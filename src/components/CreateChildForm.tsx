// ============================================================
// CreateChildForm Component
// File: src/components/CreateChildForm.tsx
// Mô tả: Quản lý & Tạo hồ sơ trẻ cho tài khoản người dùng,
//         đồng bộ với Database và Progress Tracker.
// ============================================================

import { useState, useEffect } from "react";
import {
  Heart,
  Baby,
  Stethoscope,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  BarChart2,
  Bot,
} from "lucide-react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  fetchAndSyncChildren,
  saveNewChild,
  deleteChild,
  setActiveChild,
  type ChildData,
} from "@/lib/child-storage";

// -------------------------------------------------------
// Định nghĩa kiểu dữ liệu (TypeScript Interfaces)
// -------------------------------------------------------

interface ChildFormData {
  name: string;
  age: string;
  condition: string;
}

interface FormErrors {
  name?: string;
  age?: string;
}

interface ApiResponse {
  type: "success" | "error";
  message: string;
}

// -------------------------------------------------------
// Các tùy chọn tình trạng phát triển của trẻ
// -------------------------------------------------------
const CONDITION_OPTIONS = [
  { value: "normal", label: "Phát triển bình thường" },
  { value: "autism", label: "Rối loạn phổ tự kỷ (ASD)" },
  { value: "adhd", label: "Tăng động giảm chú ý (ADHD)" },
  { value: "speech_delay", label: "Chậm nói / Chậm ngôn ngữ" },
  { value: "intellectual", label: "Chậm phát triển trí tuệ" },
  { value: "down_syndrome", label: "Hội chứng Down" },
  { value: "cerebral_palsy", label: "Bại não" },
  { value: "other", label: "Khác" },
];

// -------------------------------------------------------
// Cute Bear & Star SVG Decorations
// -------------------------------------------------------
function CuteBear({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <circle cx="40" cy="42" r="16" fill="#FFB365" />
      <circle cx="100" cy="42" r="16" fill="#FFB365" />
      <circle cx="40" cy="42" r="8" fill="#FFF5EA" />
      <circle cx="100" cy="42" r="8" fill="#FFF5EA" />
      <circle cx="70" cy="78" r="44" fill="#FFB365" />
      <ellipse cx="70" cy="92" rx="22" ry="16" fill="#FFF5EA" />
      <circle cx="56" cy="74" r="4" fill="#4B5563" />
      <circle cx="84" cy="74" r="4" fill="#4B5563" />
      <circle cx="57.5" cy="72.5" r="1.2" fill="#FFFFFF" />
      <circle cx="85.5" cy="72.5" r="1.2" fill="#FFFFFF" />
      <ellipse cx="70" cy="88" rx="4" ry="3" fill="#4B5563" />
      <path
        d="M62 96 Q70 104 78 96"
        stroke="#4B5563"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="48" cy="88" r="5" fill="#FB96BB" opacity="0.7" />
      <circle cx="92" cy="88" r="5" fill="#FB96BB" opacity="0.7" />
    </svg>
  );
}

