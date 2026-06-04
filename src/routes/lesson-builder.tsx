// ============================================================
// Route: /lesson-builder
// File: src/routes/lesson-builder.tsx
// Mô tả: Trang Lesson Builder Studio — sử dụng TanStack Router
//         file-based routing. Lazy load CanvasEditor vì nó
//         phụ thuộc Fabric.js (chỉ chạy client-side).
// ============================================================

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy import CanvasEditor vì Fabric.js chỉ chạy phía client
// (tránh lỗi SSR: "window is not defined")
const CanvasEditor = lazy(
  () => import("@/components/LessonBuilder/CanvasEditor"),
);

export const Route = createFileRoute("/lesson-builder")({
  component: LessonBuilderPage,
  head: () => ({
    meta: [
      { title: "Lesson Builder Studio — Bino" },
      {
        name: "description",
        content:
          "Thiết kế bài học trực quan với công cụ kéo thả dành cho giáo viên và phụ huynh.",
      },
    ],
  }),
});

function LessonBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div
              className="w-16 h-16 rounded-2xl grid place-items-center shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-mint) 100%)",
              }}
            >
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
            <p className="text-sm font-medium text-ink/60">
              Đang tải Lesson Builder...
            </p>
          </div>
        </div>
      }
    >
      <CanvasEditor />
    </Suspense>
  );
}
