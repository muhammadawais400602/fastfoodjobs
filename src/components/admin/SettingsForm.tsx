"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RestaurantProfile } from "@/lib/settings";

const inputClass =
  "w-full px-4 py-3 bg-white border border-[#e4bebc] rounded-lg focus:ring-2 focus:ring-[#b7102a] outline-none text-sm";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-9 h-5 rounded-full relative transition-colors ${checked ? "bg-[#b7102a]" : "bg-[#e4bebc]"}`}
    >
      <span className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

export default function SettingsForm({ profile, email }: { profile: RestaurantProfile; email: string }) {
  const router = useRouter();
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // password
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNext, setPwNext] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  const set = (patch: Partial<RestaurantProfile>) => setForm({ ...form, ...patch });

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  const changePassword = async () => {
    setPwMsg(null);
    const res = await fetch("/api/admin/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: pwCurrent, next: pwNext }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setPwMsg(json.error ?? "Failed.");
    } else {
      setPwMsg("Password updated ✓");
      setPwCurrent("");
      setPwNext("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Restaurant profile */}
      <section className="lg:col-span-8 bg-[#f0f3ff] rounded-xl p-8 border border-[#e4bebc]/30 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-[#b7102a]">store</span>
            Restaurant Profile
          </h3>
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2 bg-[#b7102a] text-white rounded-lg text-sm font-semibold hover:brightness-110 active:scale-95 transition-all disabled:opacity-70"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Restaurant Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Cuisine Type</label>
            <select className={inputClass} value={form.cuisine} onChange={(e) => set({ cuisine: e.target.value })}>
              <option>Fast Casual</option>
              <option>Quick Service</option>
              <option>Fine Dining</option>
              <option>Bakery & Cafe</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Physical Address</label>
            <input className={inputClass} value={form.address} onChange={(e) => set({ address: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Website</label>
            <input className={inputClass} value={form.website} onChange={(e) => set({ website: e.target.value })} placeholder="https://…" />
          </div>
        </div>
        {error && <p className="text-sm font-semibold text-[#93000a] bg-[#ffdad6] rounded-lg px-4 py-2 mt-4">{error}</p>}
      </section>

      {/* Notifications */}
      <section className="lg:col-span-4">
        <div className="bg-[#f0f3ff] rounded-xl p-6 border border-[#e4bebc]/30 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
          <h3 className="text-sm font-semibold uppercase flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { key: "newApplicants", label: "New Applicants", sub: "Alerts for every new resume" },
              { key: "interviewConfirmations", label: "Interview Confirmations", sub: "When a candidate accepts" },
              { key: "weeklyReports", label: "Weekly Reports", sub: "Monday morning summary" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{n.label}</p>
                  <p className="text-[11px] text-[#8f6f6e]">{n.sub}</p>
                </div>
                <Toggle
                  checked={form.notifications[n.key as keyof typeof form.notifications]}
                  onChange={(v) => set({ notifications: { ...form.notifications, [n.key]: v } })}
                />
              </div>
            ))}
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="w-full mt-6 py-2 border border-[#b7102a] text-[#b7102a] rounded-lg text-sm font-semibold hover:bg-[#b7102a]/5 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </section>

      {/* Account & security */}
      <section className="lg:col-span-12 bg-[#f0f3ff] rounded-xl p-8 border border-[#e4bebc]/30 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#b7102a]">security</span>
          Account &amp; Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-lg border border-[#e4bebc]/50">
            <p className="text-xs text-[#8f6f6e] uppercase">Owner Email</p>
            <p className="text-base font-medium">{email}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-[#e4bebc]/50 space-y-3">
            <p className="text-xs text-[#8f6f6e] uppercase">Change Password</p>
            <input
              className={inputClass}
              type="password"
              placeholder="Current password"
              value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
            />
            <input
              className={inputClass}
              type="password"
              placeholder="New password (8+ chars)"
              value={pwNext}
              onChange={(e) => setPwNext(e.target.value)}
            />
            <button
              onClick={changePassword}
              className="px-4 py-2 bg-[#183153] text-white rounded-lg text-sm font-semibold"
            >
              Update Password
            </button>
            {pwMsg && <p className="text-xs font-semibold text-[#586158]">{pwMsg}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
