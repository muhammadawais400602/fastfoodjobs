import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login | FastFoodJobs",
  description: "Sign in to your FastFoodJobs restaurant recruitment portal.",
};

const BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDVeFnByiYxDibplEFW0w4YSKA3hO9so2pzAGZ0ydZDlvf5a-1sUauSNi28Uzbe_ChxD9AwzG2pEr7_vPVbeSq6X0__4pk7gRLMj0olXPevRjSTlYiZyyK8RaKi2LKsY3vN-quKq8gLSRex7fKMZzBRqj66HgbKzmc0iiFliBpGAng59En52vmgi4lvl4Bh3ailczazXZGqeMKFHbSjJ2q_oh2GrkL7Qs5kRHk6O9wxFUw--kzhEGn1XkfYiBIuD27cXCu_UlaI5u_N";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex items-center justify-center py-16 md:py-24 px-6 pt-[112px] overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${BG}')` }}></div>
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        </div>
        <section className="relative z-10 w-full max-w-[480px]">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
