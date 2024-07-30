"use server";

import { Segment, prisma } from "@dubbie/db";
import { uploadAudioArrayToStorage } from "@dubbie/shared/services/firebaseUploads";
import { generateAudio } from "@dubbie/shared/services/generateAudio";
import { getAudioDuration } from "@dubbie/shared/utils/getAudioDuration";
import { ALL_VOICES } from "@dubbie/shared/voices";

export async function generateAudioAndUpdateDB({
  segment,
}: {
  segment: Segment;
}): Promise<Segment> {
  try {
    const voiceName = segment.voiceName;
    const voiceProvider = segment.voiceProvider;

    const voice = ALL_VOICES.find(
      (voice) => voice.name === voiceName && voice.provider === voiceProvider,
    );

    if (!voice) {
      throw new Error("Voice not found");
    }

    const audio = await generateAudio({
      text: segment.text,
      voice: voice,
    });

    if (!audio) {
      throw new Error("Failed to generate audio");
    }

    const audioUint8Array = new Uint8Array(audio);
    const url = await uploadAudioArrayToStorage(
      audioUint8Array,
      "generatedAudioClips",
    );

    const audioDuration = await getAudioDuration(audioUint8Array);
    const endTime = segment.startTime + audioDuration;

    const updatedSegment = await prisma.segment.update({
      where: { id: segment.id },
      data: { audioUrl: url, endTime: endTime, text: segment.text },
    });

    return updatedSegment;
  } catch (error) {
    console.error("Error in generateAudioAndUpdateDB:", error);
    throw error; // Re-throw the error after logging it
  }
}
