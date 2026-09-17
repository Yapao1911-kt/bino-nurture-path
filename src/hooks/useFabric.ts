// ============================================================
// useFabric — Custom Hook quản lý Fabric.js Canvas
// File: src/hooks/useFabric.ts
//
// Mô tả: Hook tách biệt toàn bộ logic Fabric.js khỏi UI,
//         quản lý vòng đời canvas, thao tác thêm/sửa phần tử,
//         và theo dõi trạng thái active object.
//
// Kiến trúc:
//   - canvasRef: ref HTML <canvas> element
//   - fabricRef: ref Fabric.Canvas instance (không trigger re-render)
//   - activeObject: React state cho object đang chọn (trigger re-render UI)
// ============================================================

import { useRef, useState, useEffect, useCallback } from "react";
import type { Canvas as FabricCanvas, FabricObject } from "fabric";

// -------------------------------------------------------
// Kiểu dữ liệu mô tả active object để UI đọc
// (tránh expose trực tiếp FabricObject ra ngoài hook)
// -------------------------------------------------------
export interface ActiveObjectInfo {
  /** Kiểu phần tử: "i-text" | "rect" | "circle" | ... */
  type: string;
  /** Màu fill hiện tại */
  fill: string;
  /** Màu stroke hiện tại */
  stroke: string;
  /** Font family (chỉ có ở Text) */
  fontFamily?: string;
}

// -------------------------------------------------------
// Kiểu trả về của hook
// -------------------------------------------------------
export interface UseFabricReturn {
  /** Ref gắn vào <canvas> element trong JSX */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Instance của Fabric Canvas để gọi các hàm nâng cao (JSON, Image export...) */
  canvasInstance: FabricCanvas | null;
  /** Thông tin active object (null nếu không chọn gì) */
  activeObject: ActiveObjectInfo | null;
  /** Thêm Text vào canvas */
  addText: (customText?: string, fontSize?: number, fontWeight?: string | number) => void;
  /** Thêm hình chữ nhật */
  addRect: () => void;
  /** Thêm hình tròn */
  addCircle: () => void;
  /** Thêm hình ngôi sao khen thưởng 5 cánh */
  addStar: () => void;
  /** Thêm hình trái tim yêu thương */
  addHeart: () => void;
  /** Thêm nhãn dán sticker / emoji */
  addSticker: (emoji: string) => void;
  /** Chèn mẫu giáo án thẻ PECS */
  addPecsTemplate: () => void;
  /** Chèn mẫu giáo án thẻ Flashcard */
  addFlashcardTemplate: () => void;
  /** Chèn mẫu lịch trình trực quan */
  addScheduleTemplate: () => void;
  /** Thêm hình ảnh */
  addImage: (url: string) => Promise<void>;
  /** Đổi fill color cho active object */
  setFillColor: (color: string) => void;
  /** Đổi stroke color cho active object */
  setStrokeColor: (color: string) => void;
  /** Đổi font family cho active text */
  setFontFamily: (font: string) => void;
  /** Đổi màu nền canvas */
  setCanvasBackground: (color: string) => void;
  /** Xóa active object */
  deleteActive: () => void;
  /** Xóa trắng canvas */
  clearCanvas: () => void;
  /** Đưa phần tử lên lớp trên */
  bringForward: () => void;
  /** Đưa phần tử xuống lớp dưới */
  sendBackward: () => void;
}

