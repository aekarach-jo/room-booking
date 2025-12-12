-- ============================================
-- Migration: Update Roles and Add New Features
-- Date: 2025-12-06
-- ============================================

-- Step 1: Add new enum values before removing old ones
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'STUDENT';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TEACHER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'STAFF';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'DEPARTMENT_HEAD';

-- Step 2: Update existing USER to STUDENT
UPDATE "User" SET role = 'STUDENT' WHERE role = 'USER';

-- Step 3: Update existing ADMIN to STAFF
UPDATE "User" SET role = 'STAFF' WHERE role = 'ADMIN';

-- Step 4: Add new columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "teacherId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "department" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "year" INTEGER;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "noShowCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isSuspended" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "suspendedUntil" TIMESTAMP(3);

-- Step 5: Create RoomType enum
DO $$ BEGIN
  CREATE TYPE "RoomType" AS ENUM ('LECTURE', 'COMPUTER_LAB', 'LABORATORY', 'MEETING', 'STUDY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 6: Add new columns to Room table
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "type" "RoomType" NOT NULL DEFAULT 'LECTURE';
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "floor" INTEGER;
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "building" TEXT;
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "equipment" JSONB;
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "openTime" TEXT DEFAULT '08:00';
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "closeTime" TEXT DEFAULT '20:00';
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "maxBookingHours" INTEGER DEFAULT 3;
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "advanceBookingDays" INTEGER DEFAULT 7;
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "requireApproval" BOOLEAN NOT NULL DEFAULT true;

-- Step 7: Add check-in/check-out columns to Booking table
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "checkInTime" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "checkOutTime" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "isNoShow" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "recurringBookingId" TEXT;

-- Step 8: Create RecurringPattern enum
DO $$ BEGIN
  CREATE TYPE "RecurringPattern" AS ENUM ('DAILY', 'WEEKLY', 'CUSTOM');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 9: Create RecurringBooking table
CREATE TABLE IF NOT EXISTS "RecurringBooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "pattern" "RecurringPattern" NOT NULL,
    "daysOfWeek" JSONB,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecurringBooking_pkey" PRIMARY KEY ("id")
);

-- Step 10: Create RoomMaintenance table
CREATE TABLE IF NOT EXISTS "RoomMaintenance" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMaintenance_pkey" PRIMARY KEY ("id")
);

-- Step 11: Create Semester table
CREATE TABLE IF NOT EXISTS "Semester" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- Step 12: Create SpecialDateType enum
DO $$ BEGIN
  CREATE TYPE "SpecialDateType" AS ENUM ('HOLIDAY', 'EXAM', 'EVENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 13: Create SpecialDate table
CREATE TABLE IF NOT EXISTS "SpecialDate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "SpecialDateType" NOT NULL,
    "description" TEXT,
    "semesterId" TEXT,

    CONSTRAINT "SpecialDate_pkey" PRIMARY KEY ("id")
);

-- Step 14: Create NotificationType enum
DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM ('BOOKING_APPROVED', 'BOOKING_REJECTED', 'BOOKING_REMINDER', 'BOOKING_CANCELLED', 'ROOM_MAINTENANCE', 'ANNOUNCEMENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 15: Create Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Step 16: Create AnnouncementType enum
DO $$ BEGIN
  CREATE TYPE "AnnouncementType" AS ENUM ('INFO', 'WARNING', 'URGENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 17: Create Announcement table
CREATE TABLE IF NOT EXISTS "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'INFO',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- Step 18: Add foreign key constraints
ALTER TABLE "RecurringBooking" ADD CONSTRAINT "RecurringBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RecurringBooking" ADD CONSTRAINT "RecurringBooking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_recurringBookingId_fkey" FOREIGN KEY ("recurringBookingId") REFERENCES "RecurringBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RoomMaintenance" ADD CONSTRAINT "RoomMaintenance_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpecialDate" ADD CONSTRAINT "SpecialDate_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 19: Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_booking_recurring" ON "Booking"("recurringBookingId");
CREATE INDEX IF NOT EXISTS "idx_notification_user" ON "Notification"("userId", "isRead");
CREATE INDEX IF NOT EXISTS "idx_announcement_publish" ON "Announcement"("publishDate", "expiryDate");
CREATE INDEX IF NOT EXISTS "idx_semester_active" ON "Semester"("isActive");
CREATE INDEX IF NOT EXISTS "idx_specialdate_date" ON "SpecialDate"("date");
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "User"("role");
CREATE INDEX IF NOT EXISTS "idx_room_type" ON "Room"("type");
