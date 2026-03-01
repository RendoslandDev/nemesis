import { Router, Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { subscriberService } from "../models/subscriber";
import { emailService } from "../services/email";
import { AppError } from "../middleware/errorHandler";

const router = Router();


const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
});

router.post("/", validate(subscribeSchema), async (req: Request, res: Response) => {
  const { email, name, source } = req.body;

  const existing = await subscriberService.findByEmail(email);
  if (existing) {
    if (existing.status === "active") {
      res.status(200).json({ message: "You're already subscribed!" });
      return;
    }
    if (existing.status === "unsubscribed") {

      await subscriberService.create(email, name, source);
    }
  }

  const subscriber = existing ?? (await subscriberService.create(email, name, source));


  if ((subscriber as any).confirm_token) {
    emailService
      .sendConfirmation(subscriber.email, (subscriber as any).confirm_token)
      .catch(console.error);
  }

  res.status(201).json({
    message: "Check your inbox to confirm your subscription.",
    id: subscriber.id,
  });
});

router.get("/confirm", async (req: Request, res: Response) => {
  const token = String(req.query.token ?? "");
  if (!token) throw new AppError(400, "Missing confirmation token");

  const subscriber = await subscriberService.confirm(token);
  if (!subscriber) throw new AppError(400, "Invalid or expired confirmation token");

  emailService.sendWelcome(subscriber.email, subscriber.name ?? undefined).catch(console.error);

  res.json({ message: "Subscription confirmed! Welcome to DevLetter." });
});

router.get("/unsubscribe", async (req: Request, res: Response) => {
  const token = String(req.query.token ?? "");
  if (!token) throw new AppError(400, "Missing unsubscribe token");

  const subscriber = await subscriberService.unsubscribe(token);
  if (!subscriber) throw new AppError(400, "Invalid unsubscribe token");

  res.json({ message: "You've been unsubscribed. Sorry to see you go." });
});

router.get("/", requireAdmin, async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit ?? 50), 200);
  const offset = Number(req.query.offset ?? 0);
  const status = req.query.status as string | undefined;

  const result = await subscriberService.list(status, limit, offset);
  res.json(result);
});

router.get("/stats", requireAdmin, async (_req: Request, res: Response) => {
  const stats = await subscriberService.getStats();
  res.json(stats);
});

export default router;
