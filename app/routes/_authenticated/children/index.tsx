import { createFileRoute, Link } from '@tanstack/react-router'
import { createClient } from '../../../utils/supabase/client'
import { useEffect, useState } from 'react'
import { User, Plus, Calendar, Activity, MessageCircle, ChevronRight, Baby } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/children/')({
  component: ChildrenIndexPage,
})

// Define Type for Child Profile
type ChildProfile = {
  id: string;
  parent_id: string;
  full_name: string;
  date_of_birth: string;
  developmental_challenges: string[];
  communication_level: string;
}

function ChildrenIndexPage() {
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchChildren() {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false, nullsFirst: false }) // Added optional ordering if applicable
      
      if (!error && data) {
        setChildren(data)
      } else if (error) {
        // Fallback to query without created_at if the column doesn't exist yet
        const { data: fallbackData } = await supabase.from('children').select('*')
        if (fallbackData) setChildren(fallbackData)
      }
      setIsLoading(false)
    }
    fetchChildren()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Đang tải hồ sơ trẻ...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hồ sơ của trẻ</h1>
          <p className="text-slate-500 mt-1">Quản lý và theo dõi tiến trình phát triển của con</p>
        </div>
        
        {children.length > 0 && (
          <Link 
            to="/children/new" 
            className="hidden sm:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Thêm hồ sơ
          </Link>
        )}
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Baby className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Chưa có hồ sơ nào</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Hãy bắt đầu hành trình can thiệp sớm bằng cách tạo hồ sơ cho bé. Bino sẽ dựa vào thông tin này để thiết kế lộ trình phù hợp nhất.
          </p>
          <Link 
            to="/children/new" 
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Thêm hồ sơ trẻ ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {children.map((child) => (
            <Link 
              key={child.id}
              to={`/children`} // Placeholder
              className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
            >
              {/* Decorative top shape */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent opacity-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="flex items-start gap-4 mb-5 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-2xl flex items-center justify-center border border-white shadow-sm shrink-0">
                  <User className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{child.full_name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(child.date_of_birth).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative z-10 flex-1">
                <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-2xl h-full">
                  <Activity className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Thách thức phát triển</span>
                    <div className="flex flex-wrap gap-1.5">
                      {child.developmental_challenges?.length > 0 ? child.developmental_challenges.map((challenge, idx) => (
                        <span key={idx} className="bg-white border border-slate-100 px-2.5 py-1 rounded-xl text-xs text-slate-600 shadow-sm whitespace-nowrap">
                          {challenge}
                        </span>
                      )) : <span className="text-sm text-slate-500 italic">Chưa cập nhật</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-2xl">
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Giao tiếp</span>
                    <span className="text-sm text-slate-700 font-medium line-clamp-1">{child.communication_level || 'Chưa xác định'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-end text-blue-500 font-medium text-sm gap-1 group-hover:gap-2 transition-all relative z-10">
                Xem chi tiết <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
          
          {/* Mobile floating button */}
          <Link 
            to="/children/new" 
            className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-colors z-40 active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </Link>
        </div>
      )}
    </div>
  )
}
