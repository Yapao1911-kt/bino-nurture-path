import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, createContext, useContext } from 'react'
import * as fabric from 'fabric'
import { createServerFn } from '@tanstack/react-start'
import { createServerSupabase } from '../utils/supabase/server'
import {
  Home,
  LayoutTemplate,
  Shapes,
  Type,
  UploadCloud,
  ChevronDown,
  CloudCheck,
  Undo2,
  Redo2,
  Search,
  Mic,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Maximize,
  PenTool,
  FolderOpen,
  LayoutGrid,
  ChevronLeft,
  Sparkles,
  Timer,
  FileText,
  DownloadCloud
} from 'lucide-react'

// --- TYPES ---
type TabType = 'templates' | 'elements' | 'text' | 'brand' | 'uploads' | 'draw' | 'projects' | 'apps'

// --- ROUTE DEFINITION ---
export const Route = createFileRoute('/_authenticated/studio')({
  component: BinoStudio,
})

// --- SERVER FUNCTIONS ---
export const saveDesignFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { title: string, canvasState: any }) => d)
  .handler(async (ctx) => {
    // Chỉ chạy trên server
    const supabase = createServerSupabase(ctx as any)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Chưa đăng nhập")

    const { title, canvasState } = ctx.data
    const { data, error } = await supabase
      .from('user_designs')
      .insert({ user_id: user.id, title, canvas_state: canvasState })
      .select().single()
      
    if (error) throw new Error(error.message)
    return data
  })

export const uploadAssetFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { fileName: string, fileBase64: string, contentType: string }) => d)
  .handler(async (ctx) => {
    const supabase = createServerSupabase(ctx as any)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Chưa đăng nhập")

    const { fileName, fileBase64, contentType } = ctx.data
    const blob = await fetch(`data:${contentType};base64,${fileBase64}`).then(r => r.blob())
    const filePath = `${user.id}/${Date.now()}_${fileName}`
    
    const { error } = await supabase.storage
      .from('studio_assets')
      .upload(filePath, blob, { contentType })
      
    if (error) throw new Error(error.message)
    
    const { data: { publicUrl } } = supabase.storage.from('studio_assets').getPublicUrl(filePath)
    return publicUrl
  })

// --- CONTEXT & HOOKS ---
const StudioContext = createContext<any>(null)
function useStudio() { return useContext(StudioContext) }

