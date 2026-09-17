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
