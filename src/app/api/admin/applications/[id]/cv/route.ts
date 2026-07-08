import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ ok: false }, { status: 404 });

  const db = await getDb();
  const doc = await db.collection("applications").findOne({ _id: new ObjectId(id) });
  if (!doc || !doc.cv) return NextResponse.json({ ok: false, error: "No CV." }, { status: 404 });

  const cv = doc.cv as { name: string; type: string; data: { buffer: Buffer } | Buffer };
  const bytes = (cv.data as { buffer?: Buffer }).buffer ?? (cv.data as Buffer);

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": cv.type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${cv.name || "cv"}"`,
    },
  });
}
