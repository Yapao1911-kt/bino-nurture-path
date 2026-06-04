import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  Sparkles, 
  Users, 
  Star, 
  BookOpen, 
  Palette, 
  PenTool, 
  ArrowRight,
  Clock
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardOverview,
})

function DashboardOverview() {
  // Lấy session từ context đã được Auth Guard bọc
  const { session } = Route.useRouteContext()
  
  // Xác định buổi trong ngày để chào
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Chào buổi sáng' : currentHour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  
  // Lấy tên người dùng (ưu tiên full_name trong metadata, nếu không có lấy email cắt phần trước @)
  const userName = session?.user?.user_metadata?.full_name 
    || session?.user?.email?.split('@')[0] 
    || 'Ba/Mẹ'

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* 1. Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {greeting}, {userName} <span className="text-4xl inline-block origin-bottom-right hover:animate-bounce">🌤️</span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Mỗi bước đi nhỏ của trẻ đều là một cột mốc tuyệt vời.
          </p>
        </div>
      </div>

      {/* 2. Hero Banner */}
      <div className="relative overflow-hidden rounded-[2rem] p-8 sm:p-10 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/50">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/40 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white text-blue-600 text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide">AI Đồng Hành</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">
            Sẵn sàng xây dựng lộ trình tuần mới cho con yêu?
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Bino đã phân tích dữ liệu tuần trước và chuẩn bị sẵn các hoạt động phù hợp với nhịp độ phát triển của trẻ.
          </p>
          <button className="mt-8 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5">
            Tạo Lộ trình AI ngay <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Quick Stats (Mock Data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Hồ sơ của trẻ</h3>
              <p className="text-sm text-slate-500">Quản lý & Theo dõi</p>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-800">1</span>
              <Link to="/children/new" className="text-sm font-medium text-rose-500 hover:text-rose-600 hover:underline">
                + Thêm bé ngay
              </Link>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Tiến độ tuần này</h3>
              <p className="text-sm text-slate-500">Hoạt động đã làm</p>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800">5</span>
                <span className="text-slate-400 font-medium">/ 12</span>
              </div>
              <span className="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                Rất tốt 🌟
              </span>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Trợ lý AI</h3>
              <p className="text-sm text-slate-500">Trạng thái lộ trình</p>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-800">Đang hoạt động</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Lối tắt hành động
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/library"
            className="group flex flex-col p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Khám phá Thư viện</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Hàng ngàn thẻ flashcard và bài tập giao tiếp có sẵn.
            </p>
            <div className="mt-auto flex items-center text-sm font-semibold text-blue-500">
              Mở thư viện <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/studio"
            className="group flex flex-col p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-100 hover:bg-indigo-50/30"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Lesson Studio</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Tự thiết kế thẻ PECS và giáo án cá nhân hóa bằng kéo thả.
            </p>
            <div className="mt-auto flex items-center text-sm font-semibold text-indigo-500">
              Bắt đầu thiết kế <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="group flex flex-col p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-100 hover:bg-emerald-50/30"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Nhật ký hành vi</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Ghi lại những thay đổi nhỏ của trẻ trong ngày hôm nay.
            </p>
            <div className="mt-auto flex items-center text-sm font-semibold text-emerald-500">
              Ghi nhật ký <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

    </div>
  )
}
