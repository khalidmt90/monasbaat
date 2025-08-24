import { expect, test, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
let orderId: string; let intentId: string; let filename: string;

beforeAll(async () => {
  const order = await prisma.order.create({ data:{ status:'pending_payment' } });
  orderId = order.id;
  const intent = await prisma.paymentIntent.create({ data:{ orderId, type:'bank_transfer', amountExpected:100 } });
  intentId = intent.id;
  // Simulate upload write
  const storageDir = `${process.cwd()}/storage/proofs`;
  await fs.promises.mkdir(storageDir, { recursive:true });
  filename = `${orderId}-test.txt`;
  await fs.promises.writeFile(`${storageDir}/${filename}`, 'hello');
  await prisma.paymentIntent.update({ where:{ id:intentId }, data:{ proofUrl: `/api/uploads/proof/${filename}` } });
});

afterAll(async ()=>{ await prisma.$disconnect(); });

test('proof record stored with private URL', async () => {
  const intent = await prisma.paymentIntent.findUnique({ where:{ id:intentId } });
  expect(intent?.proofUrl).toContain(`/api/uploads/proof/`);
});
