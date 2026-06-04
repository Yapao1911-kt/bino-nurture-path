import { createFileRoute, redirect, Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createServerSupabase } from '../utils/supabase/server'
import { createClient } from '../utils/supabase/client'
import type { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { 
  Home, 
  Users, 
  Sparkles, 
  BookOpen, 
  Palette, 
  LogOut, 
  Menu,
  X
} from 'lucide-react'

// 1. Server Function để lấy User an toàn
const getUserServerFn = createServerFn({ method: 'GET' }).handler(async (ctx) => {
  const supabase = createServerSupabase({ request: ctx.request })
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) return null
  return user
})

// 2. Định nghĩa Route Layout
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const user = await getUserServerFn()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { session: { user } }
  },
  component: AuthenticatedLayout,
})

const NAV_ITEMS = [
  { name: 'Tổng quan', path: '/dashboard', icon: Home },
  { name: 'Hồ sơ của trẻ', path: '/children', icon: Users },
  { name: 'Trợ lý AI', path: '/ai-assistant', icon: Sparkles },
  { name: 'Thư viện', path: '/library', icon: BookOpen },
  { name: 'Lesson Studio', path: '/studio', icon: Palette },
]

function AuthenticatedLayout() {
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()
  const routerState = useRouterState()
  const supabase = createClient()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Tự động đóng mobile menu khi chuyển route
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [routerState.location.pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate({ to: '/login' })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white lg:bg-slate-50/30">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold text-slate-800 tracking-tight">Bino</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = routerState.location.pathname.startsWith(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="mb-4 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-sm font-medium text-slate-700 truncate">
            {session.user.email}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Phụ huynh</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-500 font-medium transition-colors hover:bg-rose-50"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900">
      
      {/* 1. Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Bino</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-slate-500 hover:bg-slate-50 rounded-xl"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 2. Mobile Drawer (Off-canvas) */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* 3. Desktop Sidebar */}
      <div className="hidden lg:block w-72 fixed inset-y-0 left-0 bg-white border-r border-slate-100 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.02)] z-30">
        <SidebarContent />
      </div>

      {/* 4. Main Content Area */}
      <main className="flex-1 w-full lg:pl-72 pt-16 lg:pt-0 min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-8 md:p-10">
          {/* Outlet render route con */}
          <Outlet />
        </div>
      </main>
      
    </div>
  )
}
