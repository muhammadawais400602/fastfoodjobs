import CandidateShell from "@/components/candidate/CandidateShell";
import CandidateMessages from "@/components/candidate/CandidateMessages";
import { getSession } from "@/lib/auth";
import { getCandidateApplications } from "@/lib/candidate";

export const dynamic = "force-dynamic";

export default async function CandidateMessagesPage() {
  const session = await getSession();
  const apps = await getCandidateApplications(session!.email);
  const conversations = apps
    .filter((a) => a.chatToken)
    .map((a) => ({ token: a.chatToken, restaurant: a.restaurant, jobTitle: a.jobTitle, status: a.status }));

  return (
    <CandidateShell active="Messages" title="Messages" subtitle="Chat with restaurants you've applied to.">
      <CandidateMessages conversations={conversations} />
    </CandidateShell>
  );
}
