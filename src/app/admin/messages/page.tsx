import AdminShell from "@/components/admin/AdminShell";
import MessagesClient from "@/components/admin/MessagesClient";
import { getSession } from "@/lib/auth";
import { getCandidates } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getSession();
  const candidates = await getCandidates(session!.restaurant);

  return (
    <AdminShell active="Messages" title="Messages" subtitle="Chat with your candidates in real time.">
      <MessagesClient candidates={candidates} />
    </AdminShell>
  );
}
