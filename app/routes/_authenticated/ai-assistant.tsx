import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { useState } from 'react'
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Target, 
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCcw,
  Clock,
  Bot,
  ChevronDown,
  Save,
  RefreshCw,
  Star,
  Smile,
  ArrowLeft,
  Baby
} from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ------------------------------------------------------------------
// 1. Types & Interfaces
// ------------------------------------------------------------------

export interface DailyActivity {
  day: string
  title: string
  description: string
  duration: string
}

export interface AIRoadmapResponse {
  weekly_goal: string
  daily_activities: DailyActivity[]
  encouraging_message: string
}

// Zod Schema để validate input gửi lên Server
const roadmapInputSchema = z.object({
  childId: z.string().min(1, 'Vui lòng chọn hồ sơ bé'),
  age: z.string().min(1),
  communicationLevel: z.string().min(1),
  recentBehaviors: z.string().min(10, 'Vui lòng miêu tả chi tiết (ít nhất 10 ký tự)'),
  goals: z.string().min(5, 'Vui lòng nhập mục tiêu'),
})

type RoadmapInput = z.infer<typeof roadmapInputSchema>

// ------------------------------------------------------------------
// 2. Server Function (Chạy an toàn trên Server, không lộ API Key)
// ------------------------------------------------------------------

export const generateRoadmapFn = createServerFn({ method: 'POST' })
  .inputValidator(roadmapInputSchema)
  .handler(async (ctx): Promise<AIRoadmapResponse> => {
    const { recentBehaviors, goals, age, communicationLevel } = ctx.data

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Thiếu cấu hình VITE_GEMINI_API_KEY ở môi trường server.")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    })

    const systemPrompt = `Bạn là Bino, một chuyên gia giáo dục đặc biệt và can thiệp sớm. Nhiệm vụ của bạn là đưa ra lộ trình học tập, bài tập giao tiếp và gợi ý sinh hoạt cho trẻ chậm phát triển, tự kỷ, hoặc tăng động. 
QUY TẮC TỐI THƯỢNG: Tuyệt đối không chẩn đoán bệnh, không kê đơn thuốc. Văn phong phải nhẹ nhàng, thấu cảm, mang tính động viên phụ huynh. Trả lời hoàn toàn bằng tiếng Việt.
YÊU CẦU ĐẦU RA: Phải trả về ĐÚNG định dạng JSON theo cấu trúc:
{
  "weekly_goal": "Mục tiêu chính yếu của tuần này",
  "daily_activities": [
    {
      "day": "Thứ 2",
      "title": "Tên bài tập",
      "description": "Hướng dẫn chi tiết, nhẹ nhàng",
      "duration": "Ví dụ: 15 phút"
    }
    // Liệt kê từ Thứ 2 đến Chủ nhật
  ],
  "encouraging_message": "Một lời động viên ấm áp, xoa dịu gửi đến ba mẹ"
}`

    const userMessage = `Thông tin bé:
- Độ tuổi: ${age}
- Mức độ giao tiếp hiện tại: ${communicationLevel}
- Biểu hiện gần đây: ${recentBehaviors}
- Mục tiêu mong muốn: ${goals}

Xin hãy tạo cho tôi lộ trình hoạt động trong 1 tuần (từ Thứ 2 đến Chủ nhật) bám sát các thông tin trên.`

    try {
      const result = await model.generateContent(`${systemPrompt}\n\n${userMessage}`)
      const content = result.response.text()
      
      if (!content) throw new Error("Gemini trả về nội dung trống")
      
      return JSON.parse(content) as AIRoadmapResponse
    } catch (error: any) {
      console.error("Gemini Error:", error)
      throw new Error(error.message || "Không thể tạo lộ trình. Vui lòng thử lại sau.")
    }
  })

// ------------------------------------------------------------------
// 3. Cute SVG Decorations
// ------------------------------------------------------------------
function CuteCloudSmall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 50" className={className} aria-hidden>
      <ellipse cx="25" cy="32" rx="18" ry="14" fill="white" />
      <ellipse cx="48" cy="26" rx="22" ry="18" fill="white" />
      <ellipse cx="62" cy="35" rx="15" ry="12" fill="white" />
      <ellipse cx="38" cy="40" rx="22" ry="12" fill="white" />
      <circle cx="35" cy="30" r="1.5" fill="#4B5563" />
      <circle cx="50" cy="30" r="1.5" fill="#4B5563" />
      <path d="M38 35 Q43 39 48 35" stroke="#4B5563" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="31" cy="37" r="1.8" fill="#FFCAD4" opacity="0.7" />
      <circle cx="55" cy="37" r="1.8" fill="#FFCAD4" opacity="0.7" />
    </svg>
  );
}

