-- Persist Stripe customer, billing snapshot, and invoice references for one-time checkout flows.
ALTER TABLE "User"
ADD COLUMN "stripeCustomerId" TEXT;

ALTER TABLE "Order"
ADD COLUMN "billingName" TEXT,
ADD COLUMN "billingEmail" TEXT,
ADD COLUMN "billingPhone" TEXT,
ADD COLUMN "billingTaxId" TEXT,
ADD COLUMN "billingTaxIdType" TEXT,
ADD COLUMN "billingTaxExempt" TEXT,
ADD COLUMN "billingAddressJson" TEXT,
ADD COLUMN "stripeInvoiceId" TEXT,
ADD COLUMN "stripeInvoiceNumber" TEXT,
ADD COLUMN "stripeInvoicePdfUrl" TEXT,
ADD COLUMN "stripeHostedInvoiceUrl" TEXT;

CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "Order_stripeInvoiceId_key" ON "Order"("stripeInvoiceId");
