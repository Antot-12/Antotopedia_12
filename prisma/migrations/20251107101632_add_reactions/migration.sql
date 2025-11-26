-- CreateTable
CREATE TABLE "PostReaction" (
    "postId" INTEGER NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "love" INTEGER NOT NULL DEFAULT 0,
    "clap" INTEGER NOT NULL DEFAULT 0,
    "wow" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("postId")
);

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
