import { NextResponse } from "next/server";
import { Binary, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const MAX_CV_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const motivation = String(formData.get("motivation") ?? "").trim();
  const jobSlug = String(formData.get("job_slug") ?? "").trim();
  const jobId = String(formData.get("job_id") ?? "").trim();
  const jobTitle = String(formData.get("job_title") ?? "").trim();
  const restaurant = String(formData.get("restaurant") ?? "").trim();
  const cv = formData.get("cv_upload");

  if (!fullName || !email || !phone || !motivation) {
    return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (cv instanceof File && cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ ok: false, error: "CV must be 5MB or smaller." }, { status: 400 });
  }

  let cvDoc: { name: string; size: number; type: string; data: Binary } | null = null;
  if (cv instanceof File && cv.size > 0) {
    const bytes = Buffer.from(await cv.arrayBuffer());
    cvDoc = { name: cv.name, size: cv.size, type: cv.type, data: new Binary(bytes) };
  }

  try {
    const db = await getDb();
    await db.collection("applications").insertOne({
      jobSlug,
      jobId,
      jobTitle,
      restaurant,
      fullName,
      email,
      phone,
      motivation,
      cv: cvDoc,
      status: "new",
      createdAt: new Date(),
    });
    // Bump the applicant count on the posting.
    if (jobId && ObjectId.isValid(jobId)) {
      await db.collection("postings").updateOne({ _id: new ObjectId(jobId) }, { $inc: { applicants: 1 } });
    }
  } catch (err) {
    console.error("[applications] failed to save:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your application right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
