import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://fastfoodjobs.vercel.app";

// Clicked from the verification email.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!token) return NextResponse.redirect(`${APP_URL}/login`);

  try {
    const db = await getDb();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const rec = await db.collection("email_verifications").findOne({ tokenHash });
    if (!rec || rec.expiresAt < new Date()) {
      return NextResponse.redirect(`${APP_URL}/login?verify=expired`);
    }
    const collection = rec.role === "candidate" ? "candidates" : "users";
    await db.collection(collection).updateOne({ email: rec.email }, { $set: { emailVerified: true } });
    await db.collection("email_verifications").deleteMany({ email: rec.email });
    const dest = rec.role === "candidate" ? "/candidate?verified=1" : "/admin?verified=1";
    return NextResponse.redirect(`${APP_URL}${dest}`);
  } catch (err) {
    console.error("[verify]", err);
    return NextResponse.redirect(`${APP_URL}/login`);
  }
}
