-- ---------------------------------------------------------------------------
-- Seven-step "Request a Quote" form: service line, HS code, per-piece weight,
-- special-requirement flags, cargo-ready date, contact position and language,
-- plus attachments (drawings, packing lists, SDS, photos).
--
-- Additive only. Every new column is nullable or defaulted, so rows written by
-- the earlier single-page form remain valid.
-- ---------------------------------------------------------------------------

-- AlterTable
ALTER TABLE "QuoteRequest"
  ADD COLUMN "serviceType" TEXT,
  ADD COLUMN "hsCode" TEXT,
  ADD COLUMN "weightPerPieceKg" DOUBLE PRECISION,
  ADD COLUMN "isDangerousGoods" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "unNumber" TEXT,
  ADD COLUMN "isTemperatureControlled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "isBulkLiquid" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "insuranceRequired" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "cargoReadyDate" TIMESTAMP(3),
  ADD COLUMN "contactPosition" TEXT,
  ADD COLUMN "preferredLanguage" TEXT;

-- CreateTable
CREATE TABLE "QuoteAttachment" (
    "id" TEXT NOT NULL,
    "quoteRequestId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuoteAttachment_quoteRequestId_idx" ON "QuoteAttachment"("quoteRequestId");

-- AddForeignKey
ALTER TABLE "QuoteAttachment" ADD CONSTRAINT "QuoteAttachment_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Lock the new table off from PostgREST, exactly as the lockdown migration did
-- for the tables that existed then. RLS with no policies denies every role
-- except the owner; Prisma connects as the owner and is unaffected.
-- ---------------------------------------------------------------------------
ALTER TABLE "QuoteAttachment" ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  api_role TEXT;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated']
  LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON TABLE public."QuoteAttachment" FROM %I', api_role);
      RAISE NOTICE 'Revoked access to QuoteAttachment from role %', api_role;
    ELSE
      RAISE NOTICE 'Role % does not exist here (not a Supabase database) — skipped', api_role;
    END IF;
  END LOOP;
END
$$;
