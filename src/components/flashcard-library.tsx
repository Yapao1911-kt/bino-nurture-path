// ============================================================
// Component: FlashcardLibrary
// File: src/components/flashcard-library.tsx
// Mô tả: Trình quản lý Thư viện Học liệu Flashcard chuyên biệt.
//         Hiển thị các bài flashcard gộp theo danh mục (Động vật,
//         Cảm xúc, Hành động, Thực phẩm, ...). Khi bấm vào sẽ
//         chuyển hướng qua trang luyện tập flashcard tương ứng.
//         Hỗ trợ đầy đủ Thêm / Sửa / Xoá / Tạo Flashcard mới,
//         lật thẻ 2 mặt tương tác, phát âm tiếng Việt chuẩn (TTS),
//         lọc theo danh mục và đồng bộ lưu trữ localStorage.
// ============================================================

import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  Pencil,
  Trash2,
  Volume2,
  RotateCw,
  Sparkles,
  Layers,
  Search,
  RotateCcw,
  BookOpen,
  Check,
  ArrowRight,
  Grid3X3,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  type Flashcard,
  type FlashcardCategory,
  loadStoredFlashcards,
  saveStoredFlashcards,
  getAllDefaultFlashcards,
  playFlashcardSound,
  speakVietnamese,
} from "../lib/flashcard-data";

const CATEGORY_MAP: Record<FlashcardCategory, { label: string; emoji: string; color: string; bgGradient: string; description: string }> = {
  animal: {
    label: "Động vật",
    emoji: "🐾",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    bgGradient: "from-amber-400 to-orange-500",
    description: "Nhận biết các con vật quen thuộc kèm tiếng kêu vui nhộn",
  },
  food: {
    label: "Thực phẩm & Trái cây",
    emoji: "🍎",
    color: "bg-rose-100 text-rose-800 border-rose-300",
    bgGradient: "from-rose-400 to-pink-500",
    description: "Học tên các loại trái cây, rau củ và thực phẩm hằng ngày",
  },
  emotion: {
    label: "Cảm xúc",
    emoji: "😊",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    bgGradient: "from-purple-400 to-violet-500",
    description: "Nhận biết và gọi tên các cảm xúc cơ bản qua hình ảnh",
  },
  action: {
    label: "Hành động",
    emoji: "🏃",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    bgGradient: "from-blue-400 to-indigo-500",
    description: "Các hành động sinh hoạt hằng ngày giúp bé tự phục vụ",
  },
  object: {
    label: "Đồ vật",
    emoji: "🧸",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bgGradient: "from-emerald-400 to-teal-500",
    description: "Nhận biết các đồ vật thường gặp trong cuộc sống",
  },
  other: {
    label: "Khác",
    emoji: "✨",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    bgGradient: "from-slate-400 to-gray-500",
    description: "Các flashcard chủ đề khác",
  },
};

const PRESET_SUGGESTIONS = [
  {
    label: "Con thỏ",
    category: "animal" as FlashcardCategory,
    soundText: "Nhún nhảy!",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Quả cam",
    category: "food" as FlashcardCategory,
    soundText: "Chua ngọt!",
    image: "/flashcards/cam.png",
  },
  {
    label: "Uống nước",
    category: "action" as FlashcardCategory,
    soundText: "Ực ực mát quá!",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Ngạc nhiên",
    category: "emotion" as FlashcardCategory,
    soundText: "Ồ, lạ quá!",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Quả bóng",
    category: "object" as FlashcardCategory,
    soundText: "Tưng tưng!",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=600&auto=format&fit=crop",
  },
];

const FALLBACK_FLASHCARD_IMG = "/flashcards/meo.png";

// View modes
type ViewMode = "categories" | "all-cards";

