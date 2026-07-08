import { NextResponse } from "next/server";

// Receives job applications. Applications are logged to the server console
// (visible in Vercel's function logs). Swap the log for a database insert or
// email service when one is connected.
export async function POST(request: Request) {
  const formData = await request.formData();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const motivation = String(formData.get("motivation") ?? "").trim();
  const jobSlug = String(formData.get("job_slug") ?? "").trim();
  const cv = formData.get("cv_upload");

  if (!fullName || !email || !phone || !motivation) {
    return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (cv instanceof File && cv.size > 5 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "CV must be 5MB or smaller." }, { status: 400 });
  }

  console.log("[application received]", {
    jobSlug,
    fullName,
    email,
    phone,
    motivation,
    cv: cv instanceof File ? { name: cv.name, size: cv.size, type: cv.type } : null,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
