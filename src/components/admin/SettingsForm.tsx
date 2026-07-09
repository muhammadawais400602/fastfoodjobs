"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AMENITY_OPTIONS, type RestaurantProfile } from "@/lib/profile";

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

function ImageUpload({
  label,
  value,
  onChange,
  aspect,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect: "square" | "cover";
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.set("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed.");
      onChange(json.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <div
        onClick={() => input.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed border-[#e4bebc] rounded-xl overflow-hidden hover:border-[#b7102a] transition-colors bg-white flex items-center justify-center ${
          aspect === "square" ? "aspect-square max-w-[160px]" : "h-40"
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className={aspect === "square" ? "w-full h-full object-contain p-2" : "w-full h-full object-cover"} />
        ) : (
          <div className="text-center p-4 text-[#8f6f6e]">
            <span className="material-symbols-outlined text-[32px] text-[#b7102a]">upload</span>
            <p className="text-xs font-semibold mt-1">{busy ? "Uploading…" : "Click to upload"}</p>
            <p className="text-[10px]">PNG, JPG up to 4MB</p>
          </div>
        )}
        {value && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              {busy ? "Uploading…" : "Change"}
            </span>
          </div>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
      {err && <p className="text-xs font-semibold text-[#93000a]">{err}</p>}
    </div>
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

  const toggleAmenity = (key: string) =>
    set({ amenities: form.amenities.includes(key) ? form.amenities.filter((a) => a !== key) : [...form.amenities, key] });

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
            <label className="text-sm font-semibold">Tagline</label>
            <input
              className={inputClass}
              value={form.tagline}
              onChange={(e) => set({ tagline: e.target.value })}
              placeholder="Flame-grilled burgers, hiring now"
            />
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
            <label className="text-sm font-semibold">City</label>
            <input className={inputClass} value={form.city} onChange={(e) => set({ city: e.target.value })} placeholder="Beverly Hills, CA" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Phone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="(310) 555-0198" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Website</label>
            <input className={inputClass} value={form.website} onChange={(e) => set({ website: e.target.value })} placeholder="https://…" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold">Opening Hours</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.hours}
              onChange={(e) => set({ hours: e.target.value })}
              placeholder={"Mon - Fri: 9AM - 10PM\nSat - Sun: 10AM - 11PM"}
            />
            <p className="text-xs text-[#8f6f6e]">One line per day range — shown on your public page.</p>
          </div>

          <ImageUpload label="Restaurant Logo" value={form.logoUrl} onChange={(url) => set({ logoUrl: url })} aspect="square" />
          <ImageUpload label="Cover Photo" value={form.coverUrl} onChange={(url) => set({ coverUrl: url })} aspect="cover" />
        </div>

        {/* Amenities */}
        <div className="mt-6">
          <label className="text-sm font-semibold">Branch Amenities</label>
          <p className="text-xs text-[#8f6f6e] mb-3">Pick what your location offers — shown on your public page.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AMENITY_OPTIONS.map((a) => {
              const on = form.amenities.includes(a.key);
              return (
                <button
                  type="button"
                  key={a.key}
                  onClick={() => toggleAmenity(a.key)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border text-center transition-all ${
                    on ? "border-[#b7102a] bg-[#b7102a]/5 text-[#b7102a]" : "border-[#e4bebc] text-[#586158] hover:border-[#b7102a]/50"
                  }`}
                >
                  <span className="material-symbols-outlined">{a.icon}</span>
                  <span className="text-xs font-semibold">{a.label}</span>
                </button>
              );
            })}
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
