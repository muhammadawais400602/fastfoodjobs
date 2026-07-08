import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type ApplicationDoc = {
  _id: string;
  jobSlug: string;
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
  // slug shape: <restaurant>-<job-title>; drop the restaurant prefix heuristically
  return parts
    .slice(1)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Applicant";
}

export function positionFromSlug(slug: string) {
  return titleFromSlug(slug);
}

export async function getApplications(): Promise<ApplicationDoc[]> {
  const db = await getDb();
  const docs = await db.collection("applications").find({}).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map((d) => ({
    _id: d._id.toString(),
    jobSlug: d.jobSlug ?? "",
    fullName: d.fullName ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    motivation: d.motivation ?? "",
    status: d.status ?? "new",
    notes: d.notes ?? "",
    hasCv: Boolean(d.cv),
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  }));
}

export async function getApplication(id: string): Promise<ApplicationDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const d = await db.collection("applications").findOne({ _id: new ObjectId(id) });
  if (!d) return null;
  return {
    _id: d._id.toString(),
    jobSlug: d.jobSlug ?? "",
    fullName: d.fullName ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    motivation: d.motivation ?? "",
    status: d.status ?? "new",
    notes: d.notes ?? "",
    hasCv: Boolean(d.cv),
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  };
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

export async function getPostings(): Promise<PostingDoc[]> {
  const db = await getDb();
  const docs = await db.collection("postings").find({}).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map((d) => ({
    _id: d._id.toString(),
    restaurant: d.restaurant ?? "",
    jobTitle: d.jobTitle ?? "",
    jobType: d.jobType ?? "",
    rate: d.rate ?? "",
    description: d.description ?? "",
    status: d.status ?? "pending_review",
    applicants: d.applicants ?? 0,
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  }));
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

export async function getTeam(): Promise<TeamDoc[]> {
  const db = await getDb();
  const docs = await db.collection("team").find({}).sort({ createdAt: -1 }).limit(200).toArray();
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
