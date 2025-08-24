// lib/env.ts
import { z } from "zod";

const schema = z.object({
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32),
  VERCEL_URL: z.string().optional(), // e.g. my-app.vercel.app (no protocol)
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD_HASH: z.string().min(50).optional(), // bcrypt hash
});

export const env = schema.parse({
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  VERCEL_URL: process.env.VERCEL_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
});

// Base URL fallback so previews work without setting NEXTAUTH_URL there
// Order of resolution:
// 1. Explicit NEXTAUTH_URL (full URL with protocol)
// 2. NEXT_PUBLIC_SITE_URL (if you decide to expose a canonical base to the client)
// 3. VERCEL_URL (provided automatically for previews, no protocol)
// 4. Localhost fallback (dev only)
export const baseUrl = (() => {
  if (env.NEXTAUTH_URL) return env.NEXTAUTH_URL;
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site) return site;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
})();
