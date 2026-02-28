# DevLetter API

Production-ready Express + TypeScript backend for DevLetter.

## Stack

- **Runtime**: Node.js 20+ / TypeScript
- **Framework**: Express 4
- **Database**: PostgreSQL (via `pg`)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Email**: Nodemailer (works with Resend, SendGrid, or any SMTP)
- **Validation**: Zod
- **Security**: Helmet, CORS, rate limiting (express-rate-limit)

## Setup

```bash
# 1. Install deps
npm install

# 2. Configure env
cp .env.example .env
# Edit .env with your DB URL, SMTP, JWT secret

# 3. Run migrations
npm run db:migrate

# 4. Seed sample data (optional)
npm run db:seed

# 5. Start dev server
npm run dev
```

## API Reference

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register author (first = admin) |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Current author profile |

### Issues
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/issues` | — | List published issues |
| GET | `/api/issues/:slug` | — | Get single issue by slug or id |
| POST | `/api/issues` | JWT | Create issue |
| PATCH | `/api/issues/:id` | JWT | Update issue |
| DELETE | `/api/issues/:id` | Admin | Delete issue |
| GET | `/api/issues/admin/all` | Admin | List all issues (any status) |
| POST | `/api/issues/:id/send` | Admin | Send issue to all subscribers |

### Subscribers
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/subscribers` | — | Subscribe (sends confirmation email) |
| GET | `/api/subscribers/confirm?token=` | — | Confirm subscription |
| GET | `/api/subscribers/unsubscribe?token=` | — | Unsubscribe |
| GET | `/api/subscribers` | Admin | List all subscribers |
| GET | `/api/subscribers/stats` | Admin | Subscriber stats |

### Health
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Server health check |

## Database Schema

```
subscribers  — email, status, confirm/unsubscribe tokens
authors      — name, email, password_hash, role (author/admin)
issues       — number, slug, title, excerpt, content (JSONB), tags, status
email_sends  — audit log of all emails sent per subscriber per issue
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use a strong `JWT_SECRET` (32+ random chars)
- [ ] Configure SMTP (Resend recommended: `smtp.resend.com:465`)
- [ ] Set `CORS_ORIGIN` to your frontend domain
- [ ] Set up SSL/TLS (use a reverse proxy like Nginx or Caddy)
- [ ] Run behind PM2 or use a platform like Railway/Render/Fly.io
- [ ] Set up DB backups (daily at minimum)
- [ ] Monitor with Sentry or similar

## Connecting the Frontend

In your Vite frontend, point the API client at this server:

```typescript
// src/services/api.ts
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const subscribe = (email: string, name?: string) =>
  fetch(`${BASE}/api/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  }).then(r => r.json());
```
