import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  const profile = await getProfile(session!.id, session!.restaurant);

  return (
    <AdminShell active="Settings" title="Portal Settings" subtitle="Manage your restaurant presence and security.">
      <div className="mb-6 bg-[#183153] text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Your public restaurant page</p>
          <p className="text-white/60 text-sm">This is what job seekers see. It updates when you edit your profile and jobs.</p>
        </div>
        <a
          href={`/r/${session!.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#183153] px-5 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-white/90 transition-colors shrink-0"
        >
          View public page ↗
        </a>
      </div>
      <SettingsForm profile={profile} email={session!.email} />
    </AdminShell>
  );
}
