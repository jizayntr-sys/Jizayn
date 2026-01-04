-- sortOrder kolonunu ekle
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER DEFAULT 0;

-- Index ekle
CREATE INDEX IF NOT EXISTS "Product_sortOrder_idx" ON "Product"("sortOrder");

-- Mevcut ürünlere 0 değeri ver
UPDATE "Product" SET "sortOrder" = 0 WHERE "sortOrder" IS NULL;
