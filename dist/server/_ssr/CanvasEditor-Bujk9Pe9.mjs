import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { R as Root } from "../_libs/radix-ui__react-separator.mjs";
import { s as supabase } from "./supabase-BG92hIum.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { z as LayoutTemplate, ag as Type, a4 as Shapes, I as Image, a7 as Smile, u as Frame, S as Palette, a8 as Sparkles, A as ArrowLeft, h as ChevronDown, K as LoaderCircle, D as Download, a9 as Square, l as Circle, aa as Star, H as Heart, X as RefreshCw, e as BringToFront, a2 as SendToBack, J as Lightbulb, M as Lock, R as Paintbrush, ae as Trash2, g as Check } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function useFabric(width = 800, height = 560) {
  const canvasRef = reactExports.useRef(null);
  const fabricRef = reactExports.useRef(null);
  const [canvasInstance, setCanvasInstance] = reactExports.useState(null);
  const [activeObject, setActiveObject] = reactExports.useState(null);
  const extractInfo = reactExports.useCallback(
    (obj) => {
      if (!obj) return null;
      return {
        type: obj.type ?? "unknown",
        fill: typeof obj.fill === "string" ? obj.fill : "#000000",
        stroke: typeof obj.stroke === "string" ? obj.stroke : "",
        fontFamily: obj.fontFamily
      };
    },
    []
  );
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    let canvas = null;
    const initCanvas = async () => {
      const fabric = await import("../_libs/fabric.mjs");
      if (!canvasRef.current) return;
      canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#FFFFFF",
        // Cấu hình control points bo tròn, thân thiện
        selectionColor: "rgba(142, 205, 248, 0.15)",
        selectionBorderColor: "#8ECDF8",
        selectionLineWidth: 1.5
      });
      fabricRef.current = canvas;
      setCanvasInstance(canvas);
      canvas.on("selection:created", () => {
        setActiveObject(extractInfo(canvas?.getActiveObject()));
      });
      canvas.on("selection:updated", () => {
        setActiveObject(extractInfo(canvas?.getActiveObject()));
      });
      canvas.on("selection:cleared", () => {
        setActiveObject(null);
      });
      canvas.on("object:modified", () => {
        setActiveObject(extractInfo(canvas?.getActiveObject()));
      });
    };
    initCanvas();
    return () => {
      canvas?.dispose();
      fabricRef.current = null;
      setCanvasInstance(null);
    };
  }, [width, height, extractInfo]);
  const randomPosition = reactExports.useCallback(() => {
    return {
      left: 80 + Math.random() * (width - 240),
      top: 60 + Math.random() * (height - 200)
    };
  }, [width, height]);
  const addText = reactExports.useCallback(
    async (customText, fontSize = 24, fontWeight = "normal") => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const fabric = await import("../_libs/fabric.mjs");
      const pos = randomPosition();
      const text = new fabric.IText(customText || "Nhập văn bản...", {
        left: pos.left,
        top: pos.top,
        fontFamily: "Inter",
        fontSize,
        fontWeight,
        fill: "#1E293B",
        // Cấu hình control points rõ nét
        cornerColor: "#2563EB",
        cornerStyle: "circle",
        cornerSize: 8,
        transparentCorners: false,
        borderColor: "#2563EB",
        borderScaleFactor: 1.5,
        padding: 8
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      setActiveObject(extractInfo(text));
    },
    [randomPosition, extractInfo]
  );
  const addRect = reactExports.useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const pos = randomPosition();
    const rect = new fabric.Rect({
      left: pos.left,
      top: pos.top,
      width: 140,
      height: 100,
      fill: "#A8E6CF",
      stroke: "#4FA37F",
      strokeWidth: 2,
      rx: 12,
      ry: 12,
      // Control points styling
      cornerColor: "#8ECDF8",
      cornerStyle: "circle",
      cornerSize: 8,
      transparentCorners: false,
      borderColor: "#8ECDF8",
      borderScaleFactor: 1.5
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    setActiveObject(extractInfo(rect));
  }, [randomPosition, extractInfo]);
  const addCircle = reactExports.useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const pos = randomPosition();
    const circle = new fabric.Circle({
      left: pos.left,
      top: pos.top,
      radius: 55,
      fill: "#FFCAD4",
      stroke: "#D67B8B",
      strokeWidth: 2,
      // Control points styling
      cornerColor: "#8ECDF8",
      cornerStyle: "circle",
      cornerSize: 8,
      transparentCorners: false,
      borderColor: "#8ECDF8",
      borderScaleFactor: 1.5
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    setActiveObject(extractInfo(circle));
  }, [randomPosition, extractInfo]);
  const addImage = reactExports.useCallback(
    async (url) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const fabric = await import("../_libs/fabric.mjs");
      const pos = randomPosition();
      try {
        const img = await fabric.Image.fromURL(url, {
          crossOrigin: "anonymous"
        });
        const maxDim = 300;
        if (img.width > maxDim || img.height > maxDim) {
          const scale = maxDim / Math.max(img.width, img.height);
          img.scale(scale);
        }
        img.set({
          left: pos.left,
          top: pos.top,
          cornerColor: "#8ECDF8",
          cornerStyle: "circle",
          cornerSize: 8,
          transparentCorners: false,
          borderColor: "#8ECDF8",
          borderScaleFactor: 1.5
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        setActiveObject(extractInfo(img));
      } catch (err) {
        console.error("Error loading image in Fabric:", err);
        throw err;
      }
    },
    [randomPosition, extractInfo]
  );
  const setFillColor = reactExports.useCallback(
    (color) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !obj) return;
      obj.set("fill", color);
      canvas.renderAll();
      setActiveObject(extractInfo(obj));
    },
    [extractInfo]
  );
  const setStrokeColor = reactExports.useCallback(
    (color) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !obj) return;
      obj.set("stroke", color);
      if (!obj.strokeWidth || obj.strokeWidth === 0) {
        obj.set("strokeWidth", 2);
      }
      canvas.renderAll();
      setActiveObject(extractInfo(obj));
    },
    [extractInfo]
  );
  const setFontFamily = reactExports.useCallback(
    (font) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !obj) return;
      if (obj.type === "i-text" || obj.type === "textbox") {
        obj.fontFamily = font;
        canvas.renderAll();
        setActiveObject(extractInfo(obj));
      }
    },
    [extractInfo]
  );
  const addStar = reactExports.useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const pos = randomPosition();
    const starPoints = [
      { x: 50, y: 0 },
      { x: 63, y: 35 },
      { x: 100, y: 35 },
      { x: 71, y: 57 },
      { x: 82, y: 91 },
      { x: 50, y: 70 },
      { x: 18, y: 91 },
      { x: 29, y: 57 },
      { x: 0, y: 35 },
      { x: 37, y: 35 }
    ];
    const star = new fabric.Polygon(starPoints, {
      left: pos.left,
      top: pos.top,
      fill: "#FED85D",
      stroke: "#D97706",
      strokeWidth: 2,
      cornerColor: "#2563EB",
      cornerStyle: "circle",
      cornerSize: 8,
      transparentCorners: false,
      borderColor: "#2563EB",
      borderScaleFactor: 1.5
    });
    canvas.add(star);
    canvas.setActiveObject(star);
    canvas.renderAll();
    setActiveObject(extractInfo(star));
  }, [randomPosition, extractInfo]);
  const addHeart = reactExports.useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const pos = randomPosition();
    const heartPath = "M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z";
    const heart = new fabric.Path(heartPath, {
      left: pos.left,
      top: pos.top,
      scaleX: 1.2,
      scaleY: 1.2,
      fill: "#FF8DA1",
      stroke: "#E11D48",
      strokeWidth: 2,
      cornerColor: "#2563EB",
      cornerStyle: "circle",
      cornerSize: 8,
      transparentCorners: false,
      borderColor: "#2563EB",
      borderScaleFactor: 1.5
    });
    canvas.add(heart);
    canvas.setActiveObject(heart);
    canvas.renderAll();
    setActiveObject(extractInfo(heart));
  }, [randomPosition, extractInfo]);
  const addSticker = reactExports.useCallback(async (emoji) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const pos = randomPosition();
    const text = new fabric.IText(emoji, {
      left: pos.left,
      top: pos.top,
      fontSize: 60,
      cornerColor: "#2563EB",
      cornerStyle: "circle",
      cornerSize: 8,
      transparentCorners: false,
      borderColor: "#2563EB"
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setActiveObject(extractInfo(text));
  }, [randomPosition, extractInfo]);
  const addPecsTemplate = reactExports.useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const card = new fabric.Rect({
      left: 260,
      top: 60,
      width: 280,
      height: 380,
      fill: "#FFFFFF",
      stroke: "#2563EB",
      strokeWidth: 4,
      rx: 20,
      ry: 20,
      cornerColor: "#2563EB",
      cornerStyle: "circle"
    });
    const imageBox = new fabric.Rect({
      left: 280,
      top: 80,
      width: 240,
      height: 240,
      fill: "#EFF6FF",
      stroke: "#93C5FD",
      strokeWidth: 2,
      rx: 16,
      ry: 16
    });
    const iconText = new fabric.IText("🍎", {
      left: 360,
      top: 150,
      fontSize: 80
    });
    const labelBox = new fabric.Rect({
      left: 280,
      top: 340,
      width: 240,
      height: 80,
      fill: "#DBEAFE",
      stroke: "#3B82F6",
      strokeWidth: 2,
      rx: 14,
      ry: 14
    });
    const textLabel = new fabric.IText("QUẢ TÁO", {
      left: 320,
      top: 365,
      fontFamily: "Inter",
      fontSize: 26,
      fontWeight: "bold",
      fill: "#1E3A8A"
    });
    canvas.add(card, imageBox, iconText, labelBox, textLabel);
    canvas.renderAll();
  }, []);
  const addFlashcardTemplate = reactExports.useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const card = new fabric.Rect({
      left: 200,
      top: 80,
      width: 400,
      height: 360,
      fill: "#FFFBEB",
      stroke: "#D97706",
      strokeWidth: 4,
      rx: 24,
      ry: 24
    });
    const title = new fabric.IText("TỪ VỰNG HÔM NAY", {
      left: 300,
      top: 110,
      fontFamily: "Inter",
      fontSize: 18,
      fontWeight: "bold",
      fill: "#B45309"
    });
    const icon = new fabric.IText("⭐", {
      left: 360,
      top: 160,
      fontSize: 84
    });
    const word = new fabric.IText("NGÔI SAO", {
      left: 310,
      top: 290,
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: "bold",
      fill: "#78350F"
    });
    const sub = new fabric.IText("Bầu trời đêm lấp lánh", {
      left: 315,
      top: 350,
      fontFamily: "Inter",
      fontSize: 16,
      fill: "#92400E"
    });
    canvas.add(card, title, icon, word, sub);
    canvas.renderAll();
  }, []);
  const addScheduleTemplate = reactExports.useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await import("../_libs/fabric.mjs");
    const title = new fabric.IText("LỊCH TRÌNH BUỔI SÁNG CỦA BÉ", {
      left: 220,
      top: 40,
      fontFamily: "Inter",
      fontSize: 22,
      fontWeight: "bold",
      fill: "#1E293B"
    });
    const steps = [
      { step: "1", emoji: "🛏️", label: "Thức dậy", color: "#EFF6FF", stroke: "#3B82F6", left: 100 },
      { step: "2", emoji: "🪥", label: "Đánh răng", color: "#ECFDF5", stroke: "#10B981", left: 320 },
      { step: "3", emoji: "🥣", label: "Ăn sáng", color: "#FFF7ED", stroke: "#F97316", left: 540 }
    ];
    const elementsToAdd = [title];
    steps.forEach((s) => {
      const box = new fabric.Rect({
        left: s.left,
        top: 100,
        width: 170,
        height: 280,
        fill: s.color,
        stroke: s.stroke,
        strokeWidth: 3,
        rx: 18,
        ry: 18
      });
      const stepBadge = new fabric.IText(`Bước ${s.step}`, {
        left: s.left + 50,
        top: 120,
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: "bold",
        fill: s.stroke
      });
      const icon = new fabric.IText(s.emoji, {
        left: s.left + 55,
        top: 180,
        fontSize: 60
      });
      const label = new fabric.IText(s.label, {
        left: s.left + 40,
        top: 290,
        fontFamily: "Inter",
        fontSize: 18,
        fontWeight: "bold",
        fill: "#1E293B"
      });
      elementsToAdd.push(box, stepBadge, icon, label);
    });
    canvas.add(...elementsToAdd);
    canvas.renderAll();
  }, []);
  const setCanvasBackground = reactExports.useCallback((color) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.backgroundColor = color;
    canvas.renderAll();
  }, []);
  const clearCanvas = reactExports.useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#FFFFFF";
    canvas.renderAll();
    setActiveObject(null);
  }, []);
  const bringForward = reactExports.useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.bringObjectForward(obj);
    canvas.renderAll();
  }, []);
  const sendBackward = reactExports.useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
  }, []);
  const deleteActive = reactExports.useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
    setActiveObject(null);
  }, []);
  return {
    canvasRef,
    canvasInstance,
    activeObject,
    addText,
    addRect,
    addCircle,
    addStar,
    addHeart,
    addSticker,
    addPecsTemplate,
    addFlashcardTemplate,
    addScheduleTemplate,
    addImage,
    setFillColor,
    setStrokeColor,
    setFontFamily,
    setCanvasBackground,
    deleteActive,
    clearCanvas,
    bringForward,
    sendBackward
  };
}
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root.displayName;
const BINO_PALETTE = [
  { id: "amethyst", hex: "#9956DE", shadow: "#7D3EC0", label: "Mẫu bài" },
  { id: "slate_blue", hex: "#7274ED", shadow: "#595BCF", label: "Văn bản" },
  { id: "summer_sky", hex: "#1FA7E1", shadow: "#168BC0", label: "Hình khối" },
  { id: "downy", hex: "#6ED1CF", shadow: "#4BB3B1", label: "Tải ảnh" },
  { id: "pastel_green", hex: "#75D06A", shadow: "#59B84E", label: "Nhãn dán" },
  { id: "texas_rose", hex: "#FFB365", shadow: "#E59845", label: "Khung thẻ" },
  { id: "mona_lisa", hex: "#FF8B8B", shadow: "#E06D6D", label: "Bảng màu" },
  { id: "illusion", hex: "#FB96BB", shadow: "#DC779D", label: "Màu nền" }
];
const FILL_PALETTE = [
  "#9956DE",
  // Amethyst
  "#7274ED",
  // Slate Blue
  "#1FA7E1",
  // Summer Sky
  "#6ED1CF",
  // Downy
  "#75D06A",
  // Pastel Green
  "#FFB365",
  // Texas Rose
  "#FF8B8B",
  // Mona Lisa
  "#FB96BB",
  // Illusion
  "#FFFFFF",
  // Trắng tinh
  "#1E293B",
  // Đen than chì
  "#DC2626",
  // Đỏ cờ
  "#D97706"
  // Vàng đậm
];
const STROKE_PALETTE = [
  "transparent",
  // Không viền
  "#0F172A",
  // Đen viền đậm
  "#9956DE",
  // Amethyst
  "#7274ED",
  // Slate Blue
  "#1FA7E1",
  // Summer Sky
  "#6ED1CF",
  // Downy
  "#75D06A",
  // Pastel Green
  "#FFB365",
  // Texas Rose
  "#FF8B8B",
  // Mona Lisa
  "#FB96BB",
  // Illusion
  "#DC2626",
  // Đỏ đậm viền
  "#B45309"
  // Vàng nghệ viền
];
const FONT_LIST = [
  { value: "Inter", label: "Inter (Hiện đại, dễ đọc)" },
  { value: "Roboto", label: "Roboto (Tiêu chuẩn giáo khoa)" },
  { value: "Arial", label: "Arial (Đơn giản, rõ ràng)" },
  { value: "Comic Sans MS", label: "Comic Sans (Thân thiện trẻ nhỏ)" },
  { value: "Georgia", label: "Georgia (Thanh lịch có chân)" },
  { value: "Courier New", label: "Courier New (Đơn cách)" }
];
const QUICK_STICKERS = [
  { emoji: "🍎", name: "Quả táo", color: "#FF8B8B", shadow: "#E06D6D" },
  { emoji: "⭐", name: "Ngôi sao", color: "#FFB365", shadow: "#E59845" },
  { emoji: "🐻", name: "Chú gấu", color: "#9956DE", shadow: "#7D3EC0" },
  { emoji: "🌞", name: "Mặt trời", color: "#1FA7E1", shadow: "#168BC0" },
  { emoji: "🚗", name: "Ô tô", color: "#6ED1CF", shadow: "#4BB3B1" },
  { emoji: "🐶", name: "Cún con", color: "#75D06A", shadow: "#59B84E" },
  { emoji: "🐱", name: "Mèo con", color: "#7274ED", shadow: "#595BCF" },
  { emoji: "🌸", name: "Bông hoa", color: "#FB96BB", shadow: "#DC779D" },
  { emoji: "🎨", name: "Bút màu", color: "#9956DE", shadow: "#7D3EC0" },
  { emoji: "🎈", name: "Bóng bay", color: "#1FA7E1", shadow: "#168BC0" },
  { emoji: "🍓", name: "Dâu tây", color: "#FF8B8B", shadow: "#E06D6D" },
  { emoji: "🧸", name: "Gấu bông", color: "#FFB365", shadow: "#E59845" }
];
function ColorGrid({
  colors,
  activeColor,
  onSelect,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-800 uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-2", children: colors.map((color) => {
      const isTransparent = color === "transparent";
      const isActive = activeColor.toLowerCase() === color.toLowerCase() || isTransparent && !activeColor;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSelect(color),
          "aria-label": `Chọn màu ${color}`,
          className: `
                w-8 h-8 rounded-xl border-2 transition-all duration-150 cursor-pointer
                hover:scale-110 hover:shadow-md relative flex items-center justify-center
                ${isActive ? "border-blue-600 ring-2 ring-blue-500 ring-offset-2 scale-105" : "border-slate-300"}
              `,
          style: {
            backgroundColor: isTransparent ? "#FFFFFF" : color,
            ...isTransparent ? {
              backgroundImage: "linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%)",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 4px 4px"
            } : {}
          },
          children: [
            isTransparent && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 32 32", className: "w-full h-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "line",
              {
                x1: "4",
                y1: "28",
                x2: "28",
                y2: "4",
                stroke: "#EF4444",
                strokeWidth: "3",
                strokeLinecap: "round"
              }
            ) }),
            isActive && !isTransparent && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Check,
              {
                className: `w-4 h-4 ${["#ffffff", "#6ed1cf", "#75d06a", "#ffb365", "#fb96bb"].includes(
                  color.toLowerCase()
                ) ? "text-slate-900" : "text-white"}`,
                strokeWidth: 3
              }
            )
          ]
        },
        color
      );
    }) })
  ] });
}
function FontSelector({
  currentFont,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full h-11 rounded-xl justify-between text-sm font-semibold border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-[#7274ED] transition-all text-slate-800 shadow-sm",
        "aria-label": "Chọn font chữ",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: currentFont }, children: currentFont }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-slate-600" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContent,
      {
        className: "w-64 p-2 rounded-2xl border-2 border-slate-200 shadow-xl bg-white",
        side: "bottom",
        align: "start",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: FONT_LIST.map((font) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => onSelect(font.value),
            className: `
                w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all cursor-pointer flex items-center justify-between
                ${currentFont === font.value ? "bg-[#7274ED] text-white font-bold" : "text-slate-700 hover:bg-slate-100"}
              `,
            style: { fontFamily: font.value },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: font.label }),
              currentFont === font.value && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-white" })
            ]
          },
          font.value
        )) })
      }
    )
  ] });
}
function PropertiesPanel({
  activeObject,
  onSetFill,
  onSetStroke,
  onSetFont,
  onDelete,
  onBringForward,
  onSendBackward
}) {
  const typeLabels = {
    "i-text": "Văn bản chữ",
    rect: "Hình chữ nhật",
    circle: "Hình tròn",
    textbox: "Khung văn bản",
    polygon: "Ngôi sao khen ngợi",
    path: "Hình trái tim",
    image: "Hình ảnh"
  };
  const typeLabel = typeLabels[activeObject.type] ?? "Phần tử";
  const isText = activeObject.type === "i-text" || activeObject.type === "textbox";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 animate-fade-in text-slate-800", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 p-3.5 rounded-2xl shadow-xs",
        style: {
          backgroundColor: "#9956DE",
          boxShadow: "0 3.5px 0px #7D3EC0"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-white/20 text-white grid place-items-center shadow-xs shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-extrabold text-white/90 uppercase tracking-widest leading-none mb-1", children: "ĐANG CHỈNH SỬA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-white leading-tight", children: typeLabel })
          ] })
        ]
      }
    ),
    isText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-extrabold text-slate-700 uppercase tracking-wider", children: "Kiểu font chữ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FontSelector,
        {
          currentFont: activeObject.fontFamily ?? "Inter",
          onSelect: onSetFont
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-extrabold text-slate-700 uppercase tracking-wider", children: "Màu tô (Nền)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "w-full h-12 flex items-center justify-between px-4 rounded-xl transition-all cursor-pointer shadow-xs active:translate-y-0.5",
            style: {
              backgroundColor: "#FFB365",
              boxShadow: "0 3.5px 0px #E59845"
            },
            "aria-label": "Đổi màu nền",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-5 h-5 text-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Màu nền phần tử" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-7 h-7 rounded-lg border-2 border-white shadow-xs",
                  style: { backgroundColor: activeObject.fill || "#FFFFFF" }
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PopoverContent,
          {
            side: "left",
            align: "start",
            className: "w-auto p-4 rounded-2xl border-2 border-slate-200 shadow-xl bg-white",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ColorGrid,
              {
                colors: FILL_PALETTE,
                activeColor: activeObject.fill,
                onSelect: onSetFill,
                label: "Bảng 8 màu chuẩn"
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-extrabold text-slate-700 uppercase tracking-wider", children: "Màu đường viền" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "w-full h-12 flex items-center justify-between px-4 rounded-xl transition-all cursor-pointer shadow-xs active:translate-y-0.5",
            style: {
              backgroundColor: "#FF8B8B",
              boxShadow: "0 3.5px 0px #E06D6D"
            },
            "aria-label": "Đổi màu viền",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Paintbrush, { className: "w-5 h-5 text-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Màu đường viền" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-7 h-7 rounded-lg border-2 border-white shadow-xs ${!activeObject.stroke || activeObject.stroke === "transparent" ? "bg-white" : ""}`,
                  style: {
                    backgroundColor: activeObject.stroke && activeObject.stroke !== "transparent" ? activeObject.stroke : void 0,
                    ...(!activeObject.stroke || activeObject.stroke === "transparent") && {
                      backgroundImage: "linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%)",
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 4px 4px"
                    }
                  }
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PopoverContent,
          {
            side: "left",
            align: "start",
            className: "w-auto p-4 rounded-2xl border-2 border-slate-200 shadow-xl bg-white",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ColorGrid,
              {
                colors: STROKE_PALETTE,
                activeColor: activeObject.stroke || "transparent",
                onSelect: onSetStroke,
                label: "Bảng màu viền chuẩn"
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-slate-200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-extrabold text-slate-700 uppercase tracking-wider", children: "Thứ tự hiển thị" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onBringForward,
            className: "h-11 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-0.5",
            style: {
              backgroundColor: "#7274ED",
              boxShadow: "0 3px 0px #595BCF"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BringToFront, { className: "w-4 h-4 text-white" }),
              "Lên trên"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onSendBackward,
            className: "h-11 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-0.5",
            style: {
              backgroundColor: "#1FA7E1",
              boxShadow: "0 3px 0px #168BC0"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SendToBack, { className: "w-4 h-4 text-white" }),
              "Xuống dưới"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-slate-200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onDelete,
        className: "w-full h-11 rounded-xl text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:translate-y-0.5 transition-all",
        style: {
          backgroundColor: "#FF8B8B",
          boxShadow: "0 3.5px 0px #E06D6D"
        },
        "aria-label": "Xóa phần tử",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-white" }),
          "Xóa phần tử này"
        ]
      }
    )
  ] });
}
function CanvasEditor() {
  const [activeTab, setActiveTab] = reactExports.useState("templates");
  const [docTitle, setDocTitle] = reactExports.useState("Giáo án trực quan cho bé");
  const [userRole, setUserRole] = reactExports.useState("parent");
  const [isPremiumUser, setIsPremiumUser] = reactExports.useState(false);
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const [savingTemplate, setSavingTemplate] = reactExports.useState(false);
  const [exportingFile, setExportingFile] = reactExports.useState(false);
  const [templateName, setTemplateName] = reactExports.useState("");
  const [showUpgradeModal, setShowUpgradeModal] = reactExports.useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const {
    canvasRef,
    canvasInstance,
    activeObject,
    addText,
    addRect,
    addCircle,
    addStar,
    addHeart,
    addSticker,
    addPecsTemplate,
    addFlashcardTemplate,
    addScheduleTemplate,
    addImage,
    setFillColor,
    setStrokeColor,
    setFontFamily,
    setCanvasBackground,
    deleteActive,
    clearCanvas,
    bringForward,
    sendBackward
  } = useFabric(800, 560);
  reactExports.useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (user) {
          const metadataRole = user.user_metadata?.role;
          const metadataPremium = user.user_metadata?.is_premium;
          const { data: profile } = await supabase.from("profiles").select("role, is_premium").eq("id", user.id).maybeSingle();
          const currentRole = (profile?.role || metadataRole || "parent").toLowerCase();
          const isPremiumVal = !!(profile?.is_premium || metadataPremium);
          setUserRole(currentRole);
          setIsPremiumUser(isPremiumVal);
        } else {
          const savedRole = localStorage.getItem("bino_simulated_role") || "teacher";
          setUserRole(savedRole);
          setIsPremiumUser(savedRole === "premium" || savedRole === "teacher");
        }
      } catch (err) {
        console.error("Error loading user role:", err);
      }
    };
    fetchUserRole();
  }, []);
  const handleSimulateRole = (newRole) => {
    setUserRole(newRole);
    const isPrem = newRole === "premium" || newRole === "teacher";
    setIsPremiumUser(isPrem);
    localStorage.setItem("bino_simulated_role", newRole);
    toast.success(`Đã mô phỏng quyền: ${getRoleLabel(newRole)}`);
  };
  const getRoleLabel = (role) => {
    switch (role) {
      case "teacher":
        return "Giáo viên (Được xuất file)";
      case "premium":
        return "Thành viên Premium";
      default:
        return "Phụ huynh (Miễn phí)";
    }
  };
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const toastId = toast.loading("Đang xử lý tải ảnh lên...");
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;
      const { data, error } = await supabase.storage.from("lesson-materials").upload(filePath, file);
      let finalUrl = "";
      if (error) {
        console.warn("Storage upload fallback to base64:", error.message);
        finalUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        toast.info("Đã nạp ảnh trực tiếp vào canvas.", { id: toastId });
      } else {
        const {
          data: { publicUrl }
        } = supabase.storage.from("lesson-materials").getPublicUrl(filePath);
        finalUrl = publicUrl;
        toast.success("Tải ảnh lên Supabase thành công!", { id: toastId });
      }
      if (finalUrl) {
        await addImage(finalUrl);
      }
    } catch (err) {
      console.error("Image upload/embed failed:", err);
      toast.error(`Lỗi tải ảnh: ${err.message || err}`, { id: toastId });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !canvasInstance) return;
    setSavingTemplate(true);
    const toastId = toast.loading("Đang lưu giáo án...");
    try {
      const canvasJson = canvasInstance.toJSON();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const { error } = await supabase.from("lesson_templates").insert([
        {
          name: templateName.trim(),
          content: canvasJson,
          user_id: user?.id || null
        }
      ]);
      if (error) {
        const localTemplates = JSON.parse(
          localStorage.getItem("bino_local_templates") || "[]"
        );
        localTemplates.push({
          id: Date.now().toString(),
          name: templateName.trim(),
          content: canvasJson,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        localStorage.setItem(
          "bino_local_templates",
          JSON.stringify(localTemplates)
        );
        toast.info(`Đã lưu template "${templateName}" vào trình duyệt.`, {
          id: toastId
        });
      } else {
        toast.success(`Đã lưu template "${templateName}" lên Supabase!`, {
          id: toastId
        });
      }
      setShowSaveTemplateModal(false);
      setTemplateName("");
    } catch (err) {
      console.error("Save template failed:", err);
      toast.error(`Không thể lưu template: ${err.message || err}`, {
        id: toastId
      });
    } finally {
      setSavingTemplate(false);
    }
  };
  const handleExport = async (format) => {
    if (!canvasInstance) return;
    const isAuthorized = userRole === "teacher" || userRole === "premium" || isPremiumUser;
    if (!isAuthorized) {
      setShowUpgradeModal(true);
      return;
    }
    setExportingFile(true);
    const toastId = toast.loading(`Đang xuất file ${format.toUpperCase()}...`);
    setTimeout(async () => {
      try {
        if (format === "png" || format === "jpg") {
          const dataUrl = canvasInstance.toDataURL({
            format: format === "png" ? "png" : "jpeg",
            quality: 1,
            multiplier: 2
          });
          const downloadLink = document.createElement("a");
          downloadLink.download = `${docTitle.trim().replace(/\s+/g, "_") || "bino_lesson"}.${format}`;
          downloadLink.href = dataUrl;
          downloadLink.click();
          toast.success(`Đã xuất ảnh ${format.toUpperCase()} độ nét cao!`, {
            id: toastId
          });
        } else if (format === "pdf") {
          const { jsPDF } = await import("../_libs/jspdf.mjs").then(function(n) {
            return n.j;
          });
          const dataUrl = canvasInstance.toDataURL({
            format: "png",
            quality: 1,
            multiplier: 3.75
          });
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
          });
          pdf.addImage(dataUrl, "PNG", 0, 0, 297, 210);
          pdf.save(
            `${docTitle.trim().replace(/\s+/g, "_") || "bino_lesson"}.pdf`
          );
          toast.success("Đã xuất tài liệu PDF chuẩn in A4 300 DPI thành công!", {
            id: toastId
          });
        }
      } catch (err) {
        console.error("Export process failed:", err);
        toast.error(`Xuất file thất bại: ${err.message || err}`, {
          id: toastId
        });
      } finally {
        setExportingFile(false);
      }
    }, 150);
  };
  const TABS_CONFIG = [
    {
      id: "templates",
      hex: "#9956DE",
      shadow: "#7D3EC0",
      label: "Mẫu bài",
      icon: LayoutTemplate
    },
    {
      id: "text",
      hex: "#7274ED",
      shadow: "#595BCF",
      label: "Văn bản",
      icon: Type
    },
    {
      id: "shapes",
      hex: "#1FA7E1",
      shadow: "#168BC0",
      label: "Hình khối",
      icon: Shapes
    },
    {
      id: "media",
      hex: "#6ED1CF",
      shadow: "#4BB3B1",
      label: "Tải ảnh",
      icon: Image
    },
    {
      id: "stickers",
      hex: "#75D06A",
      shadow: "#59B84E",
      label: "Nhãn dán",
      icon: Smile
    },
    {
      id: "frames",
      hex: "#FFB365",
      shadow: "#E59845",
      label: "Khung thẻ",
      icon: Frame
    },
    {
      id: "palette",
      hex: "#FF8B8B",
      shadow: "#E06D6D",
      label: "Bảng màu",
      icon: Palette
    },
    {
      id: "canvas",
      hex: "#FB96BB",
      shadow: "#DC779D",
      label: "Màu nền",
      icon: Sparkles
    }
  ];
  const currentTabInfo = TABS_CONFIG.find((t) => t.id === activeTab) || TABS_CONFIG[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-[#F8FAFC]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        onChange: handleImageFileChange,
        accept: "image/*",
        className: "hidden"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto h-16 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/",
            className: "w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer",
            "aria-label": "Quay về trang chủ",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6 bg-slate-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "w-9 h-9 rounded-xl text-white grid place-items-center shadow-sm",
              style: { background: "linear-gradient(135deg, #9956DE 0%, #1FA7E1 100%)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-white" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-extrabold text-slate-900 leading-tight", children: "Lesson Builder Studio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold text-slate-500", children: "Thiết kế giáo án can thiệp & mầm non" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center justify-center flex-1 max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: docTitle,
          onChange: (e) => setDocTitle(e.target.value),
          className: "w-full text-center text-sm font-bold text-slate-800 bg-slate-100/70 hover:bg-slate-100 focus:bg-white px-4 py-2 rounded-xl border border-transparent focus:border-[#7274ED] outline-none transition-all",
          placeholder: "Nhập tên giáo án..."
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center gap-2 shadow-xs bg-slate-50 border-slate-200 text-slate-800",
              "aria-label": "Đổi vai trò mô phỏng",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2.5 h-2.5 rounded-full",
                    style: {
                      backgroundColor: userRole === "teacher" ? "#75D06A" : userRole === "premium" ? "#1FA7E1" : "#FF8B8B"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Quyền: ",
                  userRole === "teacher" ? "Giáo viên" : userRole === "premium" ? "Premium" : "Phụ huynh"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 opacity-70" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            PopoverContent,
            {
              className: "w-56 p-2 rounded-2xl border-2 border-slate-200 shadow-xl bg-white",
              align: "end",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1", children: "Mô phỏng tài khoản" }),
                [
                  { value: "teacher", label: "Giáo viên (Được xuất file)", desc: "Quyền cao nhất" },
                  { value: "premium", label: "Thành viên Premium", desc: "Được xuất file" },
                  { value: "parent", label: "Phụ huynh (Miễn phí)", desc: "Xem & thiết kế" }
                ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleSimulateRole(r.value),
                    className: `w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex flex-col ${userRole === r.value ? "bg-purple-50 font-bold text-[#9956DE]" : "text-slate-700 hover:bg-slate-100"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: r.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: r.desc })
                    ]
                  },
                  r.value
                ))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => setShowSaveTemplateModal(true),
            disabled: savingTemplate || !canvasInstance,
            variant: "outline",
            className: "h-9 px-3.5 rounded-xl text-xs font-bold text-[#7274ED] bg-purple-50/50 hover:bg-purple-100 border-2 border-[#7274ED]/30 transition-all cursor-pointer",
            children: "Lưu Template"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              disabled: exportingFile || !canvasInstance,
              className: "h-9 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer border-none flex items-center gap-1.5",
              style: {
                backgroundColor: "#7274ED",
                boxShadow: "0 3px 0px #595BCF"
              },
              children: exportingFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin text-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Đang xuất..." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 text-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Xuất File" })
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            PopoverContent,
            {
              className: "w-56 p-2 rounded-2xl border-2 border-slate-200 shadow-xl bg-white",
              align: "end",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1", children: "Định dạng xuất chất lượng cao" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleExport("png"),
                    className: "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-purple-50 hover:text-[#9956DE] cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ảnh PNG (Chất lượng 2x)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-purple-100 text-[#9956DE] px-1.5 py-0.5 rounded font-mono font-bold", children: "PNG" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleExport("jpg"),
                    className: "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1FA7E1] cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ảnh JPG (Tối ưu dung lượng)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-blue-100 text-[#1FA7E1] px-1.5 py-0.5 rounded font-mono font-bold", children: "JPG" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleExport("pdf"),
                    className: "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#059669] cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tài liệu PDF (Chuẩn in A4 300 DPI)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold", children: "PDF" })
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 max-w-[1460px] w-full mx-auto flex items-start justify-center gap-5 p-4 sm:p-6 overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-[340px] shrink-0 bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-4 flex flex-col gap-3.5 sticky top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-slate-800 uppercase tracking-wider", children: "Các thanh công cụ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full", children: "8 công cụ" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: TABS_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab(tab.id),
              className: `
                    relative flex flex-col items-center justify-center h-[58px] rounded-2xl transition-all duration-150 cursor-pointer select-none
                    ${isActive ? "ring-3 ring-slate-900 ring-offset-2 scale-105 z-10 shadow-md translate-y-[-1px]" : "hover:scale-102 hover:brightness-105 active:translate-y-0.5"}
                  `,
              style: {
                backgroundColor: tab.hex,
                boxShadow: isActive ? `0 5px 12px ${tab.hex}66, 0 3px 0px ${tab.shadow}` : `0 3.5px 0px ${tab.shadow}`,
                transform: isActive ? "scale(1.05) translateY(-1px)" : "none"
              },
              title: tab.label,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-white mb-0.5 shrink-0 drop-shadow-xs", strokeWidth: 2.4 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-extrabold text-white text-center leading-tight truncate px-1 w-full drop-shadow-xs", children: tab.label })
              ]
            },
            tab.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-slate-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-[340px]", children: [
          activeTab === "templates" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#9956DE" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutTemplate, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "MẪU GIÁO ÁN CAN THIỆP 1-CHẠM" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: addPecsTemplate,
                  className: "w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#9956DE",
                    boxShadow: "0 3.5px 0px #7D3EC0"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-white/25 text-white grid place-items-center font-bold text-lg shrink-0 shadow-2xs", children: "🗂️" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-white truncate", children: "Thẻ PECS Giao tiếp" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/90 truncate font-medium", children: "Khung viền + ô ảnh + nhãn chữ chuẩn" })
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: addFlashcardTemplate,
                  className: "w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#FFB365",
                    boxShadow: "0 3.5px 0px #E59845"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-white/25 text-white grid place-items-center font-bold text-lg shrink-0 shadow-2xs", children: "🔤" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-white truncate", children: "Flashcard Từ vựng" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/90 truncate font-medium", children: "Thẻ học từ mới kèm tranh minh họa" })
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: addScheduleTemplate,
                  className: "w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#1FA7E1",
                    boxShadow: "0 3.5px 0px #168BC0"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-white/25 text-white grid place-items-center font-bold text-lg shrink-0 shadow-2xs", children: "📅" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-white truncate", children: "Lịch trình 3 bước" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/90 truncate font-medium", children: "Quy trình hình ảnh Sáng - Trưa - Tối" })
                    ] })
                  ] })
                }
              )
            ] })
          ] }),
          activeTab === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#7274ED" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "CHÈN VĂN BẢN VÀO BÀI HỌC" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => addText("TIÊU ĐỀ BÀI HỌC", 32, "bold"),
                  className: "w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#7274ED",
                    boxShadow: "0 3.5px 0px #595BCF"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-extrabold text-white", children: "Tiêu đề lớn (32px)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white bg-white/25 px-2 py-0.5 rounded-md", children: "Chữ Đậm" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => addText("Tiêu đề phụ hướng dẫn", 22, 600),
                  className: "w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#1FA7E1",
                    boxShadow: "0 3.5px 0px #168BC0"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-extrabold text-white", children: "Tiêu đề phụ (22px)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white bg-white/25 px-2 py-0.5 rounded-md", children: "Chữ Vừa" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => addText("Nội dung mô tả hoặc câu hỏi cho trẻ...", 16, "normal"),
                  className: "w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#6ED1CF",
                    boxShadow: "0 3.5px 0px #4BB3B1"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Đoạn văn bản thường (16px)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white bg-white/25 px-2 py-0.5 rounded-md", children: "Chữ Nhỏ" })
                  ]
                }
              )
            ] })
          ] }),
          activeTab === "shapes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#1FA7E1" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shapes, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "HÌNH KHỐI HỌC TẬP" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: addRect,
                  className: "p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#1FA7E1",
                    boxShadow: "0 3.5px 0px #168BC0"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-7 h-7 text-white", strokeWidth: 2.4 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Hình chữ nhật" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: addCircle,
                  className: "p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#6ED1CF",
                    boxShadow: "0 3.5px 0px #4BB3B1"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-7 h-7 text-white", strokeWidth: 2.4 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Hình tròn" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: addStar,
                  className: "p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#FFB365",
                    boxShadow: "0 3.5px 0px #E59845"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-7 h-7 text-white fill-white", strokeWidth: 2 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Ngôi sao thưởng" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: addHeart,
                  className: "p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#FF8B8B",
                    boxShadow: "0 3.5px 0px #E06D6D"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-7 h-7 text-white fill-white", strokeWidth: 2 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Trái tim khen" })
                  ]
                }
              )
            ] })
          ] }),
          activeTab === "media" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#6ED1CF" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "TẢI HÌNH ẢNH HỌC LIỆU" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: triggerFileSelect,
                disabled: uploadingImage,
                className: "w-full h-12 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:translate-y-0.5 transition-all",
                style: {
                  backgroundColor: "#6ED1CF",
                  boxShadow: "0 3.5px 0px #4BB3B1"
                },
                children: [
                  uploadingImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-extrabold", children: uploadingImage ? "Đang nạp ảnh..." : "Tải ảnh từ máy tính" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-3.5 rounded-2xl text-white shadow-xs leading-relaxed",
                style: {
                  backgroundColor: "#7274ED",
                  boxShadow: "0 3px 0px #595BCF"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-extrabold text-white text-xs mb-1", children: "💡 Hướng dẫn chọn ảnh:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/90 font-medium", children: "Nên chọn ảnh thực tế rõ nét hoặc ảnh PNG nền trong suốt để trẻ tập trung tốt nhất." })
                ]
              }
            )
          ] }),
          activeTab === "stickers" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#75D06A" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "NHÃN DÁN STICKER MẦM NON" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 p-2 rounded-2xl bg-slate-100/90 border border-slate-200", children: QUICK_STICKERS.map((stk) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => addSticker(stk.emoji),
                className: "h-12 rounded-xl text-2xl flex items-center justify-center transition-all hover:scale-110 active:translate-y-0.5 cursor-pointer shadow-xs",
                style: {
                  backgroundColor: stk.color,
                  boxShadow: `0 3px 0px ${stk.shadow}`
                },
                title: stk.name,
                children: stk.emoji
              },
              stk.emoji
            )) })
          ] }),
          activeTab === "frames" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#FFB365" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Frame, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "KHUNG THẺ HỌC LIỆU" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: addRect,
                  className: "w-full p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#FFB365",
                    boxShadow: "0 3.5px 0px #E59845"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Khung thẻ chữ nhật chuẩn" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-white/30 text-white font-mono font-bold px-2 py-0.5 rounded", children: "140 × 100" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: addCircle,
                  className: "w-full p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5",
                  style: {
                    backgroundColor: "#75D06A",
                    boxShadow: "0 3.5px 0px #59B84E"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white", children: "Huy hiệu tròn điểm thưởng" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-white/30 text-white font-mono font-bold px-2 py-0.5 rounded", children: "R = 55" })
                  ]
                }
              )
            ] })
          ] }),
          activeTab === "palette" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#FF8B8B" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "BẢNG 8 MÀU CHUẨN BINO" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: BINO_PALETTE.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  if (activeObject) {
                    setFillColor(c.hex);
                    toast.success(`Đã đổi màu sang ${c.label}`);
                  } else {
                    toast.info("Vui lòng nhấp chọn 1 phần tử trên canvas trước!");
                  }
                },
                className: "p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-xs active:translate-y-0.5",
                style: {
                  backgroundColor: c.hex,
                  boxShadow: `0 3px 0px ${c.shadow}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-white truncate drop-shadow-xs", children: c.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full bg-white shadow-2xs shrink-0" })
                ]
              },
              c.id
            )) })
          ] }),
          activeTab === "canvas" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs",
                style: { backgroundColor: "#FB96BB" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider", children: "MÀU NỀN TRANG THIẾT KẾ" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [
              { color: "#FFFFFF", name: "Trắng tinh", shadow: "#CBD5E1", isWhite: true },
              { color: "#6ED1CF", name: "Nền Xanh ngọc", shadow: "#4BB3B1" },
              { color: "#75D06A", name: "Nền Xanh lá", shadow: "#59B84E" },
              { color: "#FFB365", name: "Nền Cam vàng", shadow: "#E59845" },
              { color: "#FF8B8B", name: "Nền Đỏ hồng", shadow: "#E06D6D" },
              { color: "#FB96BB", name: "Nền Hồng phấn", shadow: "#DC779D" },
              { color: "#1FA7E1", name: "Nền Xanh biển", shadow: "#168BC0" },
              { color: "#9956DE", name: "Nền Tím nhạt", shadow: "#7D3EC0" }
            ].map((bg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setCanvasBackground(bg.color),
                className: "p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5",
                style: {
                  backgroundColor: bg.color,
                  boxShadow: `0 3px 0px ${bg.shadow}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs font-extrabold truncate ${bg.isWhite ? "text-slate-800" : "text-white drop-shadow-xs"}`,
                      children: bg.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-3.5 h-3.5 rounded-full shrink-0 ${bg.isWhite ? "border-2 border-slate-400" : "bg-white/80"}`
                    }
                  )
                ]
              },
              bg.color
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-slate-200 my-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: clearCanvas,
                className: "w-full h-11 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-0.5",
                style: {
                  backgroundColor: "#7274ED",
                  boxShadow: "0 3px 0px #595BCF"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-white" }),
                  "Đặt lại trang về màu trắng"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex flex-col items-center gap-3 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[804px] flex items-center justify-between px-3.5 py-2 bg-white rounded-2xl border border-slate-200 shadow-2xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "px-2.5 py-1 rounded-lg text-white text-xs font-extrabold shadow-xs",
                style: { backgroundColor: currentTabInfo.hex },
                children: "📐 800 × 560 px"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-700", children: [
              "Đang mở: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-950 font-extrabold", children: currentTabInfo.label })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: bringForward,
                disabled: !activeObject,
                className: "h-8 px-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40",
                style: {
                  backgroundColor: "#7274ED",
                  boxShadow: "0 2px 0px #595BCF"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BringToFront, { className: "w-3.5 h-3.5 text-white" }),
                  "Lên trước"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: sendBackward,
                disabled: !activeObject,
                className: "h-8 px-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40",
                style: {
                  backgroundColor: "#1FA7E1",
                  boxShadow: "0 2px 0px #168BC0"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SendToBack, { className: "w-3.5 h-3.5 text-white" }),
                  "Xuống sau"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-4 bg-slate-200 mx-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: clearCanvas,
                className: "h-8 px-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all",
                style: {
                  backgroundColor: "#FF8B8B",
                  boxShadow: "0 2px 0px #E06D6D"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-white" }),
                  "Xóa hết"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-2 border-slate-300 bg-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#9956DE]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#1FA7E1]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#FF8B8B]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#75D06A]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, id: "lesson-builder-canvas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-500 text-center", children: "💡 Nhấp vào phần tử để chọn • Kéo thả để di chuyển • Kéo các góc vuông để phóng to/thu nhỏ" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-[280px] shrink-0 sticky top-24", children: activeObject ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-3xl bg-white shadow-sm border-2 border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PropertiesPanel,
        {
          activeObject,
          onSetFill: setFillColor,
          onSetStroke: setStrokeColor,
          onSetFont: setFontFamily,
          onDelete: deleteActive,
          onBringForward: bringForward,
          onSendBackward: sendBackward
        }
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2.5 p-3 rounded-2xl shadow-xs",
            style: {
              backgroundColor: "#7274ED",
              boxShadow: "0 3.5px 0px #595BCF"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-white/20 text-white grid place-items-center shadow-xs shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "w-5 h-5 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-white uppercase tracking-wider leading-tight", children: "MẸO THIẾT KẾ GIÁO ÁN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/80 font-medium", children: "Trẻ mầm non & can thiệp" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102",
              style: {
                backgroundColor: "#9956DE",
                boxShadow: "0 3px 0px #7D3EC0"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-extrabold text-white text-xs mb-1 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🎯" }),
                  " Trực quan hóa hình ảnh"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/95 text-[11px] font-medium leading-relaxed", children: "Sử dụng thẻ PECS hoặc hình vẽ to rõ kết hợp chữ in hoa để trẻ dễ nhận diện." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102",
              style: {
                backgroundColor: "#1FA7E1",
                boxShadow: "0 3px 0px #168BC0"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-extrabold text-white text-xs mb-1 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🌈" }),
                  " Màu sắc tương phản"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/95 text-[11px] font-medium leading-relaxed", children: "Chọn đường viền đậm cho thẻ để tạo ranh giới thị giác rõ ràng cho trẻ có giảm chú ý." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102",
              style: {
                backgroundColor: "#75D06A",
                boxShadow: "0 3px 0px #59B84E"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-extrabold text-white text-xs mb-1 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔤" }),
                  " Font chữ mộc mạc"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/95 text-[11px] font-medium leading-relaxed", children: [
                  "Nên dùng font ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Inter" }),
                  " hoặc ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Roboto" }),
                  " để chữ tròn trịa, không bị rối mắt."
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102",
              style: {
                backgroundColor: "#FF8B8B",
                boxShadow: "0 3px 0px #E06D6D"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-extrabold text-white text-xs mb-1 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🖨️" }),
                  " In ấn chất lượng cao"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/95 text-[11px] font-medium leading-relaxed", children: [
                  "Dùng nút ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Xuất File PDF (300 DPI)" }),
                  " để bài in sắc nét trên máy in nhiệt hoặc máy in màu."
                ] })
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    showUpgradeModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-rose-200 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-rose-100 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6 text-[#FF8B8B]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-slate-900", children: "Nâng cấp quyền xuất file" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-600 leading-relaxed", children: [
          "Chức năng xuất thiết kế học liệu (PNG, JPG, PDF 300 DPI) chỉ dành riêng cho tài khoản ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Giáo viên" }),
          " hoặc ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Premium" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 flex gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowUpgradeModal(false),
            className: "flex-1 h-10 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer font-bold text-xs",
            children: "Để sau"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/create-child",
            onClick: () => setShowUpgradeModal(false),
            className: "flex-1 h-10 bg-[#7274ED] text-white font-bold rounded-xl flex items-center justify-center hover:opacity-90 transition-all text-xs text-center border-none shadow-sm cursor-pointer",
            children: "Nâng cấp ngay"
          }
        )
      ] })
    ] }) }),
    showSaveTemplateModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-purple-200 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-purple-100 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shapes, { className: "w-6 h-6 text-[#9956DE]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-slate-900", children: "Lưu Template thiết kế" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600", children: "Nhập tên để lưu bài học này vào thư viện cá nhân của bạn." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Ví dụ: Thẻ nhận biết quả táo cho bé",
          value: templateName,
          onChange: (e) => setTemplateName(e.target.value),
          className: "w-full h-11 px-3.5 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-[#9956DE] text-xs font-semibold text-slate-900 bg-white transition-colors",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 flex gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowSaveTemplateModal(false),
            className: "flex-1 h-10 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer font-bold text-xs",
            children: "Hủy"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleSaveTemplate,
            disabled: !templateName.trim() || savingTemplate,
            className: "flex-1 h-10 bg-[#9956DE] hover:opacity-90 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm",
            children: savingTemplate ? "Đang lưu..." : "Lưu Template"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  BINO_PALETTE,
  CanvasEditor as default
};
