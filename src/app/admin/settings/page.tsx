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
      <SettingsForm profile={profile} email={session!.email} />
    </AdminShell>
  );
}
