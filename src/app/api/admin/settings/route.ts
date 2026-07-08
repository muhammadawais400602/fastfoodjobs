import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const profile = {
    name: String(body.name ?? "").trim(),
    tagline: String(body.tagline ?? "").trim(),
    cuisine: String(body.cuisine ?? "Fast Casual").trim(),
    description: String(body.description ?? "").trim(),
    address: String(body.address ?? "").trim(),
    city: String(body.city ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    website: String(body.website ?? "").trim(),
    hours: String(body.hours ?? "").trim(),
    logoUrl: String(body.logoUrl ?? "").trim(),
    coverUrl: String(body.coverUrl ?? "").trim(),
    amenities: Array.isArray(body.amenities) ? body.amenities.map((a: unknown) => String(a)) : [],
    notifications: {
      newApplicants: Boolean(body.notifications?.newApplicants),
      interviewConfirmations: Boolean(body.notifications?.interviewConfirmations),
      weeklyReports: Boolean(body.notifications?.weeklyReports),
    },
  };

  try {
    const db = await getDb();
    const set: Record<string, unknown> = { profile };
    if (profile.name) set.restaurant = profile.name;
    await db.collection("users").updateOne({ _id: new ObjectId(session.id) }, { $set: set });
  } catch (err) {
    console.error("[settings PATCH]", err);
    return NextResponse.json({ ok: false, error: "Couldn't save settings." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
