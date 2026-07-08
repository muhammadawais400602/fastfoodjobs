import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type ApplicationDoc = {
  _id: string;
  jobSlug: string;
  jobTitle: string;
  restaurant: string;
  fullName: string;
  email: string;
  phone: string;
  motivation: string;
  status: string;
  notes?: string;
  hasCv: boolean;
  createdAt: string;
};

function titleFromSlug(slug: string) {
  const parts = (slug || "").split("-");
  return (
    parts
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "Applicant"
  );
}

// Prefer a stored jobTitle; fall back to deriving from the demo slug.
export function positionOf(app: { jobTitle?: string; jobSlug?: string }) {
  return app.jobTitle && app.jobTitle.trim() ? app.jobTitle : titleFromSlug(app.jobSlug ?? "");
}

function mapApplication(d: Record<string, unknown>): ApplicationDoc {
  return {
    _id: (d._id as ObjectId).toString(),
    jobSlug: (d.jobSlug as string) ?? "",
    jobTitle: (d.jobTitle as string) ?? "",
    restaurant: (d.restaurant as string) ?? "",
    fullName: (d.fullName as string) ?? "",
    email: (d.email as string) ?? "",
    phone: (d.phone as string) ?? "",
    motivation: (d.motivation as string) ?? "",
    status: (d.status as string) ?? "new",
    notes: (d.notes as string) ?? "",
    hasCv: Boolean(d.cv),
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  };
}

// Applications for a restaurant. Includes legacy demo applications (no restaurant field)
// so nothing is hidden while you're testing.
export async function getApplications(restaurant?: string): Promise<ApplicationDoc[]> {
  const db = await getDb();
  const filter = restaurant ? { $or: [{ restaurant }, { restaurant: { $exists: false } }, { restaurant: "" }] } : {};
  const docs = await db.collection("applications").find(filter).sort({ createdAt: -1 }).limit(500).toArray();
  return docs.map((d) => mapApplication(d as Record<string, unknown>));
}

export async function getApplication(id: string): Promise<ApplicationDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const d = await db.collection("applications").findOne({ _id: new ObjectId(id) });
  if (!d) return null;
  return mapApplication(d as Record<string, unknown>);
}

export type PostingDoc = {
  _id: string;
  restaurant: string;
  jobTitle: string;
  jobType: string;
  rate: string;
  description: string;
  status: string;
  applicants: number;
  createdAt: string;
};

function mapPosting(d: Record<string, unknown>): PostingDoc {
  return {
    _id: (d._id as ObjectId).toString(),
    restaurant: (d.restaurant as string) ?? "",
    jobTitle: (d.jobTitle as string) ?? "",
    jobType: (d.jobType as string) ?? "",
    rate: (d.rate as string) ?? "",
    description: (d.description as string) ?? "",
    status: (d.status as string) ?? "pending_review",
    applicants: (d.applicants as number) ?? 0,
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  };
}

export async function getPostings(restaurant?: string): Promise<PostingDoc[]> {
  const db = await getDb();
  const filter = restaurant ? { restaurant } : {};
  const docs = await db.collection("postings").find(filter).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map((d) => mapPosting(d as Record<string, unknown>));
}

export type TeamDoc = {
  _id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  shift: string;
  status: string;
  createdAt: string;
};

export async function getTeam(restaurant?: string): Promise<TeamDoc[]> {
  const db = await getDb();
  const filter = restaurant ? { restaurant } : {};
  const docs = await db.collection("team").find(filter).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map((d) => ({
    _id: d._id.toString(),
    name: d.name ?? "",
    role: d.role ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    shift: d.shift ?? "",
    status: d.status ?? "on_shift",
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  }));
}
