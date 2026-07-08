import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Find Jobs - FastFoodJobs",
  description: "Search fast food jobs near you. Filter by restaurant type, job type, and hourly rate.",
};

const restaurantTypes = [
  { label: "Quick Service", checked: true },
  { label: "Fast Casual", checked: false },
  { label: "Drive-Thru Only", checked: false },
  { label: "Bakery & Cafe", checked: false },
];

const jobTypes = [
  { label: "Full-Time", checked: true },
  { label: "Part-Time", checked: false },
  { label: "Seasonal", checked: false },
];

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-8 pt-[88px]">
        {/* Search & filter bar */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-6">
            Restaurants near <span className="text-primary">90210</span>
          </h1>
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] flex flex-col md:flex-row gap-2 items-center border border-outline-variant/20">
            <div className="flex flex-1 items-center px-3 gap-3 w-full">
              <span className="material-symbols-outlined text-outline">search</span>
              <input
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-base h-12"
                placeholder="Search for restaurants..."
                type="text"
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
            <div className="flex flex-1 items-center px-3 gap-3 w-full border-t md:border-t-0 border-outline-variant/20">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <input
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-base h-12"
                placeholder="Beverly Hills, CA"
                type="text"
              />
            </div>
            <button className="w-full md:w-auto bg-primary text-on-primary px-14 py-3 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors shrink-0">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="md:sticky md:top-20 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-8 md:gap-10">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-3 flex justify-between items-center">
                  Restaurant Type
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </h3>
                <div className="space-y-2">
                  {restaurantTypes.map((t) => (
                    <label key={t.label} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        defaultChecked={t.checked}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 accent-primary"
                        type="checkbox"
                      />
                      <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-3">Job Type</h3>
                <div className="space-y-2">
                  {jobTypes.map((t) => (
                    <label key={t.label} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        defaultChecked={t.checked}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 accent-primary"
                        type="checkbox"
                      />
                      <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-3">Hourly Rate</h3>
                <input className="w-full accent-primary" max={35} min={15} type="range" defaultValue={25} />
                <div className="flex justify-between text-xs font-bold text-outline mt-1">
                  <span>$15/hr</span>
                  <span>$35/hr</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings.map((l) => (
                <Link
                  key={l.slug}
                  href={`/restaurants/${l.slug}`}
                  className="group bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-transparent hover:border-primary-fixed transition-all cursor-pointer active:scale-[0.98] block"
                >
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="flex gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                        <img className="w-full h-full object-cover" alt={`${l.name} logo`} src={l.logo} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-primary group-hover:underline truncate">{l.name}</h2>
                        <p className="text-xs font-bold text-secondary">Franchise: {l.franchise}</p>
                      </div>
                    </div>
                    <span className="bg-secondary-fixed text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
                      {l.jobs} Jobs Available
                    </span>
                  </div>
                  <p className="text-base text-on-surface-variant mb-6">{l.description}</p>
                  <div className="flex items-center gap-6 text-xs font-bold text-outline">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {l.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                      {l.rate}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center items-center gap-3">
              <button
                aria-label="Previous page"
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-primary text-on-primary text-sm font-semibold">1</button>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-sm font-semibold">
                2
              </button>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-sm font-semibold">
                3
              </button>
              <button
                aria-label="Next page"
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
