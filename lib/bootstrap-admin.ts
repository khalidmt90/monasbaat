// lib/bootstrap-admin.ts
import { prisma } from "@/lib/prisma";

const email = process.env.ADMIN_EMAIL;
const passHash = process.env.ADMIN_PASSWORD_HASH;

/**
 * If ADMIN_EMAIL + ADMIN_PASSWORD_HASH exist, ensure an ADMIN user.
 * Idempotent: upsert + force role=ADMIN and password to the provided hash.
 * Safe to call on every cold start.
 */
export async function bootstrapAdmin() {
  if (!email || !passHash) return;
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN", password: passHash },
      create: { email, password: passHash, role: "ADMIN" },
    });
    console.info(`[bootstrap-admin] ensured ADMIN ${user.email}`);
  } catch (err) {
    console.error("[bootstrap-admin] failed:", err);
    throw err;
  }
}
