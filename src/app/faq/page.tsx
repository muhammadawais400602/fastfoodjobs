import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqClient from "@/components/FaqClient";

export const metadata: Metadata = {
  title: "FAQs | FastFoodJobs",
  description: "Answers to common questions about hiring, applying, billing, and managing your FastFoodJobs account.",
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow px-6 py-16 pt-[112px] md:pt-[132px]">
        <FaqClient />
      </main>
      <Footer />
    </>
  );
}
