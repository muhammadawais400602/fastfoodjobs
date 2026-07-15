"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CandidateProfile } from "@/lib/candidate";

const inputClass =
  "w-full px-4 py-3 bg-white border border-[#e4bebc] rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? "bg-primary" : "bg-[#e4bebc]"}`}
    >
      <span className={`absolute top-[3px] left-[3px] bg-white rounded-full h-4.5 w-4.5 h-[18px] w-[18px] transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function CandidateSettingsForm({ profile }: { profile: CandidateProfile }) {
  const router = useRouter();
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const resumeInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<CandidateProfile>) => setForm({ ...form, ...patch });

  const save = async (next?: Partial<CandidateProfile>) => {
    const payload = { ...form, ...next };
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/candidate/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Failed.");
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setAvatarUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    try {
      const res = await fetch("/api/candidate/avatar", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed.");
      set({ avatarUrl: json.url });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const uploadResume = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    try {
      const res = await fetch("/api/candidate/resume", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed.");
      const updated = { resumeUrl: json.url, resumeName: json.name };
      set(updated);
      await save(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Career status */}
      <section className="bg-white rounded-xl p-8 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">rocket_launch</span> Career Status
        </h3>
        <div className="space-y-3">
          {[
            { key: "looking", title: "Looking for Work", sub: "Actively applying and open to new offers" },
            { key: "not_looking", title: "Not Looking", sub: "Keep profile visible but no active status" },
          ].map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => set({ careerStatus: o.key as CandidateProfile["careerStatus"] })}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                form.careerStatus === o.key ? "border-primary bg-primary/5" : "border-[#e4bebc]"
              }`}
            >
              <div>
                <p className="font-semibold text-primary">{o.title}</p>
                <p className="text-sm text-[#586158]">{o.sub}</p>
              </div>
              {form.careerStatus === o.key && <span className="material-symbols-outlined text-primary">check_circle</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Profile details */}
      <section className="bg-white rounded-xl p-8 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span> Profile Details
          </h3>
          <button onClick={() => save()} disabled={saving} className="text-primary text-sm font-semibold hover:underline disabled:opacity-60">
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
        {/* Profile photo */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {form.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-[#e4bebc]" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">
                {form.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "U"}
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarInput.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:brightness-110 active:scale-90 transition-all"
              title="Change profile photo"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold">{avatarUploading ? "Uploading…" : "Profile photo"}</p>
            <p className="text-xs text-[#586158]">JPG or PNG, max 4MB. Shown to restaurants you apply to.</p>
          </div>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#586158] uppercase">Full Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold text-[#586158] uppercase">Phone Number</label>
            <input className={inputClass} value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#586158] uppercase">Email</label>
            <input className={`${inputClass} opacity-70`} value={form.email} disabled />
          </div>
          <div>
            <label className="text-xs font-bold text-[#586158] uppercase">Preferred Language</label>
            <select className={inputClass} value={form.language} onChange={(e) => set({ language: e.target.value })}>
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
        {error && <p className="text-sm font-semibold text-[#93000a] bg-[#ffdad6] rounded-lg px-4 py-2 mt-4">{error}</p>}
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-xl p-8 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications</span> Notification Channels
        </h3>
        <div className="space-y-5">
          {[
            { key: "emailAlerts", label: "Email Job Alerts", sub: "Daily updates on new jobs matching your profile" },
            { key: "smsUpdates", label: "SMS Application Updates", sub: "Real-time alerts when a recruiter views your resume" },
            { key: "marketing", label: "Marketing & Promotions", sub: "Career tips and sponsored opportunities" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{n.label}</p>
                <p className="text-xs text-[#586158]">{n.sub}</p>
              </div>
              <Toggle
                checked={form.notifications[n.key as keyof typeof form.notifications]}
                onChange={(v) => {
                  const notifications = { ...form.notifications, [n.key]: v };
                  set({ notifications });
                  save({ notifications });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Resume */}
      <section className="bg-white rounded-xl p-8 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">upload_file</span> Resume Management
        </h3>
        <div
          onClick={() => resumeInput.current?.click()}
          className="border-2 border-dashed border-[#e4bebc] rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[#586158] text-[32px]">cloud_upload</span>
          <p className="text-sm font-semibold mt-2">{uploading ? "Uploading…" : "Click to upload new resume"}</p>
          <p className="text-xs text-[#586158]">PDF or DOCX (Max. 5MB)</p>
          <input
            ref={resumeInput}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])}
          />
        </div>
        {form.resumeUrl && (
          <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-3 p-3 bg-[#e7eeff] rounded-lg">
            <span className="material-symbols-outlined text-primary">description</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{form.resumeName || "Your resume"}</p>
              <p className="text-xs text-[#586158]">Tap to view</p>
            </div>
          </a>
        )}
      </section>
    </div>
  );
}
