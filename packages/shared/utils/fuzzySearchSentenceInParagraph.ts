import stringSimilarity from "string-similarity";

interface MatchResult {
  bestMatch: string;
  startIndex: number;
  endIndex: number;
}

export function fuzzySearchSentenceInParagraph(
  paragraph: string,
  targetSentence: string,
): MatchResult {
  const targetLength = targetSentence.length;

  // Check if the paragraph contains the exact target sentence
  if (paragraph.includes(targetSentence)) {
    const startIndex = paragraph.indexOf(targetSentence);
    const result = {
      bestMatch: targetSentence,
      startIndex,
      endIndex: startIndex + targetLength - 1,
    };
    return result;
  }

  let bestMatch = "";
  let highestScore = 0;
  let bestMatchIndex = { startIndex: 0, endIndex: 0 };

  // Sliding window approach with varying lengths
  for (let i = 0; i < paragraph.length; i++) {
    for (
      let j = i + targetLength - 5;
      j <= i + targetLength + 5 && j <= paragraph.length;
      j++
    ) {
      const window = paragraph.slice(i, j);
      const similarity = stringSimilarity.compareTwoStrings(
        window,
        targetSentence,
      );
      if (similarity > highestScore) {
        highestScore = similarity;
        bestMatch = window;
        bestMatchIndex = { startIndex: i, endIndex: j - 1 };
      }
    }
  }

  const result = {
    bestMatch,
    startIndex: bestMatchIndex.startIndex,
    endIndex: bestMatchIndex.endIndex,
  };

  return result;
}
