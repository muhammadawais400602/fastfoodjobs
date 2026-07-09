import { notFound } from "next/navigation";
import CandidateShell from "@/components/candidate/CandidateShell";
import CandidateSettingsForm from "@/components/candidate/CandidateSettingsForm";
import { getSession } from "@/lib/auth";
import { getCandidate } from "@/lib/candidate";

export const dynamic = "force-dynamic";

export default async function CandidateSettings() {
  const session = await getSession();
  const profile = await getCandidate(session!.id);
  if (!profile) notFound();

  return (
    <CandidateShell active="Settings" title="Settings & Preferences" subtitle="Manage your account, resume, and alerts.">
      <CandidateSettingsForm profile={profile} />
    </CandidateShell>
  );
}
