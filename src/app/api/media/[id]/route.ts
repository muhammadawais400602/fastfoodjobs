import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

// Public image serving — logos and cover photos appear on public pages.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ ok: false }, { status: 404 });

  const db = await getDb();
  const doc = await db.collection("media").findOne({ _id: new ObjectId(id) });
  if (!doc || !doc.data) return NextResponse.json({ ok: false }, { status: 404 });

  const bytes = (doc.data as { buffer?: Buffer }).buffer ?? (doc.data as Buffer);
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": (doc.type as string) || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
