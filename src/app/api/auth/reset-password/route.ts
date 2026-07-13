import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export async function POST(request: Request) {
  if (!rateLimit(`reset:${clientIp(request)}`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const token = String(body?.token ?? "");
  const password = String(body?.password ?? "");
  if (!token) return NextResponse.json({ ok: false, error: "Invalid reset link." }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const reset = await db.collection("password_resets").findOne({ tokenHash });
    if (!reset || reset.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const collection = reset.role === "candidate" ? "candidates" : "users";
    const passwordHash = await bcrypt.hash(password, 10);
    await db.collection(collection).updateOne({ _id: reset.userId }, { $set: { passwordHash } });
    // One-time use: burn every outstanding reset for this account.
    await db.collection("password_resets").deleteMany({ userId: reset.userId });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ ok: false, error: "Couldn't reset the password. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
