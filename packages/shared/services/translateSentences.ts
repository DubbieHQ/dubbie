import type { AcceptedLanguage } from "@dubbie/db";
import { translateChunk } from "./translateChunk";

const CHUNK_SIZES = [20, 10, 5];

export async function translateSentences({
  sentences,
  targetLanguage,
}: {
  sentences: string[];
  targetLanguage: AcceptedLanguage;
}): Promise<string[]> {
  console.log("translating sentences");
  const translatedSentences: string[] = [];
  let chunkSizeIndex = 0;

  for (let i = 0; i < sentences.length; i += CHUNK_SIZES[chunkSizeIndex]) {
    const chunk = sentences.slice(i, i + CHUNK_SIZES[chunkSizeIndex]);
    try {
      const translatedChunk = await translateChunk(chunk, targetLanguage);
      console.log("translated chunk ✅");
      translatedSentences.push(...translatedChunk);
    } catch (error) {
      if (chunkSizeIndex < CHUNK_SIZES.length - 1) {
        chunkSizeIndex++;
        i -= CHUNK_SIZES[chunkSizeIndex]; // Retry the same chunk with smaller size
      } else {
        throw error;
      }
    }
  }

  console.log("translation complete ✅");
  return translatedSentences;
}
