import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedReal from "@/components/FeaturedReal";
import WhySection from "@/components/WhySection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <Hero />
        <FeaturedReal />
        <WhySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
