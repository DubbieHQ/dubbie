import { join } from "node:path";
import { mixAudioWithDelays } from "@/utils/mixAudioWithDelays";
import { MediaType, prisma } from "@dubbie/db";
import { uploadFileToStorage } from "@dubbie/shared/services/firebaseUploads";
import { overRideVideoAudio } from "@/utils/overRideVideoAudio";
import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import { extractBGM } from "@dubbie/shared/services/extractBGM";

export async function exportMedia(projectId: string, mediaType: MediaType, includeBGM: boolean) {
  try {
    console.log("Starting export process");
    await prisma.project.update({
      where: { id: projectId },
      data: { exportStatus: "EXPORTING" },
    });

    console.log("Fetching project details");
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tracks: {
          include: {
            segments: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error("🛑 Project not found");
    }

    console.log("Project found, processing tracks");
    const translatedTrack = project.tracks[1]; //this technically can have some flaw...

    const audioFiles = translatedTrack.segments.map((segment) => ({
      path: segment.audioUrl || "",
      delay: segment.startTime,
    }));

    // Add extractedAudioUrl to the audioFiles array if includeBGM is true
    const extractedAudioUrl = project.extractedBackgroundAudioUrl; // Assuming this is where you get the URL
    if (includeBGM) {
      console.log("Including BGM in export");
      if (extractedAudioUrl) {
        audioFiles.push({ path: extractedAudioUrl, delay: 0 });
      } else {
        console.log("Extracting BGM");
        const extractedUrl = await extractBGM(project.originalUrl);
        await prisma.project.update({
          where: { id: projectId },
          data: { extractedBackgroundAudioUrl: extractedUrl },
        });
        if (extractedUrl) {
          audioFiles.push({ path: extractedUrl, delay: 0 });
        } else {
          console.error("Failed to extract BGM");
        }
      }
    }

    console.log("Number of audio files:", audioFiles.length);

    if (!audioFiles.length) {
      throw new Error("🛑 No audio files found");
    }

    const outputFileName = `output-${randomUUID()}.mp3`;
    const outputPath = join(__dirname, outputFileName);

    console.log("Mixing audio");
    await mixAudioWithDelays(audioFiles, outputPath);

    console.log("Uploading audio");
    const exportedAudioUrl = await uploadFileToStorage(outputPath, "exportedAudio");

    await unlink(outputPath); // Delete the file from disk after uploading

    console.log("Updating project with export URL");
    if (mediaType === "AUDIO") {
      await prisma.project.update({
        where: { id: projectId },
        data: { exportedUrl: exportedAudioUrl, exportStatus: "EXPORTED" },
      });
    } else if (mediaType === "VIDEO") {
      console.log("Processing video export");
      const videoOutputFileName = `output-${randomUUID()}.mp4`;
      const videoOutputPath = join(__dirname, videoOutputFileName);
      await overRideVideoAudio({
        videoURL: project.originalUrl,
        audioURL: exportedAudioUrl,
        outputPath: videoOutputPath,
      });

      console.log("Uploading video");
      const exportedVideoUrl = await uploadFileToStorage(videoOutputPath, "exportedVideo");

      await unlink(videoOutputPath); // Delete the file from disk after uploading

      console.log("Updating project with video export URL");
      await prisma.project.update({
        where: { id: projectId },
        data: { exportedUrl: exportedVideoUrl, exportStatus: "EXPORTED" },
      });
    }
  } catch (error) {
    console.error("Failed to export media:", error);
    await prisma.project.update({
      where: { id: projectId },
      data: { exportStatus: "ERROR" },
    });

    throw error; // Re-throw the error after handling it
  }
}
