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
  addText: () => void;
  /** Thêm hình chữ nhật */
  addRect: () => void;
  /** Thêm hình tròn */
  addCircle: () => void;
  /** Thêm hình ảnh */
  addImage: (url: string) => Promise<void>;
  /** Đổi fill color cho active object */
  setFillColor: (color: string) => void;
  /** Đổi stroke color cho active object */
  setStrokeColor: (color: string) => void;
  /** Đổi font family cho active text */
  setFontFamily: (font: string) => void;
  /** Xóa active object */
  deleteActive: () => void;
}

// ============================================================
// HOOK CHÍNH
// ============================================================
export function useFabric(
  width: number = 800,
  height: number = 560,
): UseFabricReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const [canvasInstance, setCanvasInstance] = useState<FabricCanvas | null>(null);

  // State cho active object — chỉ lưu thông tin serializable
  // để React có thể so sánh và trigger re-render khi cần
  const [activeObject, setActiveObject] = useState<ActiveObjectInfo | null>(
    null,
  );

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
        fontFamily: (obj as unknown as Record<string, unknown>).fontFamily as
          | string
          | undefined,
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
  const addText = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");
    const pos = randomPosition();

    const text = new fabric.IText("Nhập văn bản...", {
      left: pos.left,
      top: pos.top,
      fontFamily: "Inter",
      fontSize: 24,
      fill: "#4B5563",
      // Cấu hình control points dịu dàng
      cornerColor: "#8ECDF8",
      cornerStyle: "circle",
      cornerSize: 8,
      transparentCorners: false,
      borderColor: "#8ECDF8",
      borderScaleFactor: 1.5,
      padding: 8,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setActiveObject(extractInfo(text));
  }, [randomPosition, extractInfo]);

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
  const addImage = useCallback(async (url: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const fabric = await import("fabric");
    const pos = randomPosition();

    try {
      const img = await fabric.Image.fromURL(url, {
        crossOrigin: "anonymous"
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
  }, [randomPosition, extractInfo]);

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
    addImage,
    setFillColor,
    setStrokeColor,
    setFontFamily,
    deleteActive,
  };
}
