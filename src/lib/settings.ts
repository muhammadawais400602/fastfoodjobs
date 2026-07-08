import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type RestaurantProfile = {
  name: string;
  tagline: string;
  cuisine: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  hours: string;
  notifications: { newApplicants: boolean; interviewConfirmations: boolean; weeklyReports: boolean };
};

const DEFAULTS: RestaurantProfile = {
  name: "",
  tagline: "",
  cuisine: "Fast Casual",
  description: "",
  address: "",
  city: "",
  phone: "",
  website: "",
  hours: "",
  notifications: { newApplicants: true, interviewConfirmations: true, weeklyReports: false },
};

export function normalizeProfile(p: Partial<RestaurantProfile>, fallbackName: string): RestaurantProfile {
  return {
    name: p.name ?? fallbackName,
    tagline: p.tagline ?? "",
    cuisine: p.cuisine ?? DEFAULTS.cuisine,
    description: p.description ?? "",
    address: p.address ?? "",
    city: p.city ?? "",
    phone: p.phone ?? "",
    website: p.website ?? "",
    hours: p.hours ?? "",
    notifications: { ...DEFAULTS.notifications, ...(p.notifications ?? {}) },
  };
}

export async function getProfile(userId: string, fallbackName: string): Promise<RestaurantProfile> {
  const db = await getDb();
  const user = ObjectId.isValid(userId)
    ? await db.collection("users").findOne({ _id: new ObjectId(userId) })
    : null;
  const p = (user?.profile ?? {}) as Partial<RestaurantProfile>;
  return normalizeProfile({ ...p, name: p.name ?? user?.restaurant ?? fallbackName }, fallbackName);
}
