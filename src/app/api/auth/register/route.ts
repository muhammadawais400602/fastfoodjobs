import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const restaurant = String(body.restaurant ?? "").trim();

  if (!email || !password || !restaurant) {
    return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const users = db.collection("users");
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ ok: false, error: "An account with that email already exists." }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await users.insertOne({ email, passwordHash, restaurant, createdAt: new Date() });
    await createSession({ id: result.insertedId.toString(), email, restaurant }, false);
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ ok: false, error: "Couldn't create the account. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
