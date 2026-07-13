import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Posting jobs now lives inside the restaurant portal. Old links land here,
// so send restaurants to their listings page and everyone else to login.
export default async function PostJobPage() {
  const session = await getSession();
  redirect(session?.role === "restaurant" ? "/admin/listings" : "/login");
}
