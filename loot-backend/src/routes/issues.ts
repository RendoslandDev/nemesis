import { Router, Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { issueService } from "../models/issue";
import { subscriberService } from "../models/subscriber";
import { emailService } from "../services/email";
import { AppError } from "../middleware/errorHandler";
import { query } from "../config/db";

const router = Router();

const createIssueSchema = z.object({
  title: z.string().min(5).max(300),
  excerpt: z.string().min(10).max(500),
  content: z.array(z.any()).optional(),
  tags: z.array(z.string()).max(10).optional(),
  read_time: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "scheduled", "published"]).optional(),
  scheduled_at: z.string().datetime().optional().transform(v => v ? new Date(v) : undefined),
});

const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});


router.get("/", validate(paginationSchema, "query"), async (req: Request, res: Response) => {
  const { limit, offset } = req.query as any;
  const result = await issueService.getPublished(limit, offset);
  res.json(result);
});

router.get("/admin/all", requireAdmin, validate(paginationSchema, "query"), async (req: Request, res: Response) => {
  const { limit, offset } = req.query as any;
  const status = req.query.status as string | undefined;
  const result = await issueService.list(status, limit, offset);
  res.json(result);
});


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get("/:slugOrId", async (req: Request, res: Response) => {
  const { slugOrId } = req.params;

  let issue = null;

  if (UUID_RE.test(slugOrId)) {
    issue = await issueService.findById(slugOrId);
  } else {
    issue = await issueService.findBySlug(slugOrId);
  }

  if (!issue || issue.status !== "published") {
    throw new AppError(404, "Issue not found");
  }

  res.json(issue);
});


router.post("/", requireAuth, validate(createIssueSchema), async (req: Request, res: Response) => {
  const issue = await issueService.create({
    ...req.body,
    author_id: req.author!.id,
  });
  res.status(201).json(issue);
});


router.patch("/:id", requireAuth, validate(createIssueSchema.partial()), async (req: Request, res: Response) => {
  const existing = await issueService.findById(req.params.id);
  if (!existing) throw new AppError(404, "Issue not found");

  if (req.author!.role !== "admin" && existing.author_id !== req.author!.id) {
    throw new AppError(403, "Not authorized to edit this issue");
  }

  const updated = await issueService.update(req.params.id, req.body);
  res.json(updated);
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  const deleted = await issueService.delete(req.params.id);
  if (!deleted) throw new AppError(404, "Issue not found");
  res.status(204).send();
});


router.post("/:id/send", requireAdmin, async (req: Request, res: Response) => {
  const issue = await issueService.findById(req.params.id);
  if (!issue) throw new AppError(404, "Issue not found");
  if (issue.status !== "published") throw new AppError(400, "Issue must be published before sending");
  if (issue.sent_at) throw new AppError(409, "Issue has already been sent");

  const { subscribers } = await subscriberService.list("active", 10000, 0);
  if (subscribers.length === 0) throw new AppError(400, "No active subscribers to send to");

  await query("UPDATE issues SET sent_at = now() WHERE id = $1", [issue.id]);

  emailService.sendIssue(issue, subscribers).then(async ({ sent, failed }) => {
    await query("UPDATE issues SET sent_count = $1 WHERE id = $2", [sent, issue.id]);
    console.log(`Issue #${issue.number} sent: ${sent} ok, ${failed} failed`);
  }).catch(console.error);

  res.json({
    message: `Sending issue #${issue.number} to ${subscribers.length} subscribers...`,
    subscriber_count: subscribers.length,
  });
});

export default router;
