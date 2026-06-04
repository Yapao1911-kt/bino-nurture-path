// ============================================================
// CanvasEditor — Lesson Builder Studio
// File: src/components/LessonBuilder/CanvasEditor.tsx
//
// Mô tả: Component chính cho Canvas Editor. Bao gồm:
//   - InsertToolbar (trái): Chèn Text, Shapes
//   - Canvas (giữa): Vùng tương tác Fabric.js
//   - PropertiesPanel (phải): Chỉnh sửa active object
//
// Nguyên tắc thiết kế:
//   - "Healing Design" — pastel, dịu nhẹ, bo tròn lớn
//   - "Minimal Cognitive Load" — tối đa 3 action/nhóm
//   - Tách logic hook (useFabric) khỏi UI hoàn toàn
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Type,
  Square,
  Circle,
  Palette,
  Paintbrush,
  Trash2,
  ChevronDown,
  Shapes,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Lock,
} from "lucide-react";
import { useFabric } from "@/hooks/useFabric";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// -------------------------------------------------------
// Bảng màu pastel Bino — dùng cho Color Picker
// Giới hạn 12 màu để giảm Cognitive Load
// -------------------------------------------------------
const FILL_PALETTE = [
  "#FFFFFF",
  "#4B5563",
  "#8ECDF8",
  "#DCEFFB",
  "#A8E6CF",
  "#E2F6EC",
  "#FFD3B6",
  "#FFEBDC",
  "#FFCAD4",
  "#FFE6EB",
  "#FFF3B0",
  "#FFF8D6",
];

const STROKE_PALETTE = [
  "transparent",
  "#4B5563",
  "#3D8FC0",
  "#8ECDF8",
  "#4FA37F",
  "#A8E6CF",
  "#C9794B",
  "#FFD3B6",
  "#D67B8B",
  "#FFCAD4",
  "#C99A2E",
  "#FFF3B0",
];

// -------------------------------------------------------
// Danh sách font — giới hạn 6 font phổ biến, dễ đọc
// (Tuân thủ Minimal Cognitive Load)
// -------------------------------------------------------
const FONT_LIST = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier New" },
  { value: "Comic Sans MS", label: "Comic Sans" },
  { value: "Arial", label: "Arial" },
];

