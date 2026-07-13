import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export async function POST(request: Request) {
  if (!rateLimit(`register:${clientIp(request)}`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a minute and try again." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const role = body.role === "candidate" ? "candidate" : "restaurant";
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? body.restaurant ?? "").trim();

  if (!email || !password || !name) {
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
    const collection = role === "candidate" ? "candidates" : "users";
    const existing = await db.collection(collection).findOne({ email });
    if (existing) {
      return NextResponse.json({ ok: false, error: "An account with that email already exists." }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    if (role === "candidate") {
      const result = await db.collection("candidates").insertOne({
        email,
        passwordHash,
        name,
        savedJobs: [],
        careerStatus: "looking",
        createdAt: new Date(),
      });
      await createSession({ id: result.insertedId.toString(), email, role: "candidate", restaurant: "", name }, false);
    } else {
      const result = await db.collection("users").insertOne({ email, passwordHash, restaurant: name, createdAt: new Date() });
      await createSession({ id: result.insertedId.toString(), email, role: "restaurant", restaurant: name, name }, false);
    }
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ ok: false, error: "Couldn't create the account. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, role });
}
