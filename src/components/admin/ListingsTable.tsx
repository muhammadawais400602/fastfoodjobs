"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PostingDoc } from "@/lib/data";

const statusStyle: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-[#e7eeff] text-[#586158]",
  pending_review: "bg-[#ffdcc4] text-[#6f3800]",
  closed: "bg-[#ffdad6] text-[#93000a]",
};

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-[#e4bebc] bg-white text-sm outline-none focus:ring-2 focus:ring-[#b7102a]";

export default function ListingsTable({ postings }: { postings: PostingDoc[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<PostingDoc | null>(null);
  const [busy, setBusy] = useState(false);

  const patch = async (id: string, body: Record<string, string>) => {
    await fetch(`/api/admin/postings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    await fetch(`/api/admin/postings/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const saveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string | boolean> = Object.fromEntries(fd.entries()) as Record<string, string>;
    data.urgent = fd.get("urgent") === "on";
    await patch(editing._id, data as Record<string, string>);
    setBusy(false);
    setEditing(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f0f3ff] border-b border-[#e4bebc]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Job Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Date Posted</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Rate</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Applicants</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4bebc]">
            {postings.map((p) => (
              <tr key={p._id} className="hover:bg-[#f0f3ff] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{p.jobTitle}</span>
                    <span className="text-xs text-[#586158]">{p.jobType}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-[#586158]">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-5 text-sm text-[#586158]">{p.rate || "—"}</td>
                <td className="px-6 py-5 font-bold">{p.applicants}</td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusStyle[p.status] ?? statusStyle.draft}`}>
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.status === "active" && (
                      <a href={`/j/${p._id}`} target="_blank" rel="noopener noreferrer" title="View public page" className="p-2 text-[#586158] hover:text-[#b7102a] rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </a>
                    )}
                    <button onClick={() => setEditing(p)} title="Edit" className="p-2 text-[#586158] hover:text-[#b7102a] rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    {p.status === "closed" ? (
                      <button onClick={() => patch(p._id, { status: "active" })} className="px-3 py-1.5 bg-[#e7eeff] text-[#586158] text-xs font-bold rounded-lg hover:text-[#b7102a] transition-all">
                        Reopen
                      </button>
                    ) : (
                      <button onClick={() => patch(p._id, { status: "closed" })} title="Close listing" className="p-2 text-[#586158] hover:text-[#ba1a1a] rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">cancel</span>
                      </button>
                    )}
                    <button onClick={() => remove(p._id)} title="Delete" className="p-2 text-[#586158] hover:text-[#ba1a1a] rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <form onSubmit={saveEdit} className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden animate-scale-in">
            <h3 className="text-2xl font-bold px-6 md:px-8 pt-6 pb-4 border-b border-[#e4bebc]/50 shrink-0">Edit Listing</h3>
            <div className="overflow-y-auto px-6 md:px-8 py-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#586158]">Job Title</label>
              <input className={inputClass} name="jobTitle" defaultValue={editing.jobTitle} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#586158]">Job Type</label>
                <select className={inputClass} name="jobType" defaultValue={editing.jobType}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Seasonal</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#586158]">Status</label>
                <select className={inputClass} name="status" defaultValue={editing.status === "pending_review" ? "active" : editing.status}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#586158]">Hourly Rate</label>
                <input className={inputClass} name="rate" defaultValue={editing.rate} placeholder="$18 - $24 / hr" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#586158]">Experience</label>
                <input className={inputClass} name="experience" defaultValue={editing.experience} placeholder="1+ Years" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#586158]">Shift</label>
                <input className={inputClass} name="shift" defaultValue={editing.shift} placeholder="Day / Night" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#586158]">
              <input type="checkbox" name="urgent" defaultChecked={editing.urgent} className="h-4 w-4 accent-[#b7102a]" />
              Mark as Urgent Hire
            </label>
            <div>
              <label className="text-sm font-semibold text-[#586158]">About the Role</label>
              <textarea
                className="w-full p-3 rounded-lg border border-[#e4bebc] bg-white text-sm outline-none focus:ring-2 focus:ring-[#b7102a] resize-none"
                name="description"
                rows={3}
                defaultValue={editing.description}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Key Responsibilities</label>
              <textarea
                className="w-full p-3 rounded-lg border border-[#e4bebc] bg-white text-sm outline-none focus:ring-2 focus:ring-[#b7102a] resize-none"
                name="responsibilities"
                rows={3}
                defaultValue={editing.responsibilities.join("\n")}
                placeholder="One per line…"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Requirements</label>
              <textarea
                className="w-full p-3 rounded-lg border border-[#e4bebc] bg-white text-sm outline-none focus:ring-2 focus:ring-[#b7102a] resize-none"
                name="requirements"
                rows={3}
                defaultValue={editing.requirements.join("\n")}
                placeholder="One per line…"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Benefits &amp; Perks</label>
              <textarea
                className="w-full p-3 rounded-lg border border-[#e4bebc] bg-white text-sm outline-none focus:ring-2 focus:ring-[#b7102a] resize-none"
                name="benefits"
                rows={2}
                defaultValue={editing.benefits.join("\n")}
                placeholder="One per line…"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-[#e4bebc] text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-lg bg-[#b7102a] text-white text-sm font-semibold disabled:opacity-70">
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
          </form>
        </div>
      )}
    </>
  );
}
