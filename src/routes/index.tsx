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
  Baby,
  User,
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

/* ===================================================================
   8 MÃ MÀU CHUẨN CỦA HỆ THỐNG (BINO PALETTE)
   1. Amethyst:     #9956DE (Tím)
   2. Slate Blue:   #7274ED (Xanh lam tím)
   3. Summer Sky:   #1FA7E1 (Xanh biển)
   4. Downy:        #6ED1CF (Xanh ngọc)
   5. Pastel Green: #75D06A (Xanh lá)
   6. Texas Rose:   #FFB365 (Cam đào)
   7. Mona Lisa:    #FF8B8B (Hồng san hô)
   8. Illusion:     #FB96BB (Hồng phấn)
   =================================================================== */

/* ---------- Reusable bits ---------- */

function BinoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <span
      className={`${className} rounded-3xl grid place-items-center shadow-sm shadow-[#7274ED]/40`}
      style={{
        background: "linear-gradient(135deg, #7274ED 0%, #1FA7E1 100%)",
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
        <path d="M55 56 Q63 63 71 56" stroke="#4B5563" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Blush: Illusion #FB96BB */}
        <circle cx="46" cy="56" r="2.8" fill="#FB96BB" opacity="0.85" />
        <circle cx="78" cy="56" r="2.8" fill="#FB96BB" opacity="0.85" />
      </g>
    </svg>
  );
}

