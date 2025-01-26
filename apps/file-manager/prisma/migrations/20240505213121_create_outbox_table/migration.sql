-- CreateEnum
CREATE TYPE "OutboxType" AS ENUM ('FILE_DELETED');

-- CreateTable
CREATE TABLE "outbox" (
    "id" TEXT NOT NULL,
    "type" "OutboxType" NOT NULL,
    "aggregate_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "last_attempted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "outbox_type_aggregate_id_idx" ON "outbox"("type", "aggregate_id");
