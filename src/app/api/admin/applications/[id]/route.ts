import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { notifyApplicantStatus } from "@/lib/email";

const ALLOWED_STATUS = ["new", "reviewed", "interview", "hire", "reject"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  if (typeof body.status === "string" && ALLOWED_STATUS.includes(body.status)) update.status = body.status;
  if (typeof body.notes === "string") update.notes = body.notes;
  if (typeof body.rejectionReason === "string") update.rejectionReason = body.rejectionReason.trim();
  if (typeof body.interviewAt === "string") update.interviewAt = body.interviewAt;
  if (typeof body.interviewNote === "string") update.interviewNote = body.interviewNote.trim();

  // Reject requires a reason.
  if (update.status === "reject" && !String(update.rejectionReason ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "A rejection reason is required." }, { status: 400 });
  }
  // Interview requires a date/time.
  if (update.status === "interview" && !String(update.interviewAt ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "An interview date and time is required." }, { status: 400 });
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const app = await db.collection("applications").findOne({ _id: new ObjectId(id) });
    if (!app) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    await db.collection("applications").updateOne({ _id: new ObjectId(id) }, { $set: update });

    // Email the candidate on meaningful status changes (interview / hire / reject).
    if (typeof update.status === "string" && update.status !== app.status && app.email) {
      notifyApplicantStatus({
        to: app.email,
        applicantName: app.fullName ?? "",
        jobTitle: app.jobTitle ?? "",
        restaurant: app.restaurant ?? "",
        status: update.status,
        interviewAt: typeof update.interviewAt === "string" ? update.interviewAt : undefined,
        rejectionReason: typeof update.rejectionReason === "string" ? update.rejectionReason : undefined,
        chatToken: app.chatToken,
      });
    }
  } catch (err) {
    console.error("[applications PATCH]", err);
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
