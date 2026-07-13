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
    read: false,
    createdAt: new Date(),
  });
}

// Mark all messages from the other party as read (called when a thread is opened).
export async function markThreadRead(db: Db, applicationId: string, reader: "restaurant" | "applicant") {
  const otherSender = reader === "restaurant" ? "applicant" : "restaurant";
  await db
    .collection("messages")
    .updateMany({ applicationId, sender: otherSender, read: { $ne: true } }, { $set: { read: true } });
}

// Unread incoming-message counts per application id.
export async function unreadCounts(
  applicationIds: string[],
  reader: "restaurant" | "applicant"
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (applicationIds.length === 0) return map;
  const otherSender = reader === "restaurant" ? "applicant" : "restaurant";
  const db = await getDb();
  const grouped = await db
    .collection("messages")
    .aggregate([
      { $match: { applicationId: { $in: applicationIds }, sender: otherSender, read: { $ne: true } } },
      { $group: { _id: "$applicationId", count: { $sum: 1 } } },
    ])
    .toArray();
  for (const g of grouped) map.set(g._id as string, g.count as number);
  return map;
}

export type Candidate = {
  id: string;
  name: string;
  position: string;
  email: string;
  status: string;
  chatToken: string;
  unread: number;
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

  const unread = await unreadCounts(docs.map((d) => d._id.toString()), "restaurant");

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
      unread: unread.get(d._id.toString()) ?? 0,
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
