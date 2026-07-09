import { ObjectId, type Db } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type Message = {
  _id: string;
  sender: "restaurant" | "applicant";
  body: string;
  createdAt: string;
};

function mapMessage(d: Record<string, unknown>): Message {
  return {
    _id: (d._id as ObjectId).toString(),
    sender: (d.sender as "restaurant" | "applicant") ?? "restaurant",
    body: (d.body as string) ?? "",
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  };
}

export async function getThread(applicationId: string): Promise<Message[]> {
  if (!ObjectId.isValid(applicationId)) return [];
  const db = await getDb();
  const docs = await db
    .collection("messages")
    .find({ applicationId })
    .sort({ createdAt: 1 })
    .toArray();
  return docs.map((d) => mapMessage(d as Record<string, unknown>));
}

export async function postMessage(
  db: Db,
  applicationId: string,
  restaurant: string,
  sender: "restaurant" | "applicant",
  body: string
) {
  await db.collection("messages").insertOne({
    applicationId,
    restaurant,
    sender,
    body,
    createdAt: new Date(),
  });
}

export type Candidate = {
  id: string;
  name: string;
  position: string;
  email: string;
  status: string;
  chatToken: string;
};

// Candidates (applications) for a restaurant, each with a chat token ensured.
export async function getCandidates(restaurant: string): Promise<Candidate[]> {
  const db = await getDb();
  const docs = await db
    .collection("applications")
    .find({ $or: [{ restaurant }, { restaurant: { $exists: false } }, { restaurant: "" }] })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  const out: Candidate[] = [];
  for (const d of docs) {
    let token = d.chatToken as string | undefined;
    if (!token) {
      token = crypto.randomUUID();
      await db.collection("applications").updateOne({ _id: d._id }, { $set: { chatToken: token } });
    }
    out.push({
      id: d._id.toString(),
      name: d.fullName ?? "",
      position: d.jobTitle ?? "",
      email: d.email ?? "",
      status: d.status ?? "new",
      chatToken: token,
    });
  }
  return out;
}

// Ensure an application has a chat token (older applications may lack one).
export async function ensureChatToken(applicationId: string): Promise<string | null> {
  if (!ObjectId.isValid(applicationId)) return null;
  const db = await getDb();
  const app = await db.collection("applications").findOne({ _id: new ObjectId(applicationId) });
  if (!app) return null;
  if (app.chatToken) return app.chatToken as string;
  const token = crypto.randomUUID();
  await db.collection("applications").updateOne({ _id: new ObjectId(applicationId) }, { $set: { chatToken: token } });
  return token;
}
