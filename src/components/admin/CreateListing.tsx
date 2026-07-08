"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-[#e4bebc] bg-white text-sm outline-none focus:ring-2 focus:ring-[#b7102a]";

export default function CreateListing() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>, status: string) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), status };
    try {
      const res = await fetch("/api/admin/postings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Failed.");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#b7102a] text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm hover:brightness-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Create Listing
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <form
            onSubmit={(e) => submit(e, "active")}
            className="relative bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold">Create Job Listing</h3>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Job Title</label>
              <input className={inputClass} name="jobTitle" placeholder="Shift Manager" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#586158]">Department</label>
                <input className={inputClass} name="department" placeholder="Front of House" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#586158]">Job Type</label>
                <select className={inputClass} name="jobType" defaultValue="Full-time" required>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Seasonal</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Hourly Rate</label>
              <input className={inputClass} name="rate" placeholder="$18 - $24 / hr" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Description</label>
              <textarea
                className="w-full p-3 rounded-lg border border-[#e4bebc] bg-white text-sm outline-none focus:ring-2 focus:ring-[#b7102a] resize-none"
                name="description"
                rows={3}
                placeholder="Describe the role..."
              />
            </div>
            {error && <p className="text-sm font-semibold text-[#93000a] bg-[#ffdad6] rounded-lg px-4 py-2">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 rounded-lg border border-[#e4bebc] text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-lg bg-[#b7102a] text-white text-sm font-semibold disabled:opacity-70">
                {submitting ? "Saving…" : "Publish Listing"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
