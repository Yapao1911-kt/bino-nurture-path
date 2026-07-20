import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronDown,
  Heart,
  Save,
  RefreshCw,
  Clock,
  Star,
  Smile,
  Lightbulb,
  ArrowLeft,
  CheckCircle2,
  Baby,
} from "lucide-react";

/* ===================================================================
   Mock Data — Lộ trình AI mẫu cho Trạng thái 3
   =================================================================== */
const mockRoadmapData = {
  encouragement: "Bé đang làm rất tốt, bạn cũng vậy! 💛 Dưới đây là gợi ý cho tuần này...",
  weeklyGoal: "Tăng cường giao tiếp xã hội và nhận diện cảm xúc qua trò chơi tương tác.",
  activities: [
    {
      id: 1,
      name: "Trò chơi 'Ai đang vui?'",
      description:
        "Dùng thẻ hình ảnh các khuôn mặt cảm xúc. Bé chọn thẻ khớp với biểu cảm của bạn hoặc búp bê.",
      duration: "15 phút",
      color: "brand-yellow-soft",
      accentColor: "#C99A2E",
      icon: Smile,
    },
    {
      id: 2,
      name: "Nhận diện đồ vật qua chạm",
      description:
        "Đặt 3 đồ vật quen thuộc trước mặt bé. Hướng dẫn bé chạm vào đồ vật theo yêu cầu.",
      duration: "20 phút",
      color: "brand-mint-soft",
      accentColor: "#4FA37F",
      icon: Star,
    },
    {
      id: 3,
      name: "Kể chuyện 'Con cá nhỏ'",
      description:
        "Đọc to truyện tranh, chỉ tay vào từng hình minh họa. Khuyến khích bé lặp lại từ khóa.",
      duration: "15 phút",
      color: "brand-pink-soft",
      accentColor: "#D67B8B",
      icon: Heart,
    },
    {
      id: 4,
      name: "Bài hát 'Vỗ tay'",
      description: "Hát cùng bé bài có điệp khúc đơn giản. Khuyến khích bé vỗ tay theo nhịp.",
      duration: "10 phút",
      color: "brand-blue-soft",
      accentColor: "#3D8FC0",
      icon: Lightbulb,
    },
    {
      id: 5,
      name: "Vẽ cùng mẹ",
      description: "Cho bé cầm bút chì màu, vẽ theo nét ngang dọc đơn giản. Khen ngợi mỗi nỗ lực.",
      duration: "20 phút",
      color: "brand-peach-soft",
      accentColor: "#C9794B",
      icon: Sparkles,
    },
  ],
};

/* ===================================================================
   Mock child profiles
   =================================================================== */
const childProfiles = [
  { id: "1", name: "Bé Cà Chua", age: 4, avatar: "🍅" },
  { id: "2", name: "Bé Minh An", age: 5, avatar: "🌻" },
  { id: "3", name: "Bé Bí Ngô", age: 3, avatar: "🎃" },
];

/* ===================================================================
   Route Definition
   =================================================================== */
export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "Trợ lý AI — Bino" },
      {
        name: "description",
        content:
          "Trợ lý AI dịu dàng của Bino giúp bạn xây dựng lộ trình can thiệp sớm cá nhân hóa cho bé.",
      },
    ],
  }),
  component: AIAssistantPage,
});

/* ===================================================================
   Cute SVG Decorations
   =================================================================== */
function CuteCloudSmall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 50" className={className} aria-hidden>
      <ellipse cx="25" cy="32" rx="18" ry="14" fill="white" />
      <ellipse cx="48" cy="26" rx="22" ry="18" fill="white" />
      <ellipse cx="62" cy="35" rx="15" ry="12" fill="white" />
      <ellipse cx="38" cy="40" rx="22" ry="12" fill="white" />
      <circle cx="35" cy="30" r="1.5" fill="#4B5563" />
      <circle cx="50" cy="30" r="1.5" fill="#4B5563" />
      <path
        d="M38 35 Q43 39 48 35"
        stroke="#4B5563"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="31" cy="37" r="1.8" fill="#FFCAD4" opacity="0.7" />
      <circle cx="55" cy="37" r="1.8" fill="#FFCAD4" opacity="0.7" />
    </svg>
  );
}

