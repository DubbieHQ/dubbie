-- CreateEnum
CREATE TYPE "AcceptedLanguage" AS ENUM ('original', 'english', 'mandarin', 'spanish', 'hindi', 'arabic', 'portuguese', 'bengali', 'russian', 'japanese', 'french');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('NOT_STARTED', 'TRANSCRIBING', 'FORMATTING', 'TRANSLATING', 'AUDIO_PROCESSING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('NOT_STARTED', 'EXPORTING', 'EXPORTED', 'ERROR');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('AUDIO', 'VIDEO');

-- CreateTable
CREATE TABLE "Project" (
    "userId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "name" TEXT NOT NULL,
    "originalMediaType" "MediaType" NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "originalLanguage" "AcceptedLanguage",
    "targetLanguage" "AcceptedLanguage" NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "transcription" TEXT,
    "exportedUrl" TEXT,
    "exportType" "MediaType",
    "exportStatus" "ExportStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "projectId" TEXT NOT NULL,
    "language" "AcceptedLanguage" NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_projectId_language_key" ON "Track"("projectId", "language");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
