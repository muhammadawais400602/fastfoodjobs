import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { sendPasswordReset } from "@/lib/email";

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://fastfoodjobs.vercel.app";

export async function POST(request: Request) {
  if (!rateLimit(`forgot:${clientIp(request)}`, 3, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const role = body?.role === "candidate" ? "candidate" : "restaurant";
  if (!email) return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });

  try {
    const db = await getDb();
    const collection = role === "candidate" ? "candidates" : "users";
    const user = await db.collection(collection).findOne({ email });

    // Always respond OK so the endpoint can't be used to probe which emails exist.
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      await db.collection("password_resets").insertOne({
        tokenHash,
        userId: user._id,
        role,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        createdAt: new Date(),
      });
      sendPasswordReset({ to: email, resetUrl: `${APP_URL}/reset-password?token=${token}&role=${role}` });
    }
  } catch (err) {
    console.error("[forgot-password]", err);
  }

  return NextResponse.json({ ok: true });
}
