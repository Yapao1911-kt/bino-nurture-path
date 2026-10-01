// ============================================================
// CreateChildForm Component
// File: src/components/CreateChildForm.tsx
// Mô tả: Form tạo hồ sơ trẻ với validation, gọi API backend,
//         và trải nghiệm người dùng mượt mà.
// ============================================================

import { useState } from "react";
import {
  Heart,
  Baby,
  MapPin,
  Stethoscope,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createChildFn } from "@/routes/api/children";
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

// -------------------------------------------------------
// Định nghĩa kiểu dữ liệu (TypeScript Interfaces)
// -------------------------------------------------------

/** Dữ liệu form nhập vào */
interface ChildFormData {
  name: string;
  age: string; // Lưu dạng string để quản lý input, convert sang number khi submit
  address: string;
  condition: string;
}

/** Lỗi validation cho từng trường */
interface FormErrors {
  name?: string;
  age?: string;
}

/** Trạng thái phản hồi từ API */
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
// API Base URL — điều chỉnh theo môi trường
// -------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// -------------------------------------------------------
// Cute Bear Illustration (SVG inline — dùng lại style của project)
// -------------------------------------------------------
function CuteBear({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      {/* Ears */}
      <circle cx="40" cy="42" r="16" fill="#FFB365" />
      <circle cx="100" cy="42" r="16" fill="#FFB365" />
      <circle cx="40" cy="42" r="8" fill="#FFF5EA" />
      <circle cx="100" cy="42" r="8" fill="#FFF5EA" />
      {/* Head */}
      <circle cx="70" cy="78" r="44" fill="#FFB365" />
      {/* Snout */}
      <ellipse cx="70" cy="92" rx="22" ry="16" fill="#FFF5EA" />
      {/* Eyes */}
      <circle cx="56" cy="74" r="4" fill="#4B5563" />
      <circle cx="84" cy="74" r="4" fill="#4B5563" />
      <circle cx="57.5" cy="72.5" r="1.2" fill="#FFFFFF" />
      <circle cx="85.5" cy="72.5" r="1.2" fill="#FFFFFF" />
      {/* Nose */}
      <ellipse cx="70" cy="88" rx="4" ry="3" fill="#4B5563" />
      {/* Smile */}
      <path
        d="M62 96 Q70 104 78 96"
        stroke="#4B5563"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Blush */}
      <circle cx="48" cy="88" r="5" fill="#FB96BB" opacity="0.7" />
      <circle cx="92" cy="88" r="5" fill="#FB96BB" opacity="0.7" />
    </svg>
  );
}

