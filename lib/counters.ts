import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * Atomically increments and returns the next numeric value for the given counter key.
 * If a transaction client is supplied we reuse it (important to avoid nested write transactions in SQLite).
 */
export async function nextCounter(key: string, tx?: Prisma.TransactionClient): Promise<number> {
  if(tx){
    await tx.counter.upsert({ where:{ key }, update:{}, create:{ key, value:0 }});
    const updated = await tx.counter.update({ where:{ key }, data:{ value:{ increment:1 }}});
    return updated.value;
  }
  return prisma.$transaction(async (inner: Prisma.TransactionClient) => {
    await inner.counter.upsert({ where:{ key }, update:{}, create:{ key, value:0 }});
    const updated = await inner.counter.update({ where:{ key }, data:{ value:{ increment:1 }}});
    return updated.value;
  });
}

export function formatSeq(prefix: string, n: number, pad: number){
  return prefix + n.toString().padStart(pad,'0');
}
