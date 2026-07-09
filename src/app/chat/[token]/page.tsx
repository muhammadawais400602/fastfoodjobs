import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { getThread } from "@/lib/messages";
import Navbar from "@/components/Navbar";
import ChatClient from "@/components/ChatClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Chat | FastFoodJobs" };

export default async function ChatPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = await getDb();
  const app = await db.collection("applications").findOne({ chatToken: token });
  if (!app) notFound();

  const initial = await getThread(app._id.toString());

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <ChatClient
          token={token}
          restaurant={app.restaurant ?? "the restaurant"}
          jobTitle={app.jobTitle ?? "the role"}
          applicant={app.fullName ?? "you"}
          initial={initial}
        />
      </main>
    </>
  );
}
