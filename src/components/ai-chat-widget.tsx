import {getActiveChild} from "@/lib/child-storage";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { RefreshCw, Send, X } from "lucide-react";

export type AIChatChild = {
  name: string;
  age?: number;
};

export type AIChatProgressPoint = {
  score?: number;
  words?: number;
};

type Source = {
  document: string;
  session: number | null;
  section: string | null;
  page: number | null;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  loading?: boolean;
  sources?: Source[];
};

type AIChatWidgetProps = {
  selectedChild?: AIChatChild;
  progressData?: AIChatProgressPoint[];
  contextLabel?: string;
};

const MASCOT_SRC = "/bino-ai-mascot.png";

type ChatResponse = { answer?: string; sources?: Source[]; error?: string };

async function callChat(message: string): Promise<{ answer: string; sources: Source[] }> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, childId: getActiveChild()?.id }),
  });

  let data: ChatResponse | null = null;
  try {
    data = (await response.json()) as ChatResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Bino gặp sự cố (mã ${response.status}). Vui lòng thử lại.`);
  }

  if (!data || typeof data.answer !== "string" || !data.answer.trim()) {
    throw new Error("Phản hồi từ máy chủ không hợp lệ.");
  }

  return { answer: data.answer, sources: Array.isArray(data.sources) ? data.sources : [] };
}

function cleanPlainText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\\?\*(.*?)\\?\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*{1,3}/g, "");
}

function MascotImage({ className = "w-full h-full" }: { className?: string }) {
  return (
    <img
      src={MASCOT_SRC}
      alt="Bino AI"
      className={`${className} object-contain`}
      draggable={false}
    />
  );
}

export function AIChatWidget({
  selectedChild = { name: "bé" },
  progressData,
  contextLabel = "Trang chính Bino",
}: AIChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `Xin chào! Mình là Bino.\nMình có thể giúp bạn phân tích tiến trình, gợi ý hoạt động và trả lời câu hỏi về hành trình của ${selectedChild.name}.\n\nBạn muốn hỏi gì hôm nay?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", text };
    const loadingMsg: ChatMessage = { role: "assistant", text: "", loading: true };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const { answer, sources } = await callChat(text);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", text: answer, sources },
      ]);
    } catch (err) {
      const friendly =
        err instanceof Error && err.message
          ? err.message
          : "Ôi, Bino đang gặp sự cố kết nối. Bạn thử lại một chút nữa nhé.";
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", text: friendly }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        text: `Mình là Bino. Bắt đầu lại cuộc trò chuyện mới nha!\nBạn muốn mình hỗ trợ điều gì cho ${selectedChild.name}?`,
      },
    ]);
  };

  return (
    <>
      <button
        id="ai-chat-mascot"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-8 right-8 z-50 group flex flex-col items-center gap-1 cursor-pointer select-none"
        aria-label="Mở chat với Bino AI"
      >
        <div
          className={`absolute bottom-full mb-3 right-0 bg-ink text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg transition-all duration-200 ${
            open ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          Hỏi Bino ngay
          <div className="absolute top-full right-5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ink" />
        </div>

        {!open && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-pulse z-10"
            style={{ background: "var(--brand-pink, #F687B3)" }}
          />
        )}

        <div
          className={`w-20 h-20 rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-2 overflow-hidden transition-all duration-300 ${
            open
              ? "border-[var(--brand-blue)] shadow-[0_8px_32px_rgba(61,143,192,0.25)] scale-105"
              : "border-slate-100 group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] group-hover:-translate-y-1"
          } animate-[float_4s_ease-in-out_infinite]`}
        >
          <MascotImage className="w-full h-full p-1" />
        </div>
        <span className="text-[11px] font-bold text-ink/60 group-hover:text-ink transition-colors">
          {open ? "Đóng chat" : "Chat với Bino"}
        </span>
      </button>

      <div
        className={`fixed bottom-36 right-8 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{ maxHeight: "520px" }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-slate-100"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-blue-soft) 0%, var(--brand-mint-soft) 100%)",
          }}
        >
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm overflow-hidden shrink-0 border border-slate-100">
            <MascotImage className="w-full h-full p-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink leading-none">Bino AI</p>
            <p className="text-[11px] text-ink/50 mt-0.5 truncate">
              Sẵn sàng hỗ trợ {selectedChild.name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-xl hover:bg-white/60 transition-colors text-ink/50 hover:text-ink"
              title="Bắt đầu chat mới"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/60 transition-colors text-ink/50 hover:text-ink"
              aria-label="Đóng chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-white shadow-sm border border-slate-100 shrink-0 overflow-hidden mb-0.5">
                  <MascotImage className="w-full h-full p-0.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "text-white rounded-br-sm"
                    : "text-ink bg-slate-50 rounded-bl-sm"
                }`}
                style={msg.role === "user" ? { background: "var(--brand-blue)" } : {}}
              >
                {msg.loading ? (
                  <div className="flex gap-1.5 items-center py-1">
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: "var(--brand-mint)",
                          animationDelay: `${j * 150}ms`,
                        }}
                      />
                    ))}
                  </div>
                ) : msg.role === "assistant" ? (
                  cleanPlainText(msg.text)
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {[
              "Gợi ý hoạt động hôm nay",
              "Bé cần cải thiện gì?",
              "Phân tích tiến trình tuần này",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setInput(prompt);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-ink/70 hover:text-ink transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="px-4 pb-4 pt-2 border-t border-slate-100">
          <div className="flex items-end gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200 focus-within:border-[var(--brand-blue)] focus-within:ring-2 focus-within:ring-[var(--brand-blue)]/10 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi Bino..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/30 resize-none focus:outline-none min-h-[24px] max-h-[80px] disabled:opacity-50"
              style={{ lineHeight: "1.5" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 80) + "px";
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{ background: "var(--brand-blue)" }}
              aria-label="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-ink/30 mt-1.5 text-center">
            Enter để gửi • Shift+Enter để xuống dòng
          </p>
        </div>
      </div>
    </>
  );
}
