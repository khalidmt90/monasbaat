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

// Fire and forget admin bootstrap (idempotent)
bootstrapAdmin();
