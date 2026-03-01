import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { query } from "../config/db";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().max(300).optional(),
  twitter: z.string().max(50).optional(),
});

// POST /auth/login
router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { rows } = await query<{ id: string; email: string; name: string; role: string; password_hash: string }>(
    "SELECT * FROM authors WHERE email = $1",
    [email.toLowerCase()]
  );
  const author = rows[0];

  if (!author || !(await bcrypt.compare(password, author.password_hash))) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: author.id, email: author.email, role: author.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" } as any
  );

  res.json({
    token,
    author: { id: author.id, email: author.email, name: author.name, role: author.role },
  });
});

router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
  const { name, email, password, bio, twitter } = req.body;

  const existing = await query("SELECT id FROM authors WHERE email = $1", [email.toLowerCase()]);
  if (existing.rows.length > 0) throw new AppError(409, "Email already registered");

  const hash = await bcrypt.hash(password, 12);

  // First author gets admin role
  const { rows: [count] } = await query<{ count: string }>("SELECT COUNT(*) FROM authors");
  const role = parseInt(count.count) === 0 ? "admin" : "author";

  const { rows } = await query<{ id: string; email: string; name: string; role: string }>(
    `INSERT INTO authors (name, email, password_hash, bio, twitter, role)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, name, role`,
    [name, email.toLowerCase(), hash, bio, twitter, role]
  );
  const author = rows[0];

  const token = jwt.sign(
    { id: author.id, email: author.email, role: author.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" } as any
  );

  res.status(201).json({ token, author });
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const { rows } = await query(
    "SELECT id, name, email, bio, twitter, role, avatar_url, created_at FROM authors WHERE id = $1",
    [req.author!.id]
  );
  if (!rows[0]) throw new AppError(404, "Author not found");
  res.json(rows[0]);
});

export default router;