// ============================================================
// SUB-COMPONENT: ColorGrid — Lưới chọn màu trong Popover
// ============================================================
function ColorGrid({
  colors,
  activeColor,
  onSelect,
  label,
}: {
  colors: string[];
  activeColor: string;
  onSelect: (color: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
        {label}
      </p>
      <div className="grid grid-cols-6 gap-1.5">
        {colors.map((color) => {
          const isTransparent = color === "transparent";
          const isActive = activeColor === color;
          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              aria-label={`Chọn màu ${color}`}
              className={`
                w-8 h-8 rounded-xl border-2 transition-all duration-200
                hover:scale-110 hover:shadow-md cursor-pointer
                ${isActive ? "border-brand-blue shadow-md scale-110" : "border-white/80"}
              `}
              style={{
                backgroundColor: isTransparent ? "#FFFFFF" : color,
                ...(isTransparent
                  ? {
                      backgroundImage:
                        "linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)",
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 4px 4px",
                    }
                  : {}),
              }}
            >
              {/* Dấu chéo cho "transparent" */}
              {isTransparent && (
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <line
                    x1="4"
                    y1="28"
                    x2="28"
                    y2="4"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENT: FontSelector — Dropdown chọn font
// ============================================================
function FontSelector({
  currentFont,
  onSelect,
}: {
  currentFont: string;
  onSelect: (font: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 rounded-2xl justify-between text-sm font-medium border-2 border-transparent bg-brand-blue-soft/40 hover:bg-brand-blue-soft hover:border-brand-blue/30 transition-all"
          aria-label="Chọn font chữ"
        >
          <span style={{ fontFamily: currentFont }}>{currentFont}</span>
          <ChevronDown className="w-3.5 h-3.5 text-ink/50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-52 p-2 rounded-2xl border-2 border-brand-blue-soft"
        side="bottom"
        align="start"
      >
        <div className="space-y-0.5">
          {FONT_LIST.map((font) => (
            <button
              key={font.value}
              onClick={() => onSelect(font.value)}
              className={`
                w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all cursor-pointer
                hover:bg-brand-mint-soft
                ${currentFont === font.value ? "bg-brand-blue-soft font-semibold text-ink" : "text-ink/70"}
              `}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// SUB-COMPONENT: InsertToolbar — Thanh công cụ chèn phần tử
// (Bên trái canvas, tối đa 3 action chính hiển thị)
// ============================================================
function InsertToolbar({
  onAddText,
  onAddRect,
  onAddCircle,
  onAddImageClick,
  uploadingImage,
}: {
  onAddText: () => void;
  onAddRect: () => void;
  onAddCircle: () => void;
  onAddImageClick: () => void;
  uploadingImage: boolean;
}) {
  // State dropdown cho shapes (ẩn tùy chọn phụ)
  const [shapesOpen, setShapesOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Tiêu đề nhóm */}
      <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest px-1">
        Chèn
      </p>

      {/* Nút 1: Chèn Text — action chính, luôn hiển thị */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onAddText}
              variant="ghost"
              className="w-14 h-14 rounded-2xl bg-brand-blue-soft/50 hover:bg-brand-blue-soft hover:shadow-md transition-all duration-200 group"
              aria-label="Chèn văn bản"
            >
              <Type
                className="w-5 h-5 text-[#3D8FC0] group-hover:scale-110 transition-transform"
                strokeWidth={2.2}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="rounded-xl">
            Chèn văn bản
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Nút 2: Shapes — mở dropdown với Rect + Circle */}
      <Popover open={shapesOpen} onOpenChange={setShapesOpen}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-14 h-14 rounded-2xl bg-brand-mint-soft/50 hover:bg-brand-mint-soft hover:shadow-md transition-all duration-200 group"
                  aria-label="Chèn hình khối"
                >
                  <Shapes
                    className="w-5 h-5 text-[#4FA37F] group-hover:scale-110 transition-transform"
                    strokeWidth={2.2}
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="rounded-xl">
              Chèn hình khối
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent
          side="right"
          align="start"
          className="w-44 p-2 rounded-2xl border-2 border-brand-mint-soft"
        >
          <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest px-2 pb-1.5">
            Hình khối
          </p>
          <button
            onClick={() => {
              onAddRect();
              setShapesOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-mint-soft text-sm text-ink/80 hover:text-ink transition-colors cursor-pointer"
          >
            <Square className="w-4 h-4 text-[#4FA37F]" strokeWidth={2} />
            Hình chữ nhật
          </button>
          <button
            onClick={() => {
              onAddCircle();
              setShapesOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-mint-soft text-sm text-ink/80 hover:text-ink transition-colors cursor-pointer"
          >
            <Circle className="w-4 h-4 text-[#D67B8B]" strokeWidth={2} />
            Hình tròn
          </button>
        </PopoverContent>
      </Popover>

      {/* Nút 3: Chèn Ảnh (Upload Image) */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onAddImageClick}
              disabled={uploadingImage}
              variant="ghost"
              className="w-14 h-14 rounded-2xl bg-brand-peach-soft/50 hover:bg-brand-peach-soft hover:shadow-md transition-all duration-200 group"
              aria-label="Chèn hình ảnh từ máy tính"
            >
              {uploadingImage ? (
                <Loader2 className="w-5 h-5 text-[#C9794B] animate-spin" />
              ) : (
                <ImageIcon
                  className="w-5 h-5 text-[#C9794B] group-hover:scale-110 transition-transform"
                  strokeWidth={2.2}
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="rounded-xl">
            {uploadingImage ? "Đang tải ảnh..." : "Chèn hình ảnh"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

// ============================================================
// SUB-COMPONENT: PropertiesPanel — Bảng chỉnh sửa active object
// (Bên phải canvas, context-aware theo type của object)
// ============================================================
function PropertiesPanel({
  activeObject,
  onSetFill,
  onSetStroke,
  onSetFont,
  onDelete,
}: {
  activeObject: {
    type: string;
    fill: string;
    stroke: string;
    fontFamily?: string;
  };
  onSetFill: (color: string) => void;
  onSetStroke: (color: string) => void;
  onSetFont: (font: string) => void;
  onDelete: () => void;
}) {
  // Xác định loại phần tử để hiển thị label phù hợp
  const typeLabels: Record<string, string> = {
    "i-text": "Văn bản",
    rect: "Hình chữ nhật",
    circle: "Hình tròn",
    textbox: "Văn bản",
  };
  const typeLabel = typeLabels[activeObject.type] ?? "Phần tử";
  const isText =
    activeObject.type === "i-text" || activeObject.type === "textbox";

  return (
    <div className="w-56 flex flex-col gap-4 animate-fade-in">
      {/* Header — Loại phần tử đang chọn */}
      <div className="flex items-center gap-2">
        <span
          className="w-8 h-8 rounded-xl grid place-items-center"
          style={{ background: "var(--brand-blue-soft)" }}
        >
          <Sparkles className="w-4 h-4 text-[#3D8FC0]" />
        </span>
        <div>
          <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">
            Đang chỉnh sửa
          </p>
          <p className="text-sm font-semibold text-ink">{typeLabel}</p>
        </div>
      </div>

      <Separator className="bg-brand-blue-soft" />

      {/* --- Nhóm 1: Font chữ (chỉ hiện khi chọn Text) --- */}
      {isText && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
            Font chữ
          </p>
          <FontSelector
            currentFont={activeObject.fontFamily ?? "Inter"}
            onSelect={onSetFont}
          />
        </div>
      )}

      {/* --- Nhóm 2: Màu nền (Fill) --- */}
      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-brand-peach-soft/40 hover:bg-brand-peach-soft transition-all text-left cursor-pointer group"
              aria-label="Đổi màu nền"
            >
              <Palette className="w-4 h-4 text-[#C9794B]" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                  Màu nền
                </p>
              </div>
              <span
                className="w-7 h-7 rounded-lg border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                style={{ backgroundColor: activeObject.fill || "#FFFFFF" }}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            className="w-auto p-3 rounded-2xl border-2 border-brand-peach-soft"
          >
            <ColorGrid
              colors={FILL_PALETTE}
              activeColor={activeObject.fill}
              onSelect={onSetFill}
              label="Chọn màu nền"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* --- Nhóm 3: Màu viền (Stroke) --- */}
      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-brand-pink-soft/40 hover:bg-brand-pink-soft transition-all text-left cursor-pointer group"
              aria-label="Đổi màu viền"
            >
              <Paintbrush className="w-4 h-4 text-[#D67B8B]" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                  Màu viền
                </p>
              </div>
              <span
                className={`w-7 h-7 rounded-lg border-2 border-white shadow-sm group-hover:scale-110 transition-transform ${
                  !activeObject.stroke || activeObject.stroke === "transparent"
                    ? "bg-white"
                    : ""
                }`}
                style={{
                  backgroundColor:
                    activeObject.stroke && activeObject.stroke !== "transparent"
                      ? activeObject.stroke
                      : undefined,
                  ...((!activeObject.stroke ||
                    activeObject.stroke === "transparent") && {
                    backgroundImage:
                      "linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)",
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 4px 4px",
                  }),
                }}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            className="w-auto p-3 rounded-2xl border-2 border-brand-pink-soft"
          >
            <ColorGrid
              colors={STROKE_PALETTE}
              activeColor={activeObject.stroke || "transparent"}
              onSelect={onSetStroke}
              label="Chọn màu viền"
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="bg-brand-pink-soft" />

      {/* Nút xóa */}
      <Button
        onClick={onDelete}
        variant="ghost"
        className="w-full h-10 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm gap-2"
        aria-label="Xóa phần tử"
      >
        <Trash2 className="w-4 h-4" />
        Xóa phần tử
      </Button>
    </div>
  );
}

// ============================================================
// COMPONENT CHÍNH: CanvasEditor
// ============================================================
export default function CanvasEditor() {
  // Trạng thái kiểm tra và mô phỏng quyền (Role & Auth)
  const [userRole, setUserRole] = useState<string>("parent"); // "parent" (Free), "teacher", "premium"
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [checkingRole, setCheckingRole] = useState<boolean>(true);

  // Trạng thái hoạt động nâng cao
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [savingTemplate, setSavingTemplate] = useState<boolean>(false);
  const [exportingFile, setExportingFile] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>("");

  // Trạng thái Modals / Dialogs
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lấy toàn bộ state & actions từ useFabric hook
  const {
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
  } = useFabric(800, 560);

  // Đọc thông tin vai trò từ Supabase hoặc Mock
  useEffect(() => {
    const fetchUserRole = async () => {
      setCheckingRole(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 1. Check user metadata
          const metadataRole = user.user_metadata?.role;
          const metadataPremium = user.user_metadata?.is_premium;

          // 2. Check profiles database table if present
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, is_premium")
            .eq("id", user.id)
            .maybeSingle();

          const currentRole = (profile?.role || metadataRole || "parent").toLowerCase();
          const isPremiumVal = !!(profile?.is_premium || metadataPremium);

          setUserRole(currentRole);
          setIsPremiumUser(isPremiumVal);
        } else {
          // Lấy vai trò giả lập từ localStorage
          const savedRole = localStorage.getItem("bino_simulated_role") || "parent";
          setUserRole(savedRole);
          setIsPremiumUser(savedRole === "premium" || savedRole === "teacher");
        }
      } catch (err) {
        console.error("Error loading user role:", err);
      } finally {
        setCheckingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  // Thay đổi vai trò mô phỏng (cho dev test)
  const handleSimulateRole = (newRole: string) => {
    setUserRole(newRole);
    const isPrem = newRole === "premium" || newRole === "teacher";
    setIsPremiumUser(isPrem);
    localStorage.setItem("bino_simulated_role", newRole);
    toast.success(`Đã mô phỏng tài khoản với quyền: ${getRoleLabel(newRole)}`);
  };

  // Helper dịch nhãn vai trò sang tiếng Việt
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "teacher":
        return "Giáo viên";
      case "premium":
        return "Thành viên Premium";
      default:
        return "Phụ huynh (Miễn phí)";
    }
  };

  // Helper lấy màu sắc hiển thị cho vai trò
  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "var(--brand-mint)";
      case "premium":
        return "var(--brand-blue)";
      default:
        return "var(--brand-pink)";
    }
  };

  // Kích hoạt chọn file ảnh
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Upload và chèn ảnh
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Đang xử lý tải ảnh...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;

      // Tải lên Supabase Storage bucket 'lesson-materials'
      const { data, error } = await supabase.storage
        .from("lesson-materials")
        .upload(filePath, file);

      let finalUrl = "";
      if (error) {
        console.warn("Storage upload failed, fallback to base64 URL:", error.message);
        // Chế độ Offline/Local fallback: convert sang Base64
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        toast.info("Chế độ Offline: Ảnh đã được nạp trực tiếp vào canvas.", { id: toastId });
      } else {
        // Lấy URL công khai
        const { data: { publicUrl } } = supabase.storage
          .from("lesson-materials")
          .getPublicUrl(filePath);
        finalUrl = publicUrl;
        toast.success("Tải ảnh lên Supabase thành công!", { id: toastId });
      }

      if (finalUrl) {
        await addImage(finalUrl);
      }
    } catch (err: any) {
      console.error("Image upload/embed failed:", err);
      toast.error(`Lỗi tải ảnh: ${err.message || err}`, { id: toastId });
    } finally {
      setUploadingImage(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Lưu Template
  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !canvasInstance) return;

    setSavingTemplate(true);
    const toastId = toast.loading("Đang lưu template thiết kế...");

    try {
      const canvasJson = canvasInstance.toJSON();
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("lesson_templates")
        .insert([
          {
            name: templateName.trim(),
            content: canvasJson,
            user_id: user?.id || null,
          },
        ]);

      if (error) {
        console.warn("Save to Supabase failed, storing locally as fallback:", error.message);
        // Caching fallback bằng localStorage
        const localTemplates = JSON.parse(localStorage.getItem("bino_local_templates") || "[]");
        localTemplates.push({
          id: Date.now().toString(),
          name: templateName.trim(),
          content: canvasJson,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("bino_local_templates", JSON.stringify(localTemplates));
        toast.info(`Offline: Đã lưu template "${templateName}" vào trình duyệt.`, { id: toastId });
      } else {
        toast.success(`Đã lưu template "${templateName}" lên Supabase!`, { id: toastId });
      }

      setShowSaveTemplateModal(false);
      setTemplateName("");
    } catch (err: any) {
      console.error("Save template failed:", err);
      toast.error(`Không thể lưu template: ${err.message || err}`, { id: toastId });
    } finally {
      setSavingTemplate(false);
    }
  };

  // Xuất file PNG/JPG/PDF
  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    if (!canvasInstance) return;

    // KIỂM TRA QUYỀN (BẮT BUỘC): Chỉ Giáo viên hoặc tài khoản Premium mới được xuất
    const isAuthorized = userRole === "teacher" || userRole === "premium" || isPremiumUser;
    if (!isAuthorized) {
      setShowUpgradeModal(true);
      return;
    }

    setExportingFile(true);
    const toastId = toast.loading(`Đang xuất file ${format.toUpperCase()}...`);

    // Chạy trong setTimeout để loading spinner hiển thị trước khi Canvas chặn main thread
    setTimeout(async () => {
      try {
        if (format === "png" || format === "jpg") {
          const dataUrl = canvasInstance.toDataURL({
            format: format === "png" ? "png" : "jpeg",
            quality: 1.0,
            multiplier: 2.0, // Tăng gấp đôi kích thước để ảnh sắc nét hơn
          });

          const downloadLink = document.createElement("a");
          downloadLink.download = `bino-lesson-${Date.now()}.${format}`;
          downloadLink.href = dataUrl;
          downloadLink.click();

          toast.success(`Đã xuất file hình ảnh (${format.toUpperCase()})!`, { id: toastId });
        } else if (format === "pdf") {
          const { jsPDF } = await import("jspdf");

          // Tạo ảnh chất lượng cực cao (multiplier = 3.75 tương đương 3000px rộng ~ 300 DPI trên A4 landscape)
          const dataUrl = canvasInstance.toDataURL({
            format: "png",
            quality: 1.0,
            multiplier: 3.75,
          });

          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          });

          // Kích thước A4 landscape: 297mm x 210mm
          pdf.addImage(dataUrl, "PNG", 0, 0, 297, 210);
          pdf.save(`bino-lesson-${Date.now()}.pdf`);

          toast.success("Đã xuất file PDF 300 DPI thành công!", { id: toastId });
        }
      } catch (err: any) {
        console.error("Export process failed:", err);
        toast.error(`Xuất file thất bại: ${err.message || err}`, { id: toastId });
      } finally {
        setExportingFile(false);
      }
    }, 150);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ background: "var(--background)" }}
    >
      {/* Input chèn ảnh ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* ============================================
          Header Bar — Tiêu đề Studio & Actions
          ============================================ */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-white px-4 sm:px-6">
        <div className="max-w-screen-2xl mx-auto h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors"
              aria-label="Quay về trang chủ"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Separator orientation="vertical" className="h-5 bg-ink/10" />
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-xl grid place-items-center shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-mint) 100%)",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </span>
              <div>
                <h1 className="text-sm font-bold text-ink leading-tight">
                  Lesson Builder
                </h1>
                <p className="text-[10px] text-ink/50">
                  Studio thiết kế bài học
                </p>
              </div>
            </div>
          </div>

          {/* Right actions với vai trò & lưu/xuất */}
          <div className="flex items-center gap-3">
            {/* Bộ đổi vai trò để mô phỏng kiểm tra */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="px-3 py-1.5 rounded-2xl text-xs font-semibold border border-ink/10 cursor-pointer transition-all flex items-center gap-1.5 bg-white/60 hover:bg-white text-ink shadow-sm"
                  aria-label="Đổi vai trò mô phỏng"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                    style={{ backgroundColor: getRoleColor(userRole) }}
                  />
                  <span>Quyền: {getRoleLabel(userRole)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink/50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 rounded-2xl border-2 border-brand-blue-soft shadow-lg bg-white" align="end">
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest px-2 pb-1.5">Mô phỏng tài khoản</p>
                {[
                  { value: "parent", label: "Phụ huynh (Miễn phí)" },
                  { value: "teacher", label: "Giáo viên (Premium)" },
                  { value: "premium", label: "Thành viên Premium" },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleSimulateRole(r.value)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      userRole === r.value
                        ? "bg-brand-blue-soft/60 font-semibold text-ink"
                        : "text-ink/70 hover:bg-slate-50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Nút lưu template */}
            <Button
              onClick={() => setShowSaveTemplateModal(true)}
              disabled={savingTemplate || !canvasInstance}
              variant="ghost"
              className="h-9 px-4 rounded-xl text-xs font-semibold bg-brand-blue-soft/30 text-brand-blue hover:bg-brand-blue-soft hover:shadow-sm transition-all border border-brand-blue/10 disabled:opacity-50"
            >
              Lưu Template
            </Button>

            {/* Nút xuất file */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={exportingFile || !canvasInstance}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-95 shadow-sm shadow-brand-blue/30 cursor-pointer border-none flex items-center gap-1.5"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-mint) 100%)",
                  }}
                >
                  {exportingFile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xuất...</span>
                    </>
                  ) : (
                    <>
                      <span>Xuất File</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-2 rounded-2xl border-2 border-brand-blue-soft shadow-lg bg-white" align="end">
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest px-2 pb-1.5">Định dạng file</p>
                <button
                  onClick={() => handleExport("png")}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-ink/70 hover:bg-slate-50 hover:text-ink cursor-pointer"
                >
                  <span>Ảnh PNG (Chất lượng cao)</span>
                </button>
                <button
                  onClick={() => handleExport("jpg")}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-ink/70 hover:bg-slate-50 hover:text-ink cursor-pointer"
                >
                  <span>Ảnh JPG (Tối ưu hóa)</span>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-ink/70 hover:bg-slate-50 hover:text-ink cursor-pointer"
                >
                  <span>Tài liệu PDF (300 DPI)</span>
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* ============================================
          Main Layout — Toolbar | Canvas | Properties
          ============================================ */}
      <main className="flex-1 flex items-start justify-center gap-4 p-4 sm:p-6">
        {/* --- Cột trái: Insert Toolbar --- */}
        <aside className="sticky top-24 p-3 rounded-2xl bg-white shadow-sm border border-white/80">
          <InsertToolbar
            onAddText={addText}
            onAddRect={addRect}
            onAddCircle={addCircle}
            onAddImageClick={triggerFileSelect}
            uploadingImage={uploadingImage}
          />
        </aside>

        {/* --- Giữa: Canvas Area --- */}
        <section className="flex flex-col items-center gap-4">
          {/* Canvas wrapper */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-2 border-white bg-white">
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-brand-blue/30" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-mint/30" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-brand-pink/30" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-brand-peach/30" />

            <canvas ref={canvasRef} id="lesson-builder-canvas" />
          </div>

          <p className="text-xs text-ink/40 text-center">
            Nhấp vào phần tử để chỉnh sửa • Kéo thả để di chuyển • Kéo góc để thay đổi kích thước
          </p>
        </section>

        {/* --- Cột phải: Properties Panel --- */}
        <aside className="sticky top-24 w-56">
          {activeObject ? (
            <div className="p-4 rounded-2xl bg-white shadow-sm border border-white/80">
              <PropertiesPanel
                activeObject={activeObject}
                onSetFill={setFillColor}
                onSetStroke={setStrokeColor}
                onSetFont={setFontFamily}
                onDelete={deleteActive}
              />
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-brand-yellow-soft/40 border-2 border-dashed border-brand-yellow/30 text-center">
              <div
                className="w-12 h-12 rounded-2xl grid place-items-center mx-auto mb-3"
                style={{ background: "var(--brand-yellow-soft)" }}
              >
                <Sparkles className="w-5 h-5 text-[#C99A2E]" />
              </div>
              <p className="text-sm font-medium text-ink/60 leading-relaxed">
                Chọn một phần tử
                <br />
                trên canvas để chỉnh sửa
              </p>
            </div>
          )}
        </aside>
      </main>

      {/* ============================================
          Modals / Overlays (Upgrade & Save Template)
          ============================================ */}
      {/* Modal Nâng Cấp */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl border border-brand-pink-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-pink-soft/50 grid place-items-center">
              <Lock className="w-5 h-5 text-[#D67B8B]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-ink">Nâng cấp tài khoản</h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Chức năng xuất thiết kế chất lượng cao (PNG, JPG, PDF 300 DPI) chỉ dành riêng cho tài khoản <strong>Giáo viên</strong> hoặc <strong>Premium</strong>.
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 h-10 rounded-xl text-ink/60 hover:bg-slate-50 border border-ink/5"
              >
                Để sau
              </Button>
              <Link
                to="/create-child"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 h-10 bg-brand-pink text-ink font-semibold rounded-xl flex items-center justify-center hover:opacity-90 transition-all text-xs text-center border-none"
              >
                Nâng cấp ngay
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lưu Template */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl border border-brand-blue-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-soft/50 grid place-items-center">
              <Shapes className="w-5 h-5 text-[#3D8FC0]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-ink">Lưu Template cá nhân</h3>
              <p className="text-xs text-ink/60">
                Nhập tên để lưu thiết kế này vào tài khoản của bạn.
              </p>
            </div>
            <input
              type="text"
              placeholder="Tên bài học (ví dụ: Bé phân biệt quả táo)"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-ink/10 focus:outline-none focus:border-brand-blue text-xs text-ink bg-slate-50/50 focus:bg-white transition-colors"
              autoFocus
            />
            <div className="pt-2 flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowSaveTemplateModal(false)}
                className="flex-1 h-10 rounded-xl text-ink/60 hover:bg-slate-50 border border-ink/5"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || savingTemplate}
                className="flex-1 h-10 bg-brand-blue text-white font-semibold rounded-xl text-xs"
              >
                {savingTemplate ? "Đang lưu..." : "Lưu Template"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
