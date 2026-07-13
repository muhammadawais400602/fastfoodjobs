import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { normalizeProfile, type RestaurantProfile } from "@/lib/profile";

export type PublicRestaurant = {
  id: string;
  restaurant: string;
  profile: RestaurantProfile;
};

export type PublicJob = {
  id: string;
  restaurantId: string;
  jobTitle: string;
  department: string;
  jobType: string;
  rate: string;
  experience: string;
  shift: string;
  urgent: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: string;
  createdAt: string;
};

function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)).filter((x) => x.trim()) : [];
}

function mapJob(d: Record<string, unknown>): PublicJob {
  return {
    id: (d._id as ObjectId).toString(),
    restaurantId: "",
    jobTitle: (d.jobTitle as string) ?? "",
    department: (d.department as string) ?? "",
    jobType: (d.jobType as string) ?? "",
    rate: (d.rate as string) ?? "",
    experience: (d.experience as string) ?? "",
    shift: (d.shift as string) ?? "",
    urgent: Boolean(d.urgent),
    description: (d.description as string) ?? "",
    responsibilities: strArr(d.responsibilities),
    requirements: strArr(d.requirements),
    benefits: strArr(d.benefits),
    status: (d.status as string) ?? "",
    createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date()).toISOString(),
  };
}

function mapRestaurant(u: Record<string, unknown>): PublicRestaurant {
  const p = (u.profile ?? {}) as Partial<RestaurantProfile>;
  const name = (u.restaurant as string) ?? p.name ?? "Restaurant";
  return {
    id: (u._id as ObjectId).toString(),
    restaurant: name,
    profile: normalizeProfile(p, name),
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


// Public listings expire 30 days after posting so the site never shows stale jobs.
const LISTING_TTL_DAYS = 30;
function freshCutoff(): Date {
  return new Date(Date.now() - LISTING_TTL_DAYS * 24 * 60 * 60 * 1000);
}

// All active jobs across every restaurant, with the owning restaurant's id resolved.
export async function getAllActiveJobs(): Promise<JobCard[]> {
  const db = await getDb();
  const postings = await db
    .collection("postings")
    .find({ status: "active", createdAt: { $gte: freshCutoff() } })
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

// Fetch specific jobs by id (for a candidate's saved list). Keeps only active ones.
export async function getJobsByIds(ids: string[]): Promise<JobCard[]> {
  const objIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  if (objIds.length === 0) return [];
  const db = await getDb();
  const postings = await db.collection("postings").find({ _id: { $in: objIds }, status: "active", createdAt: { $gte: freshCutoff() } }).toArray();
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

export type RestaurantCardData = {
  id: string;
  name: string;
  jobCount: number;
  tagline: string;
  description: string;
  city: string;
  cuisine: string;
  logoUrl: string;
};

// Every restaurant account, with a live count of its active (non-expired) jobs.
export async function getRestaurantsWithActiveJobs(): Promise<RestaurantCardData[]> {
  const db = await getDb();
  const [owners, grouped] = await Promise.all([
    db.collection("users").find({}).project({ restaurant: 1, profile: 1 }).sort({ createdAt: -1 }).limit(100).toArray(),
    db
      .collection("postings")
      .aggregate([
        { $match: { status: "active", createdAt: { $gte: freshCutoff() } } },
        { $group: { _id: "$restaurant", jobCount: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const countByName = new Map<string, number>();
  for (const g of grouped) countByName.set(g._id as string, g.jobCount as number);

  return owners
    .filter((o) => o.restaurant)
    .map((o) => {
      const p = (o.profile ?? {}) as Partial<RestaurantProfile>;
      return {
        id: o._id.toString(),
        name: o.restaurant as string,
        jobCount: countByName.get(o.restaurant as string) ?? 0,
        tagline: p.tagline ?? "",
        description: p.description ?? "",
        city: p.city ?? "",
        cuisine: p.cuisine ?? "",
        logoUrl: p.logoUrl ?? "",
      };
    })
    .sort((a, b) => b.jobCount - a.jobCount);
}

export async function getRestaurantActiveJobs(restaurantName: string): Promise<PublicJob[]> {
  const db = await getDb();
  const docs = await db
    .collection("postings")
    .find({ restaurant: restaurantName, status: "active", createdAt: { $gte: freshCutoff() } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => mapJob(d as Record<string, unknown>));
}

export async function getPublicJob(id: string): Promise<{ job: PublicJob; restaurant: PublicRestaurant | null } | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const d = await db.collection("postings").findOne({ _id: new ObjectId(id) });
  if (!d || d.status !== "active") return null;

  const job = mapJob(d as Record<string, unknown>);

  // find the owning restaurant account by name
  const owner = await db.collection("users").findOne({ restaurant: d.restaurant });
  const restaurant = owner ? mapRestaurant(owner as Record<string, unknown>) : null;
  if (restaurant) job.restaurantId = restaurant.id;
  return { job, restaurant };
}
