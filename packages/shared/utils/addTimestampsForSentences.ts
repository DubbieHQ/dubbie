/**
 * Start of Selection
 */
import { fuzzySearchSentenceInParagraph } from "./fuzzySearchSentenceInParagraph";

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export function addTimestampsForSentences({
  sentences,
  words,
}: {
  sentences: string[];
  words: {
    text: string;
    timestamp: [number, number];
  }[];
}): {
  text: string;
  startTime?: number;
  endTime?: number;
}[] {
  console.log("adding timestamps for sentences");
  // Save sentences and words to a JSON file for testing
  const normalizedSentences = sentences.map(normalizeText);
  const normalizedWords = words.map((word) => ({
    ...word,
    text: normalizeText(word.text),
  }));

  const paragraph = normalizedWords.map((word) => word.text).join("");

  return normalizedSentences.map((sentence, index) => {
    const searchResult = fuzzySearchSentenceInParagraph(paragraph, sentence);
    if (searchResult) {
      let charCount = 0;
      let startWordIndex = -1;
      let endWordIndex = -1;

      for (let i = 0; i < normalizedWords.length; i++) {
        if (
          startWordIndex === -1 &&
          charCount + normalizedWords[i].text.length > searchResult.startIndex
        ) {
          startWordIndex = i;
        }
        if (
          charCount + normalizedWords[i].text.length >
          searchResult.endIndex
        ) {
          endWordIndex = i;
          break;
        }
        charCount += normalizedWords[i].text.length;
      }

      if (startWordIndex !== -1 && endWordIndex !== -1) {
        const startTime = words[startWordIndex].timestamp[0];
        const endTime = words[endWordIndex].timestamp[1];

        console.log(
          "✅ index",
          index,
          "startTime",
          startTime,
          "endTime",
          endTime,
        );
        return {
          text: sentences[index], // Return the original sentence text
          startTime,
          endTime,
        };
      }
    }

    console.log("❌ index", index);

    return {
      text: sentences[index], // Return the original sentence text
    };
  });
}