// Custom Hook lõi Fabric.js
function useFabricCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [canvas, setCanvas] = useState<any>(null)
  const historyStack = useRef<string[]>([])
  const historyIndex = useRef<number>(-1)
  const isHistoryUpdate = useRef(false)

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return
    const initCanvas = new (fabric.Canvas as any)(canvasRef.current, {
      width: 850,
      height: 478,
      backgroundColor: '#ffffff'
    })
    setCanvas(initCanvas)

    // Khởi tạo lịch sử
    historyStack.current = [JSON.stringify(initCanvas.toJSON())]
    historyIndex.current = 0

    const saveHistory = () => {
      if (isHistoryUpdate.current) return
      const json = JSON.stringify(initCanvas.toJSON())
      historyStack.current = historyStack.current.slice(0, historyIndex.current + 1)
      historyStack.current.push(json)
      historyIndex.current = historyStack.current.length - 1
    }

    initCanvas.on('object:modified', saveHistory)
    initCanvas.on('object:added', saveHistory)
    initCanvas.on('object:removed', saveHistory)

    return () => { initCanvas.dispose() }
  }, [])

  const undo = async () => {
    if (!canvas || historyIndex.current <= 0) return
    isHistoryUpdate.current = true
    historyIndex.current -= 1
    try {
      await canvas.loadFromJSON(JSON.parse(historyStack.current[historyIndex.current]))
      canvas.renderAll()
    } catch(e) {}
    isHistoryUpdate.current = false
  }

  const redo = async () => {
    if (!canvas || historyIndex.current >= historyStack.current.length - 1) return
    isHistoryUpdate.current = true
    historyIndex.current += 1
    try {
      await canvas.loadFromJSON(JSON.parse(historyStack.current[historyIndex.current]))
      canvas.renderAll()
    } catch(e) {}
    isHistoryUpdate.current = false
  }

  const addText = (fontSize = 32, fontWeight = 800) => {
    if (!canvas) return
    const text = new (fabric.IText as any)('Văn bản của bạn', {
      left: 100, top: 100, fontFamily: 'sans-serif', fill: '#334155', fontSize, fontWeight
    })
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const addEmoji = (emoji: string) => {
    if (!canvas) return
    const text = new (fabric.Text as any)(emoji, { left: 100, top: 100, fontSize: 80 })
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const addImage = async (url: string) => {
    if (!canvas) return
    try {
      const img = await (fabric.Image as any).fromURL(url, { crossOrigin: 'anonymous' })
      img.set({ left: 100, top: 100 })
      if (img.width > 400) img.scaleToWidth(400)
      canvas.add(img)
      canvas.setActiveObject(img)
    } catch (err) {
      console.error("Không tải được ảnh:", err)
    }
  }

  return { canvas, addText, addEmoji, addImage, undo, redo }
}

// --- COMPONENTS ---

function TopHeader() {
  const { title, setTitle, handleSaveAndExport, undo, redo } = useStudio()
  const [isSaving, setIsSaving] = useState(false)

  const onSave = async () => {
    setIsSaving(true)
    await handleSaveAndExport()
    setIsSaving(false)
  }

  return (
    <header className="h-[72px] bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {/* Left */}
      <div className="flex items-center gap-2">
        <Link 
          to="/dashboard" 
          className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center hover:bg-emerald-200 transition-colors shadow-sm"
          title="Về trang chủ"
        >
          <Home className="w-6 h-6" />
        </Link>
        
        <div className="flex items-center ml-2 bg-slate-50 rounded-2xl p-1 border border-slate-100">
          <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
            Tệp
          </button>
          <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
            Đổi cỡ
          </button>
          <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-emerald-400" /> Sửa <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Center - Design Name */}
      <div className="flex-1 max-w-md mx-4 hidden md:flex justify-center">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-center text-lg font-extrabold text-slate-700 bg-transparent hover:bg-slate-50 focus:bg-white px-6 py-2.5 rounded-2xl border-2 border-transparent focus:border-emerald-100 outline-none transition-all placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button onClick={undo} className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm" title="Hoàn tác">
            <Undo2 className="w-5 h-5" />
          </button>
          <button onClick={redo} className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm" title="Làm lại">
            <Redo2 className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button className="p-2.5 text-emerald-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm" title="Đã lưu">
            <CloudCheck className="w-5 h-5" />
          </button>
        </div>

        <button className="px-6 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors hidden sm:flex items-center gap-2">
          Chia sẻ
        </button>
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-3 text-sm font-bold text-white bg-emerald-400 hover:bg-emerald-500 shadow-[0_4px_14px_rgba(52,211,153,0.3)] hover:-translate-y-0.5 rounded-full transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:-translate-y-0"
        >
          <DownloadCloud className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu & Xuất File'}
        </button>
      </div>
    </header>
  )
}

function PrimarySidebar({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void }) {
  const TABS = [
    { id: 'templates', label: 'Mẫu', icon: LayoutTemplate },
    { id: 'elements', label: 'Thành phần', icon: Shapes },
    { id: 'text', label: 'Văn bản', icon: Type },
    { id: 'brand', label: 'Thương hiệu', icon: Sparkles },
    { id: 'uploads', label: 'Tải lên', icon: UploadCloud },
    { id: 'draw', label: 'Công cụ', icon: PenTool },
    { id: 'projects', label: 'Dự án', icon: FolderOpen },
    { id: 'apps', label: 'Ứng dụng', icon: LayoutGrid },
  ] as const

  return (
    <aside className="w-[90px] bg-white border-r border-slate-100 flex flex-col items-center py-4 shrink-0 z-20 h-full overflow-y-auto no-scrollbar gap-2 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center justify-center w-[72px] h-[76px] rounded-[24px] gap-1.5 transition-all group ${
              isActive 
                ? 'bg-emerald-50 text-emerald-600 shadow-sm scale-100' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 scale-95 hover:scale-100'
            }`}
          >
            <Icon className={`w-7 h-7 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] font-bold tracking-wide">{tab.label}</span>
          </button>
        )
      })}
    </aside>
  )
}

