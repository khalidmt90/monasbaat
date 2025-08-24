// lib/env.ts
import { z } from "zod";

const schema = z.object({
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32),
  VERCEL_URL: z.string().optional(), // e.g. my-app.vercel.app (no protocol)
});

export const env = schema.parse({
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  VERCEL_URL: process.env.VERCEL_URL,
});

// Base URL fallback so previews work without setting NEXTAUTH_URL there
export const baseUrl =
  env.NEXTAUTH_URL ??
  (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:3000");
