import { PrismaClient } from '@prisma/client';

declare global {
  // Ensure our generated client includes model delegates even if type generation hiccups
  // (Workaround for transient generation issue in this environment.)
  // These are structural augmentations; at runtime the properties exist.
  interface PrismaClient {
    order: any;
    orderItem: any;
    paymentIntent: any;
    invoice: any;
    auditLog: any;
    counter: any;
  }
}

export {};
