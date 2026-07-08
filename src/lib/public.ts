import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { RestaurantProfile } from "@/lib/settings";

export type PublicRestaurant = {
  id: string;
  restaurant: string;
  profile: RestaurantProfile;
};

export type PublicJob = {
  id: string;
  restaurantId: string;
  jobTitle: string;
  jobType: string;
  rate: string;
  description: string;
  status: string;
};

const DEFAULT_NOTIF = { newApplicants: true, interviewConfirmations: true, weeklyReports: false };

function mapRestaurant(u: Record<string, unknown>): PublicRestaurant {
  const p = (u.profile ?? {}) as Partial<RestaurantProfile>;
  return {
    id: (u._id as ObjectId).toString(),
    restaurant: (u.restaurant as string) ?? p.name ?? "Restaurant",
    profile: {
      name: p.name ?? (u.restaurant as string) ?? "Restaurant",
      cuisine: p.cuisine ?? "Fast Casual",
      description: p.description ?? "",
      address: p.address ?? "",
      website: p.website ?? "",
      notifications: { ...DEFAULT_NOTIF, ...(p.notifications ?? {}) },
    },
  };
}

export async function getPublicRestaurant(id: string): Promise<PublicRestaurant | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const u = await db.collection("users").findOne({ _id: new ObjectId(id) });
  if (!u) return null;
  return mapRestaurant(u as Record<string, unknown>);
}

export type JobCard = {
  id: string;
  jobTitle: string;
  jobType: string;
  rate: string;
  description: string;
  restaurant: string;
  restaurantId: string;
};

// All active jobs across every restaurant, with the owning restaurant's id resolved.
export async function getAllActiveJobs(): Promise<JobCard[]> {
  const db = await getDb();
  const postings = await db
    .collection("postings")
    .find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  const owners = await db.collection("users").find({}).project({ restaurant: 1 }).toArray();
  const idByName = new Map<string, string>();
  for (const o of owners) idByName.set(o.restaurant, o._id.toString());

  return postings.map((d) => ({
    id: d._id.toString(),
    jobTitle: d.jobTitle ?? "",
    jobType: d.jobType ?? "",
    rate: d.rate ?? "",
    description: d.description ?? "",
    restaurant: d.restaurant ?? "",
    restaurantId: idByName.get(d.restaurant) ?? "",
  }));
}

// Restaurants that currently have at least one active job.
export async function getRestaurantsWithActiveJobs(): Promise<{ id: string; name: string; jobCount: number }[]> {
  const db = await getDb();
  const grouped = await db
    .collection("postings")
    .aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$restaurant", jobCount: { $sum: 1 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 12 },
    ])
    .toArray();

  const owners = await db.collection("users").find({}).project({ restaurant: 1 }).toArray();
  const idByName = new Map<string, string>();
  for (const o of owners) idByName.set(o.restaurant, o._id.toString());

  return grouped
    .map((g) => ({ id: idByName.get(g._id) ?? "", name: g._id as string, jobCount: g.jobCount as number }))
    .filter((r) => r.id);
}

export async function getRestaurantActiveJobs(restaurantName: string): Promise<PublicJob[]> {
  const db = await getDb();
  const docs = await db
    .collection("postings")
    .find({ restaurant: restaurantName, status: "active" })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    restaurantId: "",
    jobTitle: d.jobTitle ?? "",
    jobType: d.jobType ?? "",
    rate: d.rate ?? "",
    description: d.description ?? "",
    status: d.status ?? "",
  }));
}

export async function getPublicJob(id: string): Promise<{ job: PublicJob; restaurant: PublicRestaurant | null } | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const d = await db.collection("postings").findOne({ _id: new ObjectId(id) });
  if (!d || d.status !== "active") return null;

  const job: PublicJob = {
    id: d._id.toString(),
    restaurantId: "",
    jobTitle: d.jobTitle ?? "",
    jobType: d.jobType ?? "",
    rate: d.rate ?? "",
    description: d.description ?? "",
    status: d.status ?? "",
  };

  // find the owning restaurant account by name
  const owner = await db.collection("users").findOne({ restaurant: d.restaurant });
  const restaurant = owner ? mapRestaurant(owner as Record<string, unknown>) : null;
  if (restaurant) job.restaurantId = restaurant.id;
  return { job, restaurant };
}
