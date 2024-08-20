type WordTimestamp = {
  text: string;
  timestamp: number[];
};

/**
 * Splits the given words into sentences based on timestamp gaps.
 * Note: This method is not highly accurate because the timestamps from OpenAI Whisper are not super precise.
 */
export function breakParagraphViaHeuristics(words: WordTimestamp[], gapThreshold = 0.5): string[] {
  const sentences: string[] = [];
  let currentSentence: string[] = [];
  let lastStartTime = 0;

  for (const word of words) {
    const [startTime] = word.timestamp;
    if (currentSentence.length > 0 && startTime - lastStartTime > gapThreshold) {
      sentences.push(currentSentence.join(""));
      currentSentence = [];
    }
    currentSentence.push(word.text);
    lastStartTime = startTime;
  }

  if (currentSentence.length > 0) {
    sentences.push(currentSentence.join(""));
  }

  return sentences;
}