function SecondaryPanel({ activeTab, isOpen, setIsOpen }: { activeTab: TabType, isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  if (!isOpen) return null;

  return (
    <div className="w-[360px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.04)] flex flex-col z-10 transition-all duration-300 relative h-full">
      {/* Collapse button - Healing style */}
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-16 bg-white border border-slate-100 rounded-r-2xl flex items-center justify-center shadow-md hover:bg-emerald-50 hover:text-emerald-500 text-slate-400 z-30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {activeTab === 'templates' && <TemplatesPanel />}
      {activeTab === 'elements' && <ElementsPanel />}
      {activeTab === 'text' && <TextPanel />}
      {activeTab === 'uploads' && <UploadsPanel />}
      {/* Placeholder cho các tab khác */}
      {['brand', 'draw', 'projects', 'apps'].includes(activeTab) && (
        <div className="p-8 text-center text-slate-400 font-medium">Nội dung tab {activeTab} sẽ được phát triển sau.</div>
      )}
    </div>
  )
}

function ElementsPanel() {
  const { addEmoji } = useStudio()
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="p-6 shrink-0 border-b border-slate-50">
        <div className="relative group mb-4">
          <input 
            type="text" 
            placeholder="Tìm kiếm thành phần..." 
            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">+</span>
          <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors" />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 flex items-center justify-center gap-2 border-2 border-slate-100 bg-white rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-emerald-200 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-400" /> Tạo AI
          </button>
          <button className="flex-1 py-3 bg-emerald-400 text-white rounded-2xl text-sm font-extrabold shadow-[0_4px_14px_rgba(52,211,153,0.25)] hover:bg-emerald-500 hover:-translate-y-0.5 transition-all">
            Tìm kiếm
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Dùng gần đây */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-700">Dùng gần đây</h3>
            <button className="text-xs font-bold text-emerald-500 hover:text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">Xem tất cả</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {['🐅', '🍎', '🚗', '☀️', '⚽'].map((emoji, i) => (
              <div 
                key={i} 
                onClick={() => addEmoji(emoji)}
                className="w-[72px] h-[72px] shrink-0 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl cursor-pointer hover:bg-amber-100 hover:scale-105 transition-all border border-amber-100/50 shadow-sm"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Nội dung tìm kiếm phổ biến */}
        <div>
          <h3 className="text-base font-extrabold text-slate-700 mb-4">Gợi ý cho bé</h3>
          <div className="flex flex-wrap gap-2.5">
            {['Động vật', 'Bảng chữ cái', 'Màu sắc', 'Phương tiện', 'Ngôi sao'].map(tag => (
              <button key={tag} className="px-4 py-2 border-2 border-slate-100 bg-white rounded-full text-xs font-bold text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Danh mục */}
        <div>
          <h3 className="text-base font-extrabold text-slate-700 mb-4">Khám phá thư viện</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Hình khối', color: 'bg-emerald-100' },
              { name: 'Minh họa', color: 'bg-amber-100' },
              { name: 'Ảnh thật', color: 'bg-blue-100' },
              { name: 'Video', color: 'bg-rose-100' },
              { name: 'Khung', color: 'bg-fuchsia-100' },
              { name: 'Âm thanh', color: 'bg-teal-100' },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-full aspect-square ${cat.color} rounded-[24px] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all`}>
                  <div className="w-10 h-10 bg-white/60 rounded-xl"></div>
                </div>
                <span className="text-xs font-bold text-slate-600 truncate w-full text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplatesPanel() {
  return (
    <div className="p-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <h3 className="text-base font-extrabold text-slate-700 mb-4">Mẫu thiết kế</h3>
      <div className="text-slate-400 text-sm font-medium text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        Khám phá hàng ngàn mẫu Template an toàn cho trẻ.
      </div>
    </div>
  )
}
function TextPanel() {
  const { addText } = useStudio()
  return (
    <div className="p-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <h3 className="text-base font-extrabold text-slate-700 mb-6">Thêm văn bản</h3>
      <div className="space-y-4">
        <button onClick={() => addText(32, 800)} className="w-full py-5 bg-emerald-50 hover:bg-emerald-100 rounded-[20px] font-extrabold text-2xl text-emerald-800 transition-colors shadow-sm">
          Thêm tiêu đề lớn
        </button>
        <button onClick={() => addText(24, 700)} className="w-full py-4 bg-amber-50 hover:bg-amber-100 rounded-[18px] font-bold text-lg text-amber-800 transition-colors shadow-sm">
          Thêm tiêu đề phụ
        </button>
        <button onClick={() => addText(16, 500)} className="w-full py-3 bg-blue-50 hover:bg-blue-100 rounded-2xl font-medium text-sm text-blue-800 transition-colors shadow-sm">
          Thêm một đoạn văn bản thân
        </button>
      </div>
    </div>
  )
}
function UploadsPanel() {
  const { addImage } = useStudio()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    
    try {
      // Đọc file dưới dạng base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64Str = (reader.result as string).split(',')[1]
        
        // Gọi Server Function để lưu lên Supabase Storage
        const publicUrl = await uploadAssetFn({ data: { 
          fileName: file.name, 
          fileBase64: base64Str, 
          contentType: file.type 
        }})
        
        // Chèn ảnh vào Canvas
        addImage(publicUrl)
        setIsUploading(false)
      }
    } catch (err: any) {
      console.error(err)
      alert("Lỗi tải ảnh: " + err.message)
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <h3 className="text-base font-extrabold text-slate-700 mb-4">Tải lên</h3>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full py-4 bg-blue-400 hover:bg-blue-500 text-white rounded-[20px] font-bold shadow-[0_4px_14px_rgba(96,165,250,0.3)] hover:-translate-y-0.5 transition-all mb-6 disabled:opacity-70 disabled:hover:-translate-y-0"
      >
        {isUploading ? 'Đang tải lên...' : 'Tải lên hình ảnh'}
      </button>
      <div className="text-slate-400 text-sm font-medium text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        Các tệp của bạn sẽ an toàn tại đây.
      </div>
    </div>
  )
}


function Workspace({ isPanelOpen, setIsPanelOpen }: { isPanelOpen: boolean, setIsPanelOpen: (v: boolean) => void }) {
  const { canvasRef } = useStudio()

  return (
    <div className="flex-1 bg-[#FAFAF9] flex flex-col relative overflow-hidden">
      {/* Nút mở lại Panel khi bị thu nhỏ - Healing style */}
      {!isPanelOpen && (
        <button 
          onClick={() => setIsPanelOpen(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-white border border-slate-100 border-l-0 rounded-r-2xl flex items-center justify-center shadow-md hover:bg-emerald-50 hover:text-emerald-500 text-slate-400 z-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rotate-180" />
        </button>
      )}

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-[850px] h-[478px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl relative flex items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white">
        <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center text-sm font-extrabold hover:bg-slate-100 cursor-pointer transition-colors">1</div>
        <button className="w-10 h-10 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors">
          <span className="text-xl font-bold">+</span>
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button className="w-10 h-10 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl flex items-center justify-center transition-colors">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="h-[56px] bg-white border-t border-slate-100 flex items-center justify-between px-6 shrink-0 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <button className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl">
             <FileText className="w-4 h-4" /> Ghi chú
          </button>
          <button className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl">
             <Timer className="w-4 h-4" /> Đếm ngược
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Zoom Control */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-slate-100 rounded-full relative cursor-pointer hidden sm:block">
              <div className="absolute left-0 top-0 bottom-0 w-[48%] bg-emerald-400 rounded-full"></div>
              <div className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-emerald-400 rounded-full shadow-sm hover:scale-110 transition-transform"></div>
            </div>
            <span className="text-xs font-extrabold text-slate-600 w-10 text-right">48%</span>
          </div>
          
          <div className="w-px h-5 bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
              <LayoutGrid className="w-4 h-4" /> Trang 1/1
            </button>
            <button className="text-slate-400 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-xl transition-colors">
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-xl transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

function BinoStudio() {
  const [activeTab, setActiveTab] = useState<TabType>('elements')
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [title, setTitle] = useState("Thiết kế thẻ PECS - Kỹ năng sống")
  
  // Gắn Custom Hook
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { canvas, addText, addEmoji, addImage, undo, redo } = useFabricCanvas(canvasRef)

  const handleSaveAndExport = async () => {
    if (!canvas) return
    try {
      const jsonState = canvas.toJSON()
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 })
      
      // 1. Lưu JSON vào Supabase (Bỏ qua nếu chưa config Supabase Auth)
      await saveDesignFn({ data: { title, canvasState: jsonState } })

      // 2. Tải File PNG xuống máy
      const link = document.createElement('a')
      link.download = `${title}.png`
      link.href = dataUrl
      link.click()

      alert("🎉 Đã lưu và xuất file thành công!")
    } catch (err: any) {
      console.error(err)
      alert("Lỗi khi lưu: " + err.message)
    }
  }

  const contextValue = {
    canvas, canvasRef, title, setTitle, addText, addEmoji, addImage, undo, redo, handleSaveAndExport
  }

  return (
    <StudioContext.Provider value={contextValue}>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-white font-sans">
        <TopHeader />
        <div className="flex flex-1 overflow-hidden">
          <PrimarySidebar activeTab={activeTab} setActiveTab={(tab) => {
            setActiveTab(tab)
            setIsPanelOpen(true)
          }} />
          <SecondaryPanel activeTab={activeTab} isOpen={isPanelOpen} setIsOpen={setIsPanelOpen} />
          <Workspace isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
        </div>
      </div>
    </StudioContext.Provider>
  )
}
