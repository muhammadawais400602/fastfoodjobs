import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

// One-click demo data for testing. Only fills the LOGGED-IN restaurant's own
// profile and adds demo jobs/applicants under its name — visit /api/admin/seed-demo
// while signed in to the restaurant portal.
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "restaurant") {
    return NextResponse.json({ ok: false, error: "Sign in to your restaurant account first." }, { status: 401 });
  }

  const restaurant = session.restaurant;
  const db = await getDb();

  // 1. Fill the restaurant profile (settings page + public page).
  await db.collection("users").updateOne(
    { email: session.email },
    {
      $set: {
        profile: {
          name: restaurant,
          tagline: "Legendary smash burgers, made fresh since 2015",
          cuisine: "American / Burgers",
          description:
            "We're a fast-growing burger joint known for our smash patties, hand-cut fries, and a team that feels like family. Great pay, flexible shifts, free staff meals, and real opportunities to grow into shift-lead and management roles.",
          address: "742 Sunset Boulevard",
          city: "Los Angeles, CA",
          phone: "(213) 555-0184",
          website: "https://example.com",
          hours: "Mon–Thu 10:00–22:00\nFri–Sat 10:00–00:00\nSun 11:00–21:00",
          logoUrl: "",
          coverUrl: "",
          amenities: ["wifi", "drive_thru", "indoor", "outdoor", "parking", "delivery"],
          notifications: { newApplicants: true, interviewConfirmations: true, weeklyReports: false },
        },
      },
    }
  );

  // 2. Demo job listings (skip if this restaurant already has postings).
  const existingJobs = await db.collection("postings").countDocuments({ restaurant });
  let jobsCreated = 0;
  if (existingJobs === 0) {
    const jobs = [
      {
        jobTitle: "Grill Cook",
        department: "Kitchen",
        jobType: "Full-time",
        rate: "$17–$19/hr",
        experience: "1+ year",
        shift: "Day & Evening",
        urgent: true,
        description:
          "Own the grill station during our busiest hours. You'll smash patties, keep the line moving, and uphold our food-safety standards.",
        responsibilities: ["Cook burgers and sides to spec", "Keep the grill station clean and stocked", "Follow food-safety procedures", "Support the kitchen team during rushes"],
        requirements: ["1+ year kitchen experience", "Comfortable in a fast-paced environment", "Food handler certificate a plus"],
        benefits: ["Free staff meals", "Flexible scheduling", "Growth into shift-lead roles"],
      },
      {
        jobTitle: "Cashier / Front Counter",
        department: "Front of House",
        jobType: "Part-time",
        rate: "$15–$16/hr + tips",
        experience: "No experience needed",
        shift: "Flexible",
        urgent: false,
        description:
          "Be the friendly face of the restaurant. Take orders, handle payments, and make every guest feel welcome.",
        responsibilities: ["Greet guests and take orders", "Handle cash and card payments", "Keep the front counter tidy", "Help with order pickup and delivery handoff"],
        requirements: ["Friendly, reliable, punctual", "Basic math skills", "Weekend availability a plus"],
        benefits: ["Tips on top of hourly pay", "Free staff meals", "Student-friendly schedules"],
      },
      {
        jobTitle: "Shift Manager",
        department: "Management",
        jobType: "Full-time",
        rate: "$22–$25/hr",
        experience: "2+ years",
        shift: "Rotating",
        urgent: false,
        description:
          "Run the floor during your shift: lead the team, manage breaks, resolve guest issues, and close out the till.",
        responsibilities: ["Lead a team of 6–10 during shifts", "Manage schedules and breaks", "Handle escalations and refunds", "Open/close procedures and cash reconciliation"],
        requirements: ["2+ years restaurant experience", "1+ year in a lead or supervisor role", "Calm under pressure"],
        benefits: ["Free staff meals", "Paid time off", "Clear path to General Manager"],
      },
    ];
    for (const j of jobs) {
      await db.collection("postings").insertOne({ ...j, restaurant, status: "active", applicants: 0, createdAt: new Date() });
      jobsCreated++;
    }
  }

  // 3. Demo applicants (skip if any already exist for this restaurant).
  const existingApps = await db.collection("applications").countDocuments({ restaurant });
  let appsCreated = 0;
  if (existingApps === 0) {
    const firstJob = await db.collection("postings").findOne({ restaurant });
    const applicants = [
      { fullName: "Maria Gonzalez", email: "maria.demo@example.com", phone: "(213) 555-0122", status: "new", motivation: "I've worked two summers at a food truck and love the energy of a busy kitchen. I'm quick, reliable, and great with customers." },
      { fullName: "James Carter", email: "james.demo@example.com", phone: "(213) 555-0147", status: "reviewed", motivation: "Three years of grill experience at a diner. Looking for a team where I can grow into a leadership role." },
      { fullName: "Aisha Khan", email: "aisha.demo@example.com", phone: "(213) 555-0165", status: "new", motivation: "College student with open weekend availability. Friendly, punctual, and a fast learner — cashier experience at a campus café." },
    ];
    for (const a of applicants) {
      const chatToken = crypto.randomUUID();
      const res = await db.collection("applications").insertOne({
        ...a,
        jobId: firstJob?._id?.toString() ?? "",
        jobTitle: firstJob?.jobTitle ?? "Grill Cook",
        jobSlug: "",
        restaurant,
        cv: null,
        chatToken,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 3 * 24) * 60 * 60 * 1000),
      });
      appsCreated++;
      // A first message from one applicant so the chat inbox has something in it.
      if (a.fullName === "Maria Gonzalez") {
        await db.collection("messages").insertOne({
          applicationId: res.insertedId.toString(),
          restaurant,
          sender: "applicant",
          body: "Hi! I just applied for the Grill Cook role — happy to come in for a trial shift any day this week. 😊",
          read: false,
          createdAt: new Date(),
        });
      }
    }
    if (firstJob) {
      await db.collection("postings").updateOne({ _id: firstJob._id }, { $set: { applicants: appsCreated } });
    }
  }

  return NextResponse.json({
    ok: true,
    message: `Demo data loaded for "${restaurant}". Profile filled, ${jobsCreated} jobs and ${appsCreated} applicants created. Visit your dashboard!`,
  });
}
