import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import NavbarClient from "@/components/NavbarClient";

// Session-aware site header: visitors get the marketing nav, signed-in
// restaurants/candidates get their portal menu under the profile icon.
export default async function Navbar() {
  const session = await getSession();

  let logoUrl = "";
  if (session && ObjectId.isValid(session.id)) {
    try {
      const db = await getDb();
      if (session.role === "restaurant") {
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(session.id) }, { projection: { "profile.logoUrl": 1 } });
        logoUrl = String(user?.profile?.logoUrl ?? "");
      } else {
        const c = await db
          .collection("candidates")
          .findOne({ _id: new ObjectId(session.id) }, { projection: { avatarUrl: 1 } });
        logoUrl = String(c?.avatarUrl ?? "");
      }
    } catch {
      // No image is fine — the client falls back to initials.
    }
  }

  return (
    <NavbarClient
      session={
        session
          ? {
              role: session.role,
              name: session.role === "restaurant" ? session.restaurant : session.name,
              logoUrl,
            }
          : null
      }
    />
  );
}
