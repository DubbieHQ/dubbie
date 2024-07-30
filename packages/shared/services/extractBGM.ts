import replicate from "../clients/replicateClient";
import axios from "axios";
import { uploadAudioArrayToStorage } from "@dubbie/shared/services/firebaseUploads";

type audioUrl = string;

interface ReplicateOutput {
  other: string | null;
  vocals: string | null;
}

interface SpleeterOutput {
  vocals: string;
  accompaniment: string;
}

async function tryDemucs(audioUrl: string): Promise<audioUrl | null> {
  try {
    console.log("Trying Demucs for BGM extraction");

    let prediction = await replicate.deployments.predictions.create(
      "chen-rn",
      "chen-demucs",
      {
        input: {
          jobs: 0,
          stem: "vocals",
          audio: audioUrl,
          model: "htdemucs",
          split: true,
          shifts: 1,
          overlap: 0.25,
          clip_mode: "rescale",
          mp3_preset: 2,
          wav_format: "int24",
          mp3_bitrate: 128,
          output_format: "mp3",
        },
      },
    );
    prediction = await replicate.wait(prediction);
    const output = prediction.output as ReplicateOutput;

    if (!output.other) {
      console.error("Demucs BGM output is null or undefined");
      return null;
    }

    const response = await axios.get(output.other, {
      responseType: "arraybuffer",
    });
    const audioBuffer = new Uint8Array(response.data);

    const url = await uploadAudioArrayToStorage(audioBuffer, "extractedBGM");

    console.log("Demucs BGM extraction complete ✅ ");
    return url;
  } catch (error) {
    console.error("Error extracting BGM with Demucs:", error);
    return null;
  }
}

async function trySpleeter(audioUrl: string): Promise<audioUrl | null> {
  try {
    console.log("Trying Spleeter for BGM extraction");

    const output = (await replicate.run(
      "soykertje/spleeter:cd128044253523c86abfd743dea680c88559ad975ccd72378c8433f067ab5d0a",
      {
        input: {
          audio: audioUrl,
        },
      },
    )) as SpleeterOutput;

    if (!output.accompaniment) {
      console.error("Spleeter BGM output is null or undefined");
      return null;
    }

    const response = await axios.get(output.accompaniment, {
      responseType: "arraybuffer",
    });
    const audioBuffer = new Uint8Array(response.data);

    const url = await uploadAudioArrayToStorage(audioBuffer, "extractedBGM");

    console.log("Spleeter BGM extraction complete ✅ ");
    return url;
  } catch (error) {
    console.error("Error extracting BGM with Spleeter:", error);
    return null;
  }
}

export async function extractBGM(audioUrl: string): Promise<audioUrl | null> {
  const demucsResult = await tryDemucs(audioUrl);
  if (demucsResult) {
    return demucsResult;
  }

  const spleeterResult = await trySpleeter(audioUrl);
  return spleeterResult;
}
