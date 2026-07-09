import { NextResponse } from "next/server";
import { Binary } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "Please upload an image file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be 4MB or smaller." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await db.collection("media").insertOne({
      owner: session.id,
      type: file.type,
      data: new Binary(bytes),
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true, url: `/api/media/${result.insertedId.toString()}` });
  } catch (err) {
    console.error("[media POST]", err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
