export const MODELS = {
  SONNET: "anthropic/claude-3.5-sonnet",
  GPT4O: "openai/gpt-4o",
  OPUS: "anthropic/claude-3-opus",
  HAIKU: "anthropic/claude-3-haiku:beta",
} as const;

export type Model = keyof typeof MODELS;
