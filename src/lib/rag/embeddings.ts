import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config";

function requireKey(names: string): void {
  if (!config.apiKey) {
    throw new Error(`Missing LLM API key. Set one of ${names} in your .env file.`);
  }
}

// ---------------------------------------------------------------------------
// OpenAI
// ---------------------------------------------------------------------------
let openai: OpenAI | null = null;
const OPENAI_BATCH = 96;

async function embedOpenAI(texts: string[]): Promise<number[][]> {
  requireKey("LLM_API_KEY / OPENAI_API_KEY");
  if (!openai) openai = new OpenAI({ apiKey: config.apiKey });

  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += OPENAI_BATCH) {
    const batch = texts.slice(i, i + OPENAI_BATCH);
    const res = await openai.embeddings.create({
      model: config.embeddingModel,
      input: batch,
    });
    const sorted = [...res.data].sort((a, b) => a.index - b.index);
    for (const item of sorted) out.push(item.embedding);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Gemini
// ---------------------------------------------------------------------------
let genAI: GoogleGenerativeAI | null = null;
// gemini-embedding-001 defaults to 3072 dims; 768 keeps the JSON store compact
// and cosine search fast with negligible quality loss for this corpus size.
const GEMINI_EMBED_DIM = 768;
// The free tier allows ~100 embed requests/minute. Space calls to stay under it.
const GEMINI_MIN_INTERVAL_MS = 650;
const GEMINI_MAX_RETRIES = 10;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let lastEmbedStart = 0;
async function throttle(): Promise<void> {
  const now = Date.now();
  const next = Math.max(now, lastEmbedStart + GEMINI_MIN_INTERVAL_MS);
  lastEmbedStart = next;
  const wait = next - now;
  if (wait > 0) await sleep(wait);
}

function retryDelayMs(message: string, attempt: number): number {
  const parsed = message.match(/retry in ([\d.]+)s/i)?.[1];
  const base = parsed ? Math.round(parseFloat(parsed) * 1000) : 20000;
  return Math.min(60000, Math.max(15000, base) + attempt * 2000);
}

async function embedGemini(texts: string[]): Promise<number[][]> {
  requireKey("LLM_API_KEY / GEMINI_API_KEY");
  if (!genAI) genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({ model: config.embeddingModel });

  const embedOne = async (text: string, attempt = 0): Promise<number[]> => {
    await throttle();
    try {
      const res = await model.embedContent({
        content: { role: "user", parts: [{ text: text || " " }] },
        outputDimensionality: GEMINI_EMBED_DIM,
        taskType: "RETRIEVAL_DOCUMENT",
      } as never);
      return res.embedding.values;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const rateLimited = /429|quota|Too Many Requests|RESOURCE_EXHAUSTED/i.test(msg);
      if (rateLimited && attempt < GEMINI_MAX_RETRIES) {
        await sleep(retryDelayMs(msg, attempt));
        return embedOne(text, attempt + 1);
      }
      throw e;
    }
  };

  const out: number[][] = [];
  for (const text of texts) out.push(await embedOne(text));
  return out;
}

// ---------------------------------------------------------------------------
// Provider-agnostic entrypoints
// ---------------------------------------------------------------------------

/** Embed a list of texts, batched to stay within API limits. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  return config.provider === "gemini" ? embedGemini(texts) : embedOpenAI(texts);
}

/** Embed a single query string. */
export async function embedQuery(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
