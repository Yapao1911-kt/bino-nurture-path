import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { createClient } from '../utils/supabase/client'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const supabase = createClient()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMsg(null)

    // Gọi API của Supabase để đăng ký
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) {
      setError(error.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.')
      setIsLoading(false)
      return
    }

    // Đăng ký thành công
    if (data.user) {
      setSuccessMsg('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
      // Hoặc nếu không cần confirm email, có thể chuyển hướng:
      // navigate({ to: '/dashboard' })
    }
    
    setIsLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-pink-50/20 p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-blue-50 p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký tài khoản</h1>
          <p className="text-slate-500 text-sm">Bắt đầu hành trình đồng hành cùng trẻ ngay hôm nay</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-2xl text-center border border-rose-100">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-2xl text-center border border-emerald-100">
              {successMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="ví dụ: Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ví dụ: phuhuynh@gmail.com"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMsg}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-500 font-medium hover:underline">
            Đăng nhập ngay
          </Link>
        </div>

      </div>
    </main>
  )
}
