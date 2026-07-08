"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const actions = [
  { key: "interview", label: "Move to Interview", sub: "Set up a face-to-face meet", icon: "calendar_today", hover: "hover:border-[#286182] hover:bg-[#c7e7ff]/40" },
  { key: "hire", label: "Approve for Hire", sub: "Send employment offer", icon: "check_circle", hover: "hover:border-green-600 hover:bg-green-50" },
  { key: "reject", label: "Reject Applicant", sub: "Send standard rejection", icon: "cancel", hover: "hover:border-[#ba1a1a] hover:bg-[#ffdad6]" },
];

export default function ApplicantActions({
  id,
  currentStatus,
  currentNotes,
}: {
  id: string;
  currentStatus: string;
  currentNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const update = async (payload: Record<string, string>) => {
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    router.refresh();
  };

  const setStatusTo = async (s: string) => {
    setStatus(s);
    await update({ status: s });
  };

  const saveNote = async () => {
    setSavingNote(true);
    await update({ notes });
    setSavingNote(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
      <h4 className="text-2xl font-bold mb-1">Application Status</h4>
      <p className="text-sm text-[#586158] mb-6 capitalize">
        Current: <span className="font-semibold">{status}</span>
      </p>

      <div className="space-y-4 mb-8">
        {actions.map((a) => (
          <button
            key={a.key}
            onClick={() => setStatusTo(a.key)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              status === a.key ? "border-[#b7102a] bg-[#b7102a]/5" : "border-[#e4bebc]"
            } ${a.hover}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#586158]">{a.icon}</span>
              <div className="text-left">
                <p className="text-sm font-semibold">{a.label}</p>
                <p className="text-xs text-[#586158]">{a.sub}</p>
              </div>
            </div>
            {status === a.key && <span className="material-symbols-outlined text-[#b7102a]">check</span>}
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-[#e4bebc]">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-[#586158] mb-3">Recruiter&apos;s Notes</h5>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 p-3 bg-[#e7eeff] border border-[#e4bebc] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#b7102a] mb-4 resize-none"
          placeholder="Add a private note about this applicant..."
        />
        <button
          onClick={saveNote}
          disabled={savingNote}
          className="w-full py-2 bg-[#183153] text-white text-sm font-semibold rounded-lg active:scale-95 transition-transform disabled:opacity-70"
        >
          {savingNote ? "Saving…" : noteSaved ? "Saved ✓" : "Save Note"}
        </button>
      </div>
    </div>
  );
}
