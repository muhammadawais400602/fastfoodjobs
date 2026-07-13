import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import PortalSidebar from "@/components/PortalSidebar";
import VerifyEmailBanner from "@/components/VerifyEmailBanner";

const nav = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Job Listings", icon: "work", href: "/admin/listings" },
  { label: "Applications", icon: "group", href: "/admin/applications" },
  { label: "Messages", icon: "mail", href: "/admin/messages" },
  { label: "Team Management", icon: "groups", href: "/admin/team" },
  { label: "Settings", icon: "settings", href: "/admin/settings" },
];

export default async function AdminShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  active: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const session = await getSession();

  let unverified = false;
  if (session) {
    try {
      const db = await getDb();
      const user = await db.collection("users").findOne({ email: session.email });
      unverified = user?.emailVerified === false;
    } catch {
      // If the check fails, don't block the page over a banner.
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#001b3c]">
      <PortalSidebar
        brand="FastFoodJobs"
        brandSub="Recruitment Portal"
        nav={nav}
        active={active}
        footerTitle={session?.restaurant ?? "Restaurant"}
        footerSub={session?.email ?? ""}
        headerTitle={title}
        headerRight={session?.restaurant ?? ""}
      />

      <div className="lg:ml-[260px]">
        <main className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto animate-fade-in-up">
          {unverified && <VerifyEmailBanner />}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-[32px] font-bold leading-tight">{title}</h2>
              {subtitle && <p className="text-[#586158] mt-1 text-sm md:text-base">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
