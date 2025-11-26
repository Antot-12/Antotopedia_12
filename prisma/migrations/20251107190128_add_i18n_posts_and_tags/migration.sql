/*
  Warnings:

  - The primary key for the `PostReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clap` on the `PostReaction` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `PostReaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId]` on the table `PostReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_pkey",
DROP COLUMN "clap",
DROP COLUMN "like",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fire" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PostI18n" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "locale" CHAR(2) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentMarkdown" TEXT,

    CONSTRAINT "PostI18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagI18n" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "locale" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TagI18n_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostI18n_locale_idx" ON "PostI18n"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "PostI18n_postId_locale_key" ON "PostI18n"("postId", "locale");

-- CreateIndex
CREATE INDEX "TagI18n_locale_name_idx" ON "TagI18n"("locale", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TagI18n_tagId_locale_key" ON "TagI18n"("tagId", "locale");

-- CreateIndex
CREATE INDEX "Post_status_createdAt_idx" ON "Post"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_postId_key" ON "PostReaction"("postId");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "PostI18n" ADD CONSTRAINT "PostI18n_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagI18n" ADD CONSTRAINT "TagI18n_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
