import { AcceptedLanguage } from "@dubbie/db";
import openrouter from "../clients/openrouterClient";
import { MODELS } from "../constants";

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000;

function generateLanguageDetectionPrompt(paragraph: string, acceptedLanguages: string[]): string {
  return `Please detect the language of the following paragraph and return EXACTLY one of these values (case-sensitive): ${acceptedLanguages.join(", ")}. If it's none of them, return "undefined".

ONLY RETURN ONE OF THE EXACT VALUES LISTED ABOVE AND NOTHING ELSE.
${paragraph}`;
}

export async function detectLanguageViaLLM(
  paragraph: string
): Promise<AcceptedLanguage | undefined> {
  const acceptedLanguages: string[] = Object.values(AcceptedLanguage);
  const prompt = generateLanguageDetectionPrompt(paragraph, acceptedLanguages);
  console.log("starting language detection via llm");

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await openrouter.chat.completions.create({
        model: MODELS.SONNET,
        messages: [{ role: "user", content: prompt }],
      });

      if (!completion.choices[0].message.content) {
        throw new Error("No content in completion response");
      }

      const detectedLanguage = completion.choices[0].message.content.trim();

      console.log("language detection via llm complete", detectedLanguage);

      if (detectedLanguage === "undefined") {
        return undefined;
      }

      // Direct comparison with AcceptedLanguage enum values
      if (acceptedLanguages.includes(detectedLanguage)) {
        return detectedLanguage as AcceptedLanguage;
      }

      console.log(
        `Detected language "${detectedLanguage}" is not in the accepted languages list. Retrying...`
      );
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt < MAX_RETRIES - 1) {
        const backoff = INITIAL_BACKOFF * 2 ** attempt;
        console.log(`Retrying in ${backoff}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      } else {
        console.log("Max retries reached. Returning undefined.");
        return undefined;
      }
    }
  }

  return undefined;
}
