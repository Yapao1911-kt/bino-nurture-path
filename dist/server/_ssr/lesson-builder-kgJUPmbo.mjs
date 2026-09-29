import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { K as LoaderCircle } from "../_libs/lucide-react.mjs";
const CanvasEditor = reactExports.lazy(() => import("./CanvasEditor-Bujk9Pe9.mjs"));
function LessonBuilderPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl grid place-items-center shadow-md", style: {
      background: "linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-mint) 100%)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-7 h-7 text-white animate-spin" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-ink/60", children: "Đang tải Lesson Builder..." })
  ] }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CanvasEditor, {}) });
}
export {
  LessonBuilderPage as component
};
