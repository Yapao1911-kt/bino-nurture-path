import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { ArrowLeft, Check, AlertCircle, Save } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/children/new')({
  component: NewChildPage,
})

const CHALLENGES = [
  'Tự kỷ (ASD)',
  'Tăng động giảm chú ý (ADHD)',
  'Chậm phát triển ngôn ngữ',
  'Khó khăn học tập',
  'Rối loạn xử lý giác quan',
  'Khác'
]

const COMMUNICATION_LEVELS = [
  'Chưa có ngôn ngữ',
  'Nói được từ đơn',
  'Nói được câu ngắn',
  'Giao tiếp tốt nhưng hạn chế ngữ cảnh'
]

function NewChildPage() {
  const navigate = useNavigate()
  const supabase = createClient()
  
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([])
  const [communicationLevel, setCommunicationLevel] = useState(COMMUNICATION_LEVELS[0])
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleChallenge = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge)
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!fullName || !dateOfBirth) {
      setError('Vui lòng điền đầy đủ tên và ngày sinh của bé.')
      setIsLoading(false)
      return
    }

    // Insert to supabase
    // Lấy thông tin user hiện tại để gán parent_id (trong trường hợp schema cần truyền explicit)
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    
    if (!userId) {
      setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('children').insert({
      parent_id: userId,
      full_name: fullName,
      date_of_birth: dateOfBirth,
      developmental_challenges: selectedChallenges,
      communication_level: communicationLevel
    })

    if (insertError) {
      console.error(insertError)
      setError('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.')
      setIsLoading(false)
    } else {
      // Success, chuyển hướng về danh sách
      navigate({ to: '/children' })
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-2 sm:py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        to="/children" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 w-fit hover:shadow-md hover:-translate-y-0.5 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Link>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-50 to-transparent rounded-tr-full opacity-60 pointer-events-none"></div>

        <div className="relative z-10 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Thêm hồ sơ trẻ</h1>
          <p className="text-slate-500 mt-2">Bino sẽ thiết kế lộ trình cá nhân hóa dựa trên những thông tin này.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-start gap-3 relative z-10 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Họ và tên */}
            <div className="space-y-2.5">
              <label className="block text-sm font-bold text-slate-700">Họ và tên của bé <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Minh An"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
                required
              />
            </div>

            {/* Ngày sinh */}
            <div className="space-y-2.5">
              <label className="block text-sm font-bold text-slate-700">Ngày sinh <span className="text-rose-500">*</span></label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-slate-700 font-medium"
                required
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Mức độ giao tiếp */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Khả năng giao tiếp hiện tại của con</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMUNICATION_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setCommunicationLevel(level)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group ${
                    communicationLevel === level 
                      ? 'border-blue-400 bg-blue-50 shadow-[0_2px_10px_rgb(59,130,246,0.1)]' 
                      : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    communicationLevel === level ? 'border-blue-500 bg-blue-500' : 'border-slate-300 group-hover:border-blue-300'
                  }`}>
                    {communicationLevel === level && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={`text-sm font-medium ${communicationLevel === level ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>
                    {level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Thách thức phát triển */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Thách thức phát triển (Có thể chọn nhiều)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHALLENGES.map((challenge) => {
                const isSelected = selectedChallenges.includes(challenge)
                return (
                  <button
                    key={challenge}
                    type="button"
                    onClick={() => toggleChallenge(challenge)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all text-left group ${
                      isSelected 
                        ? 'border-indigo-400 bg-indigo-50 shadow-[0_2px_10px_rgb(99,102,241,0.1)]' 
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'bg-indigo-500 border-indigo-500' : 'border border-slate-300 group-hover:border-indigo-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-600 group-hover:text-slate-800'}`}>
                      {challenge}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_8px_30px_rgb(59,130,246,0.2)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu hồ sơ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Lưu hồ sơ trẻ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
