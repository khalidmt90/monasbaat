#!/usr/bin/env ts-node
/**
 * Set or create an admin user.
 * Usage:
 *   pnpm tsx scripts/set-admin.ts --email you@example.com --password 'PlainPass123' [--role ADMIN]
 * If the user exists: upgrades role and (optionally) resets password.
 * If missing: creates with provided password.
 */
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

function parseArgs() {
  const args = process.argv.slice(2);
  const out: Record<string,string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i+1];
      if (next && !next.startsWith('--')) { out[key] = next; i++; } else { out[key] = 'true'; }
    }
  }
  return out;
}

async function main() {
  const { email, password, role = 'ADMIN' } = parseArgs();
  if (!email) {
    console.error('Missing --email');
    console.log('Example: pnpm tsx scripts/set-admin.ts --email you@example.com --password Secret123');
    process.exit(1);
  }
  if (!password) {
    console.warn('No --password provided. Existing user password will stay unchanged. New user creation requires a password.');
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const data: any = { role };
    if (password) data.password = bcrypt.hashSync(password, 10);
    const updated = await prisma.user.update({ where: { email }, data });
    console.log(`Updated user ${updated.id} email=${updated.email} role=${updated.role} passwordReset=${Boolean(password)}`);
  } else {
    if (!password) {
      console.error('Cannot create new user without --password');
      process.exit(1);
    }
    const created = await prisma.user.create({ data: { email, password: bcrypt.hashSync(password, 10), role } });
    console.log(`Created user ${created.id} email=${created.email} role=${created.role}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());
