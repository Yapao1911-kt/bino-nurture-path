/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { config } from "../src/lib/rag/config";
import { chunkDocument, extractPdfPages, type Chunk } from "../src/lib/rag/pdf";
import { embedTexts } from "../src/lib/rag/embeddings";
import { saveVectorStore, type ChunkRecord } from "../src/lib/rag/vectorStore";

/**
 * Offline ingestion pipeline (never runs on server start):
 *   WHO PDFs -> text extraction -> clean -> session/section-aware chunking
 *   -> OpenAI embeddings -> vector_db/who_cst.json
 *
 * Usage: npm run ingest
 */
async function main() {
  if (!config.apiKey) {
    console.error(
      "\n[ingest] Missing LLM_API_KEY / OPENAI_API_KEY in .env — cannot generate embeddings.\n",
    );
    process.exit(1);
  }

  if (!fs.existsSync(config.knowledgeDir)) {
    console.error(`\n[ingest] Knowledge directory not found: ${config.knowledgeDir}`);
    console.error("[ingest] Create it and copy your WHO CST PDFs there, then re-run.\n");
    process.exit(1);
  }

  const pdfFiles = fs
    .readdirSync(config.knowledgeDir)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  console.log(`\nFound ${pdfFiles.length} PDFs in ${config.knowledgeDir}`);
  if (pdfFiles.length === 0) {
    console.error("[ingest] No PDFs to process. Copy WHO CST PDFs into the folder above.\n");
    process.exit(1);
  }

  const allChunks: Chunk[] = [];
  const errors: string[] = [];

  for (const file of pdfFiles) {
    const filePath = path.join(config.knowledgeDir, file);
    console.log(`\nProcessing ${file}`);
    try {
      const buffer = fs.readFileSync(filePath);
      const pages = await extractPdfPages(buffer);
      const chunks = chunkDocument(pages, { fileName: file, source: "WHO CST" });
      console.log(`  Pages: ${pages.length}`);
      console.log(`  Chunks: ${chunks.length}`);
      allChunks.push(...chunks);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${file}: ${msg}`);
      console.error(`  ERROR: ${msg}`);
    }
  }

  if (allChunks.length === 0) {
    console.error("\n[ingest] No chunks were produced. Nothing to embed.\n");
    process.exit(1);
  }

  console.log(`\nGenerating embeddings for ${allChunks.length} chunks (${config.embeddingModel})...`);
  const records: ChunkRecord[] = [];
  const EMBED_BATCH = 100;
  let dim = 0;

  for (let i = 0; i < allChunks.length; i += EMBED_BATCH) {
    const slice = allChunks.slice(i, i + EMBED_BATCH);
    const embeddings = await embedTexts(slice.map((c) => c.text));
    dim = embeddings[0]?.length ?? dim;
    slice.forEach((chunk, j) => {
      records.push({
        id: `${chunk.metadata.document}_${String(records.length + 1).padStart(5, "0")}`,
        text: chunk.text,
        embedding: embeddings[j],
        metadata: chunk.metadata,
      });
    });
    const done = Math.min(i + EMBED_BATCH, allChunks.length);
    console.log(`  embedded ${done}/${allChunks.length}`);

    // Save checkpoint so far
    saveVectorStore(config.vectorDbPath, {
      model: config.embeddingModel,
      dim,
      count: records.length,
      created: new Date().toISOString(),
      records,
    });
  }

  console.log(`\nSaved: ${config.vectorDbPath}`);
  console.log(`Total chunks: ${records.length}`);
  console.log(`Embedding model: ${config.embeddingModel} (dim ${dim})`);
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors) console.log(`  - ${e}`);
  }
  console.log();
}

main().catch((err) => {
  console.error("\n[ingest] Fatal error:", err instanceof Error ? err.message : err);
  console.error("[ingest] (No API keys, prompts, or stack details are shown to end users.)\n");
  process.exit(1);
});