export function FlashcardLibrary() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [selectedCategory, setSelectedCategory] = useState<FlashcardCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [deletingCard, setDeletingCard] = useState<Flashcard | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form State for Create & Edit
  const [formLabel, setFormLabel] = useState("");
  const [formCategory, setFormCategory] = useState<FlashcardCategory>("animal");
  const [formSoundText, setFormSoundText] = useState("");
  const [formImage, setFormImage] = useState("");

  // Load cards from storage on client mount
  useEffect(() => {
    setCards(loadStoredFlashcards());
  }, []);

  const handleSaveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    saveStoredFlashcards(newCards);
  };

  // Open Create Dialog
  const openCreateDialog = () => {
    setFormLabel("");
    setFormCategory("animal");
    setFormSoundText("");
    setFormImage("");
    setIsCreateOpen(true);
  };

  // Open Edit Dialog
  const openEditDialog = (card: Flashcard) => {
    setEditingCard(card);
    setFormLabel(card.label);
    setFormCategory(card.category);
    setFormSoundText(card.soundText || "");
    setFormImage(card.image);
  };

  // Handle Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) return;

    const newCard: Flashcard = {
      id: `custom-${Date.now()}`,
      label: formLabel.trim(),
      category: formCategory,
      soundText: formSoundText.trim() || undefined,
      image: formImage.trim() || FALLBACK_FLASHCARD_IMG,
      isCustom: true,
    };

    const updated = [newCard, ...cards];
    handleSaveCards(updated);
    setIsCreateOpen(false);
  };

  // Handle Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !formLabel.trim()) return;

    const updated = cards.map((c) => {
      if (c.id === editingCard.id) {
        return {
          ...c,
          label: formLabel.trim(),
          category: formCategory,
          soundText: formSoundText.trim() || undefined,
          image: formImage.trim() || c.image,
        };
      }
      return c;
    });

    handleSaveCards(updated);
    setEditingCard(null);
  };

  // Handle Delete Card
  const handleDeleteConfirm = () => {
    if (!deletingCard) return;
    const updated = cards.filter((c) => c.id !== deletingCard.id);
    handleSaveCards(updated);
    setDeletingCard(null);
  };

  // Handle Reset to Default
  const handleResetToDefault = () => {
    const defaults = getAllDefaultFlashcards();
    handleSaveCards(defaults);
    setIsResetConfirmOpen(false);
  };

  // Toggle Flip Card
  const toggleFlip = (id: string) => {
    setFlippedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; sampleImages: string[] }> = {};
    for (const cat of Object.keys(CATEGORY_MAP) as FlashcardCategory[]) {
      const catCards = cards.filter((c) => c.category === cat);
      stats[cat] = {
        count: catCards.length,
        sampleImages: catCards.slice(0, 4).map((c) => c.image),
      };
    }
    return stats;
  }, [cards]);

  // Filtered Cards (for all-cards view)
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (selectedCategory !== "all" && card.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchLabel = card.label.toLowerCase().includes(q);
        const matchSound = card.soundText?.toLowerCase().includes(q);
        const matchCategory = CATEGORY_MAP[card.category]?.label.toLowerCase().includes(q);
        if (!matchLabel && !matchSound && !matchCategory) return false;
      }
      return true;
    });
  }, [cards, selectedCategory, searchQuery]);

  // Categories with cards
  const categoriesWithCards = useMemo(() => {
    return (Object.keys(CATEGORY_MAP) as FlashcardCategory[]).filter(
      (cat) => (categoryStats[cat]?.count ?? 0) > 0
    );
  }, [categoryStats]);

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h2 className="text-2xl font-bold text-slate-900">Kho Học liệu Flashcard</h2>
              <Badge className="bg-[#1FA7E1] text-white hover:bg-[#1994c8] border-none font-bold">
                {cards.length} thẻ
              </Badge>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl">
              Học liệu thẻ tương tác đa giác quan: nhận biết con vật, cảm xúc, sinh hoạt và từ vựng hằng ngày
              kèm hình ảnh trực quan và giọng đọc chuẩn tiếng Việt.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={openCreateDialog}
              className="bg-[#1FA7E1] hover:bg-[#178ebf] text-white shadow-sm font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Tạo Flashcard mới
            </Button>

            {/* Toggle view mode button */}
            <Button
              variant="outline"
              className="bg-white hover:bg-slate-50 border-slate-200"
              onClick={() => setViewMode(viewMode === "categories" ? "all-cards" : "categories")}
            >
              {viewMode === "categories" ? (
                <>
                  <Grid3X3 className="w-4 h-4 mr-1.5 text-primary" />
                  Xem tất cả thẻ
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 mr-1.5 text-primary" />
                  Xem theo chủ đề
                </>
              )}
            </Button>

            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" asChild>
              <Link to="/library/flashcards">
                <Layers className="w-4 h-4 mr-1.5 text-primary" />
                Luyện tập Quizlet
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              className="text-xs text-slate-500 hover:text-slate-700"
              title="Khôi phục 30 thẻ mẫu ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Khôi phục mẫu
            </Button>
          </div>
        </div>
      </div>

      {/* ===== VIEW MODE: CATEGORIES (Consolidated) ===== */}
      {viewMode === "categories" ? (
        <div className="space-y-6">
          <div className="text-sm text-slate-500 font-medium">
            📂 Chọn chủ đề bạn muốn luyện tập — Bấm vào để mở bài flashcard tương ứng
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categoriesWithCards.map((cat) => {
              const meta = CATEGORY_MAP[cat];
              const stats = categoryStats[cat];
              return (
                <Link
                  key={cat}
                  to="/library/flashcards"
                  search={{ deck: cat }}
                  className="block group"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-200 cursor-pointer h-full">
                    {/* Category header gradient */}
                    <div className={`bg-gradient-to-br ${meta.bgGradient} p-5 text-white relative`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{meta.emoji}</span>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{meta.label}</h3>
                            <p className="text-white/80 text-xs mt-0.5">{stats.count} thẻ</p>
                          </div>
                        </div>
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-slate-600 leading-relaxed">{meta.description}</p>

                      {/* Sample image thumbnails */}
                      {stats.sampleImages.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {stats.sampleImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center"
                            >
                              <img
                                src={img}
                                alt=""
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = FALLBACK_FLASHCARD_IMG;
                                }}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          ))}
                          {stats.count > 4 && (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-500 font-semibold">
                              +{stats.count - 4}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-[#1FA7E1] font-semibold group-hover:underline pt-1">
                        <Layers className="w-3.5 h-3.5" />
                        Bắt đầu luyện tập
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        /* ===== VIEW MODE: ALL CARDS (Individual) ===== */
        <div className="space-y-6">
          {/* Filter & Search Controls */}
          <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm flashcard theo tên từ vựng, tiếng kêu (ví dụ: con mèo, quả cam, vui vẻ)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 bg-slate-50 border-slate-200 text-sm w-full"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-sm no-scrollbar">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full h-8 text-xs font-semibold ${
                  selectedCategory === "all"
                    ? "bg-[#1FA7E1] hover:bg-[#1994c8] text-white"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                }`}
              >
                Tất cả ({cards.length})
              </Button>

              {(Object.keys(CATEGORY_MAP) as FlashcardCategory[]).map((cat) => {
                const count = cards.filter((c) => c.category === cat).length;
                const meta = CATEGORY_MAP[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <Button
                    key={cat}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full h-8 text-xs font-semibold shrink-0 ${
                      isSelected
                        ? "bg-[#1FA7E1] hover:bg-[#1994c8] text-white"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="mr-1">{meta.emoji}</span>
                    {meta.label} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Flashcard Grid */}
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCards.map((card) => {
                const isFlipped = Boolean(flippedCardIds[card.id]);
                const meta = CATEGORY_MAP[card.category] || CATEGORY_MAP.other;

                return (
                  <Card
                    key={card.id}
                    className="group relative overflow-hidden transition-all duration-200 hover:shadow-md border border-slate-200 flex flex-col bg-white"
                  >
                    {/* Front Side */}
                    {!isFlipped ? (
                      <div className="flex flex-col h-full">
                        {/* Image Area */}
                        <div className="relative h-48 bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b border-slate-100">
                          <img
                            src={card.image}
                            alt={card.label}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_FLASHCARD_IMG;
                            }}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium border ${meta.color} bg-white/90 backdrop-blur-sm shadow-xs`}
                            >
                              <span className="mr-1">{meta.emoji}</span>
                              {meta.label}
                            </Badge>
                            {card.isCustom && (
                              <Badge className="text-[10px] bg-amber-500 text-white border-none">
                                Tự tạo
                              </Badge>
                            )}
                          </div>

                          {/* Sound text bubble if available */}
                          {card.soundText && (
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-xs font-medium">
                              🎵 {card.soundText}
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <CardContent className="p-4 flex-grow flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-slate-900 leading-tight">
                              {card.label}
                            </h3>

                            {/* Speaker Action Button */}
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                playFlashcardSound(card);
                              }}
                              className="h-9 w-9 rounded-full bg-sky-100 text-[#1FA7E1] hover:bg-sky-200 hover:text-[#178ebf] shrink-0"
                              title="Phát âm từ vựng"
                            >
                              <Volume2 className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                            <button
                              type="button"
                              onClick={() => toggleFlip(card.id)}
                              className="flex items-center gap-1 text-[#1FA7E1] hover:underline font-medium"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              Lật mặt sau
                            </button>

                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditDialog(card);
                                }}
                                className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                title="Chỉnh sửa thẻ"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingCard(card);
                                }}
                                className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Xoá thẻ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    ) : (
                      /* Back Side */
                      <div className="flex flex-col h-full min-h-[300px] justify-between p-5 bg-gradient-to-b from-sky-50/50 to-white">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium border ${meta.color}`}
                            >
                              <span className="mr-1">{meta.emoji}</span>
                              {meta.label}
                            </Badge>
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                              Mặt sau
                            </span>
                          </div>

                          <div className="text-center py-4 space-y-1">
                            <h3 className="font-extrabold text-2xl text-slate-900">{card.label}</h3>
                            {card.soundText && (
                              <p className="text-sm text-[#1FA7E1] font-semibold">"{card.soundText}"</p>
                            )}
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 shadow-2xs">
                            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              Gợi ý tương tác cùng con:
                            </div>
                            <p className="leading-relaxed">
                              Chỉ vào thẻ và hỏi bé: <em>"{card.label} làm như thế nào nhỉ?"</em> hoặc khuyến khích bé nói lặp lại từ này 2-3 lần.
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFlip(card.id)}
                            className="text-xs text-slate-600 hover:text-slate-900"
                          >
                            <RotateCw className="w-3.5 h-3.5 mr-1" />
                            Lật lại mặt trước
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => playFlashcardSound(card)}
                            className="bg-[#1FA7E1] hover:bg-[#1994c8] text-white text-xs"
                          >
                            <Volume2 className="w-3.5 h-3.5 mr-1" />
                            Nghe đọc
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-3 text-[#1FA7E1]">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Không tìm thấy flashcard nào</h3>
              <p className="text-sm text-slate-500 max-w-md mb-5">
                Thử thay đổi bộ lọc, từ khóa tìm kiếm hoặc tạo một thẻ flashcard mới cho bé ngay bên dưới.
              </p>
              <Button onClick={openCreateDialog} className="bg-[#1FA7E1] hover:bg-[#1994c8] text-white">
                <Plus className="w-4 h-4 mr-1.5" />
                Tạo Flashcard mới
              </Button>
            </div>
          )}
        </div>
      )}

      {/* DIALOG: TẠO FLASHCARD MỚI */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#1FA7E1] text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Tạo học liệu tương tác
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Thêm Flashcard mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Tạo thẻ học từ vựng cho bé với hình ảnh trực quan, tiếng kêu và giọng đọc tiếng Việt.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            {/* Tên từ vựng */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Từ vựng / Tên thẻ <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Ví dụ: Con thỏ, Quả táo, Uống nước, Vui vẻ..."
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                required
              />
            </div>

            {/* Chủ đề */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Chủ đề phân loại</label>
              <Select
                value={formCategory}
                onValueChange={(val) => setFormCategory(val as FlashcardCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_MAP) as FlashcardCategory[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_MAP[cat].emoji} {CATEGORY_MAP[cat].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tiếng kêu / Mô tả âm thanh */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Tiếng kêu / Âm thanh vui nhộn (Tùy chọn)
              </label>
              <Input
                placeholder="Ví dụ: Meo meo!, Gâu gâu!, Chua ngọt!, Ha ha!"
                value={formSoundText}
                onChange={(e) => setFormSoundText(e.target.value)}
              />
            </div>

            {/* Link ảnh */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Link hình ảnh (URL)
              </label>
              <Input
                placeholder="https://... hoặc đường dẫn ảnh"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
              />
            </div>

            {/* Gợi ý mẫu nhanh */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500">Gợi ý mẫu nhanh:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SUGGESTIONS.map((preset, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-slate-50 hover:bg-slate-100"
                    onClick={() => {
                      setFormLabel(preset.label);
                      setFormCategory(preset.category);
                      setFormSoundText(preset.soundText);
                      setFormImage(preset.image);
                    }}
                  >
                    + {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-white border overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={formImage || FALLBACK_FLASHCARD_IMG}
                  alt="Xem trước"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_FLASHCARD_IMG;
                  }}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-xs text-slate-400">Xem trước thẻ:</div>
                <div className="font-bold text-slate-900 truncate">
                  {formLabel || "Tên từ vựng"}
                </div>
                <div className="text-xs text-slate-500">
                  {CATEGORY_MAP[formCategory]?.emoji} {CATEGORY_MAP[formCategory]?.label}
                  {formSoundText ? ` · "${formSoundText}"` : ""}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => speakVietnamese(formLabel || "Xem trước")}
                className="shrink-0 text-xs"
                title="Nghe thử"
              >
                <Volume2 className="w-3.5 h-3.5 mr-1 text-[#1FA7E1]" />
                Nghe thử
              </Button>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-[#1FA7E1] hover:bg-[#1994c8] text-white">
                <Check className="w-4 h-4 mr-1.5" />
                Tạo Flashcard
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: CHỈNH SỬA FLASHCARD */}
      <Dialog open={Boolean(editingCard)} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
              <Pencil className="w-4 h-4 text-[#1FA7E1]" />
              Chỉnh sửa học liệu
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Chỉnh sửa Flashcard
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Từ vựng / Tên thẻ <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Chủ đề phân loại</label>
              <Select
                value={formCategory}
                onValueChange={(val) => setFormCategory(val as FlashcardCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_MAP) as FlashcardCategory[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_MAP[cat].emoji} {CATEGORY_MAP[cat].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Tiếng kêu / Âm thanh vui nhộn
              </label>
              <Input
                value={formSoundText}
                onChange={(e) => setFormSoundText(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Link hình ảnh (URL)
              </label>
              <Input
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
              />
            </div>

            {/* Live Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-white border overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={formImage || FALLBACK_FLASHCARD_IMG}
                  alt="Xem trước"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_FLASHCARD_IMG;
                  }}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-xs text-slate-400">Xem trước:</div>
                <div className="font-bold text-slate-900 truncate">{formLabel}</div>
                <div className="text-xs text-slate-500">
                  {CATEGORY_MAP[formCategory]?.emoji} {CATEGORY_MAP[formCategory]?.label}
                  {formSoundText ? ` · "${formSoundText}"` : ""}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => speakVietnamese(formLabel)}
                className="shrink-0 text-xs"
              >
                <Volume2 className="w-3.5 h-3.5 mr-1 text-[#1FA7E1]" />
                Nghe
              </Button>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingCard(null)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-[#1FA7E1] hover:bg-[#1994c8] text-white">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALERT DIALOG: XÁC NHẬN XOÁ FLASHCARD */}
      <AlertDialog open={Boolean(deletingCard)} onOpenChange={(open) => !open && setDeletingCard(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Xóa thẻ Flashcard?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600">
              Bạn có chắc chắn muốn xóa thẻ{" "}
              <strong className="text-slate-900">"{deletingCard?.label}"</strong> khỏi Kho học liệu không?
              Hành động này sẽ xóa thẻ khỏi danh sách của bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ALERT DIALOG: KHÔI PHỤC MẪU BAN ĐẦU */}
      <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#1FA7E1]" />
              Khôi phục kho thẻ mặc định?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600">
              Hành động này sẽ khôi phục lại toàn bộ 30 thẻ flashcard mẫu chuẩn (động vật, thực phẩm, cảm xúc, hành động)
              về trạng thái gốc của hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetToDefault}
              className="bg-[#1FA7E1] hover:bg-[#1994c8] text-white"
            >
              Khôi phục ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