function CuteStarSmall({ className = "", color = "#FFF3B0" }: { className?: string; color?: string }) {
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
      <path d="M17 24 Q20 26 23 24" stroke="#4B5563" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ------------------------------------------------------------------
// 4. Client Component (UI/UX from clone, logic from local)
// ------------------------------------------------------------------

export const Route = createFileRoute('/_authenticated/ai-assistant')({
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
})

const childProfiles = [
  { id: "1", name: "Bé Cà Chua", age: 4, avatar: "🍅" },
  { id: "2", name: "Bé Minh An", age: 5, avatar: "🌻" },
  { id: "3", name: "Bé Bí Ngô", age: 3, avatar: "🎃" },
];

const activityStyles = [
  { color: "#FEF3C7", accentColor: "#D97706", icon: Smile }, // amber
  { color: "#D1FAE5", accentColor: "#059669", icon: Star }, // emerald
  { color: "#FCE7F3", accentColor: "#DB2777", icon: Heart }, // pink
  { color: "#DBEAFE", accentColor: "#2563EB", icon: Lightbulb }, // blue
  { color: "#FFEDD5", accentColor: "#EA580C", icon: Sparkles }, // orange
  { color: "#E0E7FF", accentColor: "#4F46E5", icon: Smile }, // indigo
];

type UIState = "idle" | "loading" | "result";

function AIAssistantPage() {
  const [uiState, setUiState] = useState<UIState>("idle");
  const [selectedChild, setSelectedChild] = useState(childProfiles[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [behaviorText, setBehaviorText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [saved, setSaved] = useState(false);
  
  const [result, setResult] = useState<AIRoadmapResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!behaviorText.trim() || !goalText.trim()) return;
    setUiState("loading");
    setError("");

    try {
      const payload: RoadmapInput = {
        childId: selectedChild.id,
        age: selectedChild.age.toString() + ' tuổi',
        communicationLevel: "Chưa rõ", // Tạm mặc định vì form clone không có field này
        recentBehaviors: behaviorText,
        goals: goalText
      };
      
      roadmapInputSchema.parse(payload);
      const res = await generateRoadmapFn({ data: payload });
      setResult(res);
      setUiState("result");
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
      setUiState("idle");
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRegenerate = () => {
    setUiState("idle");
    setBehaviorText("");
    setGoalText("");
    setResult(null);
  };

  const handleBack = () => {
    setUiState("idle");
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Floating background decorations */}
      <div className="absolute top-16 left-[6%] w-64 h-64 rounded-full opacity-40 blur-3xl pointer-events-none bg-blue-100" />
      <div className="absolute top-40 right-[4%] w-72 h-72 rounded-full opacity-35 blur-3xl pointer-events-none bg-orange-100" />
      <div className="absolute bottom-20 left-[20%] w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none bg-emerald-100" />

      {/* Cute floating elements */}
      <CuteCloudSmall className="absolute top-28 right-[12%] w-16 opacity-70 animate-[float_7s_ease-in-out_infinite] pointer-events-none" />
      <CuteStarSmall className="absolute top-48 left-[8%] w-8 rotate-[-10deg] animate-[float_5s_ease-in-out_infinite_1s] pointer-events-none" />
      <CuteStarSmall className="absolute bottom-32 right-[15%] w-6 rotate-[15deg] animate-[float_6s_ease-in-out_infinite_2s] pointer-events-none" color="#FFD3B6" />

      {/* Top decorative bar */}
      <div className="w-full h-1.5" style={{ background: "linear-gradient(90deg, #3B82F6 0%, #10B981 40%, #F97316 70%, #EC4899 100%)" }} />

      {/* Main content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Page header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] -rotate-1 hover:rotate-0 transition-transform">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-slate-700">Trợ lý AI</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2 animate-fade-in">
            <span className="font-semibold">Lỗi:</span> {error}
          </div>
        )}

        {/* State 1: Idle — Input Form */}
        {uiState === "idle" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                <span className="inline-block bg-white px-3 py-1 rounded-2xl shadow-[5px_5px_0px_#dce5d4] rotate-1">
                  Trợ lý Bino
                </span>
                <br className="sm:hidden" />
                <span className="inline-block mt-2">— Cùng bạn thấu hiểu bé yêu </span>
                <span className="inline-block">🌤️</span>
              </h1>
              <p className="mt-4 text-slate-500 text-base max-w-md mx-auto leading-relaxed">
                Chia sẻ với Bino về bé trong tuần qua, Bino sẽ gợi ý lộ trình phù hợp nhất.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_24px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6">
              {/* Child profile selector */}
              <div>
                <label className="flex text-sm font-semibold text-slate-800 mb-2.5 items-center gap-2">
                  <Baby className="w-4 h-4 text-blue-500" />
                  Chọn hồ sơ của bé
                </label>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{selectedChild.avatar}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{selectedChild.name}</p>
                        <p className="text-xs text-slate-500">{selectedChild.age} tuổi</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden z-20 animate-in fade-in">
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
                            <p className="font-semibold text-slate-800 text-sm">{child.name}</p>
                            <p className="text-xs text-slate-500">{child.age} tuổi</p>
                          </div>
                          {selectedChild.id === child.id && (
                            <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Behavior textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2.5">
                  Biểu hiện của bé trong tuần qua như thế nào?
                </label>
                <textarea
                  value={behaviorText}
                  onChange={(e) => setBehaviorText(e.target.value)}
                  placeholder="Ví dụ: Bé đã bắt đầu chủ động vẫy tay chào khi gặp người quen, nhưng vẫn còn e ngại với người lạ..."
                  className="w-full min-h-[120px] px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 resize-y focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
                />
              </div>

              {/* Goal textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2.5">
                  Bạn mong muốn Bino giúp bé đạt được mục tiêu gì trong tuần này?
                </label>
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="Ví dụ: Mình muốn bé tập trung hơn khi nghe kể chuyện, và chủ động gọi tên người thân..."
                  className="w-full min-h-[120px] px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 resize-y focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!behaviorText.trim() || !goalText.trim()}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-white font-bold text-base shadow-[5px_5px_0px_#6eb0db] -rotate-1 hover:rotate-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:rotate-0 bg-blue-500 hover:bg-blue-600"
              >
                <Sparkles className="w-5 h-5" />
                Bino, hãy gợi ý lộ trình cho bé!
              </button>
            </div>
          </div>
        )}

        {/* State 2: Loading */}
        {uiState === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              {/* Gentle pulsing rings */}
              <div className="absolute inset-0 -m-8 rounded-full animate-ping opacity-20 bg-blue-500" />
              <div className="absolute inset-0 -m-4 rounded-full animate-pulse opacity-30 bg-emerald-400" />
              
              {/* Center icon */}
              <div className="relative w-24 h-24 rounded-3xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-center animate-[breathe_3s_ease-in-out_infinite]">
                <Bot className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="mt-10 text-center max-w-sm mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse text-blue-500" />
                <h2 className="text-xl font-bold text-slate-800">Bino đang phân tích...</h2>
                <Sparkles className="w-4 h-4 animate-pulse text-orange-400" />
              </div>
              <p className="text-slate-500 leading-relaxed text-sm">
                Bino đang lắng nghe và dệt nên một lộ trình tuyệt vời dành riêng cho bé.
                <br />
                Vui lòng đợi một chút nhé... 💚
              </p>
            </div>
          </div>
        )}

        {/* State 3: Result */}
        {uiState === "result" && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>

            {/* Encouragement Banner */}
            <div
              className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-gradient-to-br from-amber-50 to-orange-50"
            >
              <CuteStarSmall className="absolute top-4 right-6 w-10 opacity-50 rotate-12" color="#FDE68A" />
              <CuteCloudSmall className="absolute bottom-2 right-12 w-12 opacity-40" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Lời động viên từ Bino</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed">
                  {result.encouraging_message}
                </p>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl grid place-items-center bg-emerald-50">
                  <Star className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Mục tiêu tuần này</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-slate-800 leading-snug">
                {result.weekly_goal}
              </p>
            </div>

            {/* Activity Grid */}
            <div>
              <div className="flex items-center gap-2 mb-5 px-1">
                <div className="w-8 h-8 rounded-xl grid place-items-center bg-blue-50">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Lộ trình hoạt động đề xuất</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {result.daily_activities.map((activity, index) => {
                  const style = activityStyles[index % activityStyles.length]
                  const Icon = style.icon;
                  const tilts = ["-rotate-1", "rotate-1", "rotate-0.5", "-rotate-0.5", "rotate-1", "-rotate-1", "rotate-0.5"];
                  return (
                    <div
                      key={index}
                      className={`relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 ${tilts[index % tilts.length]}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Colored left accent bar */}
                      <div
                        className="absolute left-0 top-5 bottom-5 w-1 rounded-full"
                        style={{ background: style.accentColor, opacity: 0.4 }}
                      />

                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-2xl grid place-items-center shrink-0"
                          style={{ background: style.color }}
                        >
                          <Icon className="w-5 h-5" style={{ color: style.accentColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm leading-snug">{activity.day}: {activity.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 font-medium">{activity.duration}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed pl-[52px]">
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
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-white font-bold text-sm shadow-[5px_5px_0px_#6eb0db] -rotate-0.5 hover:rotate-0 active:scale-[0.98] transition-all bg-blue-500 hover:bg-blue-600"
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
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white text-slate-800 font-bold text-sm border-2 border-slate-100 shadow-[5px_5px_0px_#f0f0f0] rotate-0.5 hover:rotate-0 active:scale-[0.98] transition-all"
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
