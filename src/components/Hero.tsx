"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const perks = ["Quick Apply", "Flexible Hours", "No Resume Needed"];

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBEv3_o89tW4Px4Lc3JpHzmiTTFkolQaZak4CiLI95klHrSgUCcqXo9n_4wWxi7NIMEEFcgBCjGFKefgvQApj_LufXQ6aVXoFryqCbfm-nioj6KeOmiOTXLc_-L2kLyrJbQWgMyN_dzGataENLhRmPcXiIkbvlBEdQ7NNk11I4b6HOniwsH4MgMO7X9hyRO4r__FLpNkjFfQZIDI9odHJY6sgAAjDkI-rQ_HXzSIzX6HInr3NsGVE7EdJZh9cbdJiKHXYqdduNSRlGf";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [zip, setZip] = useState("");

  const search = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (zip) params.set("loc", zip);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative flex items-center overflow-hidden hero-pattern py-14 md:py-20 lg:py-0 lg:min-h-[819px]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/30 to-transparent pointer-events-none"></div>

      <div className="max-w-[1280px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined icon-filled text-[16px]">local_fire_department</span>
            1,200+ NEW JOBS POSTED TODAY
          </div>

          <h1 className="font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] tracking-[-0.02em] text-on-surface max-w-2xl">
            Find Your Next <span className="text-primary italic">Flavorful</span> Career
          </h1>

          <p className="text-lg leading-relaxed text-on-surface-variant max-w-xl">
            From burger flippers to franchise directors. Connect with the biggest names in food service and start your journey today.
          </p>

          {/* Dual-input search bar */}
          <div className="bg-white p-2 rounded-2xl shadow-[0px_8px_30px_rgba(29,53,87,0.12)] border border-outline-variant/10 flex flex-col md:flex-row items-center gap-2 max-w-2xl">
            <div className="flex-1 flex items-center px-4 gap-2 w-full">
              <span className="material-symbols-outlined text-outline">search</span>
              <input
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-base h-12"
                placeholder="Job title or keyword"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
            <div className="flex-1 flex items-center px-4 gap-2 w-full border-t md:border-t-0 border-outline-variant/20">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <input
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-base h-12"
                placeholder="Enter Zip Code"
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
            </div>
            <button
              onClick={search}
              className="w-full md:w-auto bg-primary text-on-primary h-12 px-10 rounded-xl text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center shrink-0"
            >
              Search Jobs
            </button>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined icon-filled text-secondary text-[20px]">check_circle</span>
                <span className="text-xs font-bold">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image (desktop only, per design) */}
        <div className="lg:col-span-5 hidden lg:block relative">
          <div className="relative w-full aspect-square bg-surface-container rounded-[40px] overflow-hidden shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              className="w-full h-full object-cover"
              alt="A smiling fast food team member taking an order in a modern quick-service restaurant"
              src={HERO_IMG}
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 max-w-xs animate-bounce">
            <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">celebration</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Hired in 48 hours!</p>
              <p className="text-xs font-bold text-on-surface-variant">Sam J. at Burger Hub</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
