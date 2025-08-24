PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('4823f961-f6a4-4863-8af3-dfe110c6167c','6bb143ccede34b5f2f4a708529a8dbd8615ee75bcfe6852717b47bd0c97b4088',1755981295301,'20250821125352_init',NULL,NULL,1755981295298,1);
INSERT INTO _prisma_migrations VALUES('874fe24f-44cf-4153-a3fa-91e2b487dcf0','63d2ac87e25f53b0a177d44037c615bb82405abd18f4fcb66950291559f0d67d',1755981295302,'20250823200003_add_feature_flags',NULL,NULL,1755981295302,1);
INSERT INTO _prisma_migrations VALUES('2b6f3cde-cb06-4065-9ca9-83fba95de39b','0728ae3c77ffe3f2bb8897dc302aa6aff3d56c60f649b2a9bf6f386047e05377',1755981295306,'20250823202127_phase2_core_models',NULL,NULL,1755981295302,1);
INSERT INTO _prisma_migrations VALUES('15014cd3-073f-4ff9-83da-a5cd94e5a7b0','2b83ab930797d04fb2a3caf1953011c9e216dfa730a6a10be19a56e7097442f9',1755981295315,'20250823203427_init_full',NULL,NULL,1755981295306,1);
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "Vendor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "company" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vendorId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "price" INTEGER NOT NULL,
    "images" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Service_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hallId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 1,
    "session" TEXT,
    "addons" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transferRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Banner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "section" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "ctaText" TEXT,
    "ctaHref" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "FeatureFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "HallSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hallId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "capacity_limit" INTEGER,
    "price_override" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HallSlot_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "HallBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hallId" TEXT NOT NULL,
    "slotId" TEXT,
    "event_date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "pricing_json" JSONB,
    "totals_json" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HallBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HallBooking_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HallBooking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "HallSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "AgeWeightMapping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animal_type" TEXT NOT NULL,
    "age_id" TEXT NOT NULL,
    "size_band_id" TEXT,
    "estimated_weight_kg" INTEGER NOT NULL,
    "base_price_modifier" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "BookingAddon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "totals_json" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookingAddon_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "HallBooking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Hall" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "name_en" TEXT,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "area" TEXT,
    "menCapacity" INTEGER NOT NULL DEFAULT 0,
    "womenCapacity" INTEGER NOT NULL DEFAULT 0,
    "capacity_min" INTEGER,
    "capacity_max" INTEGER,
    "base_price" INTEGER NOT NULL,
    "base_price_decimal" INTEGER,
    "sessions" JSONB NOT NULL,
    "amenities" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "photos" JSONB,
    "description_ar" TEXT,
    "description_en" TEXT,
    "fee_rules" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "lat" REAL,
    "lng" REAL,
    "rating" REAL,
    "reviewsCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vendorId" TEXT,
    CONSTRAINT "Hall_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Animal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "Breed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animalId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Breed_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Age" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animalId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "teethLabel" TEXT,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Age_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "SizeBand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animalId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "labelEn" TEXT,
    "min_weight" INTEGER,
    "max_weight" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SizeBand_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "CutPreset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "priceModifier" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "PackagingOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "priceModifier" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "CookingOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "priceModifier" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "SideOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "priceModifier" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "address" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Branch_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "BasePrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animalId" TEXT NOT NULL,
    "breedId" TEXT,
    "ageId" TEXT,
    "sizeBandId" TEXT,
    "priceBase" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BasePrice_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BasePrice_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BasePrice_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES "Age" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BasePrice_sizeBandId_fkey" FOREIGN KEY ("sizeBandId") REFERENCES "SizeBand" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "DeliveryFee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT,
    "target" TEXT NOT NULL DEFAULT 'HOME',
    "fee" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeliveryFee_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "DeliverySlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "cutoff_time" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeliverySlot_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "GlobalConfig" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" JSONB NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");
CREATE UNIQUE INDEX "Hall_slug_key" ON "Hall"("slug");
CREATE INDEX "HallSlot_hallId_date_idx" ON "HallSlot"("hallId", "date");
CREATE UNIQUE INDEX "HallSlot_hallId_date_start_time_end_time_key" ON "HallSlot"("hallId", "date", "start_time", "end_time");
CREATE INDEX "HallBooking_hallId_event_date_idx" ON "HallBooking"("hallId", "event_date");
CREATE INDEX "HallBooking_userId_idx" ON "HallBooking"("userId");
CREATE UNIQUE INDEX "AgeWeightMapping_animal_type_age_id_key" ON "AgeWeightMapping"("animal_type", "age_id");
CREATE INDEX "BookingAddon_bookingId_idx" ON "BookingAddon"("bookingId");
CREATE UNIQUE INDEX "Animal_code_key" ON "Animal"("code");
CREATE INDEX "Breed_animalId_idx" ON "Breed"("animalId");
CREATE UNIQUE INDEX "Breed_animalId_code_key" ON "Breed"("animalId", "code");
CREATE INDEX "Age_animalId_idx" ON "Age"("animalId");
CREATE UNIQUE INDEX "Age_animalId_code_key" ON "Age"("animalId", "code");
CREATE INDEX "SizeBand_animalId_idx" ON "SizeBand"("animalId");
CREATE UNIQUE INDEX "SizeBand_animalId_code_key" ON "SizeBand"("animalId", "code");
CREATE UNIQUE INDEX "CutPreset_code_key" ON "CutPreset"("code");
CREATE UNIQUE INDEX "PackagingOption_code_key" ON "PackagingOption"("code");
CREATE UNIQUE INDEX "CookingOption_code_key" ON "CookingOption"("code");
CREATE UNIQUE INDEX "SideOption_code_key" ON "SideOption"("code");
CREATE UNIQUE INDEX "City_code_key" ON "City"("code");
CREATE INDEX "Branch_cityId_idx" ON "Branch"("cityId");
CREATE UNIQUE INDEX "Branch_cityId_code_key" ON "Branch"("cityId", "code");
CREATE INDEX "BasePrice_animalId_idx" ON "BasePrice"("animalId");
CREATE INDEX "BasePrice_breedId_idx" ON "BasePrice"("breedId");
CREATE INDEX "BasePrice_ageId_idx" ON "BasePrice"("ageId");
CREATE INDEX "BasePrice_sizeBandId_idx" ON "BasePrice"("sizeBandId");
CREATE INDEX "DeliveryFee_cityId_idx" ON "DeliveryFee"("cityId");
CREATE INDEX "DeliveryFee_target_idx" ON "DeliveryFee"("target");
CREATE INDEX "DeliverySlot_cityId_date_idx" ON "DeliverySlot"("cityId", "date");
CREATE UNIQUE INDEX "DeliverySlot_cityId_date_start_time_end_time_key" ON "DeliverySlot"("cityId", "date", "start_time", "end_time");
COMMIT;
