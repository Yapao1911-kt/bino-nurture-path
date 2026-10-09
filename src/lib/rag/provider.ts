import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config";
import { SYSTEM_RULES } from "./safety";
import { buildMessages, buildUserPrompt, type ChatTurn } from "./prompts";

export interface GenerateAnswerInput {
  question: string;
  context: string;
  history?: ChatTurn[];
}

/**
 * Provider abstraction. The RAG system only ever calls `generateAnswer`, so the
 * underlying model can be swapped (OpenAI -> Ollama / Gemini / Qwen / Llama / a
 * local model) without touching retriever.ts, prompts.ts, or the /api/chat route.
 */
export interface LLMProvider {
  readonly name: string;
  generateAnswer(input: GenerateAnswerInput): Promise<string>;
}

let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!config.apiKey) {
    throw new Error(
      "Missing LLM API key. Set LLM_API_KEY (or OPENAI_API_KEY) in your .env file.",
    );
  }
  if (!openaiClient) openaiClient = new OpenAI({ apiKey: config.apiKey });
  return openaiClient;
}

const openaiProvider: LLMProvider = {
  name: "openai",
  async generateAnswer({ question, context, history = [] }) {
    const openai = getOpenAI();
    const res = await openai.chat.completions.create({
      model: config.llmModel,
      temperature: 0.4,
      messages: buildMessages(question, context, history),
    });
    return (res.choices[0]?.message?.content ?? "").trim();
  },
};

let genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
  if (!config.apiKey) {
    throw new Error(
      "Missing LLM API key. Set LLM_API_KEY (or GEMINI_API_KEY) in your .env file.",
    );
  }
  if (!genAI) genAI = new GoogleGenerativeAI(config.apiKey);
  return genAI;
}

const geminiProvider: LLMProvider = {
  name: "gemini",
  async generateAnswer({ question, context, history = [] }) {
    const model = getGenAI().getGenerativeModel({
      model: config.llmModel,
      systemInstruction: SYSTEM_RULES,
      generationConfig: { temperature: 0.4 },
    });

    const chat = model.startChat({
      history: history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const res = await chat.sendMessage(buildUserPrompt(question, context));
    return (res.response.text() ?? "").trim();
  },
};

const providers: Record<string, LLMProvider> = {
  openai: openaiProvider,
  gemini: geminiProvider,
};

export function getProvider(): LLMProvider {
  const provider = providers[config.provider.toLowerCase()];
  if (!provider) {
    throw new Error(
      `Unsupported LLM_PROVIDER "${config.provider}". Available: ${Object.keys(providers).join(", ")}.`,
    );
  }
  return provider;
}

/** Convenience wrapper matching the required generateAnswer({ question, context }) shape. */
export function generateAnswer(input: GenerateAnswerInput): Promise<string> {
  return getProvider().generateAnswer(input);
}
