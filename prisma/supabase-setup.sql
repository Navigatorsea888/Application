-- ===========================================================================
-- Navigator Sea Land Limited — complete database setup
--
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- It is the exact content of the two Prisma migrations, plus the rows that
-- tell Prisma they have been applied.
--
-- It does three things:
--   1. Creates all 11 tables, their indexes and foreign keys.
--   2. Locks the PostgREST API off — row-level security on every table with
--      no policies, and no grants for anon or authenticated. Without this,
--      anyone holding your anon key (which is public by design) could read
--      the shipment register, client contacts and staff password hashes.
--   3. Records both migrations in _prisma_migrations, so a later
--      `prisma migrate deploy` sees them as already applied instead of
--      trying to create the tables a second time and failing.
--
-- Safe to run once. Running it twice will error on the CREATE TABLE
-- statements, which is the correct behaviour — it means it already ran.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- PART 1 of 3 — schema
-- ---------------------------------------------------------------------------

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERATOR',
    "office" TEXT NOT NULL DEFAULT 'ALMATY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "addressLine" TEXT,
    "city" TEXT,
    "country" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "contractRef" TEXT,
    "projectName" TEXT,
    "blNumber" TEXT,
    "cmrNumber" TEXT,
    "awbNumber" TEXT,
    "clientId" TEXT,
    "shipperName" TEXT NOT NULL,
    "shipperContact" TEXT,
    "shipperEmail" TEXT,
    "shipperPhone" TEXT,
    "shipperAddress" TEXT,
    "consigneeName" TEXT NOT NULL,
    "consigneeContact" TEXT,
    "consigneeEmail" TEXT,
    "consigneePhone" TEXT,
    "consigneeAddress" TEXT,
    "billingPartyName" TEXT,
    "billingPartyContact" TEXT,
    "billingPartyEmail" TEXT,
    "billingPartyAddress" TEXT,
    "originCity" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "portOfLoading" TEXT,
    "portOfDischarge" TEXT,
    "borderCrossings" TEXT,
    "corridors" TEXT,
    "modes" TEXT NOT NULL DEFAULT 'ROAD',
    "cargoDescription" TEXT NOT NULL,
    "commodity" TEXT,
    "packageCount" INTEGER,
    "packageType" TEXT,
    "weightKg" DOUBLE PRECISION,
    "lengthCm" DOUBLE PRECISION,
    "widthCm" DOUBLE PRECISION,
    "heightCm" DOUBLE PRECISION,
    "volumeCbm" DOUBLE PRECISION,
    "isOOG" BOOLEAN NOT NULL DEFAULT false,
    "oogNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'BOOKING_CONFIRMED',
    "exceptionFlag" TEXT,
    "exceptionNote" TEXT,
    "etd" TIMESTAMP(3),
    "eta" TIMESTAMP(3),
    "actualDeparture" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "ownerId" TEXT,
    "isPublicAccess" BOOLEAN NOT NULL DEFAULT false,
    "notifyEmails" TEXT,
    "notifyPhones" TEXT,
    "externalRef" TEXT,
    "externalSource" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT,
    "leg" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "checkpointId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "caption" TEXT,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "originCity" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "cargoDescription" TEXT NOT NULL,
    "commodity" TEXT,
    "packageCount" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "lengthCm" DOUBLE PRECISION,
    "widthCm" DOUBLE PRECISION,
    "heightCm" DOUBLE PRECISION,
    "isOOG" BOOLEAN NOT NULL DEFAULT false,
    "preferredModes" TEXT,
    "requiredByDate" TIMESTAMP(3),
    "incoterms" TEXT,
    "additionalInfo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentEnquiry" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT,
    "trackingRef" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT,
    "channel" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Client_companyName_idx" ON "Client"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingId_key" ON "Shipment"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_externalRef_key" ON "Shipment"("externalRef");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- CreateIndex
CREATE INDEX "Shipment_contractRef_idx" ON "Shipment"("contractRef");

-- CreateIndex
CREATE INDEX "Shipment_consigneeName_idx" ON "Shipment"("consigneeName");

