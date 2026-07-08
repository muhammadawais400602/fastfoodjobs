import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { normalizeProfile, type RestaurantProfile } from "@/lib/profile";

export { AMENITY_OPTIONS, amenityByKey, normalizeProfile } from "@/lib/profile";
export type { RestaurantProfile } from "@/lib/profile";

export async function getProfile(userId: string, fallbackName: string): Promise<RestaurantProfile> {
  const db = await getDb();
  const user = ObjectId.isValid(userId)
    ? await db.collection("users").findOne({ _id: new ObjectId(userId) })
    : null;
  const p = (user?.profile ?? {}) as Partial<RestaurantProfile>;
  return normalizeProfile({ ...p, name: p.name ?? user?.restaurant ?? fallbackName }, fallbackName);
}
