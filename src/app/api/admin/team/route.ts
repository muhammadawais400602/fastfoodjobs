import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || !body.name || !body.role) {
    return NextResponse.json({ ok: false, error: "Name and role are required." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("team").insertOne({
      restaurant: session.restaurant,
      name: String(body.name).trim(),
      role: String(body.role).trim(),
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      shift: String(body.shift ?? "").trim(),
      status: body.status === "off_duty" ? "off_duty" : "on_shift",
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[admin team POST]", err);
    return NextResponse.json({ ok: false, error: "Couldn't add team member." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
