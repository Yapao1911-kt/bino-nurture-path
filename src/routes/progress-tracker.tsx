import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp,
  Award,
  BookOpen,
  Smile,
  Star,
  BarChart2,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AIChatWidget as SharedAIChatWidget } from "@/components/ai-chat-widget";

/* ===================================================================
   Mock Data
   =================================================================== */
const childProfiles = [
  { id: "1", name: "Bé Cà Chua", age: 4, avatar: "🍅" },
  { id: "2", name: "Bé Minh An", age: 5, avatar: "🌻" },
  { id: "3", name: "Bé Bí Ngô", age: 3, avatar: "🎃" },
];

const weeklyData = [
  { week: "T1", words: 3, behaviors: 2, activities: 4, score: 65 },
  { week: "T2", words: 5, behaviors: 3, activities: 5, score: 72 },
  { week: "T3", words: 4, behaviors: 4, activities: 6, score: 75 },
  { week: "T4", words: 7, behaviors: 3, activities: 7, score: 80 },
  { week: "T5", words: 8, behaviors: 5, activities: 8, score: 85 },
  { week: "T6", words: 10, behaviors: 4, activities: 9, score: 88 },
  { week: "T7", words: 12, behaviors: 6, activities: 10, score: 92 },
];

const recentMilestones = [
  { id: 1, text: "Bé tự gọi tên 5 đồ vật quen thuộc", date: "3 ngày trước", icon: Star, color: "#C99A2E", bg: "var(--brand-yellow-soft)" },
  { id: 2, text: "Hoàn thành 10 hoạt động liên tiếp", date: "5 ngày trước", icon: Award, color: "#4FA37F", bg: "var(--brand-mint-soft)" },
  { id: 3, text: "Bé chủ động giao tiếp mắt khi nói chuyện", date: "1 tuần trước", icon: Smile, color: "#D67B8B", bg: "var(--brand-pink-soft)" },
];

const activityLog = [
  { name: "Flashcard nhận diện màu sắc", status: "done", duration: "15 phút", day: "Hôm nay" },
  { name: "Bài hát vỗ tay", status: "done", duration: "10 phút", day: "Hôm nay" },
  { name: "Ghép hình con vật", status: "inprogress", duration: "20 phút", day: "Hôm qua" },
  { name: "Kể chuyện tranh", status: "done", duration: "15 phút", day: "Hôm qua" },
  { name: "Nhận diện cảm xúc", status: "done", duration: "10 phút", day: "2 ngày trước" },
];

/* ===================================================================
   Route
   =================================================================== */
export const Route = createFileRoute("/progress-tracker")({
  head: () => ({
    meta: [
      { title: "Theo dõi Tiến trình — Bino" },
      {
        name: "description",
        content: "Theo dõi tiến trình phát triển của bé với biểu đồ trực quan và trợ lý AI Bino.",
      },
    ],
  }),
  component: ProgressTrackerPage,
});

/* ===================================================================
   Mini Bar Chart
   =================================================================== */
function MiniBarChart({ data }: { data: typeof weeklyData }) {
  const max = Math.max(...data.map((d) => d.score));
  return (
    <div className="flex items-end gap-2 h-32 px-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full flex items-end justify-center">
            <div
              className="w-full rounded-t-xl transition-all duration-700 ease-out group-hover:opacity-80 relative"
              style={{
                height: `${(d.score / max) * 100}px`,
                background: `linear-gradient(180deg, var(--brand-blue) 0%, var(--brand-mint) 100%)`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {d.score}đ
              </div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-ink/50">{d.week}</span>
        </div>
      ))}
    </div>
  );
}

