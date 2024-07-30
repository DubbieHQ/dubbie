import type { AcceptedLanguage } from "@dubbie/db";
import openrouter from "../clients/openrouterClient";
import { generatePrompt } from "../utils/generatePrompt";
import { retryOperation } from "../utils/retryOperation";
import { MODELS } from "../constants";

export async function breakdownParagraphViaLLM(
  paragraph: string,
  language?: AcceptedLanguage
): Promise<string[]> {
  const prompt = generatePrompt(paragraph, language);
  console.log("starting paragraph to sentences via llm");

  const operation = async () => {
    const completion = await openrouter.chat.completions.create({
      model: MODELS.SONNET,
      messages: [{ role: "user", content: prompt }],
    });

    if (!completion.choices[0].message.content)
      throw new Error("No content in completion response");

    const output = completion.choices[0].message.content
      .split("</sentence>")
      .map((sentence) => sentence.replace("<sentence>", "").trim())
      .filter((sentence) => sentence.length > 0);

    console.log("paragraph to sentences via llm complete", output);
    return output;
  };

  return retryOperation(operation);
}