function CuteStarSmall({
  className = "",
  color = "#FFF3B0",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path
        d="M20 4 L24 16 L36 16 L26 24 L30 36 L20 28 L10 36 L14 24 L4 16 L16 16 Z"
        fill={color}
        stroke="#4B5563"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="20" r="1" fill="#4B5563" />
      <circle cx="24" cy="20" r="1" fill="#4B5563" />
      <path
        d="M17 24 Q20 26 23 24"
        stroke="#4B5563"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ===================================================================
   Main Page Component
   =================================================================== */
type UIState = "idle" | "loading" | "result";

function AIAssistantPage() {
  const [uiState, setUiState] = useState<UIState>("idle");
  const [selectedChild, setSelectedChild] = useState(childProfiles[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [behaviorText, setBehaviorText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    if (!behaviorText.trim() || !goalText.trim()) return;
    setUiState("loading");
  };

  /* Auto-transition loading -> result after 3s */
  useEffect(() => {
    if (uiState === "loading") {
      const timer = setTimeout(() => setUiState("result"), 3000);
      return () => clearTimeout(timer);
    }
  }, [uiState]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRegenerate = () => {
    setUiState("loading");
  };

  const handleBack = () => {
    setUiState("idle");
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Floating background decorations */}
      <div
        className="absolute top-16 left-[6%] w-64 h-64 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "var(--brand-blue-soft)" }}
      />
      <div
        className="absolute top-40 right-[4%] w-72 h-72 rounded-full opacity-35 blur-3xl pointer-events-none"
        style={{ background: "var(--brand-peach-soft)" }}
      />
      <div
        className="absolute bottom-20 left-[20%] w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "var(--brand-mint-soft)" }}
      />

      {/* Cute floating elements */}
      <CuteCloudSmall className="absolute top-28 right-[12%] w-16 opacity-70 animate-[float_7s_ease-in-out_infinite] pointer-events-none" />
      <CuteStarSmall className="absolute top-48 left-[8%] w-8 rotate-[-10deg] animate-[float_5s_ease-in-out_infinite_1s] pointer-events-none" />
      <CuteStarSmall
        className="absolute bottom-32 right-[15%] w-6 rotate-[15deg] animate-[float_6s_ease-in-out_infinite_2s] pointer-events-none"
        color="#FFD3B6"
      />

      {/* Top decorative bar */}
      <div
        className="w-full h-1.5"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-blue) 0%, var(--brand-mint) 40%, var(--brand-peach) 70%, var(--brand-pink) 100%)",
        }}
      />

      {/* Main content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Page header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] -rotate-1 hover:rotate-0 transition-transform">
            <Sparkles className="w-4 h-4" style={{ color: "var(--brand-blue)" }} />
            <span className="text-sm font-semibold text-ink/70">Trợ lý AI</span>
          </div>
        </div>

        {/* State 1: Idle — Input Form */}
        {uiState === "idle" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
                <span className="inline-block bg-white px-3 py-1 rounded-2xl shadow-[5px_5px_0px_#dce5d4] rotate-1">
                  Trợ lý Bino
                </span>
                <br className="sm:hidden" />
                <span className="inline-block mt-2">— Cùng bạn thấu hiểu bé yêu </span>
                <span className="inline-block">🌤️</span>
              </h1>
              <p className="mt-4 text-ink/60 text-base max-w-md mx-auto leading-relaxed">
                Chia sẻ với Bino về bé trong tuần qua, Bino sẽ gợi ý lộ trình phù hợp nhất.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_24px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6">
              {/* Child profile selector */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2.5 flex items-center gap-2">
                  <Baby className="w-4 h-4" style={{ color: "var(--brand-blue)" }} />
                  Chọn hồ sơ của bé
                </label>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{selectedChild.avatar}</span>
                      <div>
                        <p className="font-semibold text-ink text-sm">{selectedChild.name}</p>
                        <p className="text-xs text-ink/50">{selectedChild.age} tuổi</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-ink/40 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden z-20 animate-fade-in">
                      {childProfiles.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setSelectedChild(child);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${selectedChild.id === child.id ? "bg-slate-50" : ""}`}
                        >
                          <span className="text-xl">{child.avatar}</span>
                          <div>
                            <p className="font-semibold text-ink text-sm">{child.name}</p>
                            <p className="text-xs text-ink/50">{child.age} tuổi</p>
                          </div>
                          {selectedChild.id === child.id && (
                            <CheckCircle2
                              className="w-4 h-4 ml-auto"
                              style={{ color: "var(--brand-mint)" }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Behavior textarea */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2.5">
                  Biểu hiện của bé trong tuần qua như thế nào?
                </label>
                <textarea
                  value={behaviorText}
                  onChange={(e) => setBehaviorText(e.target.value)}
                  placeholder="Ví dụ: Bé đã bắt đầu chủ động vẫy tay chào khi gặp người quen, nhưng vẫn còn e ngại với người lạ..."
                  className="w-full min-h-[120px] px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-ink text-sm placeholder:text-ink/30 resize-y focus:outline-none focus:ring-2 focus:ring-[#8ECDF8]/40 focus:border-[#8ECDF8]/60 transition-all"
                />
              </div>

              {/* Goal textarea */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2.5">
                  Bạn mong muốn Bino giúp bé đạt được mục tiêu gì trong tuần này?
                </label>
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="Ví dụ: Mình muốn bé tập trung hơn khi nghe kể chuyện, và chủ động gọi tên người thân..."
                  className="w-full min-h-[120px] px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-ink text-sm placeholder:text-ink/30 resize-y focus:outline-none focus:ring-2 focus:ring-[#8ECDF8]/40 focus:border-[#8ECDF8]/60 transition-all"
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!behaviorText.trim() || !goalText.trim()}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-white font-bold text-base shadow-[5px_5px_0px_#6eb0db] -rotate-1 hover:rotate-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:rotate-0"
                style={{ background: "var(--brand-blue)" }}
              >
                <Sparkles className="w-5 h-5" />
                Bino, hãy gợi ý lộ trình cho bé!
              </button>
            </div>
          </div>
        )}

        {/* State 2: Loading */}
        {uiState === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative">
              {/* Gentle pulsing rings */}
              <div
                className="absolute inset-0 -m-8 rounded-full animate-ping opacity-20"
                style={{ background: "var(--brand-blue)" }}
              />
              <div
                className="absolute inset-0 -m-4 rounded-full animate-pulse opacity-30"
                style={{ background: "var(--brand-mint)" }}
              />

              {/* Center icon */}
              <div className="relative w-24 h-24 rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-center overflow-hidden animate-[breathe_3s_ease-in-out_infinite]">
                <img
                  src="/bino-ai-mascot.png"
                  alt="Bino AI"
                  className="w-full h-full object-contain p-1"
                  draggable={false}
                />
              </div>
            </div>

            <div className="mt-10 text-center max-w-sm mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles
                  className="w-4 h-4 animate-pulse"
                  style={{ color: "var(--brand-blue)" }}
                />
                <h2 className="text-xl font-bold text-ink">Bino đang lắng nghe...</h2>
                <Sparkles
                  className="w-4 h-4 animate-pulse"
                  style={{ color: "var(--brand-peach)" }}
                />
              </div>
              <p className="text-ink/60 leading-relaxed text-sm">
                Bino đang lắng nghe và dệt nên một lộ trình tuyệt vời dành riêng cho bé.
                <br />
                Vui lòng đợi một chút nhé... 💚
              </p>
            </div>

            {/* Cute loading dots */}
            <div className="mt-8 flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full animate-bounce"
                  style={{
                    background:
                      i === 0
                        ? "var(--brand-blue)"
                        : i === 1
                          ? "var(--brand-mint)"
                          : "var(--brand-peach)",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* State 3: Result */}
        {uiState === "result" && (
          <div className="animate-fade-in space-y-6">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>

            {/* Encouragement Banner */}
            <div
              className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-yellow-soft) 0%, var(--brand-peach-soft) 100%)",
              }}
            >
              <CuteStarSmall
                className="absolute top-4 right-6 w-10 opacity-50 rotate-12"
                color="#FFF3B0"
              />
              <CuteCloudSmall className="absolute bottom-2 right-12 w-12 opacity-40" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5" style={{ color: "#D67B8B" }} />
                  <span className="text-xs font-bold tracking-wider uppercase text-ink/50">
                    Lời động viên từ Bino
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-ink leading-relaxed">
                  {mockRoadmapData.encouragement}
                </p>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-xl grid place-items-center"
                  style={{ background: "var(--brand-mint-soft)" }}
                >
                  <Star className="w-4 h-4" style={{ color: "#4FA37F" }} />
                </div>
                <span className="text-xs font-bold tracking-wider uppercase text-ink/50">
                  Mục tiêu tuần này
                </span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-ink leading-snug">
                {mockRoadmapData.weeklyGoal}
              </p>
            </div>

            {/* Activity Grid */}
            <div>
              <div className="flex items-center gap-2 mb-5 px-1">
                <div
                  className="w-8 h-8 rounded-xl grid place-items-center"
                  style={{ background: "var(--brand-blue-soft)" }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: "#3D8FC0" }} />
                </div>
                <h3 className="text-lg font-bold text-ink">Lộ trình hoạt động đề xuất</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {mockRoadmapData.activities.map((activity, index) => {
                  const Icon = activity.icon;
                  const tilts = ["-rotate-1", "rotate-1", "rotate-0.5", "-rotate-0.5", "rotate-1"];
                  return (
                    <div
                      key={activity.id}
                      className={`relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 ${tilts[index]}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Colored left accent bar */}
                      <div
                        className="absolute left-0 top-5 bottom-5 w-1 rounded-full"
                        style={{ background: activity.accentColor, opacity: 0.4 }}
                      />

                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-2xl grid place-items-center shrink-0"
                          style={{ background: `var(--${activity.color})` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: activity.accentColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-ink text-sm leading-snug">
                            {activity.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="w-3 h-3 text-ink/40" />
                            <span className="text-xs text-ink/50 font-medium">
                              {activity.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-ink/60 leading-relaxed pl-[52px]">
                        {activity.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-white font-bold text-sm shadow-[5px_5px_0px_#6eb0db] -rotate-0.5 hover:rotate-0 active:scale-[0.98] transition-all"
                style={{ background: "var(--brand-blue)" }}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Đã lưu lộ trình!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Lưu lộ trình này
                  </>
                )}
              </button>
              <button
                onClick={handleRegenerate}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white text-ink font-bold text-sm border-2 border-slate-100 shadow-[5px_5px_0px_#f0f0f0] rotate-0.5 hover:rotate-0 active:scale-[0.98] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Tạo lại lộ trình khác
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
