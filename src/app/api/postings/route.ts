import { NextResponse } from "next/server";

// Receives employer job postings. Logged to the server console (visible in
// Vercel's function logs) until a database is connected.
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

  console.log("[job posting received]", { ...body, receivedAt: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
