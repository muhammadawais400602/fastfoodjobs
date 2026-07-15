"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Faq = { q: string; a: string };
type Category = { key: string; label: string; icon: string; faqs: Faq[] };

const CATEGORIES: Category[] = [
  {
    key: "billing",
    label: "Billing & Subscriptions",
    icon: "credit_card",
    faqs: [
      {
        q: "How much does it cost to post a job?",
        a: "Posting jobs on FastFoodJobs is currently free for restaurants. Create your account, verify your email, and publish your first listing in minutes.",
      },
      {
        q: "Can I upgrade my plan at any time?",
        a: "Paid plans with featured placement and extra tools are coming soon. When they launch, you'll be able to upgrade, downgrade, or cancel at any time from your portal settings.",
      },
      {
        q: "What happens if I stop using the platform?",
        a: "Your listings expire automatically after 30 days, so nothing stale stays public. Your account and data remain safe, and you can come back and repost any time.",
      },
    ],
  },
  {
    key: "hiring",
    label: "Hiring & Candidates",
    icon: "group",
    faqs: [
      {
        q: "How do I post a new job listing?",
        a: "Sign in to your restaurant portal, open Job Listings, and click Create Listing. Fill in the role details — pay, shift, responsibilities, requirements, benefits — and hit Publish. The job appears on your public restaurant page immediately.",
      },
      {
        q: "How do applications reach me?",
        a: "Applicants apply through your public page with their CV and details. You'll get an email notification, and every application appears in your portal under Applications, where you can review CVs, schedule interviews, hire, or reject with feedback.",
      },
      {
        q: "How does messaging with candidates work?",
        a: "Every application opens a private chat between you and the candidate. Use the Messages tab in your portal — the candidate replies from their own account or via their private chat link. Each chat is labeled with the job the person applied for.",
      },
      {
        q: "Can candidates apply more than once?",
        a: "No. Applicants must have a job-seeker account, and each account can apply only once per job — so you'll never see duplicate applications for the same role.",
      },
    ],
  },
  {
    key: "account",
    label: "Account Management",
    icon: "manage_accounts",
    faqs: [
      {
        q: "How do I edit my public restaurant page?",
        a: "Everything on your public page is editable from Settings in your portal: name, tagline, description, address, city, opening hours, amenities, logo, and cover photo. Changes go live as soon as you save.",
      },
      {
        q: "Can I rename my restaurant?",
        a: "Yes — change the restaurant name in Settings. All your job listings, applications, and chats move over to the new name automatically.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "On the login page, click \"Forgot password?\", enter your email, and we'll send you a reset link. The link is valid for one hour.",
      },
    ],
  },
  {
    key: "security",
    label: "Security",
    icon: "shield",
    faqs: [
      {
        q: "Is my data secure?",
        a: "Passwords are stored hashed (never in plain text), sessions use secure httpOnly cookies, uploads are validated and size-limited, and all traffic is encrypted over HTTPS.",
      },
      {
        q: "Why do I need to verify my email?",
        a: "Email verification confirms you own the address on the account and is required before posting jobs. It keeps fake restaurant accounts off the platform.",
      },
      {
        q: "Who can see my applicants' details?",
        a: "Only your restaurant account. Applications are scoped to the restaurant they were sent to — no other restaurant or visitor can see them.",
      },
    ],
  },
];

function AccordionItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-outline-variant/40 rounded-xl shadow-[0px_2px_10px_rgba(29,53,87,0.04)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm md:text-base font-bold text-on-surface">{faq.q}</span>
        <span
          className={`material-symbols-outlined text-on-surface-variant shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 -mt-1 animate-fade-in">
          <p className="text-sm md:text-base leading-relaxed text-on-surface-variant">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqClient() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORIES.map((c) => ({
      ...c,
      faqs: c.faqs.filter((f) => !q || `${f.q} ${f.a}`.toLowerCase().includes(q)),
    })).filter((c) => (topic === "all" || c.key === topic) && c.faqs.length > 0);
  }, [query, topic]);

  return (
    <div className="max-w-[920px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[32px] md:text-[40px] font-extrabold leading-tight text-on-surface mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-on-surface-variant max-w-xl mx-auto">
          Find quick answers to common questions about hiring, applying, and managing your account on the
          FastFoodJobs platform.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-[560px] mx-auto mb-8">
        <div className="flex items-center gap-3 bg-white border border-outline-variant/60 rounded-xl px-4 h-14 shadow-[0px_2px_10px_rgba(29,53,87,0.04)] focus-within:border-primary transition-colors">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a question..."
            className="w-full bg-transparent outline-none text-base"
          />
        </div>
      </div>

      {/* Topic chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setTopic("all")}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
            topic === "all" ? "bg-primary text-on-primary" : "bg-white border border-outline-variant/60 text-on-surface-variant hover:border-primary"
          }`}
        >
          All Topics
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setTopic(c.key)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              topic === c.key ? "bg-primary text-on-primary" : "bg-white border border-outline-variant/60 text-on-surface-variant hover:border-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-outline-variant/40 mb-16">
          <span className="material-symbols-outlined text-outline text-[48px] mb-4">quiz</span>
          <h2 className="text-xl font-bold text-on-surface mb-2">No matching questions</h2>
          <p className="text-base text-on-surface-variant">Try different keywords, or contact us below.</p>
        </div>
      ) : (
        <div className="space-y-12 mb-16">
          {visible.map((c) => (
            <section key={c.key}>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-on-surface mb-5">
                <span className="material-symbols-outlined text-primary">{c.icon}</span>
                {c.label}
              </h2>
              <div className="space-y-4 stagger-children">
                {c.faqs.map((f) => (
                  <AccordionItem key={f.q} faq={f} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="bg-primary-container rounded-2xl px-8 py-12 text-center text-on-primary-container mb-4">
        <h2 className="text-2xl md:text-[28px] font-extrabold mb-2">Still have questions?</h2>
        <p className="opacity-90 mb-8">Can&apos;t find the answer you&apos;re looking for? Reach out to our friendly team.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="mailto:hello@fastfoodjobs.app"
            className="bg-white text-primary px-8 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Contact Support
          </a>
          <Link
            href="/jobs"
            className="border-2 border-white/30 text-white px-8 py-3 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
}
