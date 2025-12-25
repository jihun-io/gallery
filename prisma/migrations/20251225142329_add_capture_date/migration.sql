-- AlterTable
ALTER TABLE "images" ADD COLUMN     "captureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "images_captureDate_idx" ON "images"("captureDate");

-- CreateIndex
CREATE INDEX "images_categoryId_captureDate_idx" ON "images"("categoryId", "captureDate");
