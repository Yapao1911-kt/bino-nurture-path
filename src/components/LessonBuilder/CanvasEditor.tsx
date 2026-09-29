// ============================================================
// CanvasEditor — Lesson Builder Studio
// File: src/components/LessonBuilder/CanvasEditor.tsx
//
// Mô tả: Component chính cho Canvas Editor. Bao gồm:
//   - Tab Bar & Tool Panel (trái): 8 tab mang 8 mã màu chuẩn chính xác:
//       1. Amethyst:     #9956DE
//       2. Slate Blue:   #7274ED
//       3. Summer Sky:   #1FA7E1
//       4. Downy:        #6ED1CF
//       5. Pastel Green: #75D06A
//       6. Texas Rose:   #FFB365
//       7. Mona Lisa:    #FF8B8B
//       8. Illusion:     #FB96BB
//   - TOÀN BỘ CÁC TAB, MẸO THIẾT KẾ VÀ CẢ PHẦN CON ĐỀU DÙNG MÀU CHUẨN VÀ CHỮ MÀU TRẮNG
//   - Loại bỏ hoàn toàn tên màu khỏi nhãn tab
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Type,
  Square,
  Circle,
  Star,
  Heart,
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
  LayoutTemplate,
  BringToFront,
  SendToBack,
  RefreshCw,
  Download,
  Lightbulb,
  Check,
  Smile,
  Frame,
} from "lucide-react";
import { useFabric } from "@/hooks/useFabric";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// -------------------------------------------------------
// 8 MÃ MÀU CHUẨN CỦA HỆ THỐNG
// -------------------------------------------------------
export const BINO_PALETTE = [
  { id: "amethyst", hex: "#9956DE", shadow: "#7D3EC0", label: "Mẫu bài" },
  { id: "slate_blue", hex: "#7274ED", shadow: "#595BCF", label: "Văn bản" },
  { id: "summer_sky", hex: "#1FA7E1", shadow: "#168BC0", label: "Hình khối" },
  { id: "downy", hex: "#6ED1CF", shadow: "#4BB3B1", label: "Tải ảnh" },
  { id: "pastel_green", hex: "#75D06A", shadow: "#59B84E", label: "Nhãn dán" },
  { id: "texas_rose", hex: "#FFB365", shadow: "#E59845", label: "Khung thẻ" },
  { id: "mona_lisa", hex: "#FF8B8B", shadow: "#E06D6D", label: "Bảng màu" },
  { id: "illusion", hex: "#FB96BB", shadow: "#DC779D", label: "Màu nền" },
];

// Bảng màu chọn (Color Picker) sử dụng 8 màu chuẩn + cơ bản
const FILL_PALETTE = [
  "#9956DE", // Amethyst
  "#7274ED", // Slate Blue
  "#1FA7E1", // Summer Sky
  "#6ED1CF", // Downy
  "#75D06A", // Pastel Green
  "#FFB365", // Texas Rose
  "#FF8B8B", // Mona Lisa
  "#FB96BB", // Illusion
  "#FFFFFF", // Trắng tinh
  "#1E293B", // Đen than chì
  "#DC2626", // Đỏ cờ
  "#D97706", // Vàng đậm
];

const STROKE_PALETTE = [
  "transparent", // Không viền
  "#0F172A",     // Đen viền đậm
  "#9956DE",     // Amethyst
  "#7274ED",     // Slate Blue
  "#1FA7E1",     // Summer Sky
  "#6ED1CF",     // Downy
  "#75D06A",     // Pastel Green
  "#FFB365",     // Texas Rose
  "#FF8B8B",     // Mona Lisa
  "#FB96BB",     // Illusion
  "#DC2626",     // Đỏ đậm viền
  "#B45309",     // Vàng nghệ viền
];

// -------------------------------------------------------
// Danh sách font chuẩn cho học liệu mầm non & tiểu học
// -------------------------------------------------------
const FONT_LIST = [
  { value: "Inter", label: "Inter (Hiện đại, dễ đọc)" },
  { value: "Roboto", label: "Roboto (Tiêu chuẩn giáo khoa)" },
  { value: "Arial", label: "Arial (Đơn giản, rõ ràng)" },
  { value: "Comic Sans MS", label: "Comic Sans (Thân thiện trẻ nhỏ)" },
  { value: "Georgia", label: "Georgia (Thanh lịch có chân)" },
  { value: "Courier New", label: "Courier New (Đơn cách)" },
];

// -------------------------------------------------------
// Danh sách Sticker mầm non có sẵn
// -------------------------------------------------------
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
  { emoji: "🧸", name: "Gấu bông", color: "#FFB365", shadow: "#E59845" },
];

// Định nghĩa kiểu Tab
type ActiveTabType =
  | "templates"
  | "text"
  | "shapes"
  | "media"
  | "stickers"
  | "frames"
  | "palette"
  | "canvas";

