"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantActions({
  id,
  email,
  applicantName,
  currentStatus,
  currentNotes,
}: {
  id: string;
  email: string;
  applicantName: string;
  currentStatus: string;
  currentNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const [modal, setModal] = useState<null | "interview" | "reject">(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // modal fields
  const [interviewAt, setInterviewAt] = useState("");
  const [interviewNote, setInterviewNote] = useState("");
  const [reason, setReason] = useState("");

  const patch = async (payload: Record<string, string>) => {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error ?? "Failed.");
    router.refresh();
  };

  const quickSet = async (s: string) => {
    setStatus(s);
    try {
      await patch({ status: s });
    } catch {
      /* ignore */
    }
  };

  const submitInterview = async () => {
    setBusy(true);
    setErr(null);
    try {
      await patch({ status: "interview", interviewAt, interviewNote });
      setStatus("interview");
      setModal(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitReject = async () => {
    setBusy(true);
    setErr(null);
    try {
      await patch({ status: "reject", rejectionReason: reason });
      setStatus("reject");
      setModal(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusy(false);
    }
  };

  const saveNote = async () => {
    setSavingNote(true);
    try {
      await patch({ notes });
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch {
      /* ignore */
    } finally {
      setSavingNote(false);
    }
  };

  const mailto = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="bg-white rounded-xl p-6 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
      <h4 className="text-2xl font-bold mb-1">Application Status</h4>
      <p className="text-sm text-[#586158] mb-6 capitalize">
        Current: <span className="font-semibold">{status}</span>
      </p>

      <div className="space-y-4 mb-8">
        <button
          onClick={() => setModal("interview")}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-[#e4bebc] hover:border-[#286182] hover:bg-[#c7e7ff]/40 transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#286182]">calendar_today</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Move to Interview</p>
              <p className="text-xs text-[#586158]">Schedule a date/time or chat</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#586158]">chevron_right</span>
        </button>

        <button
          onClick={() => quickSet("hire")}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all hover:border-green-600 hover:bg-green-50 ${
            status === "hire" ? "border-green-600 bg-green-50" : "border-[#e4bebc]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600">check_circle</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Approve for Hire</p>
              <p className="text-xs text-[#586158]">Send employment offer</p>
            </div>
          </div>
          {status === "hire" && <span className="material-symbols-outlined text-green-600">check</span>}
        </button>

        <button
          onClick={() => setModal("reject")}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-[#e4bebc] hover:border-[#ba1a1a] hover:bg-[#ffdad6] transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ba1a1a]">cancel</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Reject Applicant</p>
              <p className="text-xs text-[#586158]">Add a reason for rejection</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#586158]">chevron_right</span>
        </button>
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

      {/* Interview modal */}
      {modal === "interview" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-xl w-full max-w-md p-6 md:p-8 shadow-2xl space-y-4 animate-scale-in max-h-[90dvh] overflow-y-auto">
            <h3 className="text-2xl font-bold">Move to Interview</h3>
            <p className="text-sm text-[#586158]">Schedule {applicantName} for an interview, or chat by email.</p>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Interview date &amp; time</label>
              <input
                type="datetime-local"
                value={interviewAt}
                onChange={(e) => setInterviewAt(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#e4bebc] text-sm outline-none focus:ring-2 focus:ring-[#b7102a] mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#586158]">Message (optional)</label>
              <textarea
                value={interviewNote}
                onChange={(e) => setInterviewNote(e.target.value)}
                rows={3}
                placeholder="Details, location, video link…"
                className="w-full p-3 rounded-lg border border-[#e4bebc] text-sm outline-none focus:ring-2 focus:ring-[#b7102a] resize-none mt-1"
              />
            </div>
            {err && <p className="text-sm font-semibold text-[#93000a] bg-[#ffdad6] rounded-lg px-4 py-2">{err}</p>}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
              <a
                href={mailto(`Interview invitation — ${applicantName}`)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#b7102a] hover:underline"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span> Chat by email
              </a>
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-[#e4bebc] text-sm font-semibold">
                  Cancel
                </button>
                <button onClick={submitInterview} disabled={busy} className="px-5 py-2.5 rounded-lg bg-[#286182] text-white text-sm font-semibold disabled:opacity-70">
                  {busy ? "Saving…" : "Schedule"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {modal === "reject" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-xl w-full max-w-md p-6 md:p-8 shadow-2xl space-y-4 animate-scale-in max-h-[90dvh] overflow-y-auto">
            <h3 className="text-2xl font-bold">Reject Applicant</h3>
            <p className="text-sm text-[#586158]">Add a reason — this is kept for your records.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="e.g. Not enough availability for weekend shifts."
              className="w-full p-3 rounded-lg border border-[#e4bebc] text-sm outline-none focus:ring-2 focus:ring-[#b7102a] resize-none"
            />
            {err && <p className="text-sm font-semibold text-[#93000a] bg-[#ffdad6] rounded-lg px-4 py-2">{err}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-[#e4bebc] text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={busy || !reason.trim()}
                className="px-5 py-2.5 rounded-lg bg-[#ba1a1a] text-white text-sm font-semibold disabled:opacity-50"
              >
                {busy ? "Saving…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
