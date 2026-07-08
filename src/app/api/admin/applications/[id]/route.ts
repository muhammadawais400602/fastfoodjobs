import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

const ALLOWED_STATUS = ["new", "reviewed", "interview", "hire", "reject"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  if (typeof body.status === "string" && ALLOWED_STATUS.includes(body.status)) update.status = body.status;
  if (typeof body.notes === "string") update.notes = body.notes;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("applications").updateOne({ _id: new ObjectId(id) }, { $set: update });
  } catch (err) {
    console.error("[applications PATCH]", err);
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
