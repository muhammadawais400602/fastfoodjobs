import { getSession } from "@/lib/auth";
import NavbarClient from "@/components/NavbarClient";

// Session-aware site header: visitors get the marketing nav, signed-in
// restaurants/candidates get their portal navigation everywhere.
export default async function Navbar() {
  const session = await getSession();
  return (
    <NavbarClient
      session={
        session
          ? { role: session.role, name: session.role === "restaurant" ? session.restaurant : session.name }
          : null
      }
    />
  );
}
