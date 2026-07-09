import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

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

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const role = (payload.role as Role) === "candidate" ? "candidate" : "restaurant";
    return {
      id: String(payload.id),
      email: String(payload.email),
      role,
      restaurant: String(payload.restaurant ?? ""),
      name: String(payload.name ?? payload.restaurant ?? ""),
    };
  } catch {
    return null;
  }
}
