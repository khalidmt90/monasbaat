import { PrismaClient } from "@prisma/client";

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

// Optional bootstrap of an admin user at runtime (idempotent) for preview / first run
async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH; // pre-hashed (bcrypt)
  if (!email || !hash) return;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await prisma.user.create({ data: { email, password: hash, role: "ADMIN" } });
      console.log("[bootstrap] Created admin user", email);
    }
  } catch (e) {
    console.error("[bootstrap] admin user creation failed", e);
  }
}

// Fire and forget; no await to avoid blocking cold start.
ensureBootstrapAdmin();
