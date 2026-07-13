"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { RestaurantCardData } from "@/lib/public";

const JOB_TYPE_OPTIONS = ["Full-time", "Part-time", "Seasonal"];

export default function RestaurantsSearchLive({ restaurants }: { restaurants: RestaurantCardData[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [location, setLocation] = useState(params.get("loc") ?? "");
  const [applied, setApplied] = useState({ q: params.get("q") ?? "", loc: params.get("loc") ?? "" });

  const cuisines = useMemo(
    () => Array.from(new Set(restaurants.map((r) => r.cuisine).filter(Boolean))).sort(),
    [restaurants]
  );
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [hiringOnly, setHiringOnly] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const search = () => setApplied({ q: query, loc: location });

  const results = useMemo(() => {
    const q = applied.q.trim().toLowerCase();
    const loc = applied.loc.trim().toLowerCase();
    return restaurants.filter((r) => {
      if (q && !`${r.name} ${r.cuisine} ${r.description} ${r.tagline}`.toLowerCase().includes(q)) return false;
      if (loc && !`${r.city} ${r.address}`.toLowerCase().includes(loc)) return false;
      if (selectedCuisines.length > 0 && !selectedCuisines.includes(r.cuisine)) return false;
      if (
        selectedTypes.length > 0 &&
        !selectedTypes.some((t) => r.jobTypes.some((jt) => jt.toLowerCase() === t.toLowerCase()))
      )
        return false;
      if (hiringOnly && r.jobCount === 0) return false;
      return true;
    });
  }, [restaurants, applied, selectedCuisines, selectedTypes, hiringOnly]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-6">
          Restaurants Hiring Now
        </h1>
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] flex flex-col md:flex-row gap-2 items-stretch md:items-center border border-outline-variant/20">
          <div className="flex flex-1 items-center px-3 gap-3 w-full">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="w-full bg-transparent border-none outline-none text-base h-12"
              placeholder="Search for restaurants..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          </div>
          <div className="hidden md:block w-px self-stretch my-2 bg-outline-variant/40" />
          <div className="flex flex-1 items-center px-3 gap-3 w-full border-t md:border-t-0 border-outline-variant/30">
            <span className="material-symbols-outlined text-outline">location_on</span>
            <input
              className="w-full bg-transparent border-none outline-none text-base h-12"
              placeholder="City or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          </div>
          <button
            onClick={search}
            className="w-full md:w-auto bg-primary text-on-primary px-14 py-3 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-3">Availability</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={hiringOnly}
                onChange={() => setHiringOnly(!hiringOnly)}
                className="h-5 w-5 accent-primary"
              />
              <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">
                Hiring now only
              </span>
            </label>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-3">Job Type</h3>
            <div className="space-y-2">
              {JOB_TYPE_OPTIONS.map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t)}
                    onChange={() => toggle(selectedTypes, setSelectedTypes, t)}
                    className="h-5 w-5 accent-primary"
                  />
                  <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {cuisines.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3">Cuisine</h3>
              <div className="space-y-2">
                {cuisines.map((c) => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCuisines.includes(c)}
                      onChange={() => toggle(selectedCuisines, setSelectedCuisines, c)}
                      className="h-5 w-5 accent-primary"
                    />
                    <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface-variant mb-4">
            {results.length} restaurant{results.length === 1 ? "" : "s"} found
          </p>
          {results.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-16 text-center shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <span className="material-symbols-outlined text-outline text-[48px] mb-4">storefront</span>
              <h2 className="text-xl font-bold text-on-surface mb-2">No restaurants found</h2>
              <p className="text-base text-on-surface-variant">Try clearing a filter, or check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/r/${r.id}`}
                  className="group bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-transparent hover:border-primary-fixed card-lift block"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-4 min-w-0">
                      {r.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.logoUrl}
                          alt={r.name}
                          className="w-14 h-14 rounded-lg object-cover border border-outline-variant/30 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[28px]">storefront</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-primary group-hover:underline truncate">{r.name}</h2>
                        {r.cuisine && <span className="text-xs font-bold text-secondary">{r.cuisine}</span>}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
                        r.jobCount > 0
                          ? "bg-secondary-fixed text-on-secondary-container"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {r.jobCount} Job{r.jobCount === 1 ? "" : "s"} Available
                    </span>
                  </div>
                  <p className="text-base text-on-surface-variant mb-6 line-clamp-2">
                    {r.description || r.tagline || "This restaurant is on FastFoodJobs — view their page."}
                  </p>
                  {r.city && (
                    <div className="flex items-center gap-1 text-xs font-bold text-outline">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {r.city}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
