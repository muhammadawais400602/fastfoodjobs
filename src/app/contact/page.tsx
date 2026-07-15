import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us | FastFoodJobs",
  description: "Get in touch with the FastFoodJobs team.",
};

const channels = [
  {
    icon: "mail",
    title: "Email us",
    body: "For support, feedback, or partnership inquiries.",
    action: { label: "hello@fastfoodjobs.app", href: "mailto:hello@fastfoodjobs.app" },
  },
  {
    icon: "storefront",
    title: "Restaurants",
    body: "Questions about posting jobs or managing applicants?",
    action: { label: "Read the FAQs", href: "/faq" },
  },
  {
    icon: "person",
    title: "Job seekers",
    body: "Trouble applying or accessing your account?",
    action: { label: "Read the FAQs", href: "/faq" },
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow px-6 py-16 pt-[112px] md:pt-[132px]">
        <div className="max-w-[920px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-[32px] md:text-[40px] font-extrabold leading-tight text-on-surface mb-3">
              Get in touch
            </h1>
            <p className="text-base text-on-surface-variant max-w-xl mx-auto">
              We usually reply within one business day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {channels.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-8 border border-outline-variant/40 text-center card-lift">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">{c.icon}</span>
                </div>
                <h2 className="text-lg font-bold text-on-surface mb-2">{c.title}</h2>
                <p className="text-sm text-on-surface-variant mb-5">{c.body}</p>
                <a href={c.action.href} className="text-sm font-bold text-primary hover:underline">
                  {c.action.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
