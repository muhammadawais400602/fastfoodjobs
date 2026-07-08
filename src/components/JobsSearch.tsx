"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { listings } from "@/data/listings";

const restaurantTypeOptions = ["Quick Service", "Fast Casual", "Drive-Thru Only", "Bakery & Cafe"];
const jobTypeOptions = ["Full-Time", "Part-Time", "Seasonal"];

export default function JobsSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("loc") ?? "");
  const [appliedQuery, setAppliedQuery] = useState(searchParams.get("q") ?? "");
  const [appliedLocation, setAppliedLocation] = useState(searchParams.get("loc") ?? "");
  const [types, setTypes] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [maxRate, setMaxRate] = useState(35);

  const applySearch = () => {
    setAppliedQuery(query);
    setAppliedLocation(location);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("loc", location);
    router.replace(`/jobs${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  const toggle = (value: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const results = useMemo(() => {
    return listings.filter((l) => {
      const q = appliedQuery.trim().toLowerCase();
      if (q && !`${l.name} ${l.franchise} ${l.description}`.toLowerCase().includes(q)) return false;
      const loc = appliedLocation.trim().toLowerCase();
      if (loc && !l.location.toLowerCase().includes(loc)) return false;
      if (types.length > 0 && !types.includes(l.type)) return false;
      if (jobTypes.length > 0 && !jobTypes.some((jt) => l.jobTypes.includes(jt))) return false;
      if (l.minRate > maxRate) return false;
      return true;
    });
  }, [appliedQuery, appliedLocation, types, jobTypes, maxRate]);

  return (
    <>
      {/* Search & filter bar */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-6">
          Restaurants near <span className="text-primary">{appliedLocation || "90210"}</span>
        </h1>
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] flex flex-col md:flex-row gap-2 items-center border border-outline-variant/20">
          <div className="flex flex-1 items-center px-3 gap-3 w-full">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-base h-12"
              placeholder="Search for restaurants..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
          <div className="flex flex-1 items-center px-3 gap-3 w-full border-t md:border-t-0 border-outline-variant/20">
            <span className="material-symbols-outlined text-outline">location_on</span>
            <input
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-base h-12"
              placeholder="Beverly Hills, CA"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
          </div>
          <button
            onClick={applySearch}
            className="w-full md:w-auto bg-primary text-on-primary px-14 py-3 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-20 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-8 md:gap-10">
            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3">Restaurant Type</h3>
              <div className="space-y-2">
                {restaurantTypeOptions.map((t) => (
                  <label key={t} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      checked={types.includes(t)}
                      onChange={() => toggle(t, types, setTypes)}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 accent-primary"
                      type="checkbox"
                    />
                    <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3">Job Type</h3>
              <div className="space-y-2">
                {jobTypeOptions.map((t) => (
                  <label key={t} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      checked={jobTypes.includes(t)}
                      onChange={() => toggle(t, jobTypes, setJobTypes)}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 accent-primary"
                      type="checkbox"
                    />
                    <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3">Hourly Rate</h3>
              <input
                className="w-full accent-primary"
                max={35}
                min={15}
                type="range"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs font-bold text-outline mt-1">
                <span>$15/hr</span>
                <span>Up to ${maxRate}/hr</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface-variant mb-4">
            {results.length} restaurant{results.length === 1 ? "" : "s"} found
          </p>

          {results.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-16 text-center shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <span className="material-symbols-outlined text-outline text-[48px] mb-4">search_off</span>
              <h2 className="text-xl font-bold text-on-surface mb-2">No restaurants found</h2>
              <p className="text-base text-on-surface-variant">Try adjusting your search or clearing some filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((l) => (
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
          )}
        </div>
      </div>
    </>
  );
}
