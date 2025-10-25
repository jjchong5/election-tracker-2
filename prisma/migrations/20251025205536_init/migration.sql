-- CreateTable
CREATE TABLE "Election" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "electionId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "district" TEXT,
    "isOpenSeat" BOOLEAN NOT NULL DEFAULT false,
    "incumbentName" TEXT,
    "filingDeadline" DATETIME,
    "salary" TEXT,
    "termLength" TEXT,
    "requirements" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Race_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "party" TEXT,
    "isIncumbent" BOOLEAN NOT NULL DEFAULT false,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Candidate_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
