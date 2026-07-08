import AdminShell from "@/components/admin/AdminShell";
import CreateListing from "@/components/admin/CreateListing";
import { getPostings } from "@/lib/data";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-[#e7eeff] text-[#586158]",
  pending_review: "bg-[#ffdcc4] text-[#6f3800]",
  closed: "bg-[#ffdad6] text-[#93000a]",
};

export default async function ListingsPage() {
  const postings = await getPostings();

  return (
    <AdminShell
      active="Job Listings"
      title="Job Listings"
      subtitle="Manage your restaurant's open positions."
      actions={<CreateListing />}
    >
      <div className="bg-white rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] overflow-hidden">
        {postings.length === 0 ? (
          <p className="px-6 py-16 text-center text-[#586158]">
            No listings yet. Click <span className="font-semibold">Create Listing</span> to post your first job.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f0f3ff] border-b border-[#e4bebc]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Job Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Date Posted</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Applicants</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4bebc]">
                {postings.map((p) => (
                  <tr key={p._id} className="hover:bg-[#f0f3ff] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{p.jobTitle}</span>
                        <span className="text-xs text-[#586158]">{p.jobType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#586158]">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-sm text-[#586158]">{p.rate || "—"}</td>
                    <td className="px-6 py-5 font-bold">{p.applicants}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusStyle[p.status] ?? statusStyle.draft}`}>
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
