import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const current = String(body.current ?? "");
  const next = String(body.next ?? "");
  if (next.length < 8) {
    return NextResponse.json({ ok: false, error: "New password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.id) });
    if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
      return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(next, 10);
    await db.collection("users").updateOne({ _id: new ObjectId(session.id) }, { $set: { passwordHash } });
  } catch (err) {
    console.error("[password POST]", err);
    return NextResponse.json({ ok: false, error: "Couldn't change password." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
