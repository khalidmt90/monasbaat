import { PrismaClient } from "@prisma/client";
import { bootstrapAdmin } from "@/lib/bootstrap-admin";

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__prisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.__prisma__ = prisma;

// Fire and forget admin bootstrap (idempotent) only in runtime, not during build
if (typeof process !== 'undefined' && !process.env.VERCEL_BUILD) {
  // Vercel sets VERCEL_BUILD=1 during build phase; skip DB access then.
  bootstrapAdmin();
}