/* ===================================================================
   Mini Line Sparkline
   =================================================================== */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 120;
  const H = 40;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`)
    .join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline points={points} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={(i / (data.length - 1)) * W}
          cy={H - ((v - min) / range) * (H - 4) - 2}
          r={i === data.length - 1 ? 4 : 2.5}
          fill={color}
          stroke="white"
          strokeWidth={i === data.length - 1 ? 2 : 1}
        />
      ))}
    </svg>
  );
}

/* ===================================================================
   Main Page
   =================================================================== */
function ProgressTrackerPage() {
  const [selectedChild, setSelectedChild] = useState(childProfiles[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentWeek = weeklyData[weeklyData.length - 1];
  const prevWeek = weeklyData[weeklyData.length - 2];

  const wordsDelta = currentWeek.words - prevWeek.words;
  const scoreDelta = currentWeek.score - prevWeek.score;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Top gradient bar */}
      <div
        className="w-full h-1.5"
        style={{
          background: "linear-gradient(90deg, var(--brand-blue) 0%, var(--brand-mint) 40%, var(--brand-peach) 70%, var(--brand-pink) 100%)",
        }}
      />

      {/* Background blobs */}
      <div className="absolute top-20 left-[5%] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: "var(--brand-blue-soft)" }} />
      <div className="absolute top-48 right-[5%] w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: "var(--brand-mint-soft)" }} />
      <div className="absolute bottom-32 left-[30%] w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "var(--brand-yellow-soft)" }} />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-40">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <button className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all text-ink/50 hover:text-ink">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-xl grid place-items-center"
                style={{ background: "var(--brand-yellow-soft)" }}
              >
                <BarChart2 className="w-4 h-4" style={{ color: "#C99A2E" }} />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase text-ink/40">Progress Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
              Theo dõi Tiến trình Bé
            </h1>
          </div>
        </div>

        {/* Child selector */}
        <div className="mb-8 relative inline-block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all"
          >
            <span className="text-2xl">{selectedChild.avatar}</span>
            <div className="text-left">
              <p className="text-sm font-bold text-ink">{selectedChild.name}</p>
              <p className="text-xs text-ink/50">{selectedChild.age} tuổi</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-ink/40 transition-transform ml-1 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-20 overflow-hidden min-w-[200px] animate-fade-in">
              {childProfiles.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedChild(c); setDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors ${selectedChild.id === c.id ? "bg-slate-50" : ""}`}
                >
                  <span className="text-xl">{c.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-xs text-ink/50">{c.age} tuổi</p>
                  </div>
                  {selectedChild.id === c.id && <CheckCircle2 className="w-4 h-4 ml-auto text-brand-mint" style={{ color: "var(--brand-mint)" }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Điểm tuần này",
              value: currentWeek.score,
              unit: "đ",
              delta: `+${scoreDelta}`,
              positive: scoreDelta >= 0,
              icon: TrendingUp,
              color: "var(--brand-blue)",
              bg: "var(--brand-blue-soft)",
            },
            {
              label: "Từ mới học",
              value: currentWeek.words,
              unit: " từ",
              delta: `+${wordsDelta}`,
              positive: wordsDelta >= 0,
              icon: BookOpen,
              color: "var(--brand-mint)",
              bg: "var(--brand-mint-soft)",
            },
            {
              label: "Hành vi tốt",
              value: currentWeek.behaviors,
              unit: " lần",
              delta: "+1",
              positive: true,
              icon: Smile,
              color: "#D67B8B",
              bg: "var(--brand-pink-soft)",
            },
            {
              label: "Hoạt động xong",
              value: currentWeek.activities,
              unit: "/10",
              delta: "+2",
              positive: true,
              icon: Target,
              color: "#C99A2E",
              bg: "var(--brand-yellow-soft)",
            },
          ].map(({ label, value, unit, delta, positive, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div
                className="w-9 h-9 rounded-2xl grid place-items-center mb-3"
                style={{ background: bg }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color, width: 18, height: 18 }} />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-ink">
                {value}<span className="text-base font-semibold text-ink/40">{unit}</span>
              </p>
              <p className="text-xs text-ink/50 mt-0.5 font-medium">{label}</p>
              <div className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${positive ? "text-emerald-700 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                {delta} so với tuần trước
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Milestones row */}
        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          {/* Bar chart */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-ink">Điểm tiến bộ 7 tuần</h2>
                <p className="text-xs text-ink/50 mt-0.5">Theo dõi xu hướng phát triển tổng thể</p>
              </div>
              <div
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-emerald-700"
                style={{ background: "#D1FAE5" }}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                +{scoreDelta} tuần này
              </div>
            </div>
            <MiniBarChart data={weeklyData} />

            {/* Sparklines row */}
            <div className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              {[
                { label: "Từ mới", data: weeklyData.map((d) => d.words), color: "var(--brand-blue)" },
                { label: "Hành vi", data: weeklyData.map((d) => d.behaviors), color: "#D67B8B" },
                { label: "Hoạt động", data: weeklyData.map((d) => d.activities), color: "var(--brand-mint)" },
              ].map(({ label, data, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Sparkline data={data} color={color} />
                  <span className="text-[11px] font-semibold text-ink/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-xl grid place-items-center" style={{ background: "var(--brand-yellow-soft)" }}>
                <Award className="w-4 h-4" style={{ color: "#C99A2E" }} />
              </div>
              <h2 className="text-base font-bold text-ink">Cột mốc gần đây</h2>
            </div>
            <div className="space-y-3">
              {recentMilestones.map(({ id, text, date, icon: Icon, color, bg }) => (
                <div
                  key={id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                  style={{ background: bg + "50" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl grid place-items-center shrink-0 mt-0.5"
                    style={{ background: bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink leading-snug">{text}</p>
                    <p className="text-[11px] text-ink/40 mt-1">{date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall progress ring */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="26" strokeWidth="8" stroke="#F0F0F0" fill="none" />
                  <circle
                    cx="32" cy="32" r="26" strokeWidth="8"
                    stroke="url(#progressGrad)" fill="none"
                    strokeDasharray={`${(currentWeek.score / 100) * 163} 163`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--brand-blue)" />
                      <stop offset="100%" stopColor="var(--brand-mint)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-ink">{currentWeek.score}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Tiến độ tổng thể</p>
                <p className="text-xs text-ink/50 mt-0.5 leading-relaxed">Xuất sắc! Bé đang phát triển rất tốt 🌟</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-xl grid place-items-center" style={{ background: "var(--brand-mint-soft)" }}>
              <Sparkles className="w-4 h-4" style={{ color: "var(--brand-mint)" }} />
            </div>
            <h2 className="text-base font-bold text-ink">Nhật ký hoạt động gần đây</h2>
          </div>
          <div className="space-y-2">
            {activityLog.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-xl grid place-items-center shrink-0 ${
                    item.status === "done" ? "" : "opacity-60"
                  }`}
                  style={{
                    background: item.status === "done" ? "var(--brand-mint-soft)" : "var(--brand-yellow-soft)",
                  }}
                >
                  {item.status === "done" ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: "var(--brand-mint)" }} />
                  ) : (
                    <RefreshCw className="w-4 h-4" style={{ color: "#C99A2E" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                  <p className="text-xs text-ink/40 mt-0.5">{item.day} · {item.duration}</p>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    item.status === "done"
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-amber-700 bg-amber-50"
                  }`}
                >
                  {item.status === "done" ? "Hoàn thành" : "Đang làm"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Chat Widget */}
      <SharedAIChatWidget
        selectedChild={selectedChild}
        progressData={weeklyData}
        contextLabel="Trang theo dõi tiến trình"
      />
    </div>
  );
}
