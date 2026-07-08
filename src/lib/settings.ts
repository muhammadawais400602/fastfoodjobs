import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type RestaurantProfile = {
  name: string;
  cuisine: string;
  description: string;
  address: string;
  website: string;
  notifications: { newApplicants: boolean; interviewConfirmations: boolean; weeklyReports: boolean };
};

const DEFAULTS: RestaurantProfile = {
  name: "",
  cuisine: "Fast Casual",
  description: "",
  address: "",
  website: "",
  notifications: { newApplicants: true, interviewConfirmations: true, weeklyReports: false },
};

export async function getProfile(userId: string, fallbackName: string): Promise<RestaurantProfile> {
  const db = await getDb();
  const user = ObjectId.isValid(userId)
    ? await db.collection("users").findOne({ _id: new ObjectId(userId) })
    : null;
  const p = (user?.profile ?? {}) as Partial<RestaurantProfile>;
  return {
    ...DEFAULTS,
    name: p.name ?? user?.restaurant ?? fallbackName,
    cuisine: p.cuisine ?? DEFAULTS.cuisine,
    description: p.description ?? "",
    address: p.address ?? "",
    website: p.website ?? "",
    notifications: { ...DEFAULTS.notifications, ...(p.notifications ?? {}) },
  };
}
