import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";
import { sendEmailVerification } from "@/lib/email";

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://fastfoodjobs.vercel.app";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!rateLimit(`resend-verify:${session.id}`, 3, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Please wait a few minutes before requesting again." }, { status: 429 });
  }

  try {
    const db = await getDb();
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await db.collection("email_verifications").insertOne({
      tokenHash,
      email: session.email,
      role: session.role,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });
    sendEmailVerification({
      to: session.email,
      name: session.name || session.restaurant || "",
      verifyUrl: `${APP_URL}/api/auth/verify?token=${token}`,
    });
  } catch (err) {
    console.error("[resend-verification]", err);
    return NextResponse.json({ ok: false, error: "Couldn't send the email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
