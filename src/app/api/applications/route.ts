import { NextResponse } from "next/server";
import { Binary, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { notifyRestaurantNewApplication } from "@/lib/email";
import { getSession } from "@/lib/auth";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  if (!rateLimit(`apply:${clientIp(request)}`, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Too many applications from your connection. Please wait a minute." },
      { status: 429 }
    );
  }
  // Applying requires a job-seeker account — the application is tied to it.
  const session = await getSession();
  if (!session || session.role !== "candidate") {
    return NextResponse.json(
      { ok: false, error: "Please sign in as a job seeker to apply." },
      { status: 401 }
    );
  }

  const formData = await request.formData();

  const fullName = String(formData.get("full_name") ?? "").trim();
  // Identity comes from the account, not the form — one account, one application per job.
  const email = session.email.toLowerCase();
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
  if (cv instanceof File && cv.size > 0 && !ALLOWED_CV_TYPES.includes(cv.type)) {
    return NextResponse.json({ ok: false, error: "CV must be a PDF or Word document." }, { status: 400 });
  }
  if (fullName.length > 120 || email.length > 254 || phone.length > 40 || motivation.length > 5000) {
    return NextResponse.json({ ok: false, error: "One of the fields is too long." }, { status: 400 });
  }

  let cvDoc: { name: string; size: number; type: string; data: Binary } | null = null;
  if (cv instanceof File && cv.size > 0) {
    const bytes = Buffer.from(await cv.arrayBuffer());
    cvDoc = { name: cv.name, size: cv.size, type: cv.type, data: new Binary(bytes) };
  }

  const chatToken = crypto.randomUUID();
  try {
    const db = await getDb();
    if (jobId) {
      const dup = await db.collection("applications").findOne({ jobId, email: email.toLowerCase() });
      if (dup) {
        return NextResponse.json(
          { ok: false, error: "You've already applied for this job. The restaurant can reach you in your existing chat." },
          { status: 409 }
        );
      }
    }
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
      chatToken,
      createdAt: new Date(),
    });
    // Bump the applicant count on the posting.
    if (jobId && ObjectId.isValid(jobId)) {
      await db.collection("postings").updateOne({ _id: new ObjectId(jobId) }, { $inc: { applicants: 1 } });
    }
    // Notify the restaurant owner (their login email) — fire-and-forget.
    if (restaurant) {
      const owner = await db.collection("users").findOne({ restaurant });
      if (owner?.email) {
        notifyRestaurantNewApplication({ to: owner.email, applicantName: fullName, jobTitle });
      }
    }
  } catch (err) {
    console.error("[applications] failed to save:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your application right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, chatUrl: `/chat/${chatToken}` });
}
