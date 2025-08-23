-- Add customer contact columns to Order
ALTER TABLE "Order" ADD COLUMN "customer_name" TEXT;
ALTER TABLE "Order" ADD COLUMN "customer_email" TEXT;
ALTER TABLE "Order" ADD COLUMN "customer_phone" TEXT;

-- Add proof tracking columns to PaymentIntent
ALTER TABLE "PaymentIntent" ADD COLUMN "proof_submitted_at" DATETIME;
ALTER TABLE "PaymentIntent" ADD COLUMN "proof_meta" JSONB;

-- Create SlotLock table for per-slot exclusive locks
CREATE TABLE "SlotLock" (
  "slotId" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "locked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" DATETIME,
  CONSTRAINT "SlotLock_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "HallSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "SlotLock_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Indexes for SlotLock
CREATE INDEX "SlotLock_orderId_idx" ON "SlotLock"("orderId");
