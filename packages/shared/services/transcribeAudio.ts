import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
fal.config({
  credentials: process.env.FAL_KEY, // or a function that returns a string
});

import axios from "axios";
import fs from "node:fs";
import * as fal from "@fal-ai/serverless-client";

import replicate from "../clients/replicateClient";
import openai from "../clients/openaiClient";

const transcriptionServices = [
  {
    name: "OpenAI",
    method: whisperViaOpenAI,
    note: "openai is the best in terms of accuracy, and we don't lack these few seconds of differences IMO",
  },
  {
    name: "Replicate",
    method: whisperViaReplicate,
    note: "replicate is similar to openais, but punctuation wise openai is just better..., this matters a lot more for non-english based languages.",
  },
  {
    name: "Fal",
    method: whisperViaFal,
    notes: "fal is kinad inconsistent, also lacks some puntuations for non english based languages",
  },
];

export async function transcribeAudio({ audioUrl }: { audioUrl: string }): Promise<{
  text: string;
  chunks: { text: string; timestamp: [number, number] }[];
}> {
  for (const service of transcriptionServices) {
    try {
      console.log("transcribing audio with", service.name);
      const result = await service.method({ audioUrl });
      console.log("transcription complete ✅");
      return result;
    } catch (error) {
      console.error(`${service.name} transcription failed ❌, trying next...`, error);
    }
  }
  throw new Error("All transcription services failed. ❌❌❌❌❌❌ BREAKING ERROR ❌❌❌❌❌❌");
}

//below are the functions for transcribing audio using different services
/* -------------------- -------------------- */

type TranscriptionResponse = {
  task: string;
  language: string;
  duration: number;
  text: string;
  words: { word: string; start: number; end: number }[];
};

async function whisperViaOpenAI({ audioUrl }: { audioUrl: string }): Promise<{
  text: string;
  chunks: { text: string; timestamp: [number, number] }[];
}> {
  const localFilePath = `./temp_audio_file_${uuidv4()}.mp3`;
  await downloadFile(audioUrl, localFilePath);

  const transcription = (await openai.audio.transcriptions.create({
    file: fs.createReadStream(localFilePath),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  })) as TranscriptionResponse;

  fs.unlinkSync(localFilePath); // Clean up the temporary file
  return {
    text: transcription.text,
    chunks: transcription.words.map((word) => ({
      text: word.word,
      timestamp: [word.start, word.end],
    })),
  };
}

async function whisperViaReplicate({ audioUrl }: { audioUrl: string }): Promise<{
  text: string;
  chunks: { text: string; timestamp: [number, number] }[];
}> {
  let prediction = await replicate.deployments.predictions.create("chen-rn", "fasterwhispertest", {
    input: {
      task: "transcribe",
      audio: audioUrl,
      timestamp: "word",
      batch_size: 64,
      diarise_audio: false,
    },
  });

  prediction = await replicate.wait(prediction);
  return prediction.output;
}

async function whisperViaFal({ audioUrl }: { audioUrl: string }): Promise<{
  text: string;
  chunks: { text: string; timestamp: [number, number] }[];
}> {
  const result = (await fal.run("fal-ai/whisper", {
    input: {
      audio_url: audioUrl,
      chunk_level: "word",
      batch_size: 64,
      diarise_audio: false,
    },
  })) as any;

  return result;
}

async function downloadFile(url: string, outputPath: string): Promise<void> {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
