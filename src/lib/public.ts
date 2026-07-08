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