function CuteStar({
  className = "",
  color = "#FFB365",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M32 6 L39 24 L58 26 L43 38 L48 56 L32 46 L16 56 L21 38 L6 26 L25 24 Z"
        fill={color}
        stroke="#4B5563"
        strokeOpacity="0.15"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="32" r="1.8" fill="#4B5563" />
      <circle cx="38" cy="32" r="1.8" fill="#4B5563" />
      <path
        d="M28 38 Q32 41 36 38"
        stroke="#4B5563"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ============================================================
// COMPONENT CHÍNH: CreateChildForm
// ============================================================
export default function CreateChildForm() {
  const navigate = useNavigate();

  // Danh sách hồ sơ trẻ đã lưu của user
  const [children, setChildren] = useState<ChildData[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Dữ liệu form tạo mới
  const [formData, setFormData] = useState<ChildFormData>({
    name: "",
    age: "",
    condition: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Tải danh sách hồ sơ khi mount
  useEffect(() => {
    let isMounted = true;
    async function loadChildren() {
      setIsLoadingList(true);
      const list = await fetchAndSyncChildren();
      if (isMounted) {
        setChildren(list);
        setIsLoadingList(false);
        // Nếu chưa có hồ sơ nào thì tự động hiện form tạo
        if (list.length === 0) {
          setShowCreateForm(true);
        }
      }
    }
    loadChildren();
    return () => {
      isMounted = false;
    };
  }, []);

  function validateForm(): FormErrors {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên của trẻ.";
    }
    if (!formData.age) {
      newErrors.age = "Vui lòng nhập tuổi của trẻ.";
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 18) {
        newErrors.age = "Tuổi phải là số nguyên từ 0 đến 18.";
      }
    }
    return newErrors;
  }

  function handleInputChange(field: keyof ChildFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (hasSubmitted) {
      const updatedData = { ...formData, [field]: value };
      const tempErrors = { ...errors };

      if (field === "name" && updatedData.name.trim()) {
        delete tempErrors.name;
      }
      if (field === "age") {
        const ageNum = parseInt(updatedData.age, 10);
        if (updatedData.age && !isNaN(ageNum) && ageNum >= 0 && ageNum <= 18) {
          delete tempErrors.age;
        }
      }
      setErrors(tempErrors);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setApiResponse(null);

    const ageNum = parseInt(formData.age, 10);
    const selectedCondition = CONDITION_OPTIONS.find((opt) => opt.value === formData.condition);
    const challenge = selectedCondition?.label || formData.condition || "Phát triển bình thường";

    try {
      const result = await saveNewChild({
        name: formData.name.trim(),
        age: ageNum,
        condition: challenge,
        developmentalChallenges: [challenge],
      });

      if (result.success && result.child) {
        setApiResponse({
          type: "success",
          message: "Tạo hồ sơ cho bé thành công! Đang chuyển đến trang Theo dõi tiến trình...",
        });

        // Cập nhật state danh sách
        setChildren((prev) => [result.child!, ...prev.filter((c) => c.id !== result.child!.id)]);
        setFormData({ name: "", age: "", condition: "" });
        setErrors({});
        setHasSubmitted(false);

        // Chuyển hướng trực tiếp đến Progress Tracker để phụ huynh xem tiến triển của bé
        setTimeout(() => {
          navigate({ to: "/progress-tracker" });
        }, 1200);
      } else {
        setApiResponse({
          type: "error",
          message: result.error || "Đã xảy ra lỗi khi tạo hồ sơ.",
        });
      }
    } catch (err: any) {
      console.error("Create child error:", err);
      setApiResponse({
        type: "error",
        message: err.message || "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteChild = async (childId: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa hồ sơ của ${name}?`)) return;
    await deleteChild(childId);
    const updated = children.filter((c) => c.id !== childId);
    setChildren(updated);
    if (updated.length === 0) {
      setShowCreateForm(true);
    }
  };

  const handleSelectChildAndGo = (child: ChildData, destination: "/progress-tracker" | "/ai-assistant") => {
    setActiveChild(child);
    navigate({ to: destination });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Pastel background blobs */}
      <div
        className="absolute top-10 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(31, 167, 225, 0.15)", opacity: 0.55 }}
      />
      <div
        className="absolute -top-10 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(110, 209, 207, 0.15)", opacity: 0.55 }}
      />
      <div
        className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(255, 139, 139, 0.15)", opacity: 0.55 }}
      />
      <div
        className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(255, 179, 101, 0.15)", opacity: 0.45 }}
      />

      <CuteStar className="hidden sm:block absolute top-28 left-[6%] w-12 rotate-[-12deg] animate-[float_5s_ease-in-out_infinite]" />
      <CuteStar
        className="hidden sm:block absolute bottom-32 right-[10%] w-10 rotate-[18deg] opacity-80"
        color="#FFB365"
      />
      <CuteBear className="hidden lg:block absolute bottom-16 left-[5%] w-24 opacity-70 rotate-[-8deg] animate-[float_7s_ease-in-out_infinite]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Navigation back to Home */}
        <div className="text-center mb-8 animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-ink transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về trang chủ Bino
          </Link>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            <span
              className="inline-block px-3 py-1 rounded-xl shadow-[5px_5px_0px_#1FA7E1] rotate-1"
              style={{ background: "var(--brand-blue-soft)" }}
            >
              Hồ sơ
            </span>{" "}
            <span
              className="inline-block px-3 py-1 rounded-xl shadow-[5px_5px_0px_#75D06A] -rotate-1 mt-2 sm:mt-0"
              style={{ background: "var(--brand-mint-soft)" }}
            >
              bé yêu
            </span>
          </h1>
          <p className="mt-3 text-ink/70 text-sm max-w-md mx-auto">
            Quản lý thông tin và kết nối dữ liệu của bé với Trợ lý AI & Theo dõi tiến trình.
          </p>
        </div>

        {/* Thông báo Alert */}
        {apiResponse && (
          <div className="mb-6 animate-fade-in">
            <Alert
              variant={apiResponse.type === "error" ? "destructive" : "default"}
              className={
                apiResponse.type === "success"
                  ? "border-2 border-[var(--brand-mint)] bg-[var(--brand-mint-soft)] text-ink"
                  : ""
              }
            >
              {apiResponse.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" style={{ color: "#75D06A" }} />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <AlertTitle className="font-bold">
                {apiResponse.type === "success" ? "🎉 Thành công!" : "⚠️ Có lỗi xảy ra"}
              </AlertTitle>
              <AlertDescription className="text-sm font-medium">{apiResponse.message}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* ========================================================
            VIEW 1: DANH SÁCH HỒ SƠ ĐÃ LƯU
            ======================================================== */}
        {!showCreateForm && children.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hồ sơ hiện có</p>
                <p className="text-base font-extrabold text-slate-800">
                  {children.length} bé trong tài khoản của bạn
                </p>
              </div>
              <Button
                onClick={() => {
                  setApiResponse(null);
                  setShowCreateForm(true);
                }}
                className="gap-2 rounded-xl font-bold bg-[#1FA7E1] hover:bg-[#1b93c7] text-white shadow-[0_3px_0px_#1478a3]"
              >
                <Plus className="w-4 h-4" />
                Tạo thêm hồ sơ bé
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              {children.map((child) => (
                <Card
                  key={child.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    {/* Left: Avatar + Details */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/70 grid place-items-center text-3xl shadow-inner shrink-0">
                        {child.avatar || "🌻"}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-extrabold text-slate-800">{child.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {child.age} tuổi
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Stethoscope className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>Tình trạng: <strong className="text-slate-800 font-semibold">{child.condition || "Phát triển bình thường"}</strong></span>
                        </div>
                        {child.createdAt && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Đã tạo: {new Date(child.createdAt).toLocaleDateString("vi-VN")}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap sm:flex-col items-stretch gap-2.5 min-w-[200px]">
                      <Button
                        onClick={() => handleSelectChildAndGo(child, "/progress-tracker")}
                        className="w-full gap-2 font-bold text-white rounded-xl shadow-[0_3px_0px_#59B84E]"
                        style={{ backgroundColor: "#75D06A" }}
                      >
                        <BarChart2 className="w-4 h-4" />
                        Xem Progress Tracker
                      </Button>
                      <Button
                        onClick={() => handleSelectChildAndGo(child, "/ai-assistant")}
                        variant="outline"
                        className="w-full gap-2 font-bold text-slate-700 border-slate-200 hover:bg-slate-50 rounded-xl"
                      >
                        <Bot className="w-4 h-4 text-[#7274ED]" />
                        Hỏi Bino AI
                      </Button>
                      <button
                        onClick={() => handleDeleteChild(child.id, child.name)}
                        className="flex items-center justify-center gap-1.5 text-xs text-rose-400 hover:text-rose-600 py-1 transition-colors font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa hồ sơ
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: FORM TẠO HỒ SƠ TRẺ
            ======================================================== */}
        {(showCreateForm || children.length === 0) && (
          <div>
            {children.length > 0 && (
              <div className="mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateForm(false)}
                  className="gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách {children.length} hồ sơ đã có
                </Button>
              </div>
            )}

            <Card className="relative rounded-[2rem] border-0 bg-white shadow-[12px_12px_0px_#f3f3f3] transition-transform animate-fade-in">
              <div
                className="absolute -top-3 -right-3 w-14 h-14 rounded-full grid place-items-center shadow-md z-10"
                style={{ background: "var(--brand-pink-soft)" }}
              >
                <Heart className="w-6 h-6" style={{ color: "#FF8B8B" }} />
              </div>

              <CardHeader className="pb-2 pt-8 px-6 sm:px-8">
                <CardTitle className="text-xl font-bold text-ink flex items-center gap-2">
                  <Baby className="w-5 h-5" style={{ color: "var(--brand-blue)" }} />
                  Thông tin hồ sơ trẻ
                </CardTitle>
                <CardDescription className="text-ink/60">
                  Các trường có dấu <span className="text-red-400 font-semibold">*</span> là bắt buộc nhập.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 sm:px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên trẻ */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="child-name"
                        className="text-sm font-semibold text-ink flex items-center gap-2"
                      >
                        <span
                          className="w-7 h-7 rounded-lg grid place-items-center"
                          style={{ background: "var(--brand-blue-soft)" }}
                        >
                          <Baby className="w-3.5 h-3.5" style={{ color: "#1FA7E1" }} />
                        </span>
                        Tên của trẻ <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="child-name"
                        type="text"
                        placeholder="Ví dụ: Bé Minh An"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={isLoading}
                        className={`h-12 rounded-xl bg-[var(--brand-blue-soft)]/30 border-2 px-4 text-ink placeholder:text-ink/40 transition-all duration-200 focus:bg-white focus:border-[var(--brand-blue)] focus:shadow-[0_0_0_3px_rgba(142,205,248,0.2)] ${
                          errors.name
                            ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                            : "border-transparent"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 flex items-center gap-1.5 animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Tuổi trẻ */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="child-age"
                        className="text-sm font-semibold text-ink flex items-center gap-2"
                      >
                        <span
                          className="w-7 h-7 rounded-lg grid place-items-center"
                          style={{ background: "var(--brand-peach-soft)" }}
                        >
                          <Sparkles className="w-3.5 h-3.5" style={{ color: "#FFB365" }} />
                        </span>
                        Tuổi <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="child-age"
                        type="number"
                        min={0}
                        max={18}
                        placeholder="Ví dụ: 4"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        disabled={isLoading}
                        className={`h-12 rounded-xl bg-[var(--brand-peach-soft)]/30 border-2 px-4 text-ink placeholder:text-ink/40 transition-all duration-200 focus:bg-white focus:border-[var(--brand-peach)] focus:shadow-[0_0_0_3px_rgba(255,211,182,0.25)] ${
                          errors.age
                            ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                            : "border-transparent"
                        }`}
                      />
                      {errors.age && (
                        <p className="text-sm text-red-500 flex items-center gap-1.5 animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {errors.age}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tình trạng của trẻ */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-ink flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-lg grid place-items-center"
                        style={{ background: "var(--brand-pink-soft)" }}
                      >
                        <Stethoscope className="w-3.5 h-3.5" style={{ color: "#FF8B8B" }} />
                      </span>
                      Tình trạng của trẻ
                    </Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleInputChange("condition", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        id="child-condition"
                        className="h-12 rounded-xl bg-[var(--brand-pink-soft)]/30 border-2 border-transparent px-4 text-ink transition-all duration-200 focus:bg-white focus:border-[var(--brand-pink)] focus:shadow-[0_0_0_3px_rgba(255,202,212,0.25)] data-[placeholder]:text-ink/40"
                      >
                        <SelectValue placeholder="Chọn tình trạng phát triển..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-[var(--brand-pink-soft)] shadow-lg">
                        {CONDITION_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="rounded-lg cursor-pointer focus:bg-[var(--brand-pink-soft)] py-2.5"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nút Submit */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className={`w-full h-14 rounded-2xl text-base font-bold shadow-[6px_6px_0px_#595BCF] transition-all duration-300 ease-out ${
                        isLoading
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:-translate-y-1 hover:shadow-[8px_8px_0px_#595BCF] active:translate-y-0 active:shadow-[4px_4px_0px_#595BCF]"
                      }`}
                      style={{
                        background: "var(--brand-blue)",
                        color: "white",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Đang lưu hồ sơ...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5" />
                          <span>Lưu hồ sơ và Mở Progress Tracker</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-xs text-ink/50 leading-relaxed">
                    Hồ sơ sẽ được lưu an toàn vào tài khoản của bạn và đồng bộ trực tiếp vào mục Theo dõi tiến trình.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div
            className="px-5 py-2.5 rounded-2xl bg-white border-2 border-white shadow-[4px_4px_0px_#75D06A] flex items-center gap-2 rotate-[3deg] animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Heart className="w-4 h-4" style={{ color: "#FF8B8B" }} />
            <span className="text-xs font-semibold text-ink">
              Mỗi đứa trẻ đều lớn lên theo một cách riêng 💛
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
