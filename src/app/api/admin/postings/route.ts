import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const { jobTitle, department, jobType, rate, description, status } = body;
  if (!jobTitle || !jobType) {
    return NextResponse.json({ ok: false, error: "Job title and type are required." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("postings").insertOne({
      restaurant: session.restaurant,
      jobTitle: String(jobTitle).trim(),
      department: String(department ?? "").trim(),
      jobType: String(jobType).trim(),
      rate: String(rate ?? "").trim(),
      description: String(description ?? "").trim(),
      status: status === "draft" ? "draft" : "active",
      applicants: 0,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[admin postings POST]", err);
    return NextResponse.json({ ok: false, error: "Couldn't create listing." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
