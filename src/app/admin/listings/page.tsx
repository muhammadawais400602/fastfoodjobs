import AdminShell from "@/components/admin/AdminShell";
import CreateListing from "@/components/admin/CreateListing";
import ListingsTable from "@/components/admin/ListingsTable";
import { getPostings } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const session = await getSession();
  const postings = await getPostings(session!.restaurant);

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
          <ListingsTable postings={postings} />
        )}
      </div>
    </AdminShell>
  );
}
