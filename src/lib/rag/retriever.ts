import { config } from "./config";
import { embedQuery } from "./embeddings";
import { loadVectorStore, search, type ChunkRecord } from "./vectorStore";

export interface Source {
  document: string;
  session: number | null;
  section: string | null;
  page: number | null;
}

export interface RetrievalResult {
  chunks: ChunkRecord[];
  sources: Source[];
  /** Highest similarity score, useful for logging/diagnostics (never sent to the client). */
  bestScore: number;
}

function prettyDocument(doc: string): string {
  return doc
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bWho Cst\b/g, "WHO CST");
}

/**
 * retrieveContext(question):
 *   question -> embedding -> cosine similarity -> top-K WHO CST chunks above a
 *   relevance threshold -> normalized source metadata.
 *
 * If nothing clears RAG_MIN_SCORE, returns an empty chunk list so the assistant
 * says the WHO CST material is insufficient instead of fabricating an answer.
 * Throws VectorStoreNotReadyError if the DB has not been built.
 */
export async function retrieveContext(
  question: string,
  topK: number = config.topK,
): Promise<RetrievalResult> {
  const store = loadVectorStore(config.vectorDbPath);
  const queryEmbedding = await embedQuery(question);
  const hits = search(store, queryEmbedding, topK).filter((h) => h.score >= config.minScore);

  const chunks = hits.map((h) => h.record);

  // De-duplicate sources by document + session + section + page.
  const seen = new Set<string>();
  const sources: Source[] = [];
  for (const hit of hits) {
    const m = hit.record.metadata;
    const src: Source = {
      document: prettyDocument(m.document),
      session: m.session ?? null,
      section: m.section ?? null,
      page: m.page ?? null,
    };
    const key = `${src.document}|${src.session}|${src.section}|${src.page}`;
    if (!seen.has(key)) {
      seen.add(key);
      sources.push(src);
    }
  }

  return { chunks, sources, bestScore: hits[0]?.score ?? 0 };
}
