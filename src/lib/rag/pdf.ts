import type { ChunkMetadata } from "./vectorStore";

export interface PdfPage {
  page: number;
  text: string;
}

export interface Chunk {
  metadata: ChunkMetadata;
  text: string;
}

/** Session number -> topic slug, following the WHO CST group-session structure. */
const SESSION_TOPICS: Record<number, string> = {
  1: "getting_children_engaged",
  2: "keeping_children_engaged",
  3: "play_and_home_routines",
  4: "understanding_communication",
  5: "promoting_communication",
  6: "teaching_new_skills_small_steps",
  7: "preventing_challenging_behaviour",
  8: "alternatives_to_challenging_behaviour",
  9: "problem_solving_and_caregiver_selfcare",
};

// A session heading, e.g. "Session 7: Preventing challenging behaviour", or with
// a leading page number "7 Session 7: ...". The plural running header
// "group sessions 1–9" is intentionally NOT matched (no "Session <n>" + title).
const SESSION_HEADING_RE = /^\s*(?:\d{1,3}\s+)?Session\s+(\d{1,2})\s*[:.‑–—-]?\s*(.*)$/i;

const TARGET_CHUNK = 900; // chars
const MAX_CHUNK = 1400; // hard-split threshold for a single oversized block
const OVERLAP = 160; // chars of tail carried into the next same-session chunk
const MIN_CHUNK = 200; // chunks shorter than this get merged, not emitted alone
const MIN_EMIT = 40; // discard fragments shorter than this (stray headers/labels)

function normalize(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isNoiseLine(line: string): boolean {
  const t = line.trim();
  if (!t || t.length < 2) return true;
  if (/^\d{1,4}$/.test(t)) return true; // page number
  if (/\.{4,}/.test(t)) return true; // table-of-contents dot leader
  if (/guide,?\s+group sessions/i.test(t)) return true; // running header
  if (/^[\u2013\u2014\-–—]+$/.test(t)) return true; // divider dashes
  return false;
}

/** A short, title-like line that starts a new section (not a wrapped sentence). */
function isSectionHeading(line: string): boolean {
  const t = line.trim();
  if (t.length < 3 || t.length > 70) return false;
  if (/[.!?,;:]$/.test(t)) return false; // ends like a sentence
  if (/\d$/.test(t)) return false; // ends with a number -> label/TOC
  return /^\p{Lu}[\p{L}\p{N}\s&,()'’/\-]*$/u.test(t);
}

/** Hard-split an oversized block on sentence boundaries. */
function splitOversized(block: string): string[] {
  if (block.length <= MAX_CHUNK) return [block];
  const sentences = block.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [block];
  const out: string[] = [];
  let buf = "";
  for (const s of sentences) {
    if ((buf + s).length > MAX_CHUNK && buf) {
      out.push(buf.trim());
      buf = s;
    } else {
      buf += s;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function docSlug(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export interface ChunkDocumentOptions {
  fileName: string;
  source?: string;
}

/**
 * Session/section-aware, line-based chunking. Walks pages in reading order,
 * tracks the current session / topic / section from headings, filters noise
 * (page numbers, TOC dot-leaders, running headers), and groups text into chunks
 * of roughly TARGET_CHUNK characters with a small overlap. A session change
 * always starts a new chunk so unrelated sessions are never mixed.
 */
export function chunkDocument(pages: PdfPage[], opts: ChunkDocumentOptions): Chunk[] {
  const source = opts.source ?? "WHO CST";
  const document = docSlug(opts.fileName);

  let session: number | null = null;
  let topic: string | null = null;
  let section: string | null = null;

  const chunks: Chunk[] = [];
  let buffer = "";
  let bufferStartPage: number | null = null;
  let bufferSession: number | null = null;
  let seq = 0;

  const emit = (text: string, page: number | null, sess: number | null) => {
    const clean = normalize(text);
    // Drop noise fragments (stray headers, page labels) that carry no content.
    if (clean.length < MIN_EMIT) return;
    seq += 1;
    const id = `${document}_s${sess ?? 0}_${String(seq).padStart(3, "0")}`;
    chunks.push({
      metadata: { source, document, session: sess, topic, section, page },
      text: clean,
    });
  };

  /** Flush the buffer, merging tiny fragments into the previous same-session chunk. */
  const pushChunk = () => {
    const text = normalize(buffer);
    buffer = "";
    if (!text) return;

    const last = chunks[chunks.length - 1];
    if (
      text.length < MIN_CHUNK &&
      last &&
      last.metadata.session === bufferSession &&
      last.text.length + text.length <= MAX_CHUNK
    ) {
      last.text = normalize(`${last.text} ${text}`);
    } else {
      emit(text, bufferStartPage, bufferSession);
    }
    bufferStartPage = null;
  };

  const addText = (piece: string, page: number) => {
    if (!piece) return;
    if (bufferStartPage === null) bufferStartPage = page;
    if (bufferSession === null) bufferSession = session;

    if (buffer && buffer.length + piece.length + 1 > TARGET_CHUNK) {
      const tail = session === bufferSession && OVERLAP > 0 ? buffer.slice(-OVERLAP) : "";
      pushChunk();
      bufferStartPage = page;
      bufferSession = session;
      if (tail) {
        const cut = tail.indexOf(" ");
        buffer = cut >= 0 ? tail.slice(cut + 1) : tail;
      }
    }
    buffer += (buffer ? " " : "") + piece;
  };

  for (const page of pages) {
    for (const rawLine of page.text.split("\n")) {
      const line = rawLine.trim();
      if (isNoiseLine(line)) continue;

      const sessionMatch = line.match(SESSION_HEADING_RE);
      if (sessionMatch) {
        const num = Number(sessionMatch[1]);
        if (num >= 1 && num <= 20) {
          pushChunk();
          session = num;
          topic = SESSION_TOPICS[num] ?? null;
          const title = normalize(sessionMatch[2] ?? "");
          section = title || `Session ${num}`;
          bufferSession = session;
          continue;
        }
      }

      if (isSectionHeading(line)) {
        pushChunk();
        section = line;
        bufferSession = session;
        addText(line, page.page);
        continue;
      }

      for (const piece of splitOversized(line)) addText(piece, page.page);
    }
  }

  pushChunk();
  return chunks;
}

/**
 * Extract per-page text from a PDF buffer using pdf-parse v2.
 * pdf.ts is only imported by the ingestion script, never by the server bundle.
 */
export async function extractPdfPages(buffer: Buffer): Promise<PdfPage[]> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.pages
      .map((p) => ({ page: p.num, text: normalize(p.text ?? "") }))
      .filter((p) => p.text.length > 0);
  } finally {
    await parser.destroy();
  }
}
