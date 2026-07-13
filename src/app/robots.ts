import type { MetadataRoute } from "next";

const BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://fastfoodjobs.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/candidate", "/chat", "/api"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
