import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import * as fabric from 'fabric'
import {
  Search,
  Filter,
  Download,
  Lock,
  PlayCircle,
  FileText,
  Image as ImageIcon,
  Type,
  Square,
  Circle as CircleIcon,
  Trash2,
  Save,
  DownloadCloud,
  X,
  Plus,
  Crown,
  MonitorPlay,
  FileBadge2,
  Brush,
  Palette
} from 'lucide-react'

// --- TYPES ---
type ResourceFormat = 'PDF' | 'Video' | 'Image' | 'Canva Template'
type ResourceType = 'Knowledge' | 'Resource'

interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  format: ResourceFormat
  age: string
  challenge: string
  isPremium: boolean
  thumbnail: string
}

// --- MOCK DATA ---
const MOCK_DATA: Resource[] = [
  {
    id: '1',
    title: 'Cẩm nang giao tiếp cho bé 0-3 tuổi',
    description: 'Hướng dẫn phụ huynh các bước cơ bản giúp bé phát triển ngôn ngữ.',
    type: 'Knowledge',
    format: 'PDF',
    age: '0-3',
    challenge: 'Speech Delay',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    title: 'Bài tập tương tác mắt qua trò chơi',
    description: 'Thực hành 5 phút mỗi ngày tăng cường giao tiếp mắt cho trẻ tự kỷ.',
    type: 'Knowledge',
    format: 'Video',
    age: '3-6',
    challenge: 'ASD',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    title: 'Bộ thẻ PECS cơ bản - Cảm xúc',
    description: 'Bộ thẻ hình ảnh giúp bé dễ dàng bày tỏ cảm xúc hàng ngày.',
    type: 'Resource',
    format: 'Canva Template',
    age: '0-3',
    challenge: 'ASD',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '4',
    title: 'Bảng tính rèn luyện tập trung',
    description: 'Bài tập nối hình và tô màu giúp giảm tăng động.',
    type: 'Resource',
    format: 'PDF',
    age: '3-6',
    challenge: 'ADHD',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1576158112340-524673fb3911?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '5',
    title: 'Flashcard Từ vựng động vật',
    description: 'Thẻ học từ vựng trực quan sinh động.',
    type: 'Resource',
    format: 'Canva Template',
    age: '0-3',
    challenge: 'Speech Delay',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=400&q=80'
  }
]

// --- COMPONENTS ---

