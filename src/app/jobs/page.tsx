import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobsSearchLive from "@/components/JobsSearchLive";
import { getAllActiveJobs } from "@/lib/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find Jobs - FastFoodJobs",
  description: "Search live fast food jobs from real restaurants near you.",
};

export default async function JobsPage() {
  const jobs = await getAllActiveJobs();
  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-8 pt-[88px]">
        <Suspense fallback={null}>
          <JobsSearchLive jobs={jobs} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
