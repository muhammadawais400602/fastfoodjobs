import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedRestaurants from "@/components/FeaturedRestaurants";
import ExploreOpportunities from "@/components/ExploreOpportunities";
import WhySection from "@/components/WhySection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <Hero />
        <FeaturedRestaurants />
        <ExploreOpportunities />
        <WhySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
