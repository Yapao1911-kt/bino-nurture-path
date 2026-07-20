import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AIChatWidget } from "@/components/ai-chat-widget";
import {
  Heart,
  Sparkles,
  BookOpen,
  BarChart2,
  Users,
  Smile,
  ArrowRight,
  Check,
  Menu,
  X,
  Brain,
  Palette,
  MessageCircle,
  GraduationCap,
  Compass,
  Star,
  Calendar,
  Sun,
  Cloud,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bino — Đồng hành cùng con trên hành trình can thiệp sớm" },
      {
        name: "description",
        content:
          "Bino là hệ sinh thái AI dịu dàng, giúp cha mẹ và giáo viên xây dựng lộ trình học cá nhân hóa cho trẻ có nhu cầu đặc biệt.",
      },
    ],
  }),
});

/* ---------- Reusable bits ---------- */

function BinoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <span
      className={`${className} rounded-3xl grid place-items-center shadow-sm shadow-brand-blue/40`}
      style={{
        background: "linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-mint) 100%)",
      }}
    >
      <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
    </span>
  );
}

/* ---------- Cute SVG illustrations ---------- */

function CuteCloud({ className = "", color = "#FFFFFF" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <g>
        <ellipse cx="40" cy="50" rx="28" ry="22" fill={color} />
        <ellipse cx="72" cy="42" rx="32" ry="26" fill={color} />
        <ellipse cx="92" cy="55" rx="22" ry="18" fill={color} />
        <ellipse cx="58" cy="60" rx="34" ry="18" fill={color} />
        {/* Smile */}
        <circle cx="52" cy="48" r="2.4" fill="#4B5563" />
        <circle cx="74" cy="48" r="2.4" fill="#4B5563" />
        <path
          d="M55 56 Q63 63 71 56"
          stroke="#4B5563"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Blush */}
        <circle cx="46" cy="56" r="2.8" fill="#FFCAD4" opacity="0.85" />
        <circle cx="78" cy="56" r="2.8" fill="#FFCAD4" opacity="0.85" />
      </g>
    </svg>
  );
}