// -------------------------------------------------------
// Cute Star (SVG inline)
// -------------------------------------------------------
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
  // -------------------------------------------------------
  // State Management — Quản lý trạng thái với useState
  // -------------------------------------------------------

  /** Dữ liệu form */
  const [formData, setFormData] = useState<ChildFormData>({
    name: "",
    age: "",
    
    condition: "",
  });

  /** Lỗi validation (hiển thị dưới mỗi ô nhập) */
  const [errors, setErrors] = useState<FormErrors>({});

  /** Trạng thái đang gọi API */
  const [isLoading, setIsLoading] = useState(false);

  /** Phản hồi từ API (thành công hoặc lỗi) */
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  /** Trạng thái đã từng bấm submit chưa (để hiển thị validation realtime) */
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // -------------------------------------------------------
  // Validation — Kiểm tra tính hợp lệ dữ liệu ở Frontend
  // -------------------------------------------------------
  function validateForm(): FormErrors {
    const newErrors: FormErrors = {};

    // Kiểm tra trường "Tên" — bắt buộc, không được rỗng
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên của trẻ.";
    }

    // Kiểm tra trường "Tuổi" — bắt buộc, phải là số nguyên hợp lệ 0-18
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

  // -------------------------------------------------------
  // Xử lý thay đổi input — cập nhật state và clear lỗi
  // -------------------------------------------------------
  function handleInputChange(field: keyof ChildFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Nếu đã từng submit, validate realtime để UX mượt hơn
    if (hasSubmitted) {
      const updatedData = { ...formData, [field]: value };
      const tempErrors = { ...errors };

      // Clear lỗi của field đang thay đổi nếu đã hợp lệ
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

  // -------------------------------------------------------
  // handleSubmit — Xử lý gửi form đến API Backend
  // -------------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);

    // Bước 1: Validate dữ liệu phía Frontend
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Nếu có lỗi → dừng lại, KHÔNG gọi API
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Bước 2: Chuẩn bị payload gửi đi
    setIsLoading(true);
    setApiResponse(null);

    // Tính toán date_of_birth dựa vào age
    const ageNum = parseInt(formData.age, 10);
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - ageNum;
    const dobString = `${birthYear}-01-01`;

    // Lấy nhãn tình trạng phát triển của trẻ
    const selectedCondition = CONDITION_OPTIONS.find((opt) => opt.value === formData.condition);
    const challenge = selectedCondition?.label || formData.condition || "Phát triển bình thường";

    try {
      // Lấy token xác thực từ Supabase Client
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const simulatedRole = localStorage.getItem("bino_simulated_role");

      // Nếu đang chạy ở chế độ giả lập offline (hoặc chưa đăng nhập) thì xử lý lưu local luôn
      if (!token || simulatedRole) {
        const localChildren = JSON.parse(localStorage.getItem("bino_local_children") || "[]");
        const mockChild = {
          id: Math.random().toString(36).substring(2),
          full_name: formData.name.trim(),
          date_of_birth: dobString,
          developmental_challenges: [challenge],
          communication_level: "Bình thường",
          created_at: new Date().toISOString(),
        };
        localChildren.push(mockChild);
        localStorage.setItem("bino_local_children", JSON.stringify(localChildren));

        setApiResponse({
          type: "success",
          message: simulatedRole
            ? `Chế độ dùng thử (Offline): Đã tạo hồ sơ cho bé "${formData.name.trim()}" thành công! Đăng nhập tài khoản thật để đồng bộ đám mây.`
            : `Chế độ dùng thử (Offline): Đã tạo hồ sơ cho bé "${formData.name.trim()}" thành công! Bạn có thể Đăng nhập để lưu trên cloud.`,
        });
        setFormData({ name: "", age: "",  condition: "" });
        setErrors({});
        setHasSubmitted(false);
        setTimeout(() => { navigate({ to: "/" }); }, 1500);
        return;
      }

      // Gọi Server Function của TanStack Start
      // Nếu deploy Vercel mà không có token thì dùng offline
      const response = (await createChildFn({
        data: {
          full_name: formData.name.trim(),
          date_of_birth: dobString,
          developmental_challenges: [challenge],
          communication_level: "Bình thường", // Giá trị mặc định
        },
      })) as Response;

      const data = await response.json();

      if (response.ok) {
        // Thành công (HTTP 200/201)
        setApiResponse({
          type: "success",
          message: "Tạo hồ sơ cho trẻ thành công!",
        });

        // Reset form sau khi tạo thành công
        setFormData({ name: "", age: "",  condition: "" });
        setErrors({});
        setHasSubmitted(false);
        setTimeout(() => { navigate({ to: "/" }); }, 1500);
      } else {
        // Lỗi từ Server Function
        const errorMessages = data.errors
          ? data.errors.join(". ")
          : data.message || "Đã xảy ra lỗi khi tạo hồ sơ.";

        setApiResponse({
          type: "error",
          message: errorMessages,
        });
      }
    } catch (err: any) {
      // Xử lý lỗi mạng hoặc lỗi hệ thống khác
      console.error("Create child form error:", err);
      setApiResponse({
        type: "error",
        message: "Không thể kết nối đến máy chủ hoặc đã xảy ra lỗi không xác định.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // -------------------------------------------------------
  // RENDER — Giao diện form
  // -------------------------------------------------------
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* ============================================
          Background Decorations — Pastel blobs + illustrations
          ============================================ */}
      <div
        className="absolute top-10 -left-20 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(31, 167, 225, 0.15)", opacity: 0.55 }}
      />
      <div
        className="absolute -top-10 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(110, 209, 207, 0.15)", opacity: 0.55 }}
      />
      <div
        className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(255, 139, 139, 0.15)", opacity: 0.55 }}
      />
      <div
        className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(255, 179, 101, 0.15)", opacity: 0.45 }}
      />

      {/* Floating cute illustrations */}
      <CuteStar className="hidden sm:block absolute top-28 left-[6%] w-12 rotate-[-12deg] animate-[float_5s_ease-in-out_infinite]" />
      <CuteStar
        className="hidden sm:block absolute bottom-32 right-[10%] w-10 rotate-[18deg] opacity-80"
        color="#FFB365"
      />
      <CuteBear className="hidden lg:block absolute bottom-16 left-[5%] w-24 opacity-70 rotate-[-8deg] animate-[float_7s_ease-in-out_infinite]" />

      {/* ============================================
          Main Content
          ============================================ */}
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header — Nút quay lại + Tiêu đề */}
        <div className="text-center mb-10 animate-fade-in">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về trang chủ
          </a>

          {/* Sticker-style badge */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 text-ink text-sm font-semibold shadow-[4px_4px_0px_rgba(168,230,207,0.4)] -rotate-2 hover:rotate-0 transition-transform"
              style={{ borderColor: "var(--brand-mint)" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "var(--brand-mint)" }} />
              Tạo hồ sơ mới
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            <span
              className="inline-block px-3 py-1 rounded-xl shadow-[6px_6px_0px_#1FA7E1] rotate-1"
              style={{ background: "var(--brand-blue-soft)" }}
            >
              Tạo hồ sơ
            </span>{" "}
            <span
              className="inline-block px-3 py-1 rounded-xl shadow-[6px_6px_0px_#75D06A] -rotate-1 mt-2 sm:mt-0"
              style={{ background: "var(--brand-mint-soft)" }}
            >
              cho bé yêu
            </span>
          </h1>

          <p className="mt-5 text-ink/70 leading-relaxed max-w-md mx-auto">
            Nhập thông tin cơ bản để Bino có thể xây dựng lộ trình phù hợp nhất cho con.
          </p>
        </div>

        {/* ============================================
            Alert Notification — Thông báo thành công / lỗi
            ============================================ */}
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
              <AlertTitle className="font-semibold">
                {apiResponse.type === "success" ? "🎉 Thành công!" : "⚠️ Có lỗi xảy ra"}
              </AlertTitle>
              <AlertDescription>{apiResponse.message}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* ============================================
            Form Card — Paper cutout style
            ============================================ */}
        <Card className="relative rounded-[2rem] border-0 bg-white shadow-[12px_12px_0px_#f3f3f3] rotate-0 hover:rotate-0 transition-transform animate-fade-in">
          {/* Decorative sticker on top-right */}
          <div
            className="absolute -top-3 -right-3 w-16 h-16 rounded-full grid place-items-center shadow-md z-10"
            style={{ background: "var(--brand-pink-soft)" }}
          >
            <Heart className="w-7 h-7" style={{ color: "#FF8B8B" }} />
          </div>

          <CardHeader className="pb-2 pt-8 px-6 sm:px-8">
            <CardTitle className="text-xl font-bold text-ink flex items-center gap-2">
              <Baby className="w-5 h-5" style={{ color: "var(--brand-blue)" }} />
              Thông tin hồ sơ trẻ
            </CardTitle>
            <CardDescription className="text-ink/60">
              Các trường có dấu <span className="text-red-400 font-semibold">*</span> là bắt buộc
              nhập.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* ----- Trường 1: Tên của trẻ (bắt buộc) ----- */}
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
                {/* Thông báo lỗi validation — hiển thị dưới ô nhập */}
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* ----- Trường 2: Tuổi (bắt buộc) ----- */}
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
                  placeholder="Ví dụ: 5"
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

              {/* ----- Trường 4: Tình trạng của trẻ (Dropdown Select) ----- */}
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

            
  {/* ----- Nút Submit ----- */}
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
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      <span>Tạo hồ sơ cho bé</span>
                    </>
                  )}
                </Button>
              </div>

              {/* ----- Ghi chú nhỏ cuối form ----- */}
              <p className="text-center text-xs text-ink/50 leading-relaxed">
                Thông tin sẽ được bảo mật và chỉ sử dụng để xây dựng lộ trình phù hợp cho trẻ.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Decorative floating chip — giống style Hero */}
        <div className="flex justify-center mt-8">
          <div
            className="px-5 py-2.5 rounded-2xl bg-white border-2 border-white shadow-[4px_4px_0px_#75D06A] flex items-center gap-2 rotate-[3deg] animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Heart className="w-4 h-4" style={{ color: "#FF8B8B" }} />
            <span className="text-xs font-semibold text-ink">
              Mỗi đứa trẻ đều đặc biệt 💛
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
