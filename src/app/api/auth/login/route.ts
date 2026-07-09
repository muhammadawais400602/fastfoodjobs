import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const role = body.role === "candidate" ? "candidate" : "restaurant";
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const remember = Boolean(body.remember);

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = role === "candidate" ? "candidates" : "users";
    const user = await db.collection(collection).findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
    }
    if (role === "candidate") {
      await createSession(
        { id: user._id.toString(), email: user.email, role: "candidate", restaurant: "", name: user.name ?? "" },
        remember
      );
    } else {
      await createSession(
        { id: user._id.toString(), email: user.email, role: "restaurant", restaurant: user.restaurant, name: user.restaurant },
        remember
      );
    }
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ ok: false, error: "Couldn't sign in. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, role });
}
