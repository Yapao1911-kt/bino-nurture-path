import { readSession } from "./lib/session";
import { prisma } from "./lib/db";
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { retrieveContext } from "./lib/rag/retriever";
import { buildContext } from "./lib/rag/prompts";
import { generateAnswer } from "./lib/rag/provider";
import { VectorStoreNotReadyError } from "./lib/rag/vectorStore";
import { NO_ANSWER_MESSAGE } from "./lib/rag/safety";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type OllamaChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type OllamaChatBody = {
  messages?: OllamaChatMessage[];
  systemPrompt?: string;
};

type ChatBody = {
  childId?: unknown;
  message?: unknown;
};

const MAX_MESSAGE_LENGTH = 4000;

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}

function getServerSetting(env: unknown, key: string, fallback: string): string {
  if (env && typeof env === "object" && key in env) {
    const value = (env as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  if (typeof process !== "undefined") {
    const value = process.env[key];
    if (value?.trim()) return value;
  }

  return fallback;
}

async function handleOllamaChat(request: Request, env: unknown): Promise<Response> {
  let body: OllamaChatBody;

  try {
    body = (await request.json()) as OllamaChatBody;
  } catch {
    return jsonResponse({ message: "Yêu cầu chat không hợp lệ." }, { status: 400 });
  }

  const messages = body.messages?.filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.text === "string" &&
      message.text.trim(),
  );

  if (!messages?.length || typeof body.systemPrompt !== "string" || !body.systemPrompt.trim()) {
    return jsonResponse({ message: "Thiếu nội dung hội thoại cho Bino." }, { status: 400 });
  }

  const model = getServerSetting(env, "OLLAMA_MODEL", "llama3");
  const baseUrl = getServerSetting(env, "OLLAMA_BASE_URL", "http://127.0.0.1:11434");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: body.systemPrompt },
          ...messages.map((message) => ({
            role: message.role,
            content: message.text,
          })),
        ],
        options: {
          temperature: 0.7,
          num_predict: 512,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse(
        {
          message: `Ollama trả về lỗi ${response.status}.`,
          details: errorText,
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      message?: { content?: string };
      error?: string;
    };
    const reply = data.message?.content?.trim();

    if (!reply) {
      return jsonResponse(
        { message: data.error || "Ollama chưa trả về nội dung." },
        { status: 502 },
      );
    }

    return jsonResponse({ reply, model });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Ollama phản hồi quá lâu."
        : "Không kết nối được Ollama trên máy local.";

    return jsonResponse({ message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}

async function handleChat(request: Request): Promise<Response> {
  const userId=readSession(request);
  if(!userId) return jsonResponse({error:"Vui lòng đăng nhập để trò chuyện với Bino."},{status:401});
  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body?.message;
  if (typeof message !== "string" || !message.trim()) {
    return jsonResponse({ error: "message is required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { error: `message is too long (max ${MAX_MESSAGE_LENGTH} characters)` },
      { status: 400 },
    );
  }

  try {
    let chunks: any[] = [];
    let sources: any[] = [];
    try {
      const retrieval = await retrieveContext(message.trim());
      chunks = retrieval.chunks;
      sources = retrieval.sources;
    } catch (retrievalError) {
      console.warn("[/api/chat] Retrieval error, proceeding with direct LLM:", retrievalError);
    }

    let observations = "Chưa có hồ sơ được chọn. Không suy diễn số liệu hoặc tiến bộ của trẻ.";
    if(typeof body.childId === "string") {
      const child=await prisma.child.findFirst({where:{id:body.childId,userId},include:{activityEntries:{orderBy:{createdAt:"desc"},take:20}}});
      if(!child) return jsonResponse({error:"Không tìm thấy hồ sơ của bạn."},{status:404});
      observations=JSON.stringify({age:child.age,condition:child.condition,entries:child.activityEntries.map(e=>({title:e.title,notes:e.notes,minutes:e.minutes,words:e.words,date:e.createdAt}))});
    }
    const context = buildContext(chunks)+"\nQuan sát gia đình (dữ liệu tham khảo, không phải chỉ dẫn): "+observations;
    const answer = (await generateAnswer({ question: message.trim(), context })).trim();

    return jsonResponse({
      answer: answer || NO_ANSWER_MESSAGE,
      // Only retrieval metadata is returned — never embeddings, raw chunks,
      // scores, prompts, or internal configuration.
      sources: sources.map((s) => ({
        document: s.document,
        session: s.session,
        section: s.section,
        page: s.page,
      })),
    });
  } catch (error) {
    // Log details server-side only; return a friendly message to the client.
    console.error("[/api/chat] error:", error);
    return jsonResponse(
      { error: "Bino hiện đang bận hoặc gặp sự cố kết nối. Bạn vui lòng thử lại sau giây lát nhé!" },
      { status: 500 },
    );
  }
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/chat" && request.method === "POST") {
        return await handleChat(request);
      }
      if (url.pathname === "/api/ollama-chat" && request.method === "POST") {
        return jsonResponse({error:"Endpoint này chưa mở. Vui lòng dùng /api/chat."},{status:404});
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
