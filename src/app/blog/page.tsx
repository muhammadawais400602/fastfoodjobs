import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | FastFoodJobs",
  description: "Hiring tips, career advice, and news from FastFoodJobs.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow px-6 py-16 pt-[112px] md:pt-[132px]">
        <div className="max-w-[720px] mx-auto text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[44px]">newspaper</span>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-extrabold leading-tight text-on-surface mb-3">
            The blog is coming soon
          </h1>
          <p className="text-base text-on-surface-variant mb-10 max-w-lg mx-auto">
            Hiring tips for restaurants, career advice for food-service workers, and platform news — all landing here
            shortly. In the meantime, browse who&apos;s hiring right now.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-lg text-sm font-bold active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Browse Restaurants
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