function CuteStar({ className = "", color = "#FFF3B0" }: { className?: string; color?: string }) {
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

function CuteBear({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      {/* Ears */}
      <circle cx="40" cy="42" r="16" fill="#FFD3B6" />
      <circle cx="100" cy="42" r="16" fill="#FFD3B6" />
      <circle cx="40" cy="42" r="8" fill="#FFEBDC" />
      <circle cx="100" cy="42" r="8" fill="#FFEBDC" />
      {/* Head */}
      <circle cx="70" cy="78" r="44" fill="#FFD3B6" />
      {/* Snout */}
      <ellipse cx="70" cy="92" rx="22" ry="16" fill="#FFEBDC" />
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
      <circle cx="48" cy="88" r="5" fill="#FFCAD4" opacity="0.7" />
      <circle cx="92" cy="88" r="5" fill="#FFCAD4" opacity="0.7" />
    </svg>
  );
}

/* ---------- Navbar ---------- */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState<{
    isLoggedIn: boolean;
    userName: string | null;
    role: string | null;
  }>({
    isLoggedIn: false,
    userName: null,
    role: null,
  });

  useEffect(() => {
    // 1. Kiểm tra session giả lập trước
    const simulatedRole = localStorage.getItem("bino_simulated_role");
    const simulatedUser = localStorage.getItem("bino_simulated_user");

    if (simulatedRole) {
      setAuth({
        isLoggedIn: true,
        userName: simulatedUser || "Người dùng Demo",
        role: simulatedRole,
      });
      return;
    }

    // 2. Nếu không có giả lập, kiểm tra Supabase Session thật
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuth({
          isLoggedIn: true,
          userName: session.user.user_metadata?.full_name || session.user.email || "Thành viên",
          role: session.user.user_metadata?.role || "parent",
        });
      }
    });

    // Đăng ký thay đổi trạng thái
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const simRole = localStorage.getItem("bino_simulated_role");
      const simUser = localStorage.getItem("bino_simulated_user");

      if (simRole) {
        setAuth({
          isLoggedIn: true,
          userName: simUser || "Người dùng Demo",
          role: simRole,
        });
      } else if (session?.user) {
        setAuth({
          isLoggedIn: true,
          userName: session.user.user_metadata?.full_name || session.user.email || "Thành viên",
          role: session.user.user_metadata?.role || "parent",
        });
      } else {
        setAuth({
          isLoggedIn: false,
          userName: null,
          role: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem("bino_simulated_role");
    localStorage.removeItem("bino_simulated_user");
    localStorage.removeItem("bino_simulated_email");
    await supabase.auth.signOut();
    setAuth({
      isLoggedIn: false,
      userName: null,
      role: null,
    });
    setOpen(false);
  };

  const links = [
    { label: "Trang chủ", href: "#home" },
    { label: "Tính năng", href: "#features" },
    { label: "Lesson Builder", href: "/lesson-builder" },
    { label: "Cộng đồng", href: "#community" },
    { label: "Bảng giá", href: "#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center overflow-hidden h-14 md:h-20">
          <img
            src="/logo.png"
            alt="Bino Logo"
            className="h-32 md:h-44 my-[-36px] md:my-[-50px] w-auto object-contain"
          />
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isHash = l.href.startsWith("#");
            return (
              <li key={l.href}>
                {isHash ? (
                  <a
                    href={l.href}
                    className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.href}
                    className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="hidden md:flex items-center gap-3">
          {auth.isLoggedIn ? (
            <>
              <div className="flex flex-col items-end mr-1 text-right">
                <span className="text-sm font-bold text-ink">Chào, {auth.userName}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {auth.role === "teacher" ? "Giáo viên" : "Phụ huynh"}
                </span>
              </div>
              <Link
                to="/create-child"
                className="px-4 py-2 text-xs font-bold text-ink rounded-xl border border-slate-100 bg-white shadow-[2px_2px_0px_#eee] hover:border-slate-200 transition-all text-center"
              >
                Hồ sơ bé
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-medium text-ink hover:bg-white/60 rounded-full transition-colors text-center"
              >
                Đăng nhập
              </Link>
              <Link
                to="/create-child"
                className="px-5 py-2.5 text-sm font-semibold text-ink rounded-full shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md text-center"
                style={{ background: "var(--brand-mint)" }}
              >
                Dùng thử miễn phí
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-white/70 text-ink"
          aria-label="Mở menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-white bg-white/90 backdrop-blur-md px-4 py-4 space-y-1.5">
          {links.map((l) => {
            const isHash = l.href.startsWith("#");
            return isHash ? (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-2xl text-ink hover:bg-brand-blue-soft"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-2xl text-ink hover:bg-brand-blue-soft"
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {auth.isLoggedIn ? (
              <>
                <div className="px-4 py-1.5 flex flex-col">
                  <span className="text-sm font-bold text-ink">Chào, {auth.userName}</span>
                  <span className="text-xs text-slate-400">
                    Vai trò: {auth.role === "teacher" ? "Giáo viên" : "Phụ huynh"}
                  </span>
                </div>
                <Link
                  to="/create-child"
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-2xl text-ink font-semibold bg-brand-blue-soft"
                >
                  Tạo hồ sơ cho bé
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-center px-4 py-2.5 rounded-2xl text-rose-500 hover:bg-rose-50 font-semibold cursor-pointer"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm rounded-full border border-ink/10 text-ink text-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/create-child"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm rounded-full text-ink font-semibold text-center"
                  style={{ background: "var(--brand-mint)" }}
                >
                  Dùng thử
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */

function FloatingShape({ className, color }: { className: string; color: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ backgroundColor: color, opacity: 0.55 }}
    />
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <FloatingShape className="top-10 -left-20 w-96 h-96" color="#DCEFFB" />
      <FloatingShape className="-top-10 right-0 w-96 h-96" color="#FFEBDC" />
      <FloatingShape className="bottom-10 left-1/3 w-80 h-80" color="#E2F6EC" />

      {/* Cute floating illustrations */}
      <CuteCloud className="hidden sm:block absolute top-24 right-[8%] w-24 opacity-90 animate-[float_6s_ease-in-out_infinite]" />
      <CuteStar className="hidden sm:block absolute top-40 left-[6%] w-12 rotate-[-12deg] animate-[float_5s_ease-in-out_infinite]" />
      <CuteStar
        className="absolute bottom-24 right-[14%] w-10 rotate-[18deg] opacity-80"
        color="#FFD3B6"
      />

      {/* Crafty paper-cut decorations */}
      <div className="hidden lg:block absolute top-28 left-[4%] w-28 h-20 opacity-60 rotate-12">
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
          <path
            d="M20 50C20 40 30 35 40 35C45 20 65 20 75 30C85 25 105 30 105 45C115 50 115 65 100 70H25C10 70 10 55 20 50Z"
            fill="#8ECDF8"
          />
        </svg>
      </div>
      <div className="hidden lg:block absolute bottom-16 right-[6%] w-20 h-20 opacity-60 -rotate-6">
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <path d="M40 5L48 30H75L53 45L62 70L40 55L18 70L27 45L5 30H32L40 5Z" fill="#FFF3B0" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 lg:pt-24 lg:pb-36 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-brand-blue text-ink text-sm font-semibold shadow-[4px_4px_0px_rgba(78,163,247,0.4)] -rotate-2 hover:rotate-0 transition-transform">
            <span className="w-2 h-2 rounded-full bg-brand-blue" />
            AI dịu dàng đồng hành can thiệp sớm
          </span>
          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.2] tracking-tight text-ink">
            <span className="inline-block bg-white px-3 py-1 rounded-xl shadow-[6px_6px_0px_var(--brand-mint)] rotate-1 mb-3">
              Mỗi đứa trẻ
            </span>
            <br />
            <span
              className="inline-block px-3 py-1 rounded-xl shadow-[6px_6px_0px_#FF8DA1] -rotate-1 mb-3 text-white"
              style={{ background: "var(--brand-pink)" }}
            >
              đều lớn lên
            </span>
            <br />
            <span className="inline-block bg-white px-3 py-1 rounded-xl shadow-[6px_6px_0px_var(--brand-peach)] rotate-2">
              theo một cách riêng
            </span>
          </h1>
          <div className="mt-8 text-lg text-ink/70 leading-relaxed max-w-xl mx-auto lg:mx-0 space-y-4">
            <p>
              Bino là một nền tảng web/app tích hợp Trí tuệ nhân tạo (AI) được thiết kế để hỗ trợ
              phụ huynh, giáo viên và người chăm sóc đồng hành cùng các trẻ em có khó khăn về phát
              triển (chậm nói, tự kỷ, tăng động giảm chú ý - ADHD, v.v.).
            </p>
            <p className="text-sm border-l-4 border-brand-mint pl-4 italic bg-brand-mint-soft/50 py-2 pr-3 rounded-r-xl">
              Tên gọi <strong>"Bino"</strong> mang ý nghĩa: <strong>Bi</strong> (baby/bright/begin -
              em bé, tươi sáng, sự khởi đầu) kết hợp với <strong>No</strong> (no limits/no barriers
              - không giới hạn, không rào cản), mang thông điệp cốt lõi:{" "}
              <em>
                "Không giới hạn sự phát triển của trẻ - Nơi đồng hành cùng những bước phát triển đầu
                tiên"
              </em>
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-5">
            <Link
              to="/create-child"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-bold shadow-[6px_6px_0px_#2581DF] -rotate-2 hover:rotate-0 transition-transform text-center"
              style={{ background: "var(--brand-blue)" }}
            >
              Bắt đầu miễn phí
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/library"
              search={{ tab: "materials" }}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-ink font-bold border-2 border-slate-100 shadow-[6px_6px_0px_#f0f0f0] rotate-1 hover:rotate-0 transition-transform text-center"
            >
              Khám phá học liệu
            </Link>
          </div>
        </div>

        {/* Illustration card */}
        <div className="relative">
          <div className="relative max-w-lg mx-auto">
            {/* Dashed swirly trail */}
            <svg
              className="absolute -top-10 -left-10 w-full h-full -z-10 opacity-30 pointer-events-none"
              viewBox="0 0 400 400"
              fill="none"
            >
              <path
                d="M10,200 C50,100 150,100 200,200 S350,300 390,200"
                stroke="#8ECDF8"
                strokeWidth="4"
                strokeDasharray="8,8"
              />
            </svg>
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
              style={{ background: "var(--brand-yellow-soft)" }}
            />
            <div
              className="absolute -bottom-10 -left-8 w-40 h-40 rounded-full"
              style={{ background: "var(--brand-pink-soft)" }}
            />

            {/* Main card — paper cutout style, slight tilt */}
            <div className="relative rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-[15px_15px_0px_#f3f3f3] border border-slate-50 rotate-2 space-y-4">
              {/* Sticker label */}
              <div className="absolute -top-4 left-6 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100 -rotate-[4deg] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--brand-blue)" }} />
                <span className="text-[10px] font-bold text-ink/50 tracking-wider uppercase">
                  AI đề xuất
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl grid place-items-center"
                    style={{ background: "var(--brand-blue-soft)" }}
                  >
                    <Smile className="w-6 h-6" style={{ color: "#3D8FC0" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">Bé Minh An</p>
                    <p className="text-xs text-ink/60">Lộ trình tuần này</p>
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-ink"
                  style={{ background: "var(--brand-mint-soft)" }}
                >
                  Tuần 4
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: MessageCircle,
                    title: "Giao tiếp",
                    sub: "12 từ mới",
                    bg: "var(--brand-blue-soft)",
                    color: "#25729F",
                  },
                  {
                    icon: Heart,
                    title: "Cảm xúc",
                    sub: "4 cảm xúc",
                    bg: "var(--brand-pink-soft)",
                    color: "#C55266",
                  },
                  {
                    icon: BookOpen,
                    title: "Flashcard",
                    sub: "24 thẻ",
                    bg: "var(--brand-mint-soft)",
                    color: "#2B825D",
                  },
                  {
                    icon: Star,
                    title: "Vận động",
                    sub: "5 hoạt động",
                    bg: "var(--brand-peach-soft)",
                    color: "#A6572A",
                  },
                ].map((it, i) => {
                  const Icon = it.icon;
                  const tilts = ["-rotate-1", "rotate-2", "rotate-1", "-rotate-2"];
                  return (
                    <div
                      key={it.title}
                      className={`p-4 rounded-2xl border-2 border-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 ${tilts[i]}`}
                      style={{ background: it.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: it.color }} />
                      <p className="mt-2 text-sm font-semibold text-ink">{it.title}</p>
                      <p className="text-xs text-ink/60">{it.sub}</p>
                    </div>
                  );
                })}
              </div>

              <div
                className="p-4 rounded-2xl flex items-center gap-3 border-2 border-dashed border-[#E5BA35] -rotate-1"
                style={{ background: "var(--brand-yellow-soft)" }}
              >
                <Sun className="w-5 h-5" style={{ color: "#A17415" }} />
                <p className="text-sm text-ink">"Hôm nay con đã chủ động vẫy tay chào mẹ!"</p>
              </div>
            </div>

            {/* Floating tilted sticker chip */}
            <div className="absolute -bottom-4 right-4 px-4 py-2.5 rounded-2xl bg-white border-2 border-white shadow-[4px_4px_0px_var(--brand-mint)] flex items-center gap-2 rotate-[5deg]">
              <Cloud className="w-4 h-4" style={{ color: "#2B825D" }} />
              <span className="text-xs font-semibold text-ink">Tiến bộ +18%</span>
            </div>
            {/* Friendly bear mascot peeking */}
            <div className="absolute -bottom-12 -right-6 w-28 sm:w-32 drop-shadow-md rotate-6">
              <CuteBear className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Problems ---------- */

function Problems() {
  const items = [
    {
      icon: Compass,
      title: "Cha mẹ hoang mang",
      desc: "Không biết bắt đầu từ đâu, thông tin trên mạng rời rạc và mâu thuẫn.",
      bg: "var(--brand-peach-soft)",
      iconBg: "var(--brand-peach)",
    },
    {
      icon: BookOpen,
      title: "Học liệu phân mảnh",
      desc: "Khó tìm flashcard, storyboard trực quan phù hợp với con.",
      bg: "var(--brand-blue-soft)",
      iconBg: "var(--brand-blue)",
    },
    {
      icon: GraduationCap,
      title: "Áp lực giáo án",
      desc: "Giáo viên mất quá nhiều thời gian thiết kế tài liệu cá nhân hóa.",
      bg: "var(--brand-pink-soft)",
      iconBg: "var(--brand-pink)",
    },
    {
      icon: Users,
      title: "Cảm giác cô lập",
      desc: "Thiếu một cộng đồng thấu cảm và mạng lưới chuyên gia dẫn dắt.",
      bg: "var(--brand-mint-soft)",
      iconBg: "var(--brand-mint)",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-ink text-sm font-medium"
            style={{ background: "var(--brand-peach-soft)" }}
          >
            Thấu cảm
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink leading-tight">
            Những khó khăn trên hành trình đồng hành cùng con
          </h2>
          <p className="mt-4 text-ink/70 leading-relaxed">
            Bạn không hề đơn độc. Đây là điều rất nhiều cha mẹ và thầy cô đang cùng trải qua.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, desc, bg, iconBg }) => (
            <div
              key={title}
              className="p-6 rounded-3xl bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md shadow-sm"
            >
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center"
                style={{ background: bg }}
              >
                <div
                  className="w-9 h-9 rounded-xl grid place-items-center"
                  style={{ background: iconBg }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.4} />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */

function Features() {
  const features = [
    {
      icon: Brain,
      title: "Trợ lý AI",
      desc: "AI dịu dàng xây dựng lộ trình tuần thích ứng theo biểu hiện và mục tiêu của con.",
      bg: "var(--brand-blue-soft)",
      accent: "var(--brand-blue)",
      href: "/ai-assistant",
    },
    {
      icon: BookOpen,
      title: "Kho học liệu",
      desc: "Flashcard, PECS, worksheet đa dạng — được chuyên gia chọn lọc kỹ.",
      bg: "var(--brand-mint-soft)",
      accent: "var(--brand-mint)",
      href: "/library",
      search: { tab: "materials" },
    },
    {
      icon: Palette,
      title: "Lesson Builder",
      desc: "Công cụ kéo thả phong cách Canva tạo giáo án cá nhân hóa trong vài phút.",
      bg: "var(--brand-peach-soft)",
      accent: "var(--brand-peach)",
      href: "/lesson-builder",
    },
    {
      icon: BarChart2,
      title: "Progress Tracker",
      desc: "Biểu đồ theo dõi hành vi, từ mới và mức độ tương tác theo thời gian.",
      bg: "var(--brand-yellow-soft)",
      accent: "var(--brand-yellow)",
      href: "/progress-tracker",
    },
    {
      icon: Users,
      title: "Cộng đồng phụ huynh",
      desc: "Kết nối, chia sẻ kinh nghiệm với nhóm phụ huynh đồng cảnh ngộ.",
      bg: "var(--brand-pink-soft)",
      accent: "var(--brand-pink)",
    },
    {
      icon: GraduationCap,
      title: "Mạng lưới chuyên gia",
      desc: "Đặt lịch với chuyên gia giáo dục đặc biệt & tâm lý đã kiểm duyệt.",
      bg: "var(--brand-mint-soft)",
      accent: "var(--brand-mint)",
    },
  ];
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-ink text-sm font-medium"
            style={{ background: "var(--brand-blue-soft)" }}
          >
            Hệ sinh thái
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink leading-tight">
            Mọi thứ Bino có cho hành trình của con
          </h2>
          <p className="mt-4 text-ink/70 leading-relaxed">
            Sáu công cụ được thiết kế để dịu dàng hỗ trợ trẻ, cha mẹ và thầy cô.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, bg, accent, href, search }) => (
            <div
              key={title}
              className="group p-7 rounded-3xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg shadow-sm"
              style={{ background: bg }}
            >
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center bg-white shadow-sm"
                style={{ color: "var(--ink)" }}
              >
                <div
                  className="w-9 h-9 rounded-xl grid place-items-center"
                  style={{ background: accent }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.4} />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-ink/70 leading-relaxed">{desc}</p>
              {href ? (
                <Link
                  to={href}
                  search={search}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:gap-2.5 transition-all"
                >
                  Mở ngay <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <a
                  href="#"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:gap-2.5 transition-all"
                >
                  Tìm hiểu <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Nhập hồ sơ của trẻ",
      desc: "Tuổi, mức độ tương tác, mục tiêu và những điều con yêu thích.",
      icon: Smile,
      bg: "var(--brand-blue-soft)",
      dot: "var(--brand-blue)",
    },
    {
      n: "02",
      title: "AI thiết kế lộ trình",
      desc: "Bino gợi ý chuỗi học liệu phù hợp, tuần tự, dễ thực hiện mỗi ngày.",
      icon: Sparkles,
      bg: "var(--brand-mint-soft)",
      dot: "var(--brand-mint)",
    },
    {
      n: "03",
      title: "Theo dõi & cải thiện",
      desc: "Ghi nhận tiến trình, nhận phản hồi thích ứng và điều chỉnh nhẹ nhàng.",
      icon: BarChart2,
      bg: "var(--brand-peach-soft)",
      dot: "var(--brand-peach)",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CuteCloud className="hidden md:block absolute -top-4 right-8 w-20 opacity-80" />
        <CuteStar
          className="hidden md:block absolute top-10 left-4 w-10 rotate-[10deg]"
          color="#A8E6CF"
        />
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-ink text-sm font-medium"
            style={{ background: "var(--brand-yellow-soft)" }}
          >
            Quy trình
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink leading-tight">
            3 bước đơn giản để bắt đầu
          </h2>
        </div>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div
            className="hidden lg:block absolute top-16 left-[16%] right-[16%] h-1 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--brand-blue) 0%, var(--brand-mint) 50%, var(--brand-peach) 100%)",
              opacity: 0.4,
            }}
          />
          {steps.map(({ n, title, desc, icon: Icon, bg, dot }) => (
            <div key={n} className="relative text-center">
              <div className="relative mx-auto w-32 h-32">
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: bg, opacity: 0.9 }}
                />
                <div
                  className="relative w-32 h-32 rounded-full bg-white grid place-items-center shadow-lg"
                  style={{ boxShadow: `0 12px 32px -10px ${bg}` }}
                >
                  <Icon className="w-10 h-10" style={{ color: "var(--ink)" }} strokeWidth={2} />
                  <span
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full text-ink text-sm font-bold grid place-items-center shadow-md"
                    style={{ background: dot }}
                  >
                    {n}
                  </span>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-ink/70 leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Community ---------- */

function Community() {
  return (
    <section id="community" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 lg:p-16"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-blue-soft) 0%, var(--brand-peach-soft) 50%, var(--brand-pink-soft) 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "var(--brand-yellow)", opacity: 0.35 }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "var(--brand-mint)", opacity: 0.35 }}
          />
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur text-ink text-sm font-medium">
                <Heart className="w-4 h-4" style={{ color: "#D67B8B" }} /> Kết nối
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-ink leading-tight">
                Không ai phải bước đi một mình
              </h2>
              <p className="mt-4 text-ink/80 leading-relaxed">
                Tham gia thử thách <strong className="text-ink">"7 Ngày Giao Tiếp Cùng Con"</strong>{" "}
                miễn phí và đặt lịch trò chuyện với chuyên gia đã được Bino kiểm định.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/create-child"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-ink font-semibold shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg text-center"
                  style={{ background: "var(--brand-blue)" }}
                >
                  Tham gia thử thách
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-ink font-semibold shadow-sm hover:-translate-y-1 transition-all duration-300">
                  <Calendar className="w-4 h-4" /> Đặt lịch chuyên gia
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Users,
                  v: "12.4k+",
                  l: "Cha mẹ đồng hành",
                  c: "var(--brand-blue)",
                },
                {
                  icon: GraduationCap,
                  v: "280+",
                  l: "Chuyên gia kiểm định",
                  c: "var(--brand-mint)",
                  offset: true,
                },
                {
                  icon: Sun,
                  v: "7 ngày",
                  l: "Giao tiếp cùng con",
                  c: "var(--brand-yellow)",
                },
                {
                  icon: BookOpen,
                  v: "1.500+",
                  l: "Học liệu chuyên biệt",
                  c: "var(--brand-pink)",
                  offset: true,
                },
              ].map(({ icon: Icon, v, l, c, offset }) => (
                <div
                  key={l}
                  className={`p-5 rounded-3xl bg-white/95 backdrop-blur shadow-sm ${
                    offset ? "mt-8" : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-2xl grid place-items-center"
                    style={{ background: c }}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.4} />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-ink">{v}</p>
                  <p className="text-sm text-ink/60">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

function Testimonials() {
  const items = [
    {
      quote:
        "Lần đầu tiên tôi cảm thấy mình thực sự biết phải làm gì tiếp theo cho con. Bino dịu dàng dẫn dắt từng bước nhỏ.",
      name: "Chị Mai Anh",
      role: "Mẹ của bé Nam, 4 tuổi",
      bg: "var(--brand-peach-soft)",
      avatar: "var(--brand-peach)",
    },
    {
      quote:
        "Lesson Builder tiết kiệm cho tôi hàng giờ mỗi tuần. Giáo án cá nhân hóa giờ chỉ mất 10 phút.",
      name: "Cô Thu Hằng",
      role: "Giáo viên Giáo dục Đặc biệt",
      bg: "var(--brand-mint-soft)",
      avatar: "var(--brand-mint)",
    },
    {
      quote: "Cộng đồng Bino là nơi tôi không phải giải thích quá nhiều. Mọi người đều hiểu.",
      name: "Anh Tuấn Khôi",
      role: "Bố của bé Bin, 6 tuổi",
      bg: "var(--brand-blue-soft)",
      avatar: "var(--brand-blue)",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-ink text-sm font-medium"
            style={{ background: "var(--brand-pink-soft)" }}
          >
            Câu chuyện thật
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink leading-tight">
            Những lời cảm ơn ấm áp
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure
              key={t.name}
              className="p-7 rounded-3xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md shadow-sm"
              style={{ background: t.bg }}
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ color: "#E8B84A", fill: "#E8B84A" }} />
                ))}
              </div>
              <blockquote className="mt-4 text-ink leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full grid place-items-center text-ink font-bold"
                  style={{ background: t.avatar }}
                >
                  {t.name.split(" ").slice(-1)[0].charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">{t.name}</p>
                  <p className="text-xs text-ink/60">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

function Pricing() {
  const plans = [
    {
      name: "Gói Cơ Bản",
      price: "Miễn phí",
      desc: "Bắt đầu hành trình cùng con — không tốn chi phí.",
      features: [
        "Truy cập học liệu cơ bản",
        "Tham gia cộng đồng phụ huynh",
        "Theo dõi tiến trình đơn giản",
        "Thử thách 7 ngày giao tiếp",
      ],
      cta: "Bắt đầu miễn phí",
      featured: false,
    },
    {
      name: "Gói Premium",
      price: "199.000đ",
      sub: "/tháng",
      desc: "Toàn bộ sức mạnh của Bino cho hành trình cá nhân hóa.",
      features: [
        "Trợ lý AI lập lộ trình cá nhân hóa",
        "Lesson Builder nâng cao",
        "Báo cáo & phân tích chuyên sâu",
        "Ưu tiên đặt lịch chuyên gia",
        "Toàn bộ kho học liệu Premium",
      ],
      cta: "Dùng thử 14 ngày",
      featured: true,
    },
  ];
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-ink text-sm font-medium"
            style={{ background: "var(--brand-mint-soft)" }}
          >
            Bảng giá minh bạch
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink leading-tight">
            Lựa chọn gói phù hợp với gia đình bạn
          </h2>
          <p className="mt-4 text-ink/70 leading-relaxed">
            Bạn có thể bắt đầu miễn phí và nâng cấp bất cứ khi nào cần thêm sự hỗ trợ.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className="relative p-8 rounded-3xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg shadow-sm"
              style={{
                background: p.featured
                  ? "linear-gradient(150deg, var(--brand-blue-soft) 0%, var(--brand-mint-soft) 100%)"
                  : "#FFFFFF",
                border: p.featured ? "none" : "1px solid #EEF2F7",
              }}
            >
              {p.featured && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-ink text-xs font-bold shadow-sm flex items-center gap-1"
                  style={{ background: "var(--brand-yellow)" }}
                >
                  <Sparkles className="w-3 h-3" /> Khuyên dùng
                </span>
              )}
              <h3 className="text-xl font-bold text-ink">{p.name}</h3>
              <p className="mt-2 text-sm text-ink/70 leading-relaxed">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-ink">{p.price}</span>
                {p.sub && <span className="text-ink/60">{p.sub}</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full grid place-items-center shrink-0"
                      style={{
                        background: p.featured ? "var(--brand-mint)" : "var(--brand-blue-soft)",
                      }}
                    >
                      <Check
                        className="w-3 h-3"
                        style={{
                          color: p.featured ? "#FFFFFF" : "var(--ink)",
                        }}
                        strokeWidth={3}
                      />
                    </span>
                    <span className="text-sm text-ink/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/create-child"
                className="mt-8 w-full py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-center block"
                style={{
                  background: p.featured ? "var(--brand-blue)" : "#FFFFFF",
                  color: "var(--ink)",
                  border: p.featured ? "none" : "1px solid #E5E7EB",
                }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  const cols = [
    {
      title: "Sản phẩm",
      links: [
        { label: "Tính năng", href: "#features" },
        { label: "Học liệu", href: "#" },
        { label: "Lesson Builder", href: "/lesson-builder" },
        { label: "Bảng giá", href: "#pricing" },
      ],
    },
    {
      title: "Cộng đồng",
      links: [
        { label: "Nhóm phụ huynh", href: "#" },
        { label: "Chuyên gia", href: "#" },
        { label: "Thử thách 7 ngày", href: "#" },
        { label: "Sự kiện", href: "#" },
      ],
    },
    {
      title: "Công ty",
      links: [
        { label: "Về Bino", href: "#" },
        { label: "Sứ mệnh", href: "#" },
        { label: "Tuyển dụng", href: "#" },
        { label: "Liên hệ", href: "#" },
      ],
    },
  ];
  return (
    <footer className="bg-white/60 backdrop-blur-md border-t border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center overflow-hidden h-14">
              <img
                src="/logo.png"
                alt="Bino Logo"
                className="h-32 my-[-36px] w-auto object-contain"
              />
            </div>
            <p className="mt-4 text-sm text-ink/70 leading-relaxed">
              Người bạn đồng hành thông minh trong quá trình can thiệp sớm.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-ink">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => {
                  const isHash = l.href.startsWith("#");
                  return (
                    <li key={l.label}>
                      {isHash ? (
                        <a
                          href={l.href}
                          className="text-sm text-ink/70 hover:text-ink transition-colors"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.href}
                          className="text-sm text-ink/70 hover:text-ink transition-colors"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-ink/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink/60">
            © {new Date().getFullYear()} Bino. Mọi quyền được bảo lưu.
          </p>
          <p className="text-sm italic text-ink flex items-center gap-2">
            <Heart className="w-4 h-4" style={{ color: "#D67B8B", fill: "#FFCAD4" }} />
            Đồng hành cùng con từ những bước đi đầu tiên
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Floating Mascot ---------- */

function FloatingMascot() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-[-24px] right-[-24px] md:bottom-[-44px] md:right-[-44px] z-50 group">
      {/* Tooltip speech bubble */}
      <div className="absolute bottom-[80%] right-[20%] mb-3 bg-white text-ink text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
        Bino luôn đồng hành cùng con! 🌟
        {/* Little bubble arrow */}
        <div className="absolute top-full right-12 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45 -translate-y-1.5" />
      </div>
      <div className="relative p-8">
        <img
          src="/MASCOT PNG.png"
          alt="Bino Mascot"
          className="w-48 md:w-72 h-auto object-contain animate-[float_4s_ease-in-out_infinite] cursor-pointer drop-shadow-lg transition-transform duration-300 hover:scale-105"
        />
        {/* Cute close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          className="absolute top-6 left-6 w-7 h-7 rounded-full bg-white/90 border border-slate-100 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
          aria-label="Đóng"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function Index() {
  return (
    <main className="min-h-screen bg-background font-sans text-ink antialiased">
      <Navbar />
      <Hero />
      <Problems />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
      <AIChatWidget contextLabel="Trang chính Bino" />
    </main>
  );
}
