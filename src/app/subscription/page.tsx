import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Subscription & Pricing | FastFoodJobs",
  description: "Simple pricing for restaurants hiring on FastFoodJobs.",
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    tag: "Available now",
    highlight: true,
    features: ["Public restaurant page", "Unlimited job listings", "Applicant inbox & live chat", "Email notifications", "Interview scheduling"],
    cta: { label: "Get Started Free", href: "/login" },
  },
  {
    name: "Featured",
    price: "Coming soon",
    tag: "For busy locations",
    highlight: false,
    features: ["Everything in Starter", "Priority placement in search", "Urgent-hire highlighting", "Applicant analytics", "Multiple team logins"],
    cta: { label: "Notify Me", href: "/contact" },
  },
  {
    name: "Franchise",
    price: "Coming soon",
    tag: "Multi-location brands",
    highlight: false,
    features: ["Everything in Featured", "Multiple restaurant pages", "Central hiring dashboard", "Dedicated support"],
    cta: { label: "Talk to Us", href: "/contact" },
  },
];

export default function SubscriptionPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow px-6 py-16 pt-[112px] md:pt-[132px]">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-[32px] md:text-[40px] font-extrabold leading-tight text-on-surface mb-3">
              Simple pricing for restaurants
            </h1>
            <p className="text-base text-on-surface-variant max-w-xl mx-auto">
              Hiring on FastFoodJobs is free while we grow. Paid plans with extra reach are on the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`bg-white rounded-2xl p-8 border card-lift flex flex-col ${
                  p.highlight ? "border-primary shadow-[0px_12px_40px_rgba(183,16,42,0.12)]" : "border-outline-variant/40"
                }`}
              >
                <span
                  className={`self-start text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-4 ${
                    p.highlight ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  {p.tag}
                </span>
                <h2 className="text-xl font-bold text-on-surface">{p.name}</h2>
                <p className={`text-[32px] font-extrabold mb-6 ${p.highlight ? "text-primary" : "text-on-surface"}`}>{p.price}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.cta.href}
                  className={`h-12 rounded-lg text-sm font-bold flex items-center justify-center transition-all active:scale-[0.98] ${
                    p.highlight ? "bg-primary text-on-primary" : "border border-outline text-on-surface hover:border-primary"
                  }`}
                >
                  {p.cta.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
