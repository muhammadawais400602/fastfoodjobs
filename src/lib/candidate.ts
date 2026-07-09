import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type CandidateProfile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  language: string;
  careerStatus: "looking" | "not_looking";
  resumeUrl: string;
  resumeName: string;
  savedJobs: string[];
  notifications: { emailAlerts: boolean; smsUpdates: boolean; marketing: boolean };
};

const DEFAULT_NOTIF = { emailAlerts: true, smsUpdates: false, marketing: false };

export async function getCandidate(id: string): Promise<CandidateProfile | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const c = await db.collection("candidates").findOne({ _id: new ObjectId(id) });
  if (!c) return null;
  return {
    id: c._id.toString(),
    email: c.email ?? "",
    name: c.name ?? "",
    phone: c.phone ?? "",
    language: c.language ?? "English (US)",
    careerStatus: c.careerStatus === "not_looking" ? "not_looking" : "looking",
    resumeUrl: c.resumeUrl ?? "",
    resumeName: c.resumeName ?? "",
    savedJobs: Array.isArray(c.savedJobs) ? c.savedJobs.map((x: unknown) => String(x)) : [],
    notifications: { ...DEFAULT_NOTIF, ...(c.notifications ?? {}) },
  };
}

export type CandidateApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  restaurant: string;
  status: string;
  chatToken: string;
  createdAt: string;
};

// A candidate's applications are matched by the email on their account.
export async function getCandidateApplications(email: string): Promise<CandidateApplication[]> {
  const db = await getDb();
  const docs = await db
    .collection("applications")
    .find({ email: email.toLowerCase() })
    .sort({ createdAt: -1 })
    .toArray();
  // also match original-cased emails
  const docs2 =
    docs.length === 0
      ? await db.collection("applications").find({ email }).sort({ createdAt: -1 }).toArray()
      : docs;
  return docs2.map((d) => ({
    id: d._id.toString(),
    jobId: d.jobId ?? "",
    jobTitle: d.jobTitle ?? "",
    restaurant: d.restaurant ?? "",
    status: d.status ?? "new",
    chatToken: d.chatToken ?? "",
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  }));
}
