// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Force test database override early when in TEST_MODE to avoid hitting dev.db
if (process.env.TEST_MODE === 'true') {
  const testDb = 'file:./prisma/test.db';
  if (process.env.DATABASE_URL !== testDb) {
    process.env.DATABASE_URL = testDb;
  }
}

// Prevent multiple instances in dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
