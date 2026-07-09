import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "candidate") return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const set: Record<string, unknown> = {};
  if (typeof body.name === "string") set.name = body.name.trim();
  if (typeof body.phone === "string") set.phone = body.phone.trim();
  if (typeof body.language === "string") set.language = body.language.trim();
  if (body.careerStatus === "looking" || body.careerStatus === "not_looking") set.careerStatus = body.careerStatus;
  if (typeof body.resumeUrl === "string") set.resumeUrl = body.resumeUrl;
  if (typeof body.resumeName === "string") set.resumeName = body.resumeName;
  if (body.notifications && typeof body.notifications === "object") {
    set.notifications = {
      emailAlerts: Boolean(body.notifications.emailAlerts),
      smsUpdates: Boolean(body.notifications.smsUpdates),
      marketing: Boolean(body.notifications.marketing),
    };
  }
  if (Object.keys(set).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("candidates").updateOne({ _id: new ObjectId(session.id) }, { $set: set });
  } catch (err) {
    console.error("[candidate settings]", err);
    return NextResponse.json({ ok: false, error: "Couldn't save." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
