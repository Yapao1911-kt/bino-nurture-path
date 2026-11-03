import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Baby,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AIChatWidget as SharedAIChatWidget } from "@/components/ai-chat-widget";
import {
  fetchAndSyncChildren,
  getActiveChild,
  setActiveChild,
  type ChildData,
} from "@/lib/child-storage";

/* ===================================================================
   Weekly Progress Baseline
   =================================================================== */
const weeklyData = [
  { week: "T1", words: 3, behaviors: 2, activities: 4, score: 65 },
  { week: "T2", words: 5, behaviors: 3, activities: 5, score: 72 },
  { week: "T3", words: 4, behaviors: 4, activities: 6, score: 75 },
  { week: "T4", words: 7, behaviors: 3, activities: 7, score: 80 },
  { week: "T5", words: 8, behaviors: 5, activities: 8, score: 85 },
  { week: "T6", words: 10, behaviors: 4, activities: 9, score: 88 },
  { week: "T7", words: 12, behaviors: 6, activities: 10, score: 92 },
];

/* ===================================================================
   Route Definition
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
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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
  const navigate = useNavigate();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChild, setSelectedChildState] = useState<ChildData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const list = await fetchAndSyncChildren();
      if (isMounted) {
        setChildren(list);
        const active = getActiveChild();
        if (active && list.some((c) => c.id === active.id)) {
          setSelectedChildState(active);
        } else if (list.length > 0) {
          setSelectedChildState(list[0]);
          setActiveChild(list[0]);
        } else {
          setSelectedChildState(null);
        }
        setIsLoading(false);
      }
    }
    loadData();

    const handleChildChanged = () => {
      const active = getActiveChild();
      if (active) setSelectedChildState(active);
    };
    window.addEventListener("bino_child_changed", handleChildChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("bino_child_changed", handleChildChanged);
    };
  }, []);

  const handleSelectChild = (c: ChildData) => {
    setSelectedChildState(c);
    setActiveChild(c);
    setDropdownOpen(false);
  };

  const currentWeek = weeklyData[weeklyData.length - 1];
  const prevWeek = weeklyData[weeklyData.length - 2];
  const wordsDelta = currentWeek.words - prevWeek.words;
  const scoreDelta = currentWeek.score - prevWeek.score;

  // Cột mốc tiến trình cá nhân hóa theo tên bé
  const childName = selectedChild?.name || "Bé";
  const recentMilestones = [
    {
      id: 1,
      text: `${childName} tự gọi tên 5 đồ vật quen thuộc trong nhà`,
      date: "3 ngày trước",
      icon: Star,
      color: "#C99A2E",
      bg: "var(--brand-yellow-soft)",
    },
    {
      id: 2,
      text: `Hoàn thành 10 hoạt động tương tác liên tiếp cùng ba mẹ`,
      date: "5 ngày trước",
      icon: Award,
      color: "#4FA37F",
      bg: "var(--brand-mint-soft)",
    },
    {
      id: 3,
      text: `${childName} chủ động giao tiếp mắt và mỉm cười phản hồi`,
      date: "1 tuần trước",
      icon: Smile,
      color: "#D67B8B",
      bg: "var(--brand-pink-soft)",
    },
  ];

  const activityLog = [
    { name: `Flashcard từ vựng cùng ${childName}`, status: "done", duration: "15 phút", day: "Hôm nay" },
    { name: "Bài hát vỗ tay theo nhịp", status: "done", duration: "10 phút", day: "Hôm nay" },
    { name: "Trò chơi ghép hình tương tác", status: "inprogress", duration: "20 phút", day: "Hôm qua" },
    { name: "Kể chuyện tranh trước giờ ngủ", status: "done", duration: "15 phút", day: "Hôm qua" },
    { name: "Nhận diện cảm xúc vui - buồn", status: "done", duration: "10 phút", day: "2 ngày trước" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Top gradient bar */}
      <div
        className="w-full h-1.5"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-blue) 0%, var(--brand-mint) 40%, var(--brand-peach) 70%, var(--brand-pink) 100%)",
        }}
      />

      {/* Background blobs */}
      <div
        className="absolute top-20 left-[5%] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "var(--brand-blue-soft)" }}
      />
      <div
        className="absolute top-48 right-[5%] w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "var(--brand-mint-soft)" }}
      />
      <div
        className="absolute bottom-32 left-[30%] w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--brand-yellow-soft)" }}
      />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-40">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <button className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all text-ink/50 hover:text-ink cursor-pointer">
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
              <span className="text-xs font-bold tracking-wider uppercase text-ink/40">
                Progress Tracker
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
              Theo dõi Tiến trình Bé
            </h1>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm animate-pulse">
            <Baby className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-bounce" />
            <p className="text-slate-500 font-medium">Đang tải hồ sơ và tiến trình của bé...</p>
          </div>
        )}

        {/* EMPTY STATE: Khi chưa có hồ sơ trẻ */}
        {!isLoading && (!selectedChild || children.length === 0) && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/80 grid place-items-center text-4xl mx-auto mb-5 shadow-inner">
              👶
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Chưa có hồ sơ của bé</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Bạn chưa tạo hồ sơ cho bé trong tài khoản này. Hãy tạo hồ sơ để Bino có thể cá nhân hóa lộ trình, ghi nhận các cột mốc phát triển và theo dõi tiến trình nhé!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate({ to: "/create-child" })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white shadow-[0_4px_0px_#59B84E] hover:-translate-y-0.5 transition-all cursor-pointer"
                style={{ backgroundColor: "#75D06A" }}
              >
                <Plus className="w-5 h-5" />
                Tạo hồ sơ cho bé ngay
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-2xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}

        {/* CONTENT STATE: Khi đã có hồ sơ trẻ */}
        {!isLoading && selectedChild && (
          <>
            {/* Child selector + Info bar */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative inline-block">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all cursor-pointer"
                >
                  <span className="text-2xl">{selectedChild.avatar || "🌻"}</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-ink">{selectedChild.name}</p>
                    <p className="text-xs text-ink/50">{selectedChild.age} tuổi</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink/40 transition-transform ml-2 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-30 overflow-hidden min-w-[260px] animate-fade-in p-1.5 space-y-1">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Hồ sơ của bạn
                    </div>
                    {children.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectChild(c)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer ${
                          selectedChild.id === c.id ? "bg-slate-100 font-bold" : ""
                        }`}
                      >
                        <span className="text-xl">{c.avatar || "🌻"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800 truncate">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.age} tuổi · {c.condition || "Bình thường"}</p>
                        </div>
                        {selectedChild.id === c.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate({ to: "/create-child" });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#1FA7E1] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tạo thêm hồ sơ bé mới
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tag tình trạng phát triển */}
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Tình trạng: <strong className="text-slate-900">{selectedChild.condition || "Phát triển bình thường"}</strong></span>
              </div>
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
                    {value}
                    <span className="text-base font-semibold text-ink/40">{unit}</span>
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5 font-medium">{label}</p>
                  <div
                    className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      positive ? "text-emerald-700 bg-emerald-50" : "text-rose-600 bg-rose-50"
                    }`}
                  >
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
                    <h2 className="text-base font-bold text-ink">Điểm tiến bộ 7 tuần của {childName}</h2>
                    <p className="text-xs text-ink/50 mt-0.5">Theo dõi xu hướng phát triển tổng thể</p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-emerald-700"
                    style={{ background: "#D1FAE5" }}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />+{scoreDelta} tuần này
                  </div>
                </div>
                <MiniBarChart data={weeklyData} />

                {/* Sparklines row */}
                <div className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                  {[
                    {
                      label: "Từ mới",
                      data: weeklyData.map((d) => d.words),
                      color: "var(--brand-blue)",
                    },
                    { label: "Hành vi", data: weeklyData.map((d) => d.behaviors), color: "#D67B8B" },
                    {
                      label: "Hoạt động",
                      data: weeklyData.map((d) => d.activities),
                      color: "var(--brand-mint)",
                    },
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
                  <div
                    className="w-7 h-7 rounded-xl grid place-items-center"
                    style={{ background: "var(--brand-yellow-soft)" }}
                  >
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
                        cx="32"
                        cy="32"
                        r="26"
                        strokeWidth="8"
                        stroke="url(#progressGrad)"
                        fill="none"
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
                    <p className="text-xs text-ink/50 mt-0.5 leading-relaxed">
                      Xuất sắc! {childName} đang phát triển rất tốt 🌟
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity log */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-7 h-7 rounded-xl grid place-items-center"
                  style={{ background: "var(--brand-mint-soft)" }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: "var(--brand-mint)" }} />
                </div>
                <h2 className="text-base font-bold text-ink">Nhật ký hoạt động cùng {childName}</h2>
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
                        background:
                          item.status === "done"
                            ? "var(--brand-mint-soft)"
                            : "var(--brand-yellow-soft)",
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
                      <p className="text-xs text-ink/40 mt-0.5">
                        {item.day} · {item.duration}
                      </p>
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
          </>
        )}
      </main>

      {/* AI Chat Widget: luôn nhận diện đúng bé của phụ huynh */}
      <SharedAIChatWidget
        selectedChild={selectedChild ? { name: selectedChild.name } : { name: "bé" }}
        progressData={weeklyData}
        contextLabel="Trang theo dõi tiến trình"
      />
    </div>
  );
}
