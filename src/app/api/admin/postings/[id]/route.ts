import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

const ALLOWED_STATUS = ["active", "draft", "closed"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ ok: false }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  for (const key of ["jobTitle", "jobType", "rate", "description", "department"]) {
    if (typeof body[key] === "string") update[key] = body[key].trim();
  }
  if (typeof body.status === "string" && ALLOWED_STATUS.includes(body.status)) update.status = body.status;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("postings").updateOne({ _id: new ObjectId(id) }, { $set: update });
  } catch (err) {
    console.error("[postings PATCH]", err);
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ ok: false }, { status: 404 });

  try {
    const db = await getDb();
    await db.collection("postings").deleteOne({ _id: new ObjectId(id) });
  } catch (err) {
    console.error("[postings DELETE]", err);
    return NextResponse.json({ ok: false, error: "Delete failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
