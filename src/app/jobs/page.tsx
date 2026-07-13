import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantsSearchLive from "@/components/RestaurantsSearchLive";
import { getRestaurantsWithActiveJobs } from "@/lib/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Restaurants Hiring - FastFoodJobs",
  description: "Browse restaurants hiring near you and see all their open positions.",
};

export default async function JobsPage() {
  const restaurants = await getRestaurantsWithActiveJobs();
  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-8 pt-[88px]">
        <Suspense fallback={null}>
          <RestaurantsSearchLive restaurants={restaurants} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
