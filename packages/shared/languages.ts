import type { AcceptedLanguage } from "@dubbie/db";
import { ALL_VOICES, DEFAULT_VOICE, type Voice } from "./voices";

const safeAllVoices = ALL_VOICES || [];

export const LANGUAGES: Array<{
  value: AcceptedLanguage;
  label: string;
  ietf: string;
  defaultVoice: Voice;
}> = [
  {
    value: "english",
    label: "English 🇬🇧",
    ietf: "en",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "en-US-AndrewMultilingualNeural") ||
      DEFAULT_VOICE,
  },
  {
    value: "mandarin",
    label: "Mandarin 🇨🇳",
    ietf: "zh",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "zh-CN-YunxiNeural") || DEFAULT_VOICE,
  },
  {
    value: "spanish",
    label: "Spanish 🇪🇸",
    ietf: "es",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "es-ES-AlvaroNeural") || DEFAULT_VOICE,
  },
  {
    value: "hindi",
    label: "Hindi 🇮🇳",
    ietf: "hi",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "hi-IN-MadhurNeural") || DEFAULT_VOICE,
  },
  {
    value: "arabic",
    label: "Arabic 🇸🇦",
    ietf: "ar",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "ar-SA-HamedNeural") || DEFAULT_VOICE,
  },
  {
    value: "portuguese",
    label: "Portuguese 🇵🇹",
    ietf: "pt",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "pt-PT-DuarteNeural") || DEFAULT_VOICE,
  },
  {
    value: "bengali",
    label: "Bengali 🇧🇩",
    ietf: "bn",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "bn-IN-BashkarNeural") || DEFAULT_VOICE,
  },
  {
    value: "russian",
    label: "Russian 🇷🇺",
    ietf: "ru",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "ru-RU-DmitryNeural") || DEFAULT_VOICE,
  },
  {
    value: "japanese",
    label: "Japanese 🇯🇵",
    ietf: "ja",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "ja-JP-KeitaNeural") || DEFAULT_VOICE,
  },
  {
    value: "french",
    label: "French 🇫🇷",
    ietf: "fr",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "fr-FR-HenriNeural") || DEFAULT_VOICE,
  },
  {
    value: "korean",
    label: "Korean 🇰🇷",
    ietf: "ko",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "ko-KR-InJoonNeural") || DEFAULT_VOICE,
  },
  {
    value: "german",
    label: "German 🇩🇪",
    ietf: "de",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "de-DE-KatjaNeural") || DEFAULT_VOICE,
  },
  {
    value: "italian",
    label: "Italian 🇮🇹",
    ietf: "it",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "it-IT-DiegoNeural") || DEFAULT_VOICE,
  },
  {
    value: "turkish",
    label: "Turkish 🇹🇷",
    ietf: "tr",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "tr-TR-AhmetNeural") || DEFAULT_VOICE,
  },
  {
    value: "vietnamese",
    label: "Vietnamese 🇻🇳",
    ietf: "vi",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "vi-VN-HoaiMyNeural") || DEFAULT_VOICE,
  },
  {
    value: "polish",
    label: "Polish 🇵🇱",
    ietf: "pl",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "pl-PL-MarekNeural") || DEFAULT_VOICE,
  },
  {
    value: "ukrainian",
    label: "Ukrainian 🇺🇦",
    ietf: "uk",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "uk-UA-OstapNeural") || DEFAULT_VOICE,
  },
  {
    value: "dutch",
    label: "Dutch 🇳🇱",
    ietf: "nl",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "nl-BE-ArnaudNeural") || DEFAULT_VOICE,
  },
  {
    value: "thai",
    label: "Thai 🇹🇭",
    ietf: "th",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "th-TH-NiwatNeural") || DEFAULT_VOICE,
  },
  {
    value: "indonesian",
    label: "Indonesian 🇮🇩",
    ietf: "id",
    defaultVoice: safeAllVoices.find((voice) => voice.name === "id-ID-ArdiNeural") || DEFAULT_VOICE,
  },
  {
    value: "urdu",
    label: "Urdu 🇵🇰",
    ietf: "ur",
    defaultVoice: safeAllVoices.find((voice) => voice.name === "ur-PK-AsadNeural") || DEFAULT_VOICE,
  },
  {
    value: "punjabi",
    label: "Punjabi 🇮🇳",
    ietf: "pa",
    defaultVoice:
      safeAllVoices.find((voice) => voice.name === "pa-IN-VaaniNeural") || DEFAULT_VOICE,
  },
];

export const getDefaultVoiceForLanguage = (language: AcceptedLanguage): Voice => {
  const languageConfig = LANGUAGES.find((lang) => lang.value === language);
  return languageConfig ? languageConfig.defaultVoice : DEFAULT_VOICE;
};

// Validation function to ensure all AcceptedLanguage values are covered
export const validateLanguages = (acceptedLanguages: AcceptedLanguage[]): void => {
  const missingLanguages = acceptedLanguages.filter(
    (lang) => !LANGUAGES.some((config) => config.value === lang)
  );
  if (missingLanguages.length > 0) {
    console.warn(`Missing language configurations for: ${missingLanguages.join(", ")}`);
  }
};

validateLanguages(LANGUAGES.map((lang) => lang.value));
