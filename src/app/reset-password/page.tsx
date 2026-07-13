import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password | FastFoodJobs" };

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow py-16 md:py-20 px-6 pt-[112px] md:pt-[132px]">
        <div className="max-w-[440px] mx-auto">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
