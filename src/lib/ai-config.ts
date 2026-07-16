// Shared Anthropic Claude configuration for the FE-06 AI chat experience.
// Keep model selection, system prompt, and token limits here so the route and UI
// stay aligned without duplicating settings in multiple files.

export const AI_CONFIG = {
  model: "claude-3-5-haiku-latest",
  systemPrompt:
    "You are a concise product strategist for FlyRank. Help the user with thoughtful product, delivery, and UX guidance. Keep responses short, practical, and conversational.",
  maxTokens: 400,
  temperature: 0.3,
} as const;

export type AiConfig = typeof AI_CONFIG;