function CuteStar({ className = "", color = "#FFB365" }: { className?: string; color?: string }) {
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
      <path d="M28 38 Q32 41 36 38" stroke="#4B5563" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CuteBear({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      {/* Ears: Texas Rose #FFB365 */}
      <circle cx="40" cy="42" r="16" fill="#FFB365" />
      <circle cx="100" cy="42" r="16" fill="#FFB365" />
      <circle cx="40" cy="42" r="8" fill="#FFF5EA" />
      <circle cx="100" cy="42" r="8" fill="#FFF5EA" />
      {/* Head: Texas Rose #FFB365 */}
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
      <path d="M62 96 Q70 104 78 96" stroke="#4B5563" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* Blush: Illusion #FB96BB */}
      <circle cx="48" cy="88" r="5" fill="#FB96BB" opacity="0.8" />
      <circle cx="92" cy="88" r="5" fill="#FB96BB" opacity="0.8" />
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
    // 1. Kiểm tra tài khoản thật từ localStorage
    const savedRole = localStorage.getItem("bino_user_role") || localStorage.getItem("bino_simulated_role");
    const savedUser = localStorage.getItem("bino_user_name") || localStorage.getItem("bino_simulated_user");
    if (savedUser && savedRole) {
      setAuth({
        isLoggedIn: true,
        userName: savedUser,
        role: savedRole,
      });
      return;
    }

    // 2. Kiểm tra Supabase Session nếu có
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
      const sRole = localStorage.getItem("bino_user_role") || localStorage.getItem("bino_simulated_role");
      const sUser = localStorage.getItem("bino_user_name") || localStorage.getItem("bino_simulated_user");

      if (sUser && sRole) {
        setAuth({
          isLoggedIn: true,
          userName: sUser,
          role: sRole,
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
    localStorage.removeItem("bino_user_role");
    localStorage.removeItem("bino_user_name");
    localStorage.removeItem("bino_user_email");
    localStorage.removeItem("bino_user_id");
    localStorage.removeItem("bino_simulated_role");
    localStorage.removeItem("bino_simulated_user");
    localStorage.removeItem("bino_simulated_email");
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
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
    { label: "Cộng đồng", href: "https://www.facebook.com/share/g/1CFpEpPmEq/" },
    { label: "Chuyên gia", href: "/experts" },
    { label: "Premium", href: "/premium" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center overflow-hidden h-14 md:h-20">
          <img src="/logo.png" alt="Bino Logo" className="h-32 md:h-44 my-[-36px] md:my-[-50px] w-auto object-contain" />
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isHash = l.href.startsWith("#");
            const isExternal = l.href.startsWith("http");
            return (
              <li key={l.href}>
                {isExternal ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-slate-600 hover:text-[#7274ED] transition-colors"
                  >
                    {l.label}
                  </a>
                ) : isHash ? (
                  <a
                    href={l.href}
                    className="text-sm font-semibold text-slate-600 hover:text-[#7274ED] transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.href}
                    className="text-sm font-semibold text-slate-600 hover:text-[#7274ED] transition-colors"
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div
                  className={`w-8 h-8 rounded-xl grid place-items-center ${
                    auth.role === "teacher"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {auth.role === "teacher" ? (
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Baby className="w-4 h-4 text-blue-700" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-slate-800 leading-tight">
                    {auth.userName}
                  </span>
                  <span
                    className={`inline-block text-[10px] font-black uppercase tracking-wider ${
                      auth.role === "teacher" ? "text-emerald-600" : "text-blue-600"
                    }`}
                  >
                    {auth.role === "teacher" ? "Giáo viên" : "Phụ huynh"}
                  </span>
                </div>
              </div>
              <Link
                to="/create-child"
                className="px-4 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-white shadow-[0_2px_0px_#CBD5E1] hover:border-slate-300 transition-all text-center"
              >
                Hồ sơ bé
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3.5 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-[#7274ED]/10 hover:text-[#7274ED] rounded-full transition-colors cursor-pointer"
              >
                Đăng nhập
              </Link>
              <Link
                to="/create-child"
                className="px-5 py-2.5 text-sm font-bold text-white rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md text-center cursor-pointer"
                style={{
                  backgroundColor: "#75D06A",
                  boxShadow: "0 3px 0px #59B84E",
                }}
              >
                Dùng thử miễn phí
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-white/70 text-slate-700"
          aria-label="Mở menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-1.5">
          {links.map((l) => {
            const isHash = l.href.startsWith("#");
            const isExternal = l.href.startsWith("http");
            return isExternal ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-2xl text-slate-700 hover:bg-[#1FA7E1]/10 hover:text-[#1FA7E1] font-semibold"
              >
                {l.label}
              </a>
            ) : isHash ? (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-2xl text-slate-700 hover:bg-[#1FA7E1]/10 hover:text-[#1FA7E1] font-semibold"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-2xl text-slate-700 hover:bg-[#1FA7E1]/10 hover:text-[#1FA7E1] font-semibold"
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {auth.isLoggedIn ? (
              <>
                <div className="px-3.5 py-2.5 flex items-center gap-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div
                    className={`w-9 h-9 rounded-xl grid place-items-center ${
                      auth.role === "teacher"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {auth.role === "teacher" ? (
                      <GraduationCap className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Baby className="w-5 h-5 text-blue-700" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-slate-800">{auth.userName}</span>
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider ${
                        auth.role === "teacher" ? "text-emerald-600" : "text-blue-600"
                      }`}
                    >
                      {auth.role === "teacher" ? "Giáo viên" : "Phụ huynh"}
                    </span>
                  </div>
                </div>
                <Link
                  to="/create-child"
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-2xl text-white font-bold"
                  style={{
                    backgroundColor: "#1FA7E1",
                    boxShadow: "0 3px 0px #168BC0",
                  }}
                >
                  Tạo hồ sơ cho bé
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-center px-4 py-2.5 rounded-2xl text-rose-500 hover:bg-rose-50 font-bold cursor-pointer"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold rounded-full border border-slate-200 text-slate-700 text-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/create-child"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-full text-center"
                  style={{
                    backgroundColor: "#75D06A",
                    boxShadow: "0 3px 0px #59B84E",
                  }}
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

function FloatingShape({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
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
      {/* Ambient background using Summer Sky, Texas Rose, Downy */}
      <FloatingShape className="top-10 -left-20 w-96 h-96" color="rgba(31, 167, 225, 0.15)" />
      <FloatingShape className="-top-10 right-0 w-96 h-96" color="rgba(255, 179, 101, 0.15)" />
      <FloatingShape className="bottom-10 left-1/3 w-80 h-80" color="rgba(110, 209, 207, 0.15)" />

      {/* Cute floating illustrations */}
      <CuteCloud className="hidden sm:block absolute top-24 right-[8%] w-24 opacity-90 animate-[float_6s_ease-in-out_infinite]" />
      <CuteStar className="hidden sm:block absolute top-40 left-[6%] w-12 rotate-[-12deg] animate-[float_5s_ease-in-out_infinite]" color="#FFB365" />
      <CuteStar className="absolute bottom-24 right-[14%] w-10 rotate-[18deg] opacity-80" color="#FB96BB" />

      {/* Crafty paper-cut decorations */}
      <div className="hidden lg:block absolute top-28 left-[4%] w-28 h-20 opacity-60 rotate-12">
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
          <path d="M20 50C20 40 30 35 40 35C45 20 65 20 75 30C85 25 105 30 105 45C115 50 115 65 100 70H25C10 70 10 55 20 50Z" fill="#1FA7E1" fillOpacity="0.35" />
        </svg>
      </div>
      <div className="hidden lg:block absolute bottom-16 right-[6%] w-20 h-20 opacity-60 -rotate-6">
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <path d="M40 5L48 30H75L53 45L62 70L40 55L18 70L27 45L5 30H32L40 5Z" fill="#FFB365" fillOpacity="0.45" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 lg:pt-24 lg:pb-36 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 text-slate-800 text-sm font-bold -rotate-2 hover:rotate-0 transition-transform"
            style={{
              borderColor: "#1FA7E1",
              boxShadow: "4px 4px 0px rgba(31, 167, 225, 0.4)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#1FA7E1" }} />
            AI dịu dàng đồng hành can thiệp sớm
          </span>
          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.2] tracking-tight text-slate-900">
            <span
              className="inline-block bg-white px-3 py-1 rounded-xl rotate-1 mb-3"
              style={{ boxShadow: "6px 6px 0px #6ED1CF" }}
            >
              Mỗi đứa trẻ
            </span>
            <br />
            <span
              className="inline-block px-3 py-1 rounded-xl -rotate-1 mb-3 text-white"
              style={{
                backgroundColor: "#FF8B8B",
                boxShadow: "6px 6px 0px #E06D6D",
              }}
            >
              đều lớn lên
            </span>
            <br />
            <span
              className="inline-block bg-white px-3 py-1 rounded-xl rotate-2"
              style={{ boxShadow: "6px 6px 0px #FFB365" }}
            >
              theo một cách riêng
            </span>
          </h1>
          <div className="mt-8 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 space-y-4 font-medium">
            <p>
              Bino là một nền tảng web/app tích hợp Trí tuệ nhân tạo (AI) được thiết kế để hỗ trợ phụ huynh, giáo viên và người chăm sóc đồng hành cùng các trẻ em có khó khăn về phát triển (chậm nói, tự kỷ, tăng động giảm chú ý - ADHD, v.v.).
            </p>
            <p
              className="text-sm border-l-4 pl-4 italic py-2 pr-3 rounded-r-xl"
              style={{
                borderColor: "#6ED1CF",
                backgroundColor: "rgba(110, 209, 207, 0.12)",
              }}
            >
              Tên gọi <strong>"Bino"</strong> mang ý nghĩa: <strong>Bi</strong> (baby/bright/begin - em bé, tươi sáng, sự khởi đầu) kết hợp với <strong>No</strong> (no limits/no barriers - không giới hạn, không rào cản), mang thông điệp cốt lõi: <em>"Không giới hạn sự phát triển của trẻ - Nơi đồng hành cùng những bước phát triển đầu tiên"</em>
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-5">
            <Link
              to="/create-child"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-extrabold -rotate-2 hover:rotate-0 transition-all text-center cursor-pointer"
              style={{
                backgroundColor: "#7274ED",
                boxShadow: "0 5px 0px #595BCF",
              }}
            >
              Bắt đầu miễn phí
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white font-extrabold border-2 rotate-1 hover:rotate-0 transition-all text-center cursor-pointer"
              style={{
                borderColor: "#1FA7E1",
                color: "#1FA7E1",
                boxShadow: "0 5px 0px #168BC0",
              }}
            >
              Khám phá học liệu
            </a>
          </div>
        </div>

        {/* Illustration card */}
        <div className="relative">
          <div className="relative max-w-lg mx-auto">
            {/* Dashed swirly trail */}
            <svg className="absolute -top-10 -left-10 w-full h-full -z-10 opacity-30 pointer-events-none" viewBox="0 0 400 400" fill="none">
              <path d="M10,200 C50,100 150,100 200,200 S350,300 390,200" stroke="#1FA7E1" strokeWidth="4" strokeDasharray="8,8" />
            </svg>
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
              style={{ backgroundColor: "rgba(255, 179, 101, 0.2)" }}
            />
            <div
              className="absolute -bottom-10 -left-8 w-40 h-40 rounded-full"
              style={{ backgroundColor: "rgba(251, 150, 187, 0.2)" }}
            />

            {/* Main card */}
            <div className="relative rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-[15px_15px_0px_rgba(0,0,0,0.04)] border-2 border-slate-100 rotate-2 space-y-4">
              {/* Sticker label */}
              <div className="absolute -top-4 left-6 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-200 -rotate-[4deg] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#7274ED" }} />
                <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase">AI đề xuất</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl grid place-items-center"
                    style={{ backgroundColor: "rgba(31, 167, 225, 0.15)" }}
                  >
                    <Smile className="w-6 h-6" style={{ color: "#1FA7E1" }} />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800">Bé Minh An</p>
                    <p className="text-xs font-medium text-slate-500">Lộ trình tuần này</p>
                  </div>
                </div>
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-extrabold text-white"
                  style={{
                    backgroundColor: "#75D06A",
                    boxShadow: "0 2px 0px #59B84E",
                  }}
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
                    bg: "rgba(114, 116, 237, 0.12)",
                    color: "#7274ED",
                  },
                  {
                    icon: Heart,
                    title: "Cảm xúc",
                    sub: "4 cảm xúc",
                    bg: "rgba(255, 139, 139, 0.14)",
                    color: "#FF8B8B",
                  },
                  {
                    icon: BookOpen,
                    title: "Flashcard",
                    sub: "24 thẻ",
                    bg: "rgba(110, 209, 207, 0.16)",
                    color: "#4BB3B1",
                  },
                  {
                    icon: Star,
                    title: "Vận động",
                    sub: "5 hoạt động",
                    bg: "rgba(255, 179, 101, 0.16)",
                    color: "#E59845",
                  },
                ].map((it, i) => {
                  const Icon = it.icon;
                  const tilts = ["-rotate-1", "rotate-2", "rotate-1", "-rotate-2"];
                  return (
                    <div
                      key={it.title}
                      className={`p-4 rounded-2xl border-2 border-white shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 ${tilts[i]}`}
                      style={{ background: it.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: it.color }} />
                      <p className="mt-2 text-sm font-extrabold text-slate-800">
                        {it.title}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">{it.sub}</p>
                    </div>
                  );
                })}
              </div>

              <div
                className="p-4 rounded-2xl flex items-center gap-3 border-2 border-dashed -rotate-1"
                style={{
                  borderColor: "#FFB365",
                  backgroundColor: "rgba(255, 179, 101, 0.12)",
                }}
              >
                <Sun className="w-5 h-5 shrink-0" style={{ color: "#E59845" }} />
                <p className="text-sm font-medium text-slate-700">
                  "Hôm nay con đã chủ động vẫy tay chào mẹ!"
                </p>
              </div>
            </div>

            {/* Floating tilted sticker chip */}
            <div
              className="absolute -bottom-4 right-4 px-4 py-2.5 rounded-2xl bg-white border-2 border-white flex items-center gap-2 rotate-[5deg]"
              style={{
                boxShadow: "4px 4px 0px #75D06A",
              }}
            >
              <Cloud className="w-4 h-4" style={{ color: "#75D06A" }} />
              <span className="text-xs font-extrabold text-slate-800">Tiến bộ +18%</span>
            </div>
            {/* Mascot bear */}
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
      bg: "rgba(255, 179, 101, 0.12)",
      iconBg: "#FFB365",
      shadow: "#E59845",
    },
    {
      icon: BookOpen,
      title: "Học liệu phân mảnh",
      desc: "Khó tìm flashcard, storyboard trực quan phù hợp với con.",
      bg: "rgba(31, 167, 225, 0.12)",
      iconBg: "#1FA7E1",
      shadow: "#168BC0",
    },
    {
      icon: GraduationCap,
      title: "Áp lực giáo án",
      desc: "Giáo viên mất quá nhiều thời gian thiết kế tài liệu cá nhân hóa.",
      bg: "rgba(153, 86, 222, 0.12)",
      iconBg: "#9956DE",
      shadow: "#7D3EC0",
    },
    {
      icon: Users,
      title: "Cảm giác cô lập",
      desc: "Thiếu một cộng đồng thấu cảm và mạng lưới chuyên gia dẫn dắt.",
      bg: "rgba(255, 139, 139, 0.12)",
      iconBg: "#FF8B8B",
      shadow: "#E06D6D",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-white text-xs font-extrabold shadow-xs uppercase tracking-wider"
            style={{
              backgroundColor: "#FFB365",
              boxShadow: "0 2px 0px #E59845",
            }}
          >
            Thấu cảm
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Những khó khăn trên hành trình đồng hành cùng con
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed font-medium">
            Bạn không hề đơn độc. Đây là điều rất nhiều cha mẹ và thầy cô đang cùng trải qua.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, desc, bg, iconBg, shadow }) => (
            <div
              key={title}
              className="p-6 rounded-3xl bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md border border-slate-100 shadow-xs"
            >
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center"
                style={{ background: bg }}
              >
                <div
                  className="w-9 h-9 rounded-xl grid place-items-center shadow-xs"
                  style={{
                    backgroundColor: iconBg,
                    boxShadow: `0 2.5px 0px ${shadow}`,
                  }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.4} />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
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
      bg: "rgba(114, 116, 237, 0.08)",
      accent: "#7274ED",
      shadow: "#595BCF",
      href: "/ai-assistant",
    },
    {
      icon: BookOpen,
      title: "Kho học liệu",
      desc: "Flashcard, PECS, worksheet đa dạng — được chuyên gia chọn lọc kỹ.",
      bg: "rgba(110, 209, 207, 0.12)",
      accent: "#6ED1CF",
      shadow: "#4BB3B1",
      href: "/library",
    },
    {
      icon: Palette,
      title: "Lesson Builder",
      desc: "Công cụ kéo thả phong cách Canva tạo giáo án cá nhân hóa trong vài phút.",
      bg: "rgba(153, 86, 222, 0.08)",
      accent: "#9956DE",
      shadow: "#7D3EC0",
      href: "/lesson-builder",
    },
    {
      icon: BarChart2,
      title: "Progress Tracker",
      desc: "Biểu đồ theo dõi hành vi, từ mới và mức độ tương tác theo thời gian.",
      bg: "rgba(255, 179, 101, 0.10)",
      accent: "#FFB365",
      shadow: "#E59845",
      href: "/progress-tracker",
    },
    {
      icon: Users,
      title: "Cộng đồng phụ huynh",
      desc: "Kết nối, chia sẻ kinh nghiệm với nhóm phụ huynh đồng cảnh ngộ.",
      bg: "rgba(251, 150, 187, 0.12)",
      accent: "#FB96BB",
      shadow: "#DC779D",
      href: "https://www.facebook.com/share/g/1CFpEpPmEq/",
    },
    {
      icon: GraduationCap,
      title: "Mạng lưới chuyên gia",
      desc: "Đặt lịch với chuyên gia giáo dục đặc biệt & tâm lý đã kiểm duyệt.",
      bg: "rgba(117, 208, 106, 0.12)",
      accent: "#75D06A",
      shadow: "#595BCF",
      href: "/experts",
    },
  ];
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-white text-xs font-extrabold shadow-xs uppercase tracking-wider"
            style={{
              backgroundColor: "#7274ED",
              boxShadow: "0 2px 0px #595BCF",
            }}
          >
            Hệ sinh thái
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Mọi thứ Bino có cho hành trình của con
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed font-medium">
            Sáu công cụ được thiết kế để dịu dàng hỗ trợ trẻ, cha mẹ và thầy cô.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, bg, accent, shadow, href }) => (
            <div
              key={title}
              className="group p-7 rounded-3xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg shadow-xs border border-slate-100"
              style={{ background: bg }}
            >
              <div className="w-14 h-14 rounded-2xl grid place-items-center bg-white shadow-xs">
                <div
                  className="w-9 h-9 rounded-xl grid place-items-center shadow-xs"
                  style={{
                    backgroundColor: accent,
                    boxShadow: `0 2.5px 0px ${shadow}`,
                  }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.4} />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-800">{title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed font-medium">{desc}</p>
              {href ? (
                href.startsWith("http") ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold group-hover:gap-2.5 transition-all cursor-pointer"
                    style={{ color: accent }}
                  >
                    Tham gia ngay <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    to={href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold group-hover:gap-2.5 transition-all cursor-pointer"
                    style={{ color: accent }}
                  >
                    Mở ngay <ArrowRight className="w-4 h-4" />
                  </Link>
                )
              ) : (
                <a
                  href="#"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold group-hover:gap-2.5 transition-all cursor-pointer"
                  style={{ color: accent }}
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
      bg: "rgba(114, 116, 237, 0.15)",
      dot: "#7274ED",
      shadow: "#595BCF",
    },
    {
      n: "02",
      title: "AI thiết kế lộ trình",
      desc: "Bino gợi ý chuỗi học liệu phù hợp, tuần tự, dễ thực hiện mỗi ngày.",
      icon: Sparkles,
      bg: "rgba(110, 209, 207, 0.2)",
      dot: "#6ED1CF",
      shadow: "#4BB3B1",
    },
    {
      n: "03",
      title: "Theo dõi & cải thiện",
      desc: "Ghi nhận tiến trình, nhận phản hồi thích ứng và điều chỉnh nhẹ nhàng.",
      icon: BarChart2,
      bg: "rgba(255, 179, 101, 0.2)",
      dot: "#FFB365",
      shadow: "#E59845",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CuteCloud className="hidden md:block absolute -top-4 right-8 w-20 opacity-80" />
        <CuteStar className="hidden md:block absolute top-10 left-4 w-10 rotate-[10deg]" color="#75D06A" />
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-white text-xs font-extrabold shadow-xs uppercase tracking-wider"
            style={{
              backgroundColor: "#FFB365",
              boxShadow: "0 2px 0px #E59845",
            }}
          >
            Quy trình
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            3 bước đơn giản để bắt đầu
          </h2>
        </div>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div
            className="hidden lg:block absolute top-16 left-[16%] right-[16%] h-1 rounded-full"
            style={{
              background: "linear-gradient(90deg, #7274ED 0%, #6ED1CF 50%, #FFB365 100%)",
              opacity: 0.5,
            }}
          />
          {steps.map(({ n, title, desc, icon: Icon, bg, dot, shadow }) => (
            <div key={n} className="relative text-center">
              <div className="relative mx-auto w-32 h-32">
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: bg, opacity: 0.9 }}
                />
                <div
                  className="relative w-32 h-32 rounded-full bg-white grid place-items-center shadow-lg border border-slate-100"
                  style={{ boxShadow: `0 12px 32px -10px ${bg}` }}
                >
                  <Icon
                    className="w-10 h-10"
                    style={{ color: dot }}
                    strokeWidth={2}
                  />
                  <span
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full text-white text-sm font-extrabold grid place-items-center shadow-md"
                    style={{
                      backgroundColor: dot,
                      boxShadow: `0 2.5px 0px ${shadow}`,
                    }}
                  >
                    {n}
                  </span>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-800">{title}</h3>
              <p className="mt-3 text-slate-500 leading-relaxed font-medium max-w-xs mx-auto">
                {desc}
              </p>
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
          className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border-2 border-slate-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(114, 116, 237, 0.12) 0%, rgba(110, 209, 207, 0.12) 50%, rgba(251, 150, 187, 0.12) 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: "#FFB365", opacity: 0.25 }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: "#75D06A", opacity: 0.25 }}
          />
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur text-slate-800 text-xs font-extrabold shadow-xs uppercase tracking-wider">
                <Heart className="w-4 h-4" style={{ color: "#FF8B8B" }} fill="#FF8B8B" />{" "}
                Kết nối
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Không ai phải bước đi một mình
              </h2>
              <p className="mt-4 text-slate-600 font-medium leading-relaxed">
                Tham gia thử thách{" "}
                <strong className="text-slate-900">"7 Ngày Giao Tiếp Cùng Con"</strong>{" "}
                miễn phí và đặt lịch trò chuyện với chuyên gia đã được Bino kiểm định.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/share/g/1CFpEpPmEq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-extrabold transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg text-center cursor-pointer"
                  style={{
                    backgroundColor: "#7274ED",
                    boxShadow: "0 4px 0px #595BCF",
                  }}
                >
                  <Users className="w-4 h-4 text-white" /> Tham gia nhóm cộng đồng
                </a>
                <Link
                  to="/experts"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white font-extrabold shadow-sm hover:-translate-y-1 transition-all duration-300 border-2 cursor-pointer"
                  style={{
                    borderColor: "#1FA7E1",
                    color: "#1FA7E1",
                    boxShadow: "0 3px 0px #168BC0",
                  }}
                >
                  <Calendar className="w-4 h-4" /> Đặt lịch chuyên gia
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Users,
                  v: "12.4k+",
                  l: "Cha mẹ đồng hành",
                  c: "#7274ED",
                  shadow: "#595BCF",
                },
                {
                  icon: GraduationCap,
                  v: "280+",
                  l: "Chuyên gia kiểm định",
                  c: "#75D06A",
                  shadow: "#59B84E",
                  offset: true,
                },
                {
                  icon: Sun,
                  v: "7 ngày",
                  l: "Giao tiếp cùng con",
                  c: "#FFB365",
                  shadow: "#E59845",
                },
                {
                  icon: BookOpen,
                  v: "1.500+",
                  l: "Học liệu chuyên biệt",
                  c: "#FF8B8B",
                  shadow: "#E06D6D",
                  offset: true,
                },
              ].map(({ icon: Icon, v, l, c, shadow, offset }) => (
                <div
                  key={l}
                  className={`p-5 rounded-3xl bg-white/95 backdrop-blur shadow-xs border border-slate-100 ${
                    offset ? "mt-8" : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-2xl grid place-items-center shadow-xs"
                    style={{
                      backgroundColor: c,
                      boxShadow: `0 2.5px 0px ${shadow}`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.4} />
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-slate-800">{v}</p>
                  <p className="text-sm font-semibold text-slate-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
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
      href: "/create-child",
    },
    {
      name: "Gói Premium",
      price: "180.000đ",
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
      href: "/premium",
    },
  ];
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-white text-xs font-extrabold shadow-xs uppercase tracking-wider"
            style={{
              backgroundColor: "#6ED1CF",
              boxShadow: "0 2px 0px #4BB3B1",
            }}
          >
            Bảng giá minh bạch
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Lựa chọn gói phù hợp với gia đình bạn
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed font-medium">
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
                  ? "linear-gradient(150deg, rgba(114, 116, 237, 0.12) 0%, rgba(110, 209, 207, 0.15) 100%)"
                  : "#FFFFFF",
                border: p.featured ? "2px solid #7274ED" : "2px solid #EEF2F7",
              }}
            >
              {p.featured && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-extrabold shadow-xs flex items-center gap-1 uppercase tracking-wider"
                  style={{
                    backgroundColor: "#FFB365",
                    boxShadow: "0 2px 0px #E59845",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" /> Khuyên dùng
                </span>
              )}
              <h3 className="text-xl font-extrabold text-slate-900">{p.name}</h3>
              <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
                {p.desc}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
                {p.sub && <span className="text-slate-500 font-semibold">{p.sub}</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full grid place-items-center shrink-0 text-white shadow-2xs"
                      style={{
                        backgroundColor: p.featured ? "#75D06A" : "#1FA7E1",
                      }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={p.href}
                className="mt-8 w-full py-3.5 rounded-2xl font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-center block cursor-pointer"
                style={{
                  backgroundColor: p.featured ? "#7274ED" : "#FFFFFF",
                  color: p.featured ? "#FFFFFF" : "#4B5563",
                  border: p.featured ? "none" : "2px solid #CBD5E1",
                  boxShadow: p.featured ? "0 4px 0px #595BCF" : undefined,
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
        { label: "Nhóm phụ huynh", href: "https://www.facebook.com/share/g/1CFpEpPmEq/" },
        { label: "Chuyên gia", href: "/experts" },
        { label: "Thử thách 7 ngày", href: "#community" },
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
    <footer className="bg-white/80 backdrop-blur-md border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center overflow-hidden h-14">
              <img src="/logo.png" alt="Bino Logo" className="h-32 my-[-36px] w-auto object-contain" />
            </div>
            <p className="mt-4 text-sm text-slate-500 font-medium leading-relaxed">
              Người bạn đồng hành thông minh trong quá trình can thiệp sớm.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-extrabold text-slate-800">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => {
                  const isHash = l.href.startsWith("#");
                  const isExternal = l.href.startsWith("http");
                  return (
                    <li key={l.label}>
                      {isExternal ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-slate-600 hover:text-[#7274ED] transition-colors"
                        >
                          {l.label}
                        </a>
                      ) : isHash ? (
                        <a
                          href={l.href}
                          className="text-sm font-medium text-slate-600 hover:text-[#7274ED] transition-colors"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.href}
                          className="text-sm font-medium text-slate-600 hover:text-[#7274ED] transition-colors"
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
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Bino. Mọi quyền được bảo lưu.
          </p>
          <p className="text-sm italic text-slate-700 flex items-center gap-2 font-medium">
            <Heart
              className="w-4 h-4"
              style={{ color: "#FF8B8B", fill: "#FB96BB" }}
            />
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
      <div className="absolute bottom-[80%] right-[20%] mb-3 bg-white text-slate-800 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
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
          className="absolute top-6 left-6 w-7 h-7 rounded-full bg-white/90 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
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
      <Community />
      <Pricing />
      <Footer />
      <AIChatWidget contextLabel="Trang chính Bino" />
    </main>
  );
}
