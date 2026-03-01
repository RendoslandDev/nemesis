import nodemailer from "nodemailer";
import { Issue } from "../models/issue";
import { Subscriber } from "../models/subscriber";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BASE_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// ── HTML templates ────────────────────────────────────────────────────────

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body { margin:0; padding:0; background:#F4F1EC; font-family:'Georgia',serif; color:#0C0C0C; }
    .wrap { max-width:600px; margin:0 auto; background:#fff; border:1px solid #DDD9D2; }
    .header { background:#0C0C0C; padding:24px 40px; }
    .logo { color:#F4F1EC; font-family:monospace; font-size:13px; letter-spacing:4px; text-transform:uppercase; text-decoration:none; }
    .logo span { color:rgba(255,255,255,0.3); }
    .body { padding:40px; }
    .footer { padding:24px 40px; border-top:1px solid #DDD9D2; }
    .footer p { font-family:monospace; font-size:11px; color:#888; margin:0; }
    .footer a { color:#888; }
    h1 { font-size:26px; line-height:1.25; font-weight:400; margin:0 0 16px; }
    p { font-size:15px; line-height:1.7; margin:0 0 16px; color:#444; }
    .btn { display:inline-block; background:#0C0C0C; color:#F4F1EC; font-family:monospace; font-size:12px; letter-spacing:2px; text-transform:uppercase; padding:12px 24px; text-decoration:none; }
    .tag { display:inline-block; border:1px solid #DDD9D2; font-family:monospace; font-size:10px; padding:3px 8px; color:#888; margin:0 4px 4px 0; text-transform:uppercase; letter-spacing:1px; }
    .meta { font-family:monospace; font-size:11px; color:#aaa; margin-bottom:24px; text-transform:uppercase; letter-spacing:1px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <a href="${BASE_URL}" class="logo">DEV<span>LOOT</span></a>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© 2025 DevLoot · <a href="#">Unsubscribe</a> · <a href="${BASE_URL}">Read online</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ── Email service methods ─────────────────────────────────────────────────

export const emailService = {
  async sendConfirmation(email: string, token: string): Promise<void> {
    const confirmUrl = `${BASE_URL}/confirm?token=${token}`;
    const html = baseLayout(`
      <h1>Confirm your subscription</h1>
      <p>You're one click away from joining 12,000+ developers and creators who read DevLetter every Tuesday.</p>
      <p style="margin:32px 0">
        <a href="${confirmUrl}" class="btn">Confirm subscription →</a>
      </p>
      <p style="font-size:13px;color:#aaa">If you didn't sign up, you can safely ignore this email.</p>
    `);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Confirm your DevLoot subscription",
      html,
    });
  },

  async sendWelcome(email: string, name?: string): Promise<void> {
    const html = baseLayout(`
      <h1>Welcome to DevLoot${name ? `, ${name}` : ""}.</h1>
      <p>You're in. Every Tuesday, a curated dispatch for developers who build and creators who ship — no fluff, no ads, just signal.</p>
      <p>Your first issue arrives this Tuesday. In the meantime, catch up on the archive:</p>
      <p style="margin:32px 0">
        <a href="${BASE_URL}/archive" class="btn">Browse the archive →</a>
      </p>
    `);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "You're in — welcome to DevLoot",
      html,
    });
  },

  async sendIssue(issue: Issue, subscribers: Subscriber[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    const issueUrl = `${BASE_URL}/read/${issue.id}`;

    const tagsHtml = issue.tags.map((t) => `<span class="tag">${t}</span>`).join("");

    const html = baseLayout(`
      <div class="meta">Issue #${issue.number} · ${new Date(issue.published_at!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · ${issue.read_time} read</div>
      <h1>${issue.title}</h1>
      <p><em>${issue.excerpt}</em></p>
      <div style="margin:8px 0 28px">${tagsHtml}</div>
      <p style="margin:32px 0">
        <a href="${issueUrl}" class="btn">Read full issue →</a>
      </p>
      <hr style="border:none;border-top:1px solid #DDD9D2;margin:32px 0" />
      <p style="font-size:13px;color:#aaa">You're receiving this because you subscribed at devloot.io.
        <a href="${BASE_URL}/unsubscribe?token=UNSUBSCRIBE_TOKEN" style="color:#aaa">Unsubscribe</a>
      </p>
    `);

    // In production, use a proper queue. This is a simple sequential send.
    for (const subscriber of subscribers) {
      try {
        const personalizedHtml = html.replace(
          "UNSUBSCRIBE_TOKEN",
          (subscriber as any).unsubscribe_token ?? ""
        );
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: subscriber.email,
          subject: `[#${issue.number}] ${issue.title}`,
          html: personalizedHtml,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${subscriber.email}:`, err);
        failed++;
      }
    }

    return { sent, failed };
  },
};