// 1. Canva Studio Component (Fabric.js)
const CanvasStudio = ({ onClose }: { onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<any>(null) // Using any to avoid strict type issues between v5/v6
  const [color, setColor] = useState('#b2dfdb')

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return

    // Initialize Canvas
    const initCanvas = new (fabric.Canvas as any)(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#fcfcfc'
    })
    
    setCanvas(initCanvas)

    return () => {
      initCanvas.dispose()
    }
  }, [])

  const addRect = () => {
    if (!canvas) return
    const rect = new (fabric.Rect as any)({
      left: 150,
      top: 150,
      fill: color,
      width: 120,
      height: 120,
      rx: 16,
      ry: 16,
      shadow: new (fabric.Shadow as any)({
        color: 'rgba(0,0,0,0.1)',
        blur: 10,
      })
    })
    canvas.add(rect)
    canvas.setActiveObject(rect)
  }
  
  const addCircle = () => {
    if (!canvas) return
    const circle = new (fabric.Circle as any)({
      left: 150,
      top: 150,
      fill: color,
      radius: 60,
      shadow: new (fabric.Shadow as any)({
        color: 'rgba(0,0,0,0.1)',
        blur: 10,
      })
    })
    canvas.add(circle)
    canvas.setActiveObject(circle)
  }

  const addText = () => {
    if (!canvas) return
    const text = new (fabric.IText as any)('Văn bản của bạn...', {
      left: 150,
      top: 150,
      fontFamily: 'Inter, sans-serif',
      fill: '#4b5563',
      fontSize: 28,
      fontWeight: 500
    })
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const deleteSelected = () => {
    if (!canvas) return
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length) {
      activeObjects.forEach((obj: any) => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    if (!canvas) return
    const activeObjects = canvas.getActiveObjects()
    activeObjects.forEach((obj: any) => {
      if (obj.type === 'i-text' || obj.type === 'text') {
        obj.set('fill', newColor)
      } else {
        obj.set('fill', newColor)
      }
    })
    canvas.requestRenderAll()
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !canvas) return
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (f) => {
      const data = f.target?.result as string
      const imgElement = document.createElement('img')
      imgElement.src = data
      imgElement.onload = () => {
        // @ts-ignore Handle v5 and v6 Fabric differences gracefully
        const ImgClass = fabric.Image || fabric.FabricImage
        const img = new (ImgClass as any)(imgElement, {
          left: 100,
          top: 100,
        })
        img.scaleToWidth(300)
        canvas.add(img)
        canvas.setActiveObject(img)
      }
    }
    reader.readAsDataURL(file)
  }

  const exportJSON = () => {
    if (!canvas) return
    const json = canvas.toJSON()
    console.log('Template JSON:', json)
    alert("Đã lưu Template thành công!")
  }

  const exportImage = () => {
    if (!canvas) return
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // High res
    })
    const link = document.createElement('a')
    link.download = 'bino-design.png'
    link.href = dataURL
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fdfaf6]">
        <div className="flex gap-4 items-center">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
             <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Brush className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-700 text-lg">Bino Studio</h2>
          </div>
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={exportJSON} 
             className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-50 shadow-sm transition-all"
           >
             <Save className="w-4 h-4" /> 
             <span className="font-medium text-sm">Lưu Template</span>
           </button>
           <button 
             onClick={exportImage} 
             className="flex items-center gap-2 px-5 py-2.5 bg-emerald-400 text-white rounded-2xl hover:bg-emerald-500 shadow-sm hover:shadow-md transition-all"
           >
             <DownloadCloud className="w-4 h-4" /> 
             <span className="font-medium text-sm">Xuất File PNG</span>
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-gray-50/50">
        {/* Sidebar Tools */}
        <div className="w-24 bg-white border-r border-gray-100 flex flex-col items-center py-8 gap-8 z-10 shadow-sm">
           <button 
             onClick={addText} 
             className="flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-500 hover:scale-110 transition-all"
           >
             <div className="p-3 bg-gray-50 rounded-2xl"><Type className="w-6 h-6" /></div>
             <span className="text-xs font-medium">Văn bản</span>
           </button>
           
           <button 
             onClick={addRect} 
             className="flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-500 hover:scale-110 transition-all"
           >
             <div className="p-3 bg-gray-50 rounded-2xl"><Square className="w-6 h-6" /></div>
             <span className="text-xs font-medium">Khối</span>
           </button>
           
           <button 
             onClick={addCircle} 
             className="flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-500 hover:scale-110 transition-all"
           >
             <div className="p-3 bg-gray-50 rounded-2xl"><CircleIcon className="w-6 h-6" /></div>
             <span className="text-xs font-medium">Tròn</span>
           </button>
           
           <label className="flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-500 hover:scale-110 transition-all cursor-pointer">
             <div className="p-3 bg-gray-50 rounded-2xl"><ImageIcon className="w-6 h-6" /></div>
             <span className="text-xs font-medium">Tải ảnh</span>
             <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
           </label>
           
           <div className="w-10 h-px bg-gray-100 my-2"></div>
           
           <div className="flex flex-col items-center gap-2">
             <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Màu sắc</span>
             <div className="p-1 border border-gray-200 rounded-full bg-white shadow-sm hover:scale-110 transition-transform">
               <input 
                 type="color" 
                 value={color} 
                 onChange={changeColor}
                 className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden opacity-0 absolute"
               />
               <div className="w-8 h-8 rounded-full pointer-events-none" style={{ backgroundColor: color }}></div>
             </div>
           </div>

           <button 
             onClick={deleteSelected} 
             className="flex flex-col items-center gap-2 text-red-400 hover:text-red-500 mt-auto hover:scale-110 transition-all"
           >
             <div className="p-3 bg-red-50 rounded-2xl"><Trash2 className="w-5 h-5" /></div>
             <span className="text-xs font-medium">Xóa</span>
           </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
           <div className="shadow-xl bg-white rounded-2xl overflow-hidden border border-gray-100 ring-1 ring-black/5">
             <canvas ref={canvasRef} />
           </div>
        </div>
      </div>
    </div>
  )
}

