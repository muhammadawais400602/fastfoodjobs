import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "candidate") return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const jobId = String(body.jobId ?? "");
  if (!jobId) return NextResponse.json({ ok: false, error: "Missing jobId." }, { status: 400 });

  const db = await getDb();
  const c = await db.collection("candidates").findOne({ _id: new ObjectId(session.id) });
  const saved: string[] = Array.isArray(c?.savedJobs) ? c!.savedJobs.map((x: unknown) => String(x)) : [];
  const isSaved = saved.includes(jobId);
  const next = isSaved ? saved.filter((x) => x !== jobId) : [...saved, jobId];
  await db.collection("candidates").updateOne({ _id: new ObjectId(session.id) }, { $set: { savedJobs: next } });

  return NextResponse.json({ ok: true, saved: !isSaved });
}
