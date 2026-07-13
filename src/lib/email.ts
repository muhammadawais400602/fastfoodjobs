// Transactional email via the Resend HTTP API.
// Set RESEND_API_KEY (and optionally RESEND_FROM_EMAIL, APP_URL) in Vercel env vars.
// Every sender is fire-and-forget: an email failure must never break the user's action.

const FROM = process.env.RESEND_FROM_EMAIL || "FastFoodJobs <onboarding@resend.dev>";
const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://fastfoodjobs.vercel.app";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function sendEmail(to: string, subject: string, bodyHtml: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping:", subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html: layout(bodyHtml) }),
    });
    if (!res.ok) console.error("[email] Resend error:", res.status, await res.text());
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

function layout(inner: string): string {
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;color:#161d16">
    <div style="background:#183153;padding:28px 32px;border-radius:12px 12px 0 0">
      <h1 style="color:#ffffff;margin:0;font-size:20px">FastFood<span style="color:#ff9d7a">Jobs</span></h1>
    </div>
    <div style="padding:32px;background:#ffffff;border:1px solid #e4bebc;border-top:none;border-radius:0 0 12px 12px">
      ${inner}
      <p style="margin-top:32px;font-size:12px;color:#8f6f6e">
        You're receiving this because of activity on your FastFoodJobs account.
      </p>
    </div>
  </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#b7102a;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:8px;margin:16px 0">${label}</a>`;
}

// --- New application → restaurant ---
export function notifyRestaurantNewApplication(opts: {
  to: string;
  applicantName: string;
  jobTitle: string;
}) {
  const name = escapeHtml(opts.applicantName);
  const job = escapeHtml(opts.jobTitle || "your job listing");
  void sendEmail(
    opts.to,
    `New application: ${opts.applicantName} — ${opts.jobTitle || "your listing"}`,
    `
    <h2 style="color:#183153;margin:0 0 12px">New application received 🎉</h2>
    <p style="line-height:1.6;color:#5b403f"><strong>${name}</strong> just applied for <strong>${job}</strong>.</p>
    <p style="line-height:1.6;color:#5b403f">Review their CV and motivation, then move them forward or start a chat.</p>
    ${button(`${APP_URL}/admin/applications`, "View application")}
    `
  );
}

// --- Status change → candidate ---
export function notifyApplicantStatus(opts: {
  to: string;
  applicantName: string;
  jobTitle: string;
  restaurant: string;
  status: string;
  interviewAt?: string;
  rejectionReason?: string;
  chatToken?: string;
}) {
  const job = escapeHtml(opts.jobTitle || "the position");
  const rest = escapeHtml(opts.restaurant || "the restaurant");
  const first = escapeHtml(opts.applicantName.split(" ")[0] || "there");
  const chatLink = opts.chatToken ? `${APP_URL}/chat/${opts.chatToken}` : `${APP_URL}/candidate/applications`;

  let subject = "";
  let body = "";

  if (opts.status === "interview") {
    const when = opts.interviewAt
      ? new Date(opts.interviewAt).toLocaleString([], { dateStyle: "full", timeStyle: "short" })
      : "";
    subject = `Interview invitation — ${opts.jobTitle} at ${opts.restaurant}`;
    body = `
    <h2 style="color:#183153;margin:0 0 12px">You've got an interview! 🎉</h2>
    <p style="line-height:1.6;color:#5b403f">Hi ${first}, great news — <strong>${rest}</strong> wants to interview you for <strong>${job}</strong>.</p>
    ${when ? `<p style="line-height:1.6;color:#5b403f"><strong>When:</strong> ${escapeHtml(when)}</p>` : ""}
    <p style="line-height:1.6;color:#5b403f">If you have questions, reply in your chat with the restaurant.</p>
    ${button(chatLink, "Open your chat")}`;
  } else if (opts.status === "hire") {
    subject = `Congratulations — you got the job at ${opts.restaurant}!`;
    body = `
    <h2 style="color:#183153;margin:0 0 12px">You're hired! 🎊</h2>
    <p style="line-height:1.6;color:#5b403f">Hi ${first}, <strong>${rest}</strong> has selected you for <strong>${job}</strong>. They'll be in touch with next steps — you can also message them directly.</p>
    ${button(chatLink, "Open your chat")}`;
  } else if (opts.status === "reject") {
    subject = `Update on your application — ${opts.jobTitle} at ${opts.restaurant}`;
    body = `
    <h2 style="color:#183153;margin:0 0 12px">Application update</h2>
    <p style="line-height:1.6;color:#5b403f">Hi ${first}, thank you for applying for <strong>${job}</strong> at <strong>${rest}</strong>. Unfortunately they've decided not to move forward this time.</p>
    ${opts.rejectionReason ? `<p style="line-height:1.6;color:#5b403f;background:#fff4f2;border-left:3px solid #b7102a;padding:12px 16px;border-radius:0 8px 8px 0"><strong>Their feedback:</strong> ${escapeHtml(opts.rejectionReason)}</p>` : ""}
    <p style="line-height:1.6;color:#5b403f">Don't be discouraged — new roles are posted every day.</p>
    ${button(`${APP_URL}/jobs`, "Browse more jobs")}`;
  } else {
    return; // no email for "new"/"reviewed"
  }

  void sendEmail(opts.to, subject, body);
}

// --- Password reset ---
export function sendPasswordReset(opts: { to: string; resetUrl: string }) {
  void sendEmail(
    opts.to,
    "Reset your FastFoodJobs password",
    `
    <h2 style="color:#183153;margin:0 0 12px">Password reset</h2>
    <p style="line-height:1.6;color:#5b403f">We received a request to reset your password. Click the button below — the link is valid for 1 hour.</p>
    ${button(opts.resetUrl, "Reset password")}
    <p style="line-height:1.6;color:#5b403f;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
    `
  );
}
