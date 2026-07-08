import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobsSearch from "@/components/JobsSearch";

export const metadata: Metadata = {
  title: "Find Jobs - FastFoodJobs",
  description: "Search fast food jobs near you. Filter by restaurant type, job type, and hourly rate.",
};

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-8 pt-[88px]">
        <Suspense fallback={null}>
          <JobsSearch />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
