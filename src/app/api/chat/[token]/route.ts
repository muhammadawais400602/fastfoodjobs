import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getThread, postMessage } from "@/lib/messages";

// Public applicant chat, accessed via a per-application magic-link token.
async function findByToken(token: string) {
  const db = await getDb();
  const app = await db.collection("applications").findOne({ chatToken: token });
  return app;
}

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const app = await findByToken(token);
  if (!app) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({
    ok: true,
    restaurant: app.restaurant ?? "",
    jobTitle: app.jobTitle ?? "",
    applicant: app.fullName ?? "",
    messages: await getThread(app._id.toString()),
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const app = await findByToken(token);
  if (!app) return NextResponse.json({ ok: false }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const text = String(body.body ?? "").trim();
  if (!text) return NextResponse.json({ ok: false, error: "Message is empty." }, { status: 400 });

  const db = await getDb();
  await postMessage(db, app._id.toString(), app.restaurant ?? "", "applicant", text);
  return NextResponse.json({ ok: true });
}
