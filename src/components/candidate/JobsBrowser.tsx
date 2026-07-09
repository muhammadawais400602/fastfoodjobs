"use client";
import { useState } from "react";
import Link from "next/link";
import type { JobCard } from "@/lib/public";

export default function JobsBrowser({ jobs, savedIds }: { jobs: JobCard[]; savedIds: string[] }) {
  const [saved, setSaved] = useState<Set<string>>(new Set(savedIds));
  const [query, setQuery] = useState("");

  const toggleSave = async (jobId: string) => {
    const res = await fetch("/api/candidate/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    const json = await res.json();
    if (json.ok) {
      setSaved((prev) => {
        const next = new Set(prev);
        if (json.saved) next.add(jobId);
        else next.delete(jobId);
        return next;
      });
    }
  };

  const results = jobs.filter((j) =>
    `${j.jobTitle} ${j.restaurant} ${j.description}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs or restaurants…"
          className="w-full max-w-md px-4 py-3 bg-white border border-[#e4bebc] rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-[#e4bebc]">
          <p className="text-[#586158]">No jobs found. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((j) => (
            <div key={j.id} className="bg-white p-6 rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:border-primary transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="text-xl font-bold">{j.jobTitle}</h4>
                  <p className="text-sm font-semibold text-[#586158]">{j.restaurant}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#586158]">
                    {j.rate && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                        {j.rate}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                      {j.jobType}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(j.id)}
                  className={`p-2 rounded-lg transition-colors ${saved.has(j.id) ? "text-primary" : "text-[#586158] hover:text-primary"}`}
                  title={saved.has(j.id) ? "Unsave" : "Save job"}
                >
                  <span className={`material-symbols-outlined ${saved.has(j.id) ? "icon-filled" : ""}`}>bookmark</span>
                </button>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Link href={`/j/${j.id}`} className="px-6 py-2 border border-primary text-primary text-sm font-semibold rounded-lg hover:bg-primary/5 transition-all">
                  Details
                </Link>
                <Link href={`/apply/job/${j.id}`} className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container transition-all">
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
