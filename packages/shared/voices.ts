import { AcceptedLanguage } from "@dubbie/db";
import voicesData from "./voicesData.json";

export type Voice = {
  provider: "azure" | "openai";
  name: string;
  exampleSoundUrl: string | null;
  language: AcceptedLanguage | "multilingual";
  gender: "male" | "female";
};

const AZURE_VOICES = voicesData.azure as Voice[];

const OPENAI_VOICES = voicesData.openai as Voice[];

export const ALL_VOICES: Voice[] = [...AZURE_VOICES, ...OPENAI_VOICES];

export const DEFAULT_VOICE = ALL_VOICES[1];