-- CreateIndex
CREATE INDEX "Shipment_createdAt_idx" ON "Shipment"("createdAt");

-- CreateIndex
CREATE INDEX "Checkpoint_shipmentId_occurredAt_idx" ON "Checkpoint"("shipmentId", "occurredAt");

-- CreateIndex
CREATE INDEX "Attachment_checkpointId_idx" ON "Attachment"("checkpointId");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteRequest_reference_key" ON "QuoteRequest"("reference");

-- CreateIndex
CREATE INDEX "QuoteRequest_status_createdAt_idx" ON "QuoteRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ShipmentEnquiry_status_createdAt_idx" ON "ShipmentEnquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_createdAt_idx" ON "NotificationLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "RateLimit_key_createdAt_idx" ON "RateLimit"("key", "createdAt");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "Checkpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentEnquiry" ADD CONSTRAINT "ShipmentEnquiry_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ---------------------------------------------------------------------------
-- PART 2 of 3 — lock the PostgREST API off
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Lock the PostgREST API off.
--
-- Supabase exposes every table in the `public` schema over PostgREST, reachable
-- with the anon key — which is public by design and shipped to browsers. Tables
-- created through the Supabase dashboard get row-level security switched on by
-- default; tables created by a Prisma migration do NOT.
--
-- Without this migration, anyone holding the anon key could read the whole
-- shipment register, every client contact, and the staff password hashes.
--
-- This application never talks to PostgREST. It reaches Postgres through Prisma
-- using the pooled connection string, as the table owner, and table owners
-- bypass RLS — so enabling RLS with no policies costs the application nothing
-- and closes the API completely.
--
-- If you ever want to query Supabase from a browser or another service, add
-- explicit policies then. Do not disable this.
-- ---------------------------------------------------------------------------

-- 1. Enable RLS on every table. With no policies attached, RLS denies all
--    access to any role that is not the owner.
DO $$
DECLARE
  target RECORD;
BEGIN
  FOR target IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target.tablename);
  END LOOP;
END
$$;

-- 2. Revoke every grant from the two roles PostgREST authenticates as, and stop
--    future tables inheriting grants. Guarded by an existence check so this
--    migration also runs on a plain Postgres, where these roles do not exist.
DO $$
DECLARE
  api_role TEXT;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated']
  LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON SCHEMA public FROM %I', api_role);

      -- Applies to objects created later by the role running migrations.
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM %I', api_role);
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', api_role);
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM %I', api_role);

      RAISE NOTICE 'Revoked public-schema access from role %', api_role;
    ELSE
      RAISE NOTICE 'Role % does not exist here (not a Supabase database) — skipped', api_role;
    END IF;
  END LOOP;
END
$$;


-- ---------------------------------------------------------------------------
-- PART 3 of 3 — tell Prisma these migrations are already applied
--
-- Without these rows, `prisma migrate deploy` would try to create the tables
-- again and fail with "relation already exists". The checksums are SHA-256 of
-- the migration files and must match exactly.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    VARCHAR(36) PRIMARY KEY NOT NULL,
    "checksum"              VARCHAR(64) NOT NULL,
    "finished_at"           TIMESTAMPTZ,
    "migration_name"        VARCHAR(255) NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        TIMESTAMPTZ,
    "started_at"            TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "_prisma_migrations"
    (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
VALUES
    (gen_random_uuid()::text,
     '79a0fd71dd6b3c67ff4fe99abda65c39719fed6de4fc6691b8e0bf6919e3675d',
     now(), '20260917141135_init', now(), 1),
    (gen_random_uuid()::text,
     '7978a8627b091a16520938cc87c4cc3334e0956f876cd0d38abefa3a694b8cf6',
     now(), '20260917141200_lock_down_public_api', now(), 1)
ON CONFLICT DO NOTHING;

-- _prisma_migrations sits in the public schema too, so it gets the same
-- treatment as everything else.
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- Verify: every row below must say "t" under rowsecurity.
-- ---------------------------------------------------------------------------
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
