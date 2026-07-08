import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getApplications, positionOf } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getSession();
  const applications = await getApplications(session!.restaurant);

  return (
    <AdminShell active="Messages" title="Messages" subtitle="Reach out to candidates by email.">
      <div className="bg-white rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] overflow-hidden">
        <div className="px-6 py-4 bg-[#f0f3ff] border-b border-[#e4bebc]">
          <h3 className="text-sm font-semibold">Candidates</h3>
        </div>
        {applications.length === 0 ? (
          <p className="px-6 py-16 text-center text-[#586158]">No candidates to message yet.</p>
        ) : (
          <ul className="divide-y divide-[#e4bebc]">
            {applications.map((a) => (
              <li key={a._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#f0f3ff] transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{a.fullName}</p>
                  <p className="text-xs text-[#b7102a] font-semibold">{positionOf(a)} applicant</p>
                  <p className="text-sm text-[#586158] truncate">{a.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/applications/${a._id}`} className="px-4 py-2 rounded-lg border border-[#e4bebc] text-sm font-semibold hover:bg-white transition-colors">
                    View
                  </Link>
                  <a
                    href={`mailto:${a.email}?subject=${encodeURIComponent(`Your application for ${positionOf(a)}`)}`}
                    className="px-4 py-2 rounded-lg bg-[#b7102a] text-white text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    Email
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-[#586158] mt-4">
        Messaging opens your email client for now. In-app two-way chat requires applicant accounts — we can add that
        later.
      </p>
    </AdminShell>
  );
}
