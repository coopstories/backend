-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "nextPassword" TEXT NOT NULL,
    "masterPassword" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StoryFragment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storyId" INTEGER NOT NULL,
    "contributorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "StoryFragment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