// ============================================================
// SUB-COMPONENT: ColorGrid — Lưới chọn màu tương phản cao
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
    <div className="space-y-3 p-1">
      <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
        {label}
      </p>
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => {
          const isTransparent = color === "transparent";
          const isActive =
            activeColor.toLowerCase() === color.toLowerCase() ||
            (isTransparent && !activeColor);

          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              aria-label={`Chọn màu ${color}`}
              className={`
                w-8 h-8 rounded-xl border-2 transition-all duration-150 cursor-pointer
                hover:scale-110 hover:shadow-md relative flex items-center justify-center
                ${isActive ? "border-blue-600 ring-2 ring-blue-500 ring-offset-2 scale-105" : "border-slate-300"}
              `}
              style={{
                backgroundColor: isTransparent ? "#FFFFFF" : color,
                ...(isTransparent
                  ? {
                      backgroundImage:
                        "linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%)",
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 4px 4px",
                    }
                  : {}),
              }}
            >
              {isTransparent && (
                <svg viewBox="0 0 32 32" className="w-full h-full p-1">
                  <line
                    x1="4"
                    y1="28"
                    x2="28"
                    y2="4"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {isActive && !isTransparent && (
                <Check
                  className={`w-4 h-4 ${
                    ["#ffffff", "#6ed1cf", "#75d06a", "#ffb365", "#fb96bb"].includes(
                      color.toLowerCase()
                    )
                      ? "text-slate-900"
                      : "text-white"
                  }`}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENT: FontSelector — Dropdown chọn font rõ ràng
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
          className="w-full h-11 rounded-xl justify-between text-sm font-semibold border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-[#7274ED] transition-all text-slate-800 shadow-sm"
          aria-label="Chọn font chữ"
        >
          <span style={{ fontFamily: currentFont }}>{currentFont}</span>
          <ChevronDown className="w-4 h-4 text-slate-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-2 rounded-2xl border-2 border-slate-200 shadow-xl bg-white"
        side="bottom"
        align="start"
      >
        <div className="space-y-1">
          {FONT_LIST.map((font) => (
            <button
              key={font.value}
              onClick={() => onSelect(font.value)}
              className={`
                w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all cursor-pointer flex items-center justify-between
                ${
                  currentFont === font.value
                    ? "bg-[#7274ED] text-white font-bold"
                    : "text-slate-700 hover:bg-slate-100"
                }
              `}
              style={{ fontFamily: font.value }}
            >
              <span>{font.label}</span>
              {currentFont === font.value && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// SUB-COMPONENT: PropertiesPanel — Bảng điều khiển đối tượng
// ============================================================
function PropertiesPanel({
  activeObject,
  onSetFill,
  onSetStroke,
  onSetFont,
  onDelete,
  onBringForward,
  onSendBackward,
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
  onBringForward: () => void;
  onSendBackward: () => void;
}) {
  const typeLabels: Record<string, string> = {
    "i-text": "Văn bản chữ",
    rect: "Hình chữ nhật",
    circle: "Hình tròn",
    textbox: "Khung văn bản",
    polygon: "Ngôi sao khen ngợi",
    path: "Hình trái tim",
    image: "Hình ảnh",
  };
  const typeLabel = typeLabels[activeObject.type] ?? "Phần tử";
  const isText =
    activeObject.type === "i-text" || activeObject.type === "textbox";

  return (
    <div className="flex flex-col gap-4 animate-fade-in text-slate-800">
      {/* Header trạng thái — Màu Amethyst #9956DE CHỮ TRẮNG */}
      <div
        className="flex items-center gap-3 p-3.5 rounded-2xl shadow-xs"
        style={{
          backgroundColor: "#9956DE",
          boxShadow: "0 3.5px 0px #7D3EC0",
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-white/20 text-white grid place-items-center shadow-xs shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-white/90 uppercase tracking-widest leading-none mb-1">
            ĐANG CHỈNH SỬA
          </p>
          <p className="text-sm font-extrabold text-white leading-tight">{typeLabel}</p>
        </div>
      </div>

      {/* Font chữ nếu là Text */}
      {isText && (
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Kiểu font chữ
          </label>
          <FontSelector
            currentFont={activeObject.fontFamily ?? "Inter"}
            onSelect={onSetFont}
          />
        </div>
      )}

      {/* Chọn màu nền (Fill) — Nút màu Texas Rose #FFB365 CHỮ TRẮNG */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Màu tô (Nền)
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-full h-12 flex items-center justify-between px-4 rounded-xl transition-all cursor-pointer shadow-xs active:translate-y-0.5"
              style={{
                backgroundColor: "#FFB365",
                boxShadow: "0 3.5px 0px #E59845",
              }}
              aria-label="Đổi màu nền"
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-white" />
                <span className="text-xs font-extrabold text-white">Màu nền phần tử</span>
              </div>
              <div
                className="w-7 h-7 rounded-lg border-2 border-white shadow-xs"
                style={{ backgroundColor: activeObject.fill || "#FFFFFF" }}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            className="w-auto p-4 rounded-2xl border-2 border-slate-200 shadow-xl bg-white"
          >
            <ColorGrid
              colors={FILL_PALETTE}
              activeColor={activeObject.fill}
              onSelect={onSetFill}
              label="Bảng 8 màu chuẩn"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Chọn màu viền (Stroke) — Nút màu Mona Lisa #FF8B8B CHỮ TRẮNG */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Màu đường viền
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-full h-12 flex items-center justify-between px-4 rounded-xl transition-all cursor-pointer shadow-xs active:translate-y-0.5"
              style={{
                backgroundColor: "#FF8B8B",
                boxShadow: "0 3.5px 0px #E06D6D",
              }}
              aria-label="Đổi màu viền"
            >
              <div className="flex items-center gap-2.5">
                <Paintbrush className="w-5 h-5 text-white" />
                <span className="text-xs font-extrabold text-white">Màu đường viền</span>
              </div>
              <div
                className={`w-7 h-7 rounded-lg border-2 border-white shadow-xs ${
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
                      "linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%)",
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
            className="w-auto p-4 rounded-2xl border-2 border-slate-200 shadow-xl bg-white"
          >
            <ColorGrid
              colors={STROKE_PALETTE}
              activeColor={activeObject.stroke || "transparent"}
              onSelect={onSetStroke}
              label="Bảng màu viền chuẩn"
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="bg-slate-200" />

      {/* Sắp xếp thứ tự lớp (Layering) — Slate Blue #7274ED & Summer Sky #1FA7E1 CHỮ TRẮNG */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Thứ tự hiển thị
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onBringForward}
            className="h-11 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-0.5"
            style={{
              backgroundColor: "#7274ED",
              boxShadow: "0 3px 0px #595BCF",
            }}
          >
            <BringToFront className="w-4 h-4 text-white" />
            Lên trên
          </button>
          <button
            onClick={onSendBackward}
            className="h-11 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-0.5"
            style={{
              backgroundColor: "#1FA7E1",
              boxShadow: "0 3px 0px #168BC0",
            }}
          >
            <SendToBack className="w-4 h-4 text-white" />
            Xuống dưới
          </button>
        </div>
      </div>

      <Separator className="bg-slate-200" />

      {/* Nút xóa phần tử — Mona Lisa #FF8B8B CHỮ TRẮNG */}
      <button
        onClick={onDelete}
        className="w-full h-11 rounded-xl text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:translate-y-0.5 transition-all"
        style={{
          backgroundColor: "#FF8B8B",
          boxShadow: "0 3.5px 0px #E06D6D",
        }}
        aria-label="Xóa phần tử"
      >
        <Trash2 className="w-4 h-4 text-white" />
        Xóa phần tử này
      </button>
    </div>
  );
}

// ============================================================
// COMPONENT CHÍNH: CanvasEditor
// ============================================================
export default function CanvasEditor() {
  // Trạng thái tab đang chọn trong 8 tab
  const [activeTab, setActiveTab] = useState<ActiveTabType>("templates");

  // Tiêu đề thiết kế giáo án
  const [docTitle, setDocTitle] = useState<string>("Giáo án trực quan cho bé");

  // Trạng thái vai trò người dùng (Role & Auth)
  const [userRole, setUserRole] = useState<string>("parent");
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

  // Trạng thái tác vụ nâng cao
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [savingTemplate, setSavingTemplate] = useState<boolean>(false);
  const [exportingFile, setExportingFile] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>("");

  // Modals
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Custom hook Fabric quản lý Canvas
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
    sendBackward,
  } = useFabric(800, 560);

  // Đọc thông tin quyền từ Supabase / localStorage
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const metadataRole = user.user_metadata?.role;
          const metadataPremium = user.user_metadata?.is_premium;

          const { data: profile } = await supabase
            .from("profiles")
            .select("role, is_premium")
            .eq("id", user.id)
            .maybeSingle();

          const currentRole = (
            profile?.role ||
            metadataRole ||
            "parent"
          ).toLowerCase();
          const isPremiumVal = !!(profile?.is_premium || metadataPremium);

          setUserRole(currentRole);
          setIsPremiumUser(isPremiumVal);
        } else {
          const savedRole =
            localStorage.getItem("bino_simulated_role") || "teacher";
          setUserRole(savedRole);
          setIsPremiumUser(savedRole === "premium" || savedRole === "teacher");
        }
      } catch (err) {
        console.error("Error loading user role:", err);
      }
    };

    fetchUserRole();
  }, []);

  // Thay đổi quyền mô phỏng (cho kiểm thử nhanh)
  const handleSimulateRole = (newRole: string) => {
    setUserRole(newRole);
    const isPrem = newRole === "premium" || newRole === "teacher";
    setIsPremiumUser(isPrem);
    localStorage.setItem("bino_simulated_role", newRole);
    toast.success(`Đã mô phỏng quyền: ${getRoleLabel(newRole)}`);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "teacher":
        return "Giáo viên (Được xuất file)";
      case "premium":
        return "Thành viên Premium";
      default:
        return "Phụ huynh (Miễn phí)";
    }
  };

  // Upload file ảnh
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Đang xử lý tải ảnh lên...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from("lesson-materials")
        .upload(filePath, file);

      let finalUrl = "";
      if (error) {
        console.warn("Storage upload fallback to base64:", error.message);
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        toast.info("Đã nạp ảnh trực tiếp vào canvas.", { id: toastId });
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("lesson-materials").getPublicUrl(filePath);
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Lưu Template
  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !canvasInstance) return;

    setSavingTemplate(true);
    const toastId = toast.loading("Đang lưu giáo án...");

    try {
      const canvasJson = canvasInstance.toJSON();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("lesson_templates").insert([
        {
          name: templateName.trim(),
          content: canvasJson,
          user_id: user?.id || null,
        },
      ]);

      if (error) {
        const localTemplates = JSON.parse(
          localStorage.getItem("bino_local_templates") || "[]"
        );
        localTemplates.push({
          id: Date.now().toString(),
          name: templateName.trim(),
          content: canvasJson,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(
          "bino_local_templates",
          JSON.stringify(localTemplates)
        );
        toast.info(`Đã lưu template "${templateName}" vào trình duyệt.`, {
          id: toastId,
        });
      } else {
        toast.success(`Đã lưu template "${templateName}" lên Supabase!`, {
          id: toastId,
        });
      }

      setShowSaveTemplateModal(false);
      setTemplateName("");
    } catch (err: any) {
      console.error("Save template failed:", err);
      toast.error(`Không thể lưu template: ${err.message || err}`, {
        id: toastId,
      });
    } finally {
      setSavingTemplate(false);
    }
  };

  // Xuất file PNG / JPG / PDF 300 DPI
  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    if (!canvasInstance) return;

    const isAuthorized =
      userRole === "teacher" || userRole === "premium" || isPremiumUser;
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
            quality: 1.0,
            multiplier: 2.0,
          });

          const downloadLink = document.createElement("a");
          downloadLink.download = `${docTitle.trim().replace(/\s+/g, "_") || "bino_lesson"}.${format}`;
          downloadLink.href = dataUrl;
          downloadLink.click();

          toast.success(`Đã xuất ảnh ${format.toUpperCase()} độ nét cao!`, {
            id: toastId,
          });
        } else if (format === "pdf") {
          const { jsPDF } = await import("jspdf");

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

          pdf.addImage(dataUrl, "PNG", 0, 0, 297, 210);
          pdf.save(
            `${docTitle.trim().replace(/\s+/g, "_") || "bino_lesson"}.pdf`
          );

          toast.success("Đã xuất tài liệu PDF chuẩn in A4 300 DPI thành công!", {
            id: toastId,
          });
        }
      } catch (err: any) {
        console.error("Export process failed:", err);
        toast.error(`Xuất file thất bại: ${err.message || err}`, {
          id: toastId,
        });
      } finally {
        setExportingFile(false);
      }
    }, 150);
  };

  // Cấu hình 8 tab chính (KHÔNG CHỨA TÊN MÀU TRONG NHÃN, TOÀN BỘ CHỮ MÀU TRẮNG)
  const TABS_CONFIG = [
    {
      id: "templates" as ActiveTabType,
      hex: "#9956DE",
      shadow: "#7D3EC0",
      label: "Mẫu bài",
      icon: LayoutTemplate,
    },
    {
      id: "text" as ActiveTabType,
      hex: "#7274ED",
      shadow: "#595BCF",
      label: "Văn bản",
      icon: Type,
    },
    {
      id: "shapes" as ActiveTabType,
      hex: "#1FA7E1",
      shadow: "#168BC0",
      label: "Hình khối",
      icon: Shapes,
    },
    {
      id: "media" as ActiveTabType,
      hex: "#6ED1CF",
      shadow: "#4BB3B1",
      label: "Tải ảnh",
      icon: ImageIcon,
    },
    {
      id: "stickers" as ActiveTabType,
      hex: "#75D06A",
      shadow: "#59B84E",
      label: "Nhãn dán",
      icon: Smile,
    },
    {
      id: "frames" as ActiveTabType,
      hex: "#FFB365",
      shadow: "#E59845",
      label: "Khung thẻ",
      icon: Frame,
    },
    {
      id: "palette" as ActiveTabType,
      hex: "#FF8B8B",
      shadow: "#E06D6D",
      label: "Bảng màu",
      icon: Palette,
    },
    {
      id: "canvas" as ActiveTabType,
      hex: "#FB96BB",
      shadow: "#DC779D",
      label: "Màu nền",
      icon: Sparkles,
    },
  ];

  // Tab đang hoạt động
  const currentTabInfo = TABS_CONFIG.find((t) => t.id === activeTab) || TABS_CONFIG[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* File input ẩn cho upload ảnh */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* ============================================================
          1. HEADER BAR: Chuẩn mực, cân đối, sắc nét
          ============================================================ */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
          {/* Cánh trái: Quay về & Tên Studio */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Quay về trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Separator orientation="vertical" className="h-6 bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl text-white grid place-items-center shadow-sm"
                style={{ background: "linear-gradient(135deg, #9956DE 0%, #1FA7E1 100%)" }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </span>
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Lesson Builder Studio
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  Thiết kế giáo án can thiệp & mầm non
                </p>
              </div>
            </div>
          </div>

          {/* Giữa: Tên bài học đang thiết kế (Editable) */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-sm">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full text-center text-sm font-bold text-slate-800 bg-slate-100/70 hover:bg-slate-100 focus:bg-white px-4 py-2 rounded-xl border border-transparent focus:border-[#7274ED] outline-none transition-all"
              placeholder="Nhập tên giáo án..."
            />
          </div>

          {/* Cánh phải: Quyền tài khoản, Lưu template & Xuất File */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Bộ chuyển vai trò kiểm thử */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center gap-2 shadow-xs bg-slate-50 border-slate-200 text-slate-800"
                  aria-label="Đổi vai trò mô phỏng"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        userRole === "teacher"
                          ? "#75D06A"
                          : userRole === "premium"
                          ? "#1FA7E1"
                          : "#FF8B8B",
                    }}
                  />
                  <span>Quyền: {userRole === "teacher" ? "Giáo viên" : userRole === "premium" ? "Premium" : "Phụ huynh"}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-2 rounded-2xl border-2 border-slate-200 shadow-xl bg-white"
                align="end"
              >
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                  Mô phỏng tài khoản
                </p>
                {[
                  { value: "teacher", label: "Giáo viên (Được xuất file)", desc: "Quyền cao nhất" },
                  { value: "premium", label: "Thành viên Premium", desc: "Được xuất file" },
                  { value: "parent", label: "Phụ huynh (Miễn phí)", desc: "Xem & thiết kế" },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleSimulateRole(r.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex flex-col ${
                      userRole === r.value
                        ? "bg-purple-50 font-bold text-[#9956DE]"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-[10px] text-slate-400">{r.desc}</span>
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Nút lưu template */}
            <Button
              onClick={() => setShowSaveTemplateModal(true)}
              disabled={savingTemplate || !canvasInstance}
              variant="outline"
              className="h-9 px-3.5 rounded-xl text-xs font-bold text-[#7274ED] bg-purple-50/50 hover:bg-purple-100 border-2 border-[#7274ED]/30 transition-all cursor-pointer"
            >
              Lưu Template
            </Button>

            {/* Nút xuất File — Màu Slate Blue #7274ED CHỮ TRẮNG */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={exportingFile || !canvasInstance}
                  className="h-9 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer border-none flex items-center gap-1.5"
                  style={{
                    backgroundColor: "#7274ED",
                    boxShadow: "0 3px 0px #595BCF",
                  }}
                >
                  {exportingFile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span className="text-white">Đang xuất...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-white" />
                      <span className="text-white">Xuất File</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-2 rounded-2xl border-2 border-slate-200 shadow-xl bg-white"
                align="end"
              >
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                  Định dạng xuất chất lượng cao
                </p>
                <button
                  onClick={() => handleExport("png")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-purple-50 hover:text-[#9956DE] cursor-pointer"
                >
                  <span>Ảnh PNG (Chất lượng 2x)</span>
                  <span className="text-[10px] bg-purple-100 text-[#9956DE] px-1.5 py-0.5 rounded font-mono font-bold">PNG</span>
                </button>
                <button
                  onClick={() => handleExport("jpg")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1FA7E1] cursor-pointer"
                >
                  <span>Ảnh JPG (Tối ưu dung lượng)</span>
                  <span className="text-[10px] bg-blue-100 text-[#1FA7E1] px-1.5 py-0.5 rounded font-mono font-bold">JPG</span>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#059669] cursor-pointer"
                >
                  <span>Tài liệu PDF (Chuẩn in A4 300 DPI)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">PDF</span>
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. WORKSPACE: Bố cục 3 phần cân đối hoàn hảo
          Cột trái (340px) ⇄ Vùng Canvas trung tâm (800px) ⇄ Cột phải (280px)
          ============================================================ */}
      <main className="flex-1 max-w-[1460px] w-full mx-auto flex items-start justify-center gap-5 p-4 sm:p-6 overflow-x-auto">
        {/* ------------------------------------------------------------
            CỘT TRÁI: 8 THANH TAB MÀU CHUẨN (CHỮ TRẮNG) & CẢ PHẦN CON
            Kích thước: 340px cố định, ngay ngắn, 100% thẳng hàng
            ------------------------------------------------------------ */}
        <aside className="w-[340px] shrink-0 bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-4 flex flex-col gap-3.5 sticky top-24">
          {/* TIÊU ĐỀ KHU VỰC TAB */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Các thanh công cụ
            </p>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              8 công cụ
            </span>
          </div>

          {/* LƯỚI 8 THANH TAB: 2 HÀNG × 4 CỘT — TOÀN BỘ CHỮ MÀU TRẮNG
              - Nút 3D bo góc tròn lớn theo ảnh mẫu
              - KHÔNG ĐỂ TÊN MÀU TRÊN TAB, CHỈ ĐỂ TÊN TÁC VỤ */}
          <div className="grid grid-cols-4 gap-2">
            {TABS_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex flex-col items-center justify-center h-[58px] rounded-2xl transition-all duration-150 cursor-pointer select-none
                    ${
                      isActive
                        ? "ring-3 ring-slate-900 ring-offset-2 scale-105 z-10 shadow-md translate-y-[-1px]"
                        : "hover:scale-102 hover:brightness-105 active:translate-y-0.5"
                    }
                  `}
                  style={{
                    backgroundColor: tab.hex,
                    boxShadow: isActive
                      ? `0 5px 12px ${tab.hex}66, 0 3px 0px ${tab.shadow}`
                      : `0 3.5px 0px ${tab.shadow}`,
                    transform: isActive ? "scale(1.05) translateY(-1px)" : "none",
                  }}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5 text-white mb-0.5 shrink-0 drop-shadow-xs" strokeWidth={2.4} />
                  {/* CHỮ TRẮNG 100% — CANH ĐỀU KHÔNG LỌT RA NGOÀI */}
                  <span className="text-[11px] font-extrabold text-white text-center leading-tight truncate px-1 w-full drop-shadow-xs">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <Separator className="bg-slate-200" />

          {/* CẢ PHẦN CON CỦA CÁC THANH CÔNG CỤ: TOÀN BỘ ĐỔI THÀNH MÀU CHUẨN VÀ CHỮ MÀU TRẮNG */}
          <div className="flex-1 flex flex-col gap-3 min-h-[340px]">
            {/* TAB 1: MẪU GIÁO ÁN — AMETHYST #9956DE CHỮ TRẮNG */}
            {activeTab === "templates" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#9956DE" }}
                >
                  <LayoutTemplate className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    MẪU GIÁO ÁN CAN THIỆP 1-CHẠM
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={addPecsTemplate}
                    className="w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#9956DE",
                      boxShadow: "0 3.5px 0px #7D3EC0",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/25 text-white grid place-items-center font-bold text-lg shrink-0 shadow-2xs">
                        🗂️
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">
                          Thẻ PECS Giao tiếp
                        </p>
                        <p className="text-[11px] text-white/90 truncate font-medium">
                          Khung viền + ô ảnh + nhãn chữ chuẩn
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={addFlashcardTemplate}
                    className="w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#FFB365",
                      boxShadow: "0 3.5px 0px #E59845",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/25 text-white grid place-items-center font-bold text-lg shrink-0 shadow-2xs">
                        🔤
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">
                          Flashcard Từ vựng
                        </p>
                        <p className="text-[11px] text-white/90 truncate font-medium">
                          Thẻ học từ mới kèm tranh minh họa
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={addScheduleTemplate}
                    className="w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#1FA7E1",
                      boxShadow: "0 3.5px 0px #168BC0",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/25 text-white grid place-items-center font-bold text-lg shrink-0 shadow-2xs">
                        📅
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">
                          Lịch trình 3 bước
                        </p>
                        <p className="text-[11px] text-white/90 truncate font-medium">
                          Quy trình hình ảnh Sáng - Trưa - Tối
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: VĂN BẢN — SLATE BLUE #7274ED CHỮ TRẮNG */}
            {activeTab === "text" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#7274ED" }}
                >
                  <Type className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    CHÈN VĂN BẢN VÀO BÀI HỌC
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => addText("TIÊU ĐỀ BÀI HỌC", 32, "bold")}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#7274ED",
                      boxShadow: "0 3.5px 0px #595BCF",
                    }}
                  >
                    <span className="text-sm font-extrabold text-white">
                      Tiêu đề lớn (32px)
                    </span>
                    <span className="text-xs font-extrabold text-white bg-white/25 px-2 py-0.5 rounded-md">
                      Chữ Đậm
                    </span>
                  </button>

                  <button
                    onClick={() => addText("Tiêu đề phụ hướng dẫn", 22, 600)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#1FA7E1",
                      boxShadow: "0 3.5px 0px #168BC0",
                    }}
                  >
                    <span className="text-sm font-extrabold text-white">
                      Tiêu đề phụ (22px)
                    </span>
                    <span className="text-xs font-extrabold text-white bg-white/25 px-2 py-0.5 rounded-md">
                      Chữ Vừa
                    </span>
                  </button>

                  <button
                    onClick={() => addText("Nội dung mô tả hoặc câu hỏi cho trẻ...", 16, "normal")}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#6ED1CF",
                      boxShadow: "0 3.5px 0px #4BB3B1",
                    }}
                  >
                    <span className="text-xs font-extrabold text-white">
                      Đoạn văn bản thường (16px)
                    </span>
                    <span className="text-xs font-extrabold text-white bg-white/25 px-2 py-0.5 rounded-md">
                      Chữ Nhỏ
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: HÌNH KHỐI — SUMMER SKY #1FA7E1 CHỮ TRẮNG */}
            {activeTab === "shapes" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#1FA7E1" }}
                >
                  <Shapes className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    HÌNH KHỐI HỌC TẬP
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={addRect}
                    className="p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#1FA7E1",
                      boxShadow: "0 3.5px 0px #168BC0",
                    }}
                  >
                    <Square className="w-7 h-7 text-white" strokeWidth={2.4} />
                    <span className="text-xs font-extrabold text-white">
                      Hình chữ nhật
                    </span>
                  </button>

                  <button
                    onClick={addCircle}
                    className="p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#6ED1CF",
                      boxShadow: "0 3.5px 0px #4BB3B1",
                    }}
                  >
                    <Circle className="w-7 h-7 text-white" strokeWidth={2.4} />
                    <span className="text-xs font-extrabold text-white">
                      Hình tròn
                    </span>
                  </button>

                  <button
                    onClick={addStar}
                    className="p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#FFB365",
                      boxShadow: "0 3.5px 0px #E59845",
                    }}
                  >
                    <Star className="w-7 h-7 text-white fill-white" strokeWidth={2} />
                    <span className="text-xs font-extrabold text-white">
                      Ngôi sao thưởng
                    </span>
                  </button>

                  <button
                    onClick={addHeart}
                    className="p-3.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#FF8B8B",
                      boxShadow: "0 3.5px 0px #E06D6D",
                    }}
                  >
                    <Heart className="w-7 h-7 text-white fill-white" strokeWidth={2} />
                    <span className="text-xs font-extrabold text-white">
                      Trái tim khen
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: TẢI ẢNH — DOWNY #6ED1CF CHỮ TRẮNG */}
            {activeTab === "media" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#6ED1CF" }}
                >
                  <ImageIcon className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    TẢI HÌNH ẢNH HỌC LIỆU
                  </h3>
                </div>

                <button
                  onClick={triggerFileSelect}
                  disabled={uploadingImage}
                  className="w-full h-12 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:translate-y-0.5 transition-all"
                  style={{
                    backgroundColor: "#6ED1CF",
                    boxShadow: "0 3.5px 0px #4BB3B1",
                  }}
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-white" />
                  )}
                  <span className="text-white font-extrabold">
                    {uploadingImage ? "Đang nạp ảnh..." : "Tải ảnh từ máy tính"}
                  </span>
                </button>

                <div
                  className="p-3.5 rounded-2xl text-white shadow-xs leading-relaxed"
                  style={{
                    backgroundColor: "#7274ED",
                    boxShadow: "0 3px 0px #595BCF",
                  }}
                >
                  <p className="font-extrabold text-white text-xs mb-1">💡 Hướng dẫn chọn ảnh:</p>
                  <p className="text-[11px] text-white/90 font-medium">
                    Nên chọn ảnh thực tế rõ nét hoặc ảnh PNG nền trong suốt để trẻ tập trung tốt nhất.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: NHÃN DÁN — PASTEL GREEN #75D06A CHỮ TRẮNG */}
            {activeTab === "stickers" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#75D06A" }}
                >
                  <Smile className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    NHÃN DÁN STICKER MẦM NON
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-2 p-2 rounded-2xl bg-slate-100/90 border border-slate-200">
                  {QUICK_STICKERS.map((stk) => (
                    <button
                      key={stk.emoji}
                      onClick={() => addSticker(stk.emoji)}
                      className="h-12 rounded-xl text-2xl flex items-center justify-center transition-all hover:scale-110 active:translate-y-0.5 cursor-pointer shadow-xs"
                      style={{
                        backgroundColor: stk.color,
                        boxShadow: `0 3px 0px ${stk.shadow}`,
                      }}
                      title={stk.name}
                    >
                      {stk.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: KHUNG THẺ — TEXAS ROSE #FFB365 CHỮ TRẮNG */}
            {activeTab === "frames" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#FFB365" }}
                >
                  <Frame className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    KHUNG THẺ HỌC LIỆU
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={addRect}
                    className="w-full p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#FFB365",
                      boxShadow: "0 3.5px 0px #E59845",
                    }}
                  >
                    <span className="text-xs font-extrabold text-white">Khung thẻ chữ nhật chuẩn</span>
                    <span className="text-[10px] bg-white/30 text-white font-mono font-bold px-2 py-0.5 rounded">
                      140 × 100
                    </span>
                  </button>

                  <button
                    onClick={addCircle}
                    className="w-full p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5"
                    style={{
                      backgroundColor: "#75D06A",
                      boxShadow: "0 3.5px 0px #59B84E",
                    }}
                  >
                    <span className="text-xs font-extrabold text-white">Huy hiệu tròn điểm thưởng</span>
                    <span className="text-[10px] bg-white/30 text-white font-mono font-bold px-2 py-0.5 rounded">
                      R = 55
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 7: BẢNG MÀU — MONA LISA #FF8B8B CHỮ TRẮNG */}
            {activeTab === "palette" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#FF8B8B" }}
                >
                  <Palette className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    BẢNG 8 MÀU CHUẨN BINO
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {BINO_PALETTE.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        if (activeObject) {
                          setFillColor(c.hex);
                          toast.success(`Đã đổi màu sang ${c.label}`);
                        } else {
                          toast.info("Vui lòng nhấp chọn 1 phần tử trên canvas trước!");
                        }
                      }}
                      className="p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                      style={{
                        backgroundColor: c.hex,
                        boxShadow: `0 3px 0px ${c.shadow}`,
                      }}
                    >
                      <span className="text-xs font-extrabold text-white truncate drop-shadow-xs">
                        {c.label}
                      </span>
                      <span className="w-4 h-4 rounded-full bg-white shadow-2xs shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: MÀU NỀN CANVAS — ILLUSION #FB96BB CHỮ TRẮNG */}
            {activeTab === "canvas" && (
              <div className="space-y-3 animate-fade-in">
                <div
                  className="px-3 py-2 rounded-xl text-white flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: "#FB96BB" }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    MÀU NỀN TRANG THIẾT KẾ
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { color: "#FFFFFF", name: "Trắng tinh", shadow: "#CBD5E1", isWhite: true },
                    { color: "#6ED1CF", name: "Nền Xanh ngọc", shadow: "#4BB3B1" },
                    { color: "#75D06A", name: "Nền Xanh lá", shadow: "#59B84E" },
                    { color: "#FFB365", name: "Nền Cam vàng", shadow: "#E59845" },
                    { color: "#FF8B8B", name: "Nền Đỏ hồng", shadow: "#E06D6D" },
                    { color: "#FB96BB", name: "Nền Hồng phấn", shadow: "#DC779D" },
                    { color: "#1FA7E1", name: "Nền Xanh biển", shadow: "#168BC0" },
                    { color: "#9956DE", name: "Nền Tím nhạt", shadow: "#7D3EC0" },
                  ].map((bg) => (
                    <button
                      key={bg.color}
                      onClick={() => setCanvasBackground(bg.color)}
                      className="p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between shadow-xs active:translate-y-0.5"
                      style={{
                        backgroundColor: bg.color,
                        boxShadow: `0 3px 0px ${bg.shadow}`,
                      }}
                    >
                      <span
                        className={`text-xs font-extrabold truncate ${
                          bg.isWhite ? "text-slate-800" : "text-white drop-shadow-xs"
                        }`}
                      >
                        {bg.name}
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                          bg.isWhite ? "border-2 border-slate-400" : "bg-white/80"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <Separator className="bg-slate-200 my-1" />

                <button
                  onClick={clearCanvas}
                  className="w-full h-11 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                  style={{
                    backgroundColor: "#7274ED",
                    boxShadow: "0 3px 0px #595BCF",
                  }}
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                  Đặt lại trang về màu trắng
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ------------------------------------------------------------
            VÙNG GIỮA: Canvas Editor tương tác trung tâm
            Kích thước chuẩn 800 × 560 px, cân đối tuyệt đối
            ------------------------------------------------------------ */}
        <section className="flex flex-col items-center gap-3 shrink-0">
          {/* Thanh công cụ phụ phía trên Canvas (Cân đối & Tiện ích)
              LƯU Ý: KHÔNG ĐỂ TÊN MÀU TRÊN TAB/STATUS THEO YÊU CẦU */}
          <div className="w-[804px] flex items-center justify-between px-3.5 py-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-lg text-white text-xs font-extrabold shadow-xs"
                style={{ backgroundColor: currentTabInfo.hex }}
              >
                📐 800 × 560 px
              </span>
              <span className="text-xs font-bold text-slate-700">
                Đang mở: <strong className="text-slate-950 font-extrabold">{currentTabInfo.label}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={bringForward}
                disabled={!activeObject}
                className="h-8 px-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40"
                style={{
                  backgroundColor: "#7274ED",
                  boxShadow: "0 2px 0px #595BCF",
                }}
              >
                <BringToFront className="w-3.5 h-3.5 text-white" />
                Lên trước
              </button>
              <button
                onClick={sendBackward}
                disabled={!activeObject}
                className="h-8 px-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40"
                style={{
                  backgroundColor: "#1FA7E1",
                  boxShadow: "0 2px 0px #168BC0",
                }}
              >
                <SendToBack className="w-3.5 h-3.5 text-white" />
                Xuống sau
              </button>
              <Separator orientation="vertical" className="h-4 bg-slate-200 mx-1" />
              <button
                onClick={clearCanvas}
                className="h-8 px-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all"
                style={{
                  backgroundColor: "#FF8B8B",
                  boxShadow: "0 2px 0px #E06D6D",
                }}
              >
                <RefreshCw className="w-3.5 h-3.5 text-white" />
                Xóa hết
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-2 border-slate-300 bg-white">
            {/* 4 dấu góc định vị thị giác tinh tế theo 4 màu chuẩn */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#9956DE]" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#1FA7E1]" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#FF8B8B]" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#75D06A]" />

            <canvas ref={canvasRef} id="lesson-builder-canvas" />
          </div>

          {/* Dòng hướng dẫn thao tác thẳng hàng */}
          <p className="text-xs font-semibold text-slate-500 text-center">
            💡 Nhấp vào phần tử để chọn • Kéo thả để di chuyển • Kéo các góc vuông để phóng to/thu nhỏ
          </p>
        </section>

        {/* ------------------------------------------------------------
            CỘT PHẢI: Properties Inspector & Mẹo thiết kế giáo án
            TOÀN BỘ PHẦN "MẸO THIẾT KẾ GIÁO ÁN" ĐỀU DÙNG MÀU CHUẨN VÀ CHỮ TRẮNG
            Kích thước: 280px cân xứng đối xứng với cột trái
            ------------------------------------------------------------ */}
        <aside className="w-[280px] shrink-0 sticky top-24">
          {activeObject ? (
            <div className="p-4 rounded-3xl bg-white shadow-sm border-2 border-slate-200">
              <PropertiesPanel
                activeObject={activeObject}
                onSetFill={setFillColor}
                onSetStroke={setStrokeColor}
                onSetFont={setFontFamily}
                onDelete={deleteActive}
                onBringForward={bringForward}
                onSendBackward={sendBackward}
              />
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-3.5">
              {/* Header Mẹo thiết kế giáo án — Màu Slate Blue #7274ED CHỮ TRẮNG */}
              <div
                className="flex items-center gap-2.5 p-3 rounded-2xl shadow-xs"
                style={{
                  backgroundColor: "#7274ED",
                  boxShadow: "0 3.5px 0px #595BCF",
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 text-white grid place-items-center shadow-xs shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider leading-tight">
                    MẸO THIẾT KẾ GIÁO ÁN
                  </h3>
                  <p className="text-[10px] text-white/80 font-medium">Trẻ mầm non & can thiệp</p>
                </div>
              </div>

              {/* TOÀN BỘ CÁC TAB / THẺ MẸO ĐỔI THÀNH MÀU CHUẨN VÀ CHỮ TRẮNG 100% */}
              <div className="space-y-2.5 text-xs">
                {/* Thẻ 1: Amethyst #9956DE — CHỮ TRẮNG */}
                <div
                  className="p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102"
                  style={{
                    backgroundColor: "#9956DE",
                    boxShadow: "0 3px 0px #7D3EC0",
                  }}
                >
                  <p className="font-extrabold text-white text-xs mb-1 flex items-center gap-1.5">
                    <span>🎯</span> Trực quan hóa hình ảnh
                  </p>
                  <p className="text-white/95 text-[11px] font-medium leading-relaxed">
                    Sử dụng thẻ PECS hoặc hình vẽ to rõ kết hợp chữ in hoa để trẻ dễ nhận diện.
                  </p>
                </div>

                {/* Thẻ 2: Summer Sky #1FA7E1 — CHỮ TRẮNG */}
                <div
                  className="p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102"
                  style={{
                    backgroundColor: "#1FA7E1",
                    boxShadow: "0 3px 0px #168BC0",
                  }}
                >
                  <p className="font-extrabold text-white text-xs mb-1 flex items-center gap-1.5">
                    <span>🌈</span> Màu sắc tương phản
                  </p>
                  <p className="text-white/95 text-[11px] font-medium leading-relaxed">
                    Chọn đường viền đậm cho thẻ để tạo ranh giới thị giác rõ ràng cho trẻ có giảm chú ý.
                  </p>
                </div>

                {/* Thẻ 3: Pastel Green #75D06A — CHỮ TRẮNG */}
                <div
                  className="p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102"
                  style={{
                    backgroundColor: "#75D06A",
                    boxShadow: "0 3px 0px #59B84E",
                  }}
                >
                  <p className="font-extrabold text-white text-xs mb-1 flex items-center gap-1.5">
                    <span>🔤</span> Font chữ mộc mạc
                  </p>
                  <p className="text-white/95 text-[11px] font-medium leading-relaxed">
                    Nên dùng font <strong>Inter</strong> hoặc <strong>Roboto</strong> để chữ tròn trịa, không bị rối mắt.
                  </p>
                </div>

                {/* Thẻ 4: Mona Lisa #FF8B8B — CHỮ TRẮNG */}
                <div
                  className="p-3 rounded-2xl text-white shadow-xs transition-transform hover:scale-102"
                  style={{
                    backgroundColor: "#FF8B8B",
                    boxShadow: "0 3px 0px #E06D6D",
                  }}
                >
                  <p className="font-extrabold text-white text-xs mb-1 flex items-center gap-1.5">
                    <span>🖨️</span> In ấn chất lượng cao
                  </p>
                  <p className="text-white/95 text-[11px] font-medium leading-relaxed">
                    Dùng nút <strong>Xuất File PDF (300 DPI)</strong> để bài in sắc nét trên máy in nhiệt hoặc máy in màu.
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* ============================================================
          3. MODALS / DIALOGS: Nâng cấp tài khoản & Lưu Template
          ============================================================ */}
      {/* Modal Nâng Cấp */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-rose-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 grid place-items-center">
              <Lock className="w-6 h-6 text-[#FF8B8B]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">
                Nâng cấp quyền xuất file
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chức năng xuất thiết kế học liệu (PNG, JPG, PDF 300 DPI) chỉ dành riêng cho tài khoản <strong>Giáo viên</strong> hoặc <strong>Premium</strong>.
              </p>
            </div>
            <div className="pt-2 flex gap-2.5">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 h-10 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer font-bold text-xs"
              >
                Để sau
              </Button>
              <Link
                to="/create-child"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 h-10 bg-[#7274ED] text-white font-bold rounded-xl flex items-center justify-center hover:opacity-90 transition-all text-xs text-center border-none shadow-sm cursor-pointer"
              >
                Nâng cấp ngay
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lưu Template */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-purple-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 grid place-items-center">
              <Shapes className="w-6 h-6 text-[#9956DE]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">
                Lưu Template thiết kế
              </h3>
              <p className="text-xs text-slate-600">
                Nhập tên để lưu bài học này vào thư viện cá nhân của bạn.
              </p>
            </div>
            <input
              type="text"
              placeholder="Ví dụ: Thẻ nhận biết quả táo cho bé"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-[#9956DE] text-xs font-semibold text-slate-900 bg-white transition-colors"
              autoFocus
            />
            <div className="pt-2 flex gap-2.5">
              <Button
                variant="outline"
                onClick={() => setShowSaveTemplateModal(false)}
                className="flex-1 h-10 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer font-bold text-xs"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || savingTemplate}
                className="flex-1 h-10 bg-[#9956DE] hover:opacity-90 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
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
