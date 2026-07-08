"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { JobCard } from "@/lib/public";

const jobTypeOptions = ["Full-time", "Part-time", "Seasonal"];

export default function JobsSearchLive({ jobs }: { jobs: JobCard[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [applied, setApplied] = useState(params.get("q") ?? "");
  const [types, setTypes] = useState<string[]>([]);

  const toggle = (v: string) => setTypes(types.includes(v) ? types.filter((t) => t !== v) : [...types, v]);

  const results = useMemo(() => {
    const q = applied.trim().toLowerCase();
    return jobs.filter((j) => {
      if (q && !`${j.jobTitle} ${j.restaurant} ${j.description}`.toLowerCase().includes(q)) return false;
      if (types.length > 0 && !types.some((t) => j.jobType.toLowerCase() === t.toLowerCase())) return false;
      return true;
    });
  }, [jobs, applied, types]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-6">Find Your Next Job</h1>
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] flex flex-col md:flex-row gap-2 items-center border border-outline-variant/20">
          <div className="flex flex-1 items-center px-3 gap-3 w-full">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="w-full bg-transparent border-none outline-none text-base h-12"
              placeholder="Search jobs or restaurants..."
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
        <aside className="w-full md:w-64 flex-shrink-0">
          <h3 className="text-sm font-semibold text-on-surface mb-3">Job Type</h3>
          <div className="space-y-2">
            {jobTypeOptions.map((t) => (
              <label key={t} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={types.includes(t)} onChange={() => toggle(t)} className="h-5 w-5 accent-primary" />
                <span className="text-base text-on-surface-variant group-hover:text-primary transition-colors">{t}</span>
              </label>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface-variant mb-4">
            {results.length} job{results.length === 1 ? "" : "s"} found
          </p>
          {results.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-16 text-center shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <span className="material-symbols-outlined text-outline text-[48px] mb-4">work_off</span>
              <h2 className="text-xl font-bold text-on-surface mb-2">No jobs found</h2>
              <p className="text-base text-on-surface-variant">Check back soon — new roles are posted every day.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((j) => (
                <Link
                  key={j.id}
                  href={`/j/${j.id}`}
                  className="group bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-transparent hover:border-primary-fixed transition-all block"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-primary group-hover:underline">{j.jobTitle}</h2>
                      {j.restaurantId ? (
                        <span className="text-xs font-bold text-secondary">{j.restaurant}</span>
                      ) : (
                        <span className="text-xs font-bold text-secondary">{j.restaurant}</span>
                      )}
                    </div>
                    <span className="bg-secondary-fixed text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
                      {j.jobType}
                    </span>
                  </div>
                  <p className="text-base text-on-surface-variant mb-6 line-clamp-2">{j.description}</p>
                  {j.rate && (
                    <div className="flex items-center gap-1 text-xs font-bold text-outline">
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                      {j.rate}
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
