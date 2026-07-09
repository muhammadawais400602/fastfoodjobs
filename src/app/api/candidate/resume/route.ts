import { NextResponse } from "next/server";
import { Binary } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "candidate") return NextResponse.json({ ok: false }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "Upload a PDF or Word document." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Resume must be 5MB or smaller." }, { status: 400 });
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
    return NextResponse.json({ ok: true, url: `/api/media/${result.insertedId.toString()}`, name: file.name });
  } catch (err) {
    console.error("[candidate resume]", err);
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}
