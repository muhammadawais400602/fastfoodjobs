import Link from "next/link";
import CandidateShell from "@/components/candidate/CandidateShell";
import Stepper from "@/components/candidate/Stepper";
import { getSession } from "@/lib/auth";
import { getCandidateApplications } from "@/lib/candidate";

export const dynamic = "force-dynamic";

export default async function CandidateApplications() {
  const session = await getSession();
  const apps = await getCandidateApplications(session!.email);

  return (
    <CandidateShell active="Applications" title="Applications" subtitle={`${apps.length} total`}>
      {apps.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-[#e4bebc]">
          <p className="text-[#586158] mb-4">No applications yet.</p>
          <Link href="/candidate/jobs" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => (
            <div key={a.id} className="bg-white p-6 rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-lg font-bold">{a.jobTitle}</h4>
                  {a.restaurant && <p className="text-sm text-[#586158]">{a.restaurant}</p>}
                </div>
                <span className="text-xs font-semibold text-[#586158]">Applied {new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
              <Stepper status={a.status} />
              <div className="mt-4 flex gap-3">
                {a.jobId && (
                  <Link href={`/j/${a.jobId}`} className="text-sm font-semibold text-primary hover:underline">
                    View job
                  </Link>
                )}
                <Link href="/candidate/messages" className="text-sm font-semibold text-primary hover:underline">
                  Messages
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </CandidateShell>
  );
}
