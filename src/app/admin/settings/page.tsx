import AdminShell from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <AdminShell active="Settings" title="Settings" subtitle="Your account details.">
      <div className="bg-white rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] p-8 max-w-lg space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#586158]">Restaurant</label>
          <p className="text-lg font-semibold mt-1">{session?.restaurant}</p>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#586158]">Account Email</label>
          <p className="text-lg font-semibold mt-1">{session?.email}</p>
        </div>
        <p className="text-sm text-[#586158] pt-4 border-t border-[#e4bebc]">
          More settings (password change, team invites, notifications) can be added here.
        </p>
      </div>
    </AdminShell>
  );
}
