import CandidateShell from "@/components/candidate/CandidateShell";
import CandidateMessages from "@/components/candidate/CandidateMessages";
import { getSession } from "@/lib/auth";
import { getCandidateApplications } from "@/lib/candidate";
import { unreadCounts } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function CandidateMessagesPage() {
  const session = await getSession();
  const apps = await getCandidateApplications(session!.email);
  const withChat = apps.filter((a) => a.chatToken);
  const unread = await unreadCounts(withChat.map((a) => a.id), "applicant");
  const conversations = withChat.map((a) => ({
    token: a.chatToken,
    restaurant: a.restaurant,
    jobTitle: a.jobTitle,
    status: a.status,
    unread: unread.get(a.id) ?? 0,
  }));

  return (
    <CandidateShell active="Messages" title="Messages" subtitle="Chat with restaurants you've applied to.">
      <CandidateMessages conversations={conversations} />
    </CandidateShell>
  );
}
