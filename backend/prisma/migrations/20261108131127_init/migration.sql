-- CreateEnum
CREATE TYPE "Role" AS ENUM ('company', 'creator', 'admin');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('draft', 'in_review', 'open', 'judging', 'closed');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('image', 'logo', 'other');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "display_name" TEXT NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "logo_path" TEXT,
    "description" TEXT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "reward_amount" DECIMAL(10,2) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "QuestStatus" NOT NULL DEFAULT 'draft',
    "rejection_reason" TEXT,
    "winner_submission_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_assets" (
    "id" SERIAL NOT NULL,
    "quest_id" INTEGER NOT NULL,
    "file_path" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "original_name" TEXT NOT NULL,

    CONSTRAINT "quest_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" SERIAL NOT NULL,
    "quest_id" INTEGER NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ai_tool" TEXT NOT NULL,
    "video_path" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_user_id_key" ON "companies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "quests_winner_submission_id_key" ON "quests"("winner_submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_quest_id_creator_id_key" ON "submissions"("quest_id", "creator_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_winner_submission_id_fkey" FOREIGN KEY ("winner_submission_id") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_assets" ADD CONSTRAINT "quest_assets_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
