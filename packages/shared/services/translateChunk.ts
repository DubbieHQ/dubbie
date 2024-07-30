import type { AcceptedLanguage } from "@dubbie/db";
import openrouter from "../clients/openrouterClient";
import { MODELS, type Model } from "../constants";

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

export async function translateChunk(
  sentences: string[],
  targetLanguage: AcceptedLanguage,
  model: Model = "GPT4O"
): Promise<string[]> {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const completion = await openrouter.chat.completions.create({
        model: MODELS[model],
        messages: [
          {
            role: "user",
            content: createPrompt(targetLanguage, sentences),
          },
        ],
      });

      if (completion.choices && completion.choices.length > 0) {
        const content = completion.choices[0].message.content;

        if (content) {
          const translatedChunk = parseSentences(content);
          if (translatedChunk.length === sentences.length) {
            return translatedChunk;
          }
        }
      }
    } catch (error: any) {
      console.log("❌ Error during translation attempt:", error);
      await delay(BASE_DELAY * 2 ** retries); // Exponential backoff
    }
    retries++;
  }

  const models = Object.keys(MODELS) as Model[];
  const currentModelIndex = models.indexOf(model);
  if (currentModelIndex < models.length - 1) {
    return translateChunk(sentences, targetLanguage, models[currentModelIndex + 1]);
  }

  throw new Error("Translation failed after maximum retries.");
}

function parseSentences(content: string): string[] {
  const regex = /<\d+>(.*?)<\/\d+>/g;
  const matches = [];
  let match;
  while (true) {
    match = regex.exec(content);
    if (match === null) break;
    matches.push(match[1].trim());
  }
  return matches;
}

function createPrompt(targetLanguage: AcceptedLanguage, sentences: string[]): string {
  const numberOfLines = sentences.length;
  return `Below is the text that needs to be translated.
I want you to translate the text into ${targetLanguage}.

Ensure the translation captures the meaning and intent of the original text, rather than providing a literal word-for-word translation.
The goal is to produce translations similar in quality and naturalness to Netflix subtitles, which prioritize conveying the essence of the dialogue in a way that feels authentic and easily understandable in the target language.

Do not add empty lines between sentences.
Please only return the translation and absolutely nothing else.
Return each line of the translation on a new line, wrapped in tags like <1></1>, <2></2>, etc.
For example:
<1>This is the first sentence.</1>
<2>This is the second sentence.</2>
Make sure there are exactly ${numberOfLines} lines in the output.
${sentences.join("\n")}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
