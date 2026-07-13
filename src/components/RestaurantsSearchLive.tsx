"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { RestaurantCardData } from "@/lib/public";

export default function RestaurantsSearchLive({ restaurants }: { restaurants: RestaurantCardData[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [applied, setApplied] = useState(params.get("q") ?? "");

  const cuisines = useMemo(
    () => Array.from(new Set(restaurants.map((r) => r.cuisine).filter(Boolean))).sort(),
    [restaurants]
  );
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const toggleCuisine = (c: string) =>
    setSelectedCuisines(selectedCuisines.includes(c) ? selectedCuisines.filter((x) => x !== c) : [...selectedCuisines, c]);

  const results = useMemo(() => {
    const q = applied.trim().toLowerCase();
    return restaurants.filter((r) => {
      if (q && !`${r.name} ${r.city} ${r.cuisine} ${r.description} ${r.tagline}`.toLowerCase().includes(q)) return false;
      if (selectedCuisines.length > 0 && !selectedCuisines.includes(r.cuisine)) return false;
      return true;
    });
  }, [restaurants, applied, selectedCuisines]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-6">
          Restaurants Hiring Now
        </h1>
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] flex flex-col md:flex-row gap-2 items-center border border-outline-variant/20">
          <div className="flex flex-1 items-center px-3 gap-3 w-full">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="w-full bg-transparent border-none outline-none text-base h-12"
              placeholder="Search restaurants, cuisine, or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setApplied(query)}
            />
          </div>
          <button
            onClick={() => setApplied(query)}
            className="w-full md:w-auto bg-primary text-on-primary px-14 py-3 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {cuisines.length > 1 && (
          <aside className="w-full md:w-64 flex-shrink-0">
            <h3 className="text-sm font-semibold text-on-surface mb-3">Cuisine</h3>
            <div className="space-y-2">
              {cuisines.map((c) => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCuisines.includes(c)}
                    onChange={() => toggleCuisine(c)}
                    className="h-5 w-5 accent-primary"
                  />
                  <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">{c}</span>
                </label>
              ))}
            </div>
          </aside>
        )}

        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface-variant mb-4">
            {results.length} restaurant{results.length === 1 ? "" : "s"} hiring
          </p>
          {results.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-16 text-center shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <span className="material-symbols-outlined text-outline text-[48px] mb-4">storefront</span>
              <h2 className="text-xl font-bold text-on-surface mb-2">No restaurants found</h2>
              <p className="text-base text-on-surface-variant">Check back soon — new restaurants join every day.</p>
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
                    <span className="bg-secondary-fixed text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
                      {r.jobCount} Job{r.jobCount === 1 ? "" : "s"} Available
                    </span>
                  </div>
                  <p className="text-base text-on-surface-variant mb-6 line-clamp-2">
                    {r.description || r.tagline || "This restaurant is hiring — view their open positions."}
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
