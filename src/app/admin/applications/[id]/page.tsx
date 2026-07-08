import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ApplicantActions from "@/components/admin/ApplicantActions";
import { getApplication, positionFromSlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getApplication(id);
  if (!app) notFound();

  const initials = app.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AdminShell active="Applications" title={`Applicant: ${app.fullName}`} subtitle={positionFromSlug(app.jobSlug)}>
      <div className="mb-6 flex items-center gap-1">
        <span className="material-symbols-outlined text-[#586158] text-[20px]">chevron_left</span>
        <Link href="/admin/applications" className="text-sm font-semibold text-[#586158] hover:text-[#b7102a]">
          Back to Applications
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Header card */}
          <div className="bg-white rounded-xl p-6 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-xl bg-[#b7102a]/10 flex items-center justify-center text-[#b7102a] text-3xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{app.fullName}</h3>
                  <p className="text-[#586158]">Applied for {positionFromSlug(app.jobSlug)}</p>
                </div>
                <span className="px-3 py-1 bg-[#c7e7ff]/40 text-[#286182] text-xs font-bold rounded-full border border-[#286182]/20 capitalize">
                  {app.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 text-[#586158]">
                  <span className="material-symbols-outlined text-[#b7102a]">mail</span>
                  <span className="text-sm">{app.email}</span>
                </div>
                <div className="flex items-center gap-3 text-[#586158]">
                  <span className="material-symbols-outlined text-[#b7102a]">call</span>
                  <span className="text-sm">{app.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-[#586158]">
                  <span className="material-symbols-outlined text-[#b7102a]">calendar_today</span>
                  <span className="text-sm">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-[#586158]">
                  <span className="material-symbols-outlined text-[#b7102a]">description</span>
                  {app.hasCv ? (
                    <a
                      href={`/api/admin/applications/${app._id}/cv`}
                      className="text-sm text-[#b7102a] font-semibold hover:underline"
                    >
                      Download CV
                    </a>
                  ) : (
                    <span className="text-sm">No CV attached</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-white rounded-xl p-6 border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#586158] mb-4">Why they want to work here</h4>
            <p className="text-[#001b3c] leading-relaxed whitespace-pre-line">{app.motivation || "—"}</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <ApplicantActions id={app._id} currentStatus={app.status} currentNotes={app.notes ?? ""} />
        </div>
      </div>
    </AdminShell>
  );
}
