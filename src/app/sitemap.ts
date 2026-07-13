import type { MetadataRoute } from "next";
import { getAllActiveJobs, getRestaurantsWithActiveJobs } from "@/lib/public";

const BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://fastfoodjobs.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/jobs`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const [jobs, restaurants] = await Promise.all([getAllActiveJobs(), getRestaurantsWithActiveJobs()]);
    const jobPages: MetadataRoute.Sitemap = jobs.map((j) => ({
      url: `${BASE}/j/${j.id}`,
      changeFrequency: "daily",
      priority: 0.8,
    }));
    const restaurantPages: MetadataRoute.Sitemap = restaurants.map((r) => ({
      url: `${BASE}/r/${r.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticPages, ...jobPages, ...restaurantPages];
  } catch {
    return staticPages;
  }
}
