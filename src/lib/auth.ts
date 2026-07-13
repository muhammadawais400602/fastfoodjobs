import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const COOKIE = "ffj_session";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET environment variable is not set.");
  return new TextEncoder().encode(s);
}

export type Role = "restaurant" | "candidate";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  restaurant: string; // restaurant name (restaurant accounts) or ""
  name: string; // display name (candidate accounts) or restaurant name
};

export async function createSession(user: SessionUser, remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

// Cached per request so multiple calls (shell + page + APIs) hit the DB once.
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const role = (payload.role as Role) === "candidate" ? "candidate" : "restaurant";
    const session: SessionUser = {
      id: String(payload.id),
      email: String(payload.email),
      role,
      restaurant: String(payload.restaurant ?? ""),
      name: String(payload.name ?? payload.restaurant ?? ""),
    };

    // The restaurant name in the token goes stale if the restaurant is renamed
    // in Settings, which silently breaks the portal (data is scoped by name).
    // Always use the current name from the database.
    if (role === "restaurant" && ObjectId.isValid(session.id)) {
      try {
        const db = await getDb();
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(session.id) }, { projection: { restaurant: 1 } });
        if (user?.restaurant) {
          session.restaurant = String(user.restaurant);
          session.name = String(user.restaurant);
        }
      } catch {
        // If the lookup fails, fall back to the token's copy rather than logging out.
      }
    }

    return session;
  } catch {
    return null;
  }
});
