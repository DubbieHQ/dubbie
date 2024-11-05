import { v4 as uuidv4 } from "uuid";
import { join } from "node:path";
import { unlink } from "node:fs/promises";
import { extractAudioFromVideo } from "@/utils/extractAudioFromVideo";
import { AcceptedLanguage, prisma, type Project, type Track } from "@dubbie/db";
import { extractBGM } from "@dubbie/shared/services/extractBGM";
import { uploadFileToStorage } from "@dubbie/shared/services/firebaseUploads";
import { transcribeAudio } from "@dubbie/shared/services/transcribeAudio";
import { addTimestampsForSentences } from "@dubbie/shared/utils/addTimestampsForSentences";
import { updateProjectStatus } from "./updateProjectStatus";
import { compressAudio } from "@/utils/compressAudio";
import { getFirebaseFileMetadata } from "@dubbie/shared/services/getFirebaseFileMetadata";
import { breakdownParagraphViaLLM } from "@dubbie/shared/services/breakdownParagraphViaLLM";
import { detectLanguageViaLLM } from "@dubbie/shared/services/detectLanguageViaLLM";

export async function createOriginalTrack(projectId: string) {
  updateProjectStatus(projectId, "NOT_STARTED");
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { tracks: true },
  });

  if (!project) throw new Error("🛑 Project not found");

  const alreadyHasOriginalTrack = project.tracks.some((track) => track.language === "original");
  if (alreadyHasOriginalTrack) await deleteOriginalTracks(projectId);

  const audioUrl = await compressOrConvert(project);

  if (project.extractBackgroundAudio) {
    extractBGM(audioUrl)
      .then(async (bgmUrl) => {
        await prisma.project.update({
          where: { id: projectId },
          data: { extractedBackgroundAudioUrl: bgmUrl },
        });
      })
      .catch((error) => {
        console.error("Error extracting BGM:", error);
      });
  }

  updateProjectStatus(projectId, "TRANSCRIBING");
  const { text: transcriptionText, chunks: wordTimeStamps } = await transcribeAudio({ audioUrl });

  const detectedLanguage = await detectLanguageViaLLM(transcriptionText);

  await prisma.project.update({
    where: { id: projectId },
    data: { originalLanguage: detectedLanguage as AcceptedLanguage },
  });

  updateProjectStatus(projectId, "FORMATTING");
  const sentences = await breakdownParagraphViaLLM(transcriptionText, detectedLanguage);

  await createTrackWithSegments({
    projectId,
    sentences,
    wordTimeStamps,
    voiceName: project.defaultVoiceName,
    voiceProvider: project.defaultVoiceProvider,
  });
}

/**
 * Processes the project's original media to obtain an audio URL.
 * - If the media is audio and larger than 25MB, compresses it.
 * - If the media is video, extracts the audio.
 * - Uploads the processed audio to storage and returns the URL.
 */

async function compressOrConvert(project: Project): Promise<string> {
  console.log("handling audio processing");
  let audioUrl;
  const uniqueId = uuidv4();
  if (project.originalMediaType === "AUDIO") {
    const fileMeta = await getFirebaseFileMetadata(project.originalUrl);
    const fileSizeInBytes = Number(fileMeta.size);
    if (fileSizeInBytes > 25 * 1024 * 1024) {
      const outputPath = join(__dirname, `${uniqueId}_compressedAudio.opus`);
      await compressAudio(project.originalUrl, outputPath);
      audioUrl = await uploadFileToStorage(outputPath, "compressedAudio");
      await unlink(outputPath);
    } else {
      audioUrl = project.originalUrl;
    }
  } else {
    const outputPath = join(__dirname, `${uniqueId}_extractedAudio.opus`);
    await extractAudioFromVideo(project.originalUrl, outputPath);
    audioUrl = await uploadFileToStorage(outputPath, "audioConvertedFromVideo");
    await unlink(outputPath);
  }
  return audioUrl;
}

async function deleteOriginalTracks(projectId: string) {
  const originalTracks = await prisma.track.findMany({
    where: { projectId, language: "original" },
    include: { segments: true },
  });
  for (const track of originalTracks) {
    await prisma.segment.deleteMany({ where: { trackId: track.id } });
    await prisma.track.delete({ where: { id: track.id } });
  }
}

const createTrackWithSegments = async ({
  projectId,
  sentences,
  wordTimeStamps,
  voiceName,
  voiceProvider,
}: {
  projectId: string;
  sentences: string[];
  wordTimeStamps: {
    text: string;
    timestamp: [number, number];
  }[];
  voiceName: string;
  voiceProvider: string;
}): Promise<Track> => {
  const track = await prisma.track.create({
    data: { projectId, language: "original" },
  });

  const sentenceTimeStamps = await addTimestampsForSentences({
    sentences,
    words: wordTimeStamps,
  });

  await Promise.all(
    sentenceTimeStamps.map((sentence, index) =>
      prisma.segment.create({
        data: {
          trackId: track.id,
          index,
          startTime: sentence.startTime || 0,
          endTime: sentence.endTime || 0,
          voiceName,
          voiceProvider,
          text: sentence.text,
        },
      })
    )
  );

  console.log("created new track with translated segments ✅");
  return track;
};
