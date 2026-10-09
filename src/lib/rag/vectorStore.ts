import fs from "node:fs";
import path from "node:path";

export interface ChunkMetadata {
  source: string;
  document: string;
  session?: number | null;
  topic?: string | null;
  section?: string | null;
  page?: number | null;
}

export interface ChunkRecord {
  id: string;
  text: string;
  embedding: number[];
  metadata: ChunkMetadata;
}

export interface VectorStoreFile {
  model: string;
  dim: number;
  count: number;
  created: string;
  records: ChunkRecord[];
}

export interface SearchResult {
  record: ChunkRecord;
  score: number;
}

export class VectorStoreNotReadyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VectorStoreNotReadyError";
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Load the vector store from disk, caching it in memory for the process. */
let cache: { path: string; mtimeMs: number; store: VectorStoreFile } | null = null;

export function loadVectorStore(filePath: string): VectorStoreFile {
  if (!fs.existsSync(filePath)) {
    throw new VectorStoreNotReadyError(
      `Vector database not found at ${filePath}. Run "npm run ingest" first.`,
    );
  }

  const stat = fs.statSync(filePath);
  if (cache && cache.path === filePath && cache.mtimeMs === stat.mtimeMs) {
    return cache.store;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const store = JSON.parse(raw) as VectorStoreFile;
  if (!store.records || !Array.isArray(store.records) || store.records.length === 0) {
    throw new VectorStoreNotReadyError("Vector database is empty. Run \"npm run ingest\" first.");
  }

  cache = { path: filePath, mtimeMs: stat.mtimeMs, store };
  return store;
}

export function saveVectorStore(filePath: string, store: VectorStoreFile): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(store), "utf-8");
}

export function search(
  store: VectorStoreFile,
  queryEmbedding: number[],
  topK: number,
): SearchResult[] {
  return store.records
    .map((record) => ({ record, score: cosineSimilarity(queryEmbedding, record.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