// 2. Main Page Component
function LibraryPage() {
  const navigate = useNavigate({ from: '/library' })
  const [activeTab, setActiveTab] = useState<ResourceType>('Knowledge')
  const [ageFilter, setAgeFilter] = useState<string>('')
  const [challengeFilter, setChallengeFilter] = useState<string>('')
  const [formatFilter, setFormatFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [userIsPremium] = useState(false) // Mock user state

  // Filter Logic
  const filteredData = MOCK_DATA.filter(item => {
    if (item.type !== activeTab) return false
    if (ageFilter && item.age !== ageFilter) return false
    if (challengeFilter && item.challenge !== challengeFilter) return false
    if (formatFilter && item.format !== formatFilter) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleResourceClick = (item: Resource) => {
    if (item.isPremium && !userIsPremium) {
      setShowUpgradeModal(true)
      return
    }
    
    if (item.format === 'Canva Template') {
      navigate({ to: '/studio' })
    } else {
      // Logic for downloading/viewing other formats
      console.log('Downloading/Viewing:', item.title)
      alert(`Đang mở: ${item.title}`)
    }
  }

  const getFormatIcon = (format: ResourceFormat) => {
    switch (format) {
      case 'PDF': return <FileText className="w-4 h-4" />
      case 'Video': return <PlayCircle className="w-4 h-4" />
      case 'Image': return <ImageIcon className="w-4 h-4" />
      case 'Canva Template': return <Palette className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FileBadge2 className="w-8 h-8 text-emerald-500" />
              Thư viện & Học liệu
            </h1>
            <p className="text-gray-500 mt-2">
              Khám phá không gian lưu trữ tài liệu và công cụ thiết kế dành riêng cho sự phát triển của trẻ.
            </p>
          </div>
          
          <Link 
            to="/studio"
            className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-sm transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Tạo thiết kế mới
          </Link>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-0 ring-1 ring-gray-100 rounded-3xl shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none transition-shadow"
              />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm ring-1 ring-gray-50 space-y-6">
              <div className="flex items-center gap-2 text-gray-700 font-semibold border-b border-gray-50 pb-4">
                <Filter className="w-5 h-5 text-emerald-400" />
                Bộ lọc tìm kiếm
              </div>

              {/* Age Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Độ tuổi</h3>
                <div className="flex flex-wrap gap-2">
                  {['0-3', '3-6'].map(age => (
                    <button
                      key={age}
                      onClick={() => setAgeFilter(ageFilter === age ? '' : age)}
                      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                        ageFilter === age 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {age} tuổi
                    </button>
                  ))}
                </div>
              </div>

              {/* Challenge Group Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nhóm thách thức</h3>
                <div className="flex flex-col gap-2">
                  {['ASD', 'ADHD', 'Speech Delay'].map(challenge => (
                    <button
                      key={challenge}
                      onClick={() => setChallengeFilter(challengeFilter === challenge ? '' : challenge)}
                      className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors text-left ${
                        challengeFilter === challenge 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {challenge === 'ASD' ? 'Tự kỷ (ASD)' : 
                       challenge === 'ADHD' ? 'Tăng động (ADHD)' : 'Chậm ngôn ngữ'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Định dạng</h3>
                <div className="flex flex-col gap-2">
                  {['PDF', 'Video', 'Image', 'Canva Template'].map(format => (
                    <button
                      key={format}
                      onClick={() => setFormatFilter(formatFilter === format ? '' : format)}
                      className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors text-left flex items-center gap-2 ${
                        formatFilter === format 
                          ? 'bg-rose-50 text-rose-600' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {getFormatIcon(format as ResourceFormat)}
                      {format === 'Canva Template' ? 'Học liệu tương tác' : format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Tabs */}
            <div className="flex bg-white p-1.5 rounded-3xl shadow-sm ring-1 ring-gray-100 w-fit">
              <button 
                onClick={() => setActiveTab('Knowledge')}
                className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  activeTab === 'Knowledge' 
                    ? 'bg-emerald-400 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Thư viện Kiến thức
              </button>
              <button 
                onClick={() => setActiveTab('Resource')}
                className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  activeTab === 'Resource' 
                    ? 'bg-emerald-400 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Thư viện Học liệu
              </button>
            </div>

            {/* Grid */}
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map(item => (
                  <div 
                    key={item.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl ring-1 ring-gray-100 hover:ring-emerald-100 transition-all cursor-pointer flex flex-col"
                    onClick={() => handleResourceClick(item)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Premium/Basic Tag */}
                      <div className="absolute top-4 left-4">
                        {item.isPremium ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/90 backdrop-blur text-white text-xs font-semibold rounded-2xl shadow-sm">
                            <Crown className="w-3.5 h-3.5" />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur text-white text-xs font-semibold rounded-2xl shadow-sm">
                            BASIC
                          </span>
                        )}
                      </div>
                      
                      {/* Format Overlay Icon */}
                      <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-2xl shadow-sm flex items-center justify-center text-gray-600 group-hover:text-emerald-500 transition-colors">
                        {getFormatIcon(item.format)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                          {item.age} TUỔI
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                          {item.challenge}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                        {item.description}
                      </p>
                      
                      <div className="pt-4 border-t border-gray-50 flex justify-between items-center mt-auto">
                        <span className="text-xs font-medium text-gray-400">
                          {item.format === 'Canva Template' ? 'Mở trong Studio' : 'Tải xuống / Xem'}
                        </span>
                        <button className={`p-2.5 rounded-xl transition-colors ${
                          item.isPremium && !userIsPremium 
                            ? 'bg-gray-50 text-gray-400' 
                            : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-400 group-hover:text-white'
                        }`}>
                          {item.isPremium && !userIsPremium ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center ring-1 ring-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Không tìm thấy tài liệu</h3>
                <p className="text-gray-500 mt-2">Thử điều chỉnh bộ lọc để xem nhiều kết quả hơn nhé.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12">
              <Crown className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">Gói Premium</h3>
            <p className="text-center text-gray-500 mb-8">
              Tài nguyên này nằm trong gói Premium. Nâng cấp ngay để mở khóa toàn bộ thư viện học liệu chất lượng cao cho bé.
            </p>
            <button className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-sm transition-colors">
              Nâng cấp tài khoản
            </button>
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="w-full py-3.5 mt-2 text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              Để sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/library')({
  component: LibraryPage,
})
