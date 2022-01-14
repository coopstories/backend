-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "nextPassword" TEXT NOT NULL,
    "masterPassword" TEXT NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryFragment" (
    "id" SERIAL NOT NULL,
    "storyId" INTEGER NOT NULL,
    "contributorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "StoryFragment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoryFragment" ADD CONSTRAINT "StoryFragment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
