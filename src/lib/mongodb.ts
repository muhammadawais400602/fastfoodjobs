import { MongoClient, type Db } from "mongodb";

// Cached connection so serverless invocations reuse the same client.
let cached: Promise<Db> | null = null;

export function getDb(): Promise<Db> {
  if (!cached) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set.");
    }
    const client = new MongoClient(uri);
    cached = client.connect().then((c) => c.db(process.env.MONGODB_DB ?? "fastfoodjobs"));
  }
  return cached;
}
