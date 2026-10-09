import path from "node:path";
import "dotenv/config";

/**
 * Read a setting from process.env first, then Vite's import.meta.env.
 * LLM/embedding secrets are intentionally NOT VITE_-prefixed so they never
 * get inlined into the browser bundle.
 */
function env(key: string, fallback = ""): string {
  const fromProcess = typeof process !== "undefined" ? process.env[key] : undefined;
  if (fromProcess && fromProcess.trim()) return fromProcess.trim();

  const meta = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const fromMeta = meta?.[key];
  if (fromMeta && fromMeta.trim()) return fromMeta.trim();

  return fallback;
}

const ROOT = typeof process !== "undefined" ? process.cwd() : ".";

const provider = env("LLM_PROVIDER", "openai").toLowerCase();
const isGemini = provider === "gemini";

// One active provider => one resolved key. Generic LLM_API_KEY wins, then the
// provider-specific var. VITE_GEMINI_API_KEY is only a last-resort fallback.
const apiKey = env(
  "LLM_API_KEY",
  env("OPENAI_API_KEY", env("GEMINI_API_KEY", env("VITE_GEMINI_API_KEY", ""))),
);

export const config = {
  root: ROOT,
  provider,
  apiKey,
  llmModel: env("LLM_MODEL", isGemini ? "gemini-2.5-flash" : "gpt-4o-mini"),
  embeddingModel: env(
    "EMBEDDING_MODEL",
    isGemini ? "gemini-embedding-001" : "text-embedding-3-small",
  ),
  topK: Number(env("RAG_TOP_K", "5")) || 5,
  // Cosine-similarity floor. Chunks below this are treated as "not relevant"
  // so the assistant admits insufficient WHO CST material instead of guessing.
  minScore: Number(env("RAG_MIN_SCORE", "0.25")) || 0,

  knowledgeDir: path.join(ROOT, "data", "knowledge", "who_cst"),
  vectorDbDir: path.join(ROOT, "vector_db"),
  vectorDbPath: path.join(ROOT, "vector_db", "who_cst.json"),
} as const;

export type RagConfig = typeof config;
