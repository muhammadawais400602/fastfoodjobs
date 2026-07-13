import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { getThread, postMessage, markThreadRead } from "@/lib/messages";

// Verify the application belongs to this restaurant.
async function ownsApplication(applicationId: string, restaurant: string) {
  if (!ObjectId.isValid(applicationId)) return false;
  const db = await getDb();
  const app = await db.collection("applications").findOne({ _id: new ObjectId(applicationId) });
  if (!app) return false;
  return !app.restaurant || app.restaurant === restaurant;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const applicationId = new URL(request.url).searchParams.get("applicationId") ?? "";
  if (!(await ownsApplication(applicationId, session.restaurant))) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  const db = await getDb();
  await markThreadRead(db, applicationId, "restaurant");
  return NextResponse.json({ ok: true, messages: await getThread(applicationId) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const applicationId = String(body.applicationId ?? "");
  const text = String(body.body ?? "").trim();
  if (!text) return NextResponse.json({ ok: false, error: "Message is empty." }, { status: 400 });
  if (!(await ownsApplication(applicationId, session.restaurant))) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  const db = await getDb();
  await postMessage(db, applicationId, session.restaurant, "restaurant", text);
  return NextResponse.json({ ok: true });
}
