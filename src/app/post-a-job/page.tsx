import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostJobForm from "@/components/PostJobForm";

export const metadata: Metadata = {
  title: "Post a Job | FastFoodJobs",
  description: "Reach thousands of food service workers. Post your restaurant's open roles on FastFoodJobs.",
};

export default function PostJobPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow py-16 md:py-20 px-6 pt-[112px] md:pt-[132px] relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/4 opacity-10">
          <div className="w-[600px] h-[600px] bg-secondary rounded-full blur-[120px]"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/4 translate-y-1/4 opacity-10">
          <div className="w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-[720px] mx-auto">
          <div className="mb-10">
            <h1 className="font-extrabold text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-primary mb-2">
              Post a Job
            </h1>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              Reach thousands of energetic food service workers. Fill your open roles in as little as 48 hours.
            </p>
          </div>

          <PostJobForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
