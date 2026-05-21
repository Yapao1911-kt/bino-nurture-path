import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  Leaf,
  Brain,
  Palette,
  MessageCircle,
  GraduationCap,
  Compass,
  Star,
  Calendar,
  Shield,
  Sun,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bino — Đồng hành cùng con trên hành trình can thiệp sớm" },
      {
        name: "description",
        content:
          "Bino là hệ sinh thái AI hỗ trợ cha mẹ và giáo viên xây dựng lộ trình học tập cá nhân hóa cho trẻ có nhu cầu đặc biệt.",
      },
    ],
  }),
});

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Trang chủ", href: "#home" },
    { label: "Tính năng", href: "#features" },
    { label: "Cộng đồng", href: "#community" },
    { label: "Học liệu", href: "#resources" },
    { label: "Bảng giá", href: "#pricing" },
  ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-emerald-100/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center shadow-sm">
            <Leaf className="w-5 h-5 text-white" />
          </span>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Bino</span>
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors rounded-full">
            Đăng nhập
          </button>
          <button className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-sm shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            Dùng thử miễn phí
          </button>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-emerald-50 text-slate-700"
          aria-label="Mở menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-emerald-100/60 bg-white/90 backdrop-blur-md px-4 py-4 space-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex gap-2">
            <button className="flex-1 px-4 py-2 text-sm rounded-full border border-slate-200 text-slate-700">
              Đăng nhập
            </button>
            <button className="flex-1 px-4 py-2 text-sm rounded-full bg-emerald-500 text-white">
              Dùng thử
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-24 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -top-10 right-0 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-sky-100/50 blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI đồng hành can thiệp sớm
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight tracking-tight">
            Mỗi đứa trẻ đều lớn lên theo một <span className="text-emerald-600">cách riêng</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
            Bino đồng hành cùng cha mẹ và thầy cô xây dựng lộ trình cá nhân hóa, cung cấp học liệu
            chuyên biệt dưới sự hỗ trợ của Trí tuệ nhân tạo (AI).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-emerald-600">
              Bắt đầu miễn phí
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-1">
              Khám phá học liệu
            </button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              An toàn cho trẻ
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-500" />
              Thiết kế bởi chuyên gia
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-emerald-100 via-amber-50 to-sky-100 rotate-3" />
            <div className="absolute inset-3 rounded-[3rem] bg-white shadow-xl shadow-emerald-100/50 p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 grid place-items-center text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Lộ trình tuần của Minh An</p>
                  <p className="text-xs text-slate-500">AI cá nhân hóa · 5 hoạt động</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 hover:-translate-y-1 transition-transform duration-300">
                  <Smile className="w-6 h-6 text-amber-500" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">Cảm xúc</p>
                  <p className="text-xs text-slate-500">Nhận biết 4 cảm xúc cơ bản</p>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 hover:-translate-y-1 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 text-sky-500" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">Giao tiếp</p>
                  <p className="text-xs text-slate-500">Học 12 từ mới tuần này</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 hover:-translate-y-1 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">Flashcard</p>
                  <p className="text-xs text-slate-500">24 thẻ trực quan</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 hover:-translate-y-1 transition-transform duration-300">
                  <BarChart2 className="w-6 h-6 text-rose-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">Tiến bộ</p>
                  <p className="text-xs text-slate-500">+18% tương tác</p>
                </div>
              </div>
              <div className="mt-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <p className="text-sm">"Hôm nay con đã chủ động vẫy tay chào mẹ!"</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-amber-200/70 blur-xl" />
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-emerald-200/70 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Problems() {
  const items = [
    {
      icon: Compass,
      title: "Cha mẹ hoang mang",
      desc: "Không biết bắt đầu từ đâu, thông tin trên mạng rời rạc và mâu thuẫn.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: BookOpen,
      title: "Học liệu phân mảnh",
      desc: "Khó tìm kiếm flashcard, storyboard trực quan phù hợp với con.",
      color: "bg-sky-50 text-sky-600",
    },
    {
      icon: GraduationCap,
      title: "Áp lực giáo án",
      desc: "Giáo viên mất quá nhiều thời gian thiết kế tài liệu cá nhân hóa cho từng trẻ.",
      color: "bg-rose-50 text-rose-500",
    },
    {
      icon: Users,
      title: "Cảm giác cô lập",
      desc: "Thiếu một cộng đồng thấu cảm và mạng lưới chuyên gia dẫn dắt.",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];
  return (
    <section className="py-20 sm:py-28 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm font-medium">
            Thấu cảm
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            Những khó khăn trên hành trình đồng hành cùng con
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Bạn không hề đơn độc. Đây là những điều rất nhiều cha mẹ và thầy cô đang cùng trải qua.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group p-6 rounded-3xl bg-white border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-emerald-100/50"
            >
              <div className={`w-12 h-12 rounded-2xl grid place-items-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Brain,
      title: "Trợ lý AI",
      desc: "AI xây dựng lộ trình tuần thích ứng theo biểu hiện và mục tiêu của con.",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: BookOpen,
      title: "Kho học liệu",
      desc: "Flashcard, PECS communication cards, worksheet đa dạng — chọn lọc kỹ.",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: Palette,
      title: "Lesson Builder Studio",
      desc: "Công cụ kéo thả phong cách Canva tạo giáo án cá nhân hóa trong vài phút.",
      bg: "bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      icon: BarChart2,
      title: "Progress Tracker",
      desc: "Biểu đồ theo dõi hành vi, từ mới và mức độ tương tác của trẻ theo thời gian.",
      bg: "bg-rose-50",
      iconColor: "text-rose-500",
    },
    {
      icon: Users,
      title: "Cộng đồng phụ huynh",
      desc: "Nơi kết nối, chia sẻ kinh nghiệm với các nhóm phụ huynh đồng cảnh ngộ.",
      bg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      icon: GraduationCap,
      title: "Mạng lưới chuyên gia",
      desc: "Đặt lịch với chuyên gia giáo dục đặc biệt & tâm lý đã được kiểm duyệt.",
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ];
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
            Giải pháp
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            Hệ sinh thái thông minh của Bino
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Sáu công cụ được thiết kế để cùng nhau hỗ trợ trẻ, cha mẹ và thầy cô.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, bg, iconColor }) => (
            <div
              key={title}
              className={`group p-7 rounded-3xl ${bg} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-white grid place-items-center shadow-sm ${iconColor}`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-800">{title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{desc}</p>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 group-hover:gap-2.5 transition-all"
              >
                Tìm hiểu <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Nhập hồ sơ của trẻ",
      desc: "Tuổi, mức độ tương tác, mục tiêu can thiệp và những điều con yêu thích.",
      icon: Smile,
    },
    {
      n: "02",
      title: "AI thiết kế lộ trình",
      desc: "Bino gợi ý chuỗi học liệu phù hợp, tuần tự, dễ thực hiện tại nhà và trên lớp.",
      icon: Sparkles,
    },
    {
      n: "03",
      title: "Theo dõi & cải thiện",
      desc: "Ghi nhận tiến trình, nhận phản hồi thích ứng và điều chỉnh nhẹ nhàng mỗi ngày.",
      icon: BarChart2,
    },
  ];
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white/60 to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 text-sm font-medium">
            Quy trình
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            3 bước đơn giản để bắt đầu
          </h2>
        </div>
        <div className="mt-16 relative">
          <div className="hidden lg:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-emerald-200 via-amber-200 to-sky-200" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc, icon: Icon }) => (
              <div key={n} className="relative text-center">
                <div className="relative mx-auto w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-emerald-100/60 blur-2xl" />
                  <div className="relative w-32 h-32 rounded-full bg-white border-2 border-emerald-100 grid place-items-center shadow-lg shadow-emerald-100/60">
                    <Icon className="w-10 h-10 text-emerald-600" />
                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-amber-400 text-white text-sm font-bold grid place-items-center shadow-md">
                      {n}
                    </span>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-800">{title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section id="community" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-100 via-amber-50 to-sky-100 p-8 sm:p-12 lg:p-16">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 text-emerald-700 text-sm font-medium">
                <Heart className="w-4 h-4" /> Kết nối
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
                Không ai phải bước đi một mình
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Tham gia thử thách <strong>"7 Ngày Giao Tiếp Cùng Con"</strong> miễn phí và đặt lịch
                trò chuyện với chuyên gia đã được Bino kiểm định.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all duration-300 hover:-translate-y-1 shadow-md shadow-emerald-200">
                  Tham gia thử thách
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1">
                  <Calendar className="w-4 h-4" /> Đặt lịch chuyên gia
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/90 backdrop-blur shadow-sm">
                <Users className="w-7 h-7 text-emerald-600" />
                <p className="mt-3 text-2xl font-bold text-slate-800">12.4k+</p>
                <p className="text-sm text-slate-500">Cha mẹ đồng hành</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/90 backdrop-blur shadow-sm mt-8">
                <GraduationCap className="w-7 h-7 text-sky-600" />
                <p className="mt-3 text-2xl font-bold text-slate-800">280+</p>
                <p className="text-sm text-slate-500">Chuyên gia kiểm định</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/90 backdrop-blur shadow-sm">
                <Sun className="w-7 h-7 text-amber-500" />
                <p className="mt-3 text-2xl font-bold text-slate-800">7 ngày</p>
                <p className="text-sm text-slate-500">Giao tiếp cùng con</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/90 backdrop-blur shadow-sm mt-8">
                <BookOpen className="w-7 h-7 text-rose-500" />
                <p className="mt-3 text-2xl font-bold text-slate-800">1.500+</p>
                <p className="text-sm text-slate-500">Học liệu chuyên biệt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "Lần đầu tiên tôi cảm thấy mình thực sự biết phải làm gì tiếp theo cho con. Bino dịu dàng dẫn dắt từng bước nhỏ.",
      name: "Chị Mai Anh",
      role: "Mẹ của bé Nam, 4 tuổi",
      bg: "bg-amber-50",
    },
    {
      quote:
        "Lesson Builder tiết kiệm cho tôi hàng giờ mỗi tuần. Giáo án cá nhân hóa giờ chỉ mất 10 phút.",
      name: "Cô Thu Hằng",
      role: "Giáo viên Giáo dục Đặc biệt",
      bg: "bg-emerald-50",
    },
    {
      quote:
        "Cộng đồng Bino là nơi tôi không phải giải thích quá nhiều. Mọi người đều hiểu.",
      name: "Anh Tuấn Khôi",
      role: "Bố của bé Bin, 6 tuổi",
      bg: "bg-sky-50",
    },
  ];
  return (
    <section className="py-20 sm:py-28 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-rose-50 text-rose-500 text-sm font-medium">
            Câu chuyện thật
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            Những lời cảm ơn ấm áp
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure
              key={t.name}
              className={`p-7 rounded-3xl ${t.bg} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 text-slate-700 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white grid place-items-center text-emerald-600 font-bold">
                  {t.name.charAt(t.name.length - 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <span className="inline-flex px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
            Minh bạch
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            Lựa chọn gói phù hợp với gia đình bạn
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Bạn có thể bắt đầu miễn phí và nâng cấp bất cứ khi nào cần thêm sự hỗ trợ.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative p-8 rounded-3xl transition-all duration-300 ease-out hover:-translate-y-1 ${
                p.featured
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-200"
                  : "bg-white border border-slate-100 hover:shadow-md"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-400 text-white text-xs font-bold shadow-sm">
                  ✨ Khuyên dùng
                </span>
              )}
              <h3 className={`text-xl font-bold ${p.featured ? "text-white" : "text-slate-800"}`}>
                {p.name}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  p.featured ? "text-emerald-50" : "text-slate-500"
                }`}
              >
                {p.desc}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-bold ${
                    p.featured ? "text-white" : "text-slate-800"
                  }`}
                >
                  {p.price}
                </span>
                {p.sub && (
                  <span className={p.featured ? "text-emerald-100" : "text-slate-500"}>
                    {p.sub}
                  </span>
                )}
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-full grid place-items-center shrink-0 ${
                        p.featured ? "bg-white/20" : "bg-emerald-100"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${p.featured ? "text-white" : "text-emerald-600"}`}
                      />
                    </span>
                    <span
                      className={`text-sm ${p.featured ? "text-emerald-50" : "text-slate-600"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  p.featured
                    ? "bg-white text-emerald-600 hover:bg-emerald-50"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      title: "Sản phẩm",
      links: ["Tính năng", "Học liệu", "Lesson Builder", "Bảng giá"],
    },
    {
      title: "Cộng đồng",
      links: ["Nhóm phụ huynh", "Chuyên gia", "Thử thách 7 ngày", "Sự kiện"],
    },
    {
      title: "Công ty",
      links: ["Về Bino", "Sứ mệnh", "Tuyển dụng", "Liên hệ"],
    },
  ];
  return (
    <footer className="border-t border-emerald-100/60 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
                <Leaf className="w-5 h-5 text-white" />
              </span>
              <span className="text-xl font-bold text-slate-800">Bino</span>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Người bạn đồng hành thông minh trong quá trình can thiệp sớm.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-slate-800">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Bino. Mọi quyền được bảo lưu.
          </p>
          <p className="text-sm italic text-emerald-600 flex items-center gap-2">
            <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            Đồng hành cùng con từ những bước đi đầu tiên
          </p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-amber-50/40 font-sans text-slate-700 antialiased">
      <Navbar />
      <Hero />
      <Problems />
      <Features />
      <HowItWorks />
      <Community />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
