import {
  SpeechConfig,
  SpeechSynthesizer,
  ResultReason,
  type SpeechSynthesisResult,
} from "microsoft-cognitiveservices-speech-sdk";
import openai from "@dubbie/shared/clients/openaiClient";
import { type Voice } from "../voices";

export async function generateAudio({
  text,
  voice,
}: {
  text: string;
  voice: Voice;
}): Promise<ArrayBuffer> {
  if (voice.provider === "azure") {
    return generateAzureAudio(text, voice.name as any);
  }
  if (voice.provider === "openai") {
    return generateOpenAIAudio(text, voice.name as any); //TODO: add voice name
  }
  console.warn("Unsupported provider, using default voice");
  return generateAzureAudio(text, "en-US-AndrewMultilingualNeural");
}

async function generateAzureAudio(
  text: string,
  voiceName: string,
  retryCount = 0
): Promise<ArrayBuffer> {
  const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY as string;
  const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastus";

  const speechConfig = SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
  speechConfig.speechSynthesisVoiceName = voiceName;
  const synthesizer = new SpeechSynthesizer(speechConfig);

  try {
    const result = await new Promise<SpeechSynthesisResult>((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            resolve(result);
          } else {
            console.error(`Speech synthesis canceled, reason: ${result.reason}`);
            reject(result);
          }
          synthesizer.close();
        },
        (error) => {
          console.error(`Speech synthesis error: ${error}`);
          synthesizer.close();
          reject(error);
        }
      );
    });

    return result.audioData;
  } catch (error) {
    if (retryCount < 3) {
      console.warn(`Speech synthesis failed, retrying in ${2 ** retryCount} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 2 ** retryCount * 1000));
      return generateAzureAudio(text, voiceName, retryCount + 1);
    }
    throw error;
  }
}

async function generateOpenAIAudio(
  text: string,
  voiceName: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
): Promise<ArrayBuffer> {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voiceName,
    input: text,
  });

  // This line is all you need
  return Buffer.from(await mp3.arrayBuffer());
}

/* 
The following code is commented out for now but may be used in the future to enhance the audio generation functionality. 

Differences and enhancements in the commented-out code:
1. **Length Control**: The `generateAudio` function includes an optional `lengthInSeconds` parameter to control the duration of the generated audio.
2. **SSML and Prosody Rate**: The `generateAzureAudio` function uses SSML (Speech Synthesis Markup Language) to adjust the prosody rate, allowing for fine-tuned control over the speech rate.
3. **Audio Duration Adjustment**: After generating the audio, the code checks the duration using `ffprobe` and adjusts the speech rate if the duration does not match the desired length.
4. **Retry Mechanism**: Similar to the current implementation, it includes a retry mechanism for handling synthesis failures.

This code is more advanced and provides additional features that might be useful for future requirements.
*/

/* 
import {
  SpeechConfig,
  SpeechSynthesizer,
  ResultReason,
  type SpeechSynthesisResult,
} from "microsoft-cognitiveservices-speech-sdk";
import fs from "fs";
import path from "path";
import openai from "../clients/openaiClient";
import type { AzureVoices, OpenAIVoices, Voice } from "@/languages";
import { execSync } from "child_process";

const speechFile = path.resolve("./speech.mp3");

export async function generateAudio({
  text,
  voice,
  lengthInSeconds,
}: {
  text: string;
  voice: Voice;
  lengthInSeconds?: number;
}): Promise<ArrayBuffer> {
  if (voice.provider === "azure") {
    return generateAzureAudio(text, voice.name, lengthInSeconds);
  } else if (voice.provider === "openai") {
    return generateOpenAIAudio(text, voice.name);
  } else {
    throw new Error("Unsupported provider");
  }
}

async function generateAzureAudio(
  text: string,
  voiceName: AzureVoices,
  lengthInSeconds?: number,
  retryCount = 0,
  rate = 1.0
): Promise<ArrayBuffer> {
  const speechConfig = SpeechConfig.fromSubscription(
    "be267ed553be452c9e31065bf69ad5bc",
    "eastus"
  );
  speechConfig.speechSynthesisVoiceName = voiceName;
  const synthesizer = new SpeechSynthesizer(speechConfig);

  // Create SSML with prosody rate adjustment
  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="${voiceName}">
        <prosody rate="${rate * 100}%">${text}</prosody>
      </voice>
    </speak>
  `;

  try {
    const result = await new Promise<SpeechSynthesisResult>(
      (resolve, reject) => {
        synthesizer.speakSsmlAsync(
          ssml,
          (result) => {
            if (result.reason === ResultReason.SynthesizingAudioCompleted) {
              console.log(`Speech synthesized for text [${text}]`);
              resolve(result);
            } else {
              console.error(
                `Speech synthesis canceled, reason: ${result.reason}`
              );
              reject(result);
            }
            synthesizer.close();
          },
          (error) => {
            console.error(`Speech synthesis error: ${error}`);
            synthesizer.close();
            reject(error);
          }
        );
      }
    );

    const buffer = Buffer.from(result.audioData);
    await fs.promises.writeFile(speechFile, buffer);

    const duration = getAudioDuration(speechFile);

    if (lengthInSeconds && Math.abs(duration - lengthInSeconds) > 0.2) {
      const newRate = rate * (lengthInSeconds / duration);
      return generateAzureAudio(text, voiceName, lengthInSeconds, retryCount, newRate);
    }

    return result.audioData;
  } catch (error) {
    if (retryCount < 3) {
      console.warn(
        `Speech synthesis failed, retrying in ${2 ** retryCount} seconds...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 2 ** retryCount * 1000)
      );
      return generateAzureAudio(text, voiceName, lengthInSeconds, retryCount + 1, rate);
    }
    throw error;
  }
}

function getAudioDuration(filePath: string): number {
  const result = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`);
  return parseFloat(result.toString().trim());
}

async function generateOpenAIAudio(
  text: string,
  voiceName: OpenAIVoices
): Promise<ArrayBuffer> {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voiceName,
    input: text,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
 
  */
