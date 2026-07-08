"use client";
import { useState } from "react";

const inputClass =
  "h-12 px-4 rounded-lg border border-outline/30 bg-surface-bright text-base outline-none focus:border-secondary-container focus:border-2 transition-all w-full";

export default function PostJobForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/postings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_8px_30px_rgba(29,53,87,0.08)] p-14 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px]">check_circle</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface">Posting Submitted!</h2>
          <p className="text-base text-on-surface-variant mt-2">
            Our team will review your job posting and it will go live within 24 hours. We&apos;ll email you a
            confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-[0px_8px_30px_rgba(29,53,87,0.08)] border border-outline-variant/10 overflow-hidden">
      <div className="p-8 md:p-14">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="restaurant">
                Restaurant / Franchise Name
              </label>
              <input className={inputClass} id="restaurant" name="restaurant" placeholder="Burger Palace" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="contactEmail">
                Contact Email
              </label>
              <input
                className={inputClass}
                id="contactEmail"
                name="contactEmail"
                placeholder="hiring@example.com"
                required
                type="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="jobTitle">
                Job Title
              </label>
              <input className={inputClass} id="jobTitle" name="jobTitle" placeholder="Shift Manager" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="jobType">
                Job Type
              </label>
              <select className={inputClass} id="jobType" name="jobType" required defaultValue="Full-Time">
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Seasonal</option>
                <option>Flexible</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="rate">
                Hourly Rate
              </label>
              <input className={inputClass} id="rate" name="rate" placeholder="$18 - $24 / hr" required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="description">
              Job Description
            </label>
            <textarea
              className="p-4 rounded-lg border border-outline/30 bg-surface-bright text-base outline-none focus:border-secondary-container focus:border-2 transition-all resize-none"
              id="description"
              name="description"
              placeholder="Describe the role, responsibilities, and what makes your restaurant a great place to work..."
              required
              rows={5}
            ></textarea>
          </div>

          {error && (
            <p className="text-sm font-semibold text-error bg-error-container rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline-variant/30 mt-10">
            <p className="text-xs font-bold text-on-surface-variant max-w-[300px]">
              By posting, you agree to our Terms of Service. Postings are reviewed before going live.
            </p>
            <button
              className="w-full md:w-auto h-14 px-12 bg-primary text-on-primary rounded-lg text-base font-bold shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-80"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  <span>Post Job</span>
                  <span className="material-symbols-outlined">send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