// ============================================================
// HOOK CHÍNH
// ============================================================
export function useFabric(width: number = 800, height: number = 560): UseFabricReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const [canvasInstance, setCanvasInstance] = useState<FabricCanvas | null>(null);

  // State cho active object — chỉ lưu thông tin serializable
  // để React có thể so sánh và trigger re-render khi cần
  const [activeObject, setActiveObject] = useState<ActiveObjectInfo | null>(null);

  // -------------------------------------------------------
  // Hàm đọc thông tin từ FabricObject → ActiveObjectInfo
  // -------------------------------------------------------
  const extractInfo = useCallback(
    (obj: FabricObject | null | undefined): ActiveObjectInfo | null => {
      if (!obj) return null;
      return {
        type: obj.type ?? "unknown",
        fill: typeof obj.fill === "string" ? obj.fill : "#000000",
        stroke: typeof obj.stroke === "string" ? obj.stroke : "",
        fontFamily: (obj as unknown as Record<string, unknown>).fontFamily as string | undefined,
      };
    },
    [],
  );

  // -------------------------------------------------------
  // Khởi tạo Canvas + Event listeners
  // -------------------------------------------------------
  useEffect(() => {
    // Fabric.js sử dụng browser APIs (Canvas2D), chỉ chạy phía client
    if (typeof window === "undefined") return;

    let canvas: FabricCanvas | null = null;

    // Dynamic import để tránh lỗi SSR (TanStack Start render server-side)
    const initCanvas = async () => {
      const fabric = await import("fabric");

      if (!canvasRef.current) return;

      canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#FFFFFF",
        // Cấu hình control points bo tròn, thân thiện
        selectionColor: "rgba(142, 205, 248, 0.15)",
        selectionBorderColor: "#8ECDF8",
        selectionLineWidth: 1.5,
      });

      fabricRef.current = canvas;
      setCanvasInstance(canvas);

      // --- Event: Khi người dùng chọn object ---
      canvas.on("selection:created", () => {
        setActiveObject(extractInfo(canvas?.getActiveObject()));
      });

      // --- Event: Khi đổi sang object khác ---
      canvas.on("selection:updated", () => {
        setActiveObject(extractInfo(canvas?.getActiveObject()));
      });

      // --- Event: Khi bỏ chọn ---
      canvas.on("selection:cleared", () => {
        setActiveObject(null);
      });

      // --- Event: Khi object bị modify (scale, move) ---
      canvas.on("object:modified", () => {
        setActiveObject(extractInfo(canvas?.getActiveObject()));
      });
    };

    initCanvas();

    // Cleanup: hủy canvas khi unmount để tránh memory leak
    return () => {
      canvas?.dispose();
      fabricRef.current = null;
      setCanvasInstance(null);
    };
  }, [width, height, extractInfo]);

  // -------------------------------------------------------
  // Hàm tiện ích: tính vị trí ngẫu nhiên trong canvas
  // để object mới không bị chồng lên nhau
  // -------------------------------------------------------
  const randomPosition = useCallback(() => {
    return {
      left: 80 + Math.random() * (width - 240),
      top: 60 + Math.random() * (height - 200),
    };
  }, [width, height]);

  // -------------------------------------------------------
  // INSERT: Thêm Text (IText — có thể edit trực tiếp trên canvas)
  // -------------------------------------------------------
  const addText = useCallback(
    async (
      customText?: string,
      fontSize: number = 24,
      fontWeight: string | number = "normal"
    ) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const fabric = await import("fabric");
      const pos = randomPosition();

      const text = new fabric.IText(customText || "Nhập văn bản...", {
        left: pos.left,
        top: pos.top,
        fontFamily: "Inter",
        fontSize,
        fontWeight: fontWeight as any,
        fill: "#1E293B",
        // Cấu hình control points rõ nét
        cornerColor: "#2563EB",
        cornerStyle: "circle",
        cornerSize: 8,
        transparentCorners: false,
        borderColor: "#2563EB",
        borderScaleFactor: 1.5,
        padding: 8,
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      setActiveObject(extractInfo(text));
    },
    [randomPosition, extractInfo]
  );

  // -------------------------------------------------------
  // INSERT: Thêm hình chữ nhật (Rect)
  // -------------------------------------------------------
  const addRect = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");
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
      borderScaleFactor: 1.5,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    setActiveObject(extractInfo(rect));
  }, [randomPosition, extractInfo]);

  // -------------------------------------------------------
  // INSERT: Thêm hình tròn (Circle)
  // -------------------------------------------------------
  const addCircle = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");
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
      borderScaleFactor: 1.5,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    setActiveObject(extractInfo(circle));
  }, [randomPosition, extractInfo]);

  // -------------------------------------------------------
  // INSERT: Thêm hình ảnh (Image)
  // -------------------------------------------------------
  const addImage = useCallback(
    async (url: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const fabric = await import("fabric");
      const pos = randomPosition();

      try {
        const img = await fabric.Image.fromURL(url, {
          crossOrigin: "anonymous",
        });

        // Giới hạn kích thước tối đa (300px) để không tràn canvas
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
          borderScaleFactor: 1.5,
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
    [randomPosition, extractInfo],
  );

  // -------------------------------------------------------
  // EDIT: Đổi fill color cho active object
  // -------------------------------------------------------
  const setFillColor = useCallback(
    (color: string) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !obj) return;

      obj.set("fill", color);
      canvas.renderAll();
      setActiveObject(extractInfo(obj));
    },
    [extractInfo],
  );

  // -------------------------------------------------------
  // EDIT: Đổi stroke color cho active object
  // -------------------------------------------------------
  const setStrokeColor = useCallback(
    (color: string) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !obj) return;

      obj.set("stroke", color);
      // Đảm bảo stroke hiển thị nếu chưa có strokeWidth
      if (!obj.strokeWidth || obj.strokeWidth === 0) {
        obj.set("strokeWidth", 2);
      }
      canvas.renderAll();
      setActiveObject(extractInfo(obj));
    },
    [extractInfo],
  );

  // -------------------------------------------------------
  // EDIT: Đổi font family cho active text
  // -------------------------------------------------------
  const setFontFamily = useCallback(
    (font: string) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !obj) return;

      // Chỉ áp dụng cho IText
      if (obj.type === "i-text" || obj.type === "textbox") {
        (obj as unknown as Record<string, unknown>).fontFamily = font;
        canvas.renderAll();
        setActiveObject(extractInfo(obj));
      }
    },
    [extractInfo],
  );

  // -------------------------------------------------------
  // INSERT: Thêm hình ngôi sao khen thưởng 5 cánh
  // -------------------------------------------------------
  const addStar = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");
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
      { x: 37, y: 35 },
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
      borderScaleFactor: 1.5,
    });

    canvas.add(star);
    canvas.setActiveObject(star);
    canvas.renderAll();
    setActiveObject(extractInfo(star));
  }, [randomPosition, extractInfo]);

  // -------------------------------------------------------
  // INSERT: Thêm hình trái tim yêu thương
  // -------------------------------------------------------
  const addHeart = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");
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
      borderScaleFactor: 1.5,
    });

    canvas.add(heart);
    canvas.setActiveObject(heart);
    canvas.renderAll();
    setActiveObject(extractInfo(heart));
  }, [randomPosition, extractInfo]);

  // -------------------------------------------------------
  // INSERT: Thêm Sticker / Emoji mầm non
  // -------------------------------------------------------
  const addSticker = useCallback(async (emoji: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");
    const pos = randomPosition();

    const text = new fabric.IText(emoji, {
      left: pos.left,
      top: pos.top,
      fontSize: 60,
      cornerColor: "#2563EB",
      cornerStyle: "circle",
      cornerSize: 8,
      transparentCorners: false,
      borderColor: "#2563EB",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setActiveObject(extractInfo(text));
  }, [randomPosition, extractInfo]);

  // -------------------------------------------------------
  // TEMPLATE: Mẫu thẻ giao tiếp PECS
  // -------------------------------------------------------
  const addPecsTemplate = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");

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
      cornerStyle: "circle",
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
      ry: 16,
    });

    const iconText = new fabric.IText("🍎", {
      left: 360,
      top: 150,
      fontSize: 80,
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
      ry: 14,
    });

    const textLabel = new fabric.IText("QUẢ TÁO", {
      left: 320,
      top: 365,
      fontFamily: "Inter",
      fontSize: 26,
      fontWeight: "bold",
      fill: "#1E3A8A",
    });

    canvas.add(card, imageBox, iconText, labelBox, textLabel);
    canvas.renderAll();
  }, []);

  // -------------------------------------------------------
  // TEMPLATE: Mẫu thẻ Flashcard học từ vựng
  // -------------------------------------------------------
  const addFlashcardTemplate = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");

    const card = new fabric.Rect({
      left: 200,
      top: 80,
      width: 400,
      height: 360,
      fill: "#FFFBEB",
      stroke: "#D97706",
      strokeWidth: 4,
      rx: 24,
      ry: 24,
    });

    const title = new fabric.IText("TỪ VỰNG HÔM NAY", {
      left: 300,
      top: 110,
      fontFamily: "Inter",
      fontSize: 18,
      fontWeight: "bold",
      fill: "#B45309",
    });

    const icon = new fabric.IText("⭐", {
      left: 360,
      top: 160,
      fontSize: 84,
    });

    const word = new fabric.IText("NGÔI SAO", {
      left: 310,
      top: 290,
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: "bold",
      fill: "#78350F",
    });

    const sub = new fabric.IText("Bầu trời đêm lấp lánh", {
      left: 315,
      top: 350,
      fontFamily: "Inter",
      fontSize: 16,
      fill: "#92400E",
    });

    canvas.add(card, title, icon, word, sub);
    canvas.renderAll();
  }, []);

  // -------------------------------------------------------
  // TEMPLATE: Mẫu lịch trình 3 bước trực quan
  // -------------------------------------------------------
  const addScheduleTemplate = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");

    const title = new fabric.IText("LỊCH TRÌNH BUỔI SÁNG CỦA BÉ", {
      left: 220,
      top: 40,
      fontFamily: "Inter",
      fontSize: 22,
      fontWeight: "bold",
      fill: "#1E293B",
    });

    const steps = [
      { step: "1", emoji: "🛏️", label: "Thức dậy", color: "#EFF6FF", stroke: "#3B82F6", left: 100 },
      { step: "2", emoji: "🪥", label: "Đánh răng", color: "#ECFDF5", stroke: "#10B981", left: 320 },
      { step: "3", emoji: "🥣", label: "Ăn sáng", color: "#FFF7ED", stroke: "#F97316", left: 540 },
    ];

    const elementsToAdd: any[] = [title];

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
        ry: 18,
      });

      const stepBadge = new fabric.IText(`Bước ${s.step}`, {
        left: s.left + 50,
        top: 120,
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: "bold",
        fill: s.stroke,
      });

      const icon = new fabric.IText(s.emoji, {
        left: s.left + 55,
        top: 180,
        fontSize: 60,
      });

      const label = new fabric.IText(s.label, {
        left: s.left + 40,
        top: 290,
        fontFamily: "Inter",
        fontSize: 18,
        fontWeight: "bold",
        fill: "#1E293B",
      });

      elementsToAdd.push(box, stepBadge, icon, label);
    });

    canvas.add(...elementsToAdd);
    canvas.renderAll();
  }, []);

  // -------------------------------------------------------
  // CANVAS: Đổi màu nền Canvas
  // -------------------------------------------------------
  const setCanvasBackground = useCallback((color: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.backgroundColor = color;
    canvas.renderAll();
  }, []);

  // -------------------------------------------------------
  // CANVAS: Xóa trắng toàn bộ
  // -------------------------------------------------------
  const clearCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#FFFFFF";
    canvas.renderAll();
    setActiveObject(null);
  }, []);

  // -------------------------------------------------------
  // LAYER: Đưa lên trên
  // -------------------------------------------------------
  const bringForward = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.bringObjectForward(obj);
    canvas.renderAll();
  }, []);

  // -------------------------------------------------------
  // LAYER: Đưa xuống dưới
  // -------------------------------------------------------
  const sendBackward = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
  }, []);

  // -------------------------------------------------------
  // DELETE: Xóa active object khỏi canvas
  // -------------------------------------------------------
  const deleteActive = useCallback(() => {
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
    sendBackward,
  };
}
