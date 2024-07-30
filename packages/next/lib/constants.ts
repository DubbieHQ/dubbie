import { ProjectWithTracksAndSegments } from "./types";
export const DRAG_THRESHOLD = 4;
export const PLACEHOLDER_TEXT = "Enter your text here! 👋";
export const UPSCALE_FACTOR = 50;
export const QUERY_KEYS = {
  subscription: ["subscriptionInfo"],
};

export const styles = {
  topbarHeight: 64,
  controlHeight: 35,
  trackHeight: 125,
  scrollBarWidth: 20,
};
// Determine if the environment is development or production
const isDevelopment = process.env.NODE_ENV === "development";

// Set API_ENDPOINT based on the environment
export const API_ENDPOINT = isDevelopment
  ? process.env.NEXT_PUBLIC_DEV_API_ENDPOINT
  : process.env.NEXT_PUBLIC_PROD_API_ENDPOINT;

export const DEFAULT_PROJECT_STATE: ProjectWithTracksAndSegments = {
  id: "",
  name: "",
  status: "NOT_STARTED",
  originalMediaType: "VIDEO",
  originalUrl: "",
  originalLanguage: null,
  targetLanguage: "english",
  thumbnailUrl: "",
  tracks: [],
  exportedUrl: null,
  exportType: null,
  exportStatus: "NOT_STARTED",
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "",
  isDeleted: false,
  extractedBackgroundAudioUrl: null,
  audioDurationInSeconds: null,
  comments: null,
  defaultVoiceName: "",
  defaultVoiceProvider: "",
  extractBackgroundAudio: false,
};

const BASE_DOMAIN_URL = "https://app.dubbie.com";

export const URLS = {
  SUCCCESS_URL: `${BASE_DOMAIN_URL}/settings`,
  CANCEL_URL: `${BASE_DOMAIN_URL}/pricing`,
  DISCORD: "https://discord.gg/qJNV93PY2e",
  GITHUB: "https://github.com/DubbieHQ/dubbie",
};
