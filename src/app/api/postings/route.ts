import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { restaurant, contactEmail, jobTitle, jobType, rate, description } = body;

  if (!restaurant || !contactEmail || !jobTitle || !jobType || !rate || !description) {
    return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("postings").insertOne({
      restaurant: String(restaurant).trim(),
      contactEmail: String(contactEmail).trim(),
      jobTitle: String(jobTitle).trim(),
      jobType: String(jobType).trim(),
      rate: String(rate).trim(),
      description: String(description).trim(),
      status: "pending_review",
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[postings] failed to save:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your posting right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
