import { profiles, type Profile, type JobOpening } from "@/data/profiles";

export type JobDetail = {
  slug: string;
  title: string;
  company: string;
  companySlug: string;
  city: string;
  logo: string;
  tags: { label: string; highlight: boolean }[];
  salary: string;
  experience: string;
  shift: string;
  posted: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  benefits: { icon: string; label: string }[];
  franchise: { name: string; since: string; locations: string; rating: string };
  mapAddress: string;
};

const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBEhMhzrJnlQZX6oM2Iut18C4kED0Ddkc_uWvwjTxYumXYDufYfkqUWoYWahAt61WwwH1QItWgQU0UYwa6TnU-Sy0uzZH1d7gjMwi3Kc2nmF_LBVgKjTjXfJpv6EjjRN8_ifwWNli4JLWA9CJO6nfe_5FeDAgv2cBDD_cunhs57UFFiaZhY6Jl4_h7dttStkBBIcVWzhfYU4lYnBBfLP5WfjqfqdhyD0fccJytyr6vGGElUsKX1r2esK9veqpRIBbTZGS2ykdL2KHfw";

export const mapImage = MAP_IMG;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const defaultBenefits = [
  { icon: "restaurant", label: "Free Meals" },
  { icon: "medical_services", label: "Health Insurance" },
  { icon: "history_edu", label: "401(k) Matching" },
];

function buildJob(profile: Profile, job: JobOpening): JobDetail {
  const isManager = /manager|head|lead/i.test(job.title);
  return {
    slug: `${profile.slug}-${slugify(job.title)}`,
    title: job.title,
    company: profile.name,
    companySlug: profile.slug,
    city: profile.city,
    logo: profile.logo,
    tags: [
      ...(job.tag ? [{ label: job.tag.label, highlight: job.tag.style === "urgent" }] : []),
      { label: job.schedule, highlight: false },
    ],
    salary: job.rate,
    experience: isManager ? "1+ Years" : "None Required",
    shift: "Day / Night",
    posted: "2 days ago",
    about: `${profile.name} is looking for an energetic and professional ${job.title} to join our high-velocity kitchen and service teams. You will help make sure that every guest receives a \"craveable\" experience through speed, quality, and cleanliness. We pride ourselves on a culture of excellence and mutual respect.`,
    responsibilities: isManager
      ? [
          "Oversee daily operations, including food prep, inventory, and point-of-sale management.",
          "Directly manage a team of 10-15 crew members, providing real-time coaching and support.",
          "Ensure strict adherence to health, safety, and hygiene protocols in accordance with franchise standards.",
          "Optimize drive-thru and counter speed of service to meet aggressive QSR benchmarks.",
          "Resolve guest concerns with a positive, solutions-oriented attitude.",
        ]
      : [
          "Deliver fast, friendly service at the counter, drive-thru, or kitchen line.",
          "Prepare menu items to spec with consistent speed and quality.",
          "Keep your station clean, stocked, and ready for every rush.",
          "Follow all health, safety, and hygiene protocols.",
          "Support teammates and jump in wherever the shift needs you.",
        ],
    requirements: [
      "Valid Food Handler's Certification",
      "Ability to stand for 8+ hours",
      "Strong communication skills",
      "Flexible availability (weekends/holidays)",
    ],
    benefits: defaultBenefits,
    franchise: {
      name: "Smith Group Franchising",
      since: "Multi-unit operator since 1998",
      locations: "14 across California",
      rating: "4.2",
    },
    mapAddress: `${profile.address[0].replace(/,$/, "")}, ${profile.city.split(",")[0]}`,
  };
}

export const jobs: JobDetail[] = profiles.flatMap((profile) =>
  profile.jobs.map((job) => buildJob(profile, job))
);

export function getJob(slug: string) {
  return jobs.find((j) => j.slug === slug);
}

export function jobSlug(profileSlug: string, title: string) {
  return `${profileSlug}-${slugify(title)}`;
}
