// ============================================================
// Component: FlashcardViewer
// File: src/components/flashcard-viewer.tsx
// Mô tả: Trình xem Flashcard phong cách Quizlet cao cấp.
//         Hỗ trợ lật thẻ 3D, tự động chạy (autoplay), xáo bài,
//         giọng đọc tiếng Việt (TTS), phím tắt bàn phím
//         và tích hợp trò chơi ghép thẻ (matching game) trực quan.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Volume2,
  VolumeX,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Shuffle,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Settings,
  HelpCircle,
  Maximize2,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  dailyVocabularyFlashcards,
  type Flashcard,
  type FlashcardCategory,
} from "@/lib/flashcard-data";
import { cn } from "@/lib/utils";

type FilterCategory = FlashcardCategory | "all";
type ActiveTab = "flashcard" | "game";
type FrontSideMode = "image" | "word";

interface FlashcardViewerProps {
  cards?: Flashcard[];
  title?: string;
}

export function FlashcardViewer({
  cards = dailyVocabularyFlashcards,
  title = "Bộ Flashcard Từ vựng hàng ngày",
}: FlashcardViewerProps) {
  // Tabs & Modes
  const [activeTab, setActiveTab] = useState<ActiveTab>("flashcard");
  const [category, setCategory] = useState<FilterCategory>("all");
  const [current, setCurrent] = useState(0);

  // Deck State
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  // Autoplay State
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState<number>(4000); // ms

  // Card View Settings
  const [frontSide, setFrontSide] = useState<FrontSideMode>("image");
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Audio & TTS refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Lọc dữ liệu ban đầu
  useEffect(() => {
    let filtered = category === "all" ? cards : cards.filter((card) => card.category === category);

    if (isShuffled) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    setDeck(filtered);
    setCurrent(0);
    setIsFlipped(false);
    setIsPlaying(false);
  }, [category, cards, isShuffled]);

  // Hủy âm thanh khi unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, []);

  // Text-To-Speech (TTS) đọc tiếng Việt
  const speakVietnamese = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Dừng câu đang đọc dở

    const cleanText = text.replace("Con ", "").replace("Quả ", ""); // đọc ngắn gọn hơn
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";
    utterance.rate = 0.85; // tốc độ hơi chậm cho bé dễ nghe
    utterance.volume = 1;

    // Tìm giọng đọc tiếng Việt ấm áp nếu có
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes("vi-VN"));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const playAudioFile = useCallback(
    (audioUrl: string, fallbackText: string) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play().catch(() => {
        speakVietnamese(fallbackText);
      });
    },
    [speakVietnamese],
  );

  // Phát giọng đọc từ vựng, ưu tiên file thu âm rồi mới fallback sang TTS.
  const playVoice = useCallback(
    (card: Flashcard) => {
      if (card.voiceUrl) {
        playAudioFile(card.voiceUrl, card.label);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        speakVietnamese(card.label);
      }
    },
    [playAudioFile, speakVietnamese],
  );

  // Phát tiếng kêu động vật hoặc fallback sang giọng đọc từ vựng.
  const playSound = useCallback(
    (card: Flashcard) => {
      if (card.soundUrl) {
        playAudioFile(card.soundUrl, card.label);
      } else {
        playVoice(card);
      }
    },
    [playAudioFile, playVoice],
  );

  const activeCard = deck[current];

  // Tự động phát âm thanh khi lật hoặc đổi thẻ
  useEffect(() => {
    if (!activeCard) return;

    if (autoSpeak) {
      // Đọc từ khi hiển thị mặt chữ
      const shouldSpeak =
        (frontSide === "word" && !isFlipped) || (frontSide === "image" && isFlipped);

      if (shouldSpeak) {
        // Chỉ phát âm khi mặt chữ hiển thị
        playVoice(activeCard);
      } else if (frontSide === "image" && !isFlipped && activeCard.soundUrl) {
        // Nếu mặt ảnh hiện, con vật có tiếng kêu -> phát tiếng kêu
        playSound(activeCard);
      }
    }
  }, [current, isFlipped, frontSide, autoSpeak, activeCard, playSound, playVoice]);

  // Xử lý Autoplay logic
  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    if (!isPlaying || deck.length === 0) return;

    let step = 0; // 0: Đang ở mặt trước, 1: Lật ra mặt sau

    autoplayTimerRef.current = setInterval(() => {
      if (step === 0) {
        // Bước 1: Lật thẻ ra mặt sau
        setIsFlipped(true);
        step = 1;
      } else {
        // Bước 2: Chuyển sang thẻ tiếp theo và úp lại mặt trước
        setIsFlipped(false);
        step = 0;
        setCurrent((prev) => {
          if (prev >= deck.length - 1) {
            // Hết bộ bài -> dừng lại
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }
    }, autoplaySpeed / 2); // Chia đôi thời gian để lật -> chuyển thẻ đều đặn

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, deck.length, autoplaySpeed]);

  // Phím tắt bàn phím
  useEffect(() => {
    if (activeTab !== "flashcard") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((v) => !v);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.code === "Enter" || e.code === "KeyR") {
        e.preventDefault();
        if (activeCard) {
          if (e.code === "KeyR") {
            speakVietnamese(activeCard.label);
          } else {
            playVoice(activeCard);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, deck.length, current, activeCard, playVoice, speakVietnamese]);

  const goPrev = () => {
    setIsFlipped(false);
    setCurrent((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    setIsFlipped(false);
    setCurrent((i) => Math.min(deck.length - 1, i + 1));
  };

  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };

  // Tính tiến độ %
  const progressPercent = deck.length > 0 ? ((current + 1) / deck.length) * 100 : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER & CHUYỂN TAB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            {title}
          </h2>
          <p className="text-sm text-ink/60 mt-1">
            Học tập qua thẻ từ vựng thông minh và trò chơi tương tác.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab("flashcard")}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "flashcard"
                ? "bg-white text-ink shadow-sm"
                : "text-ink/60 hover:text-ink",
            )}
          >
            <BookOpen className="w-4 h-4" />
            Thẻ ghi nhớ
          </button>
          <button
            onClick={() => setActiveTab("game")}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "game" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink",
            )}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-500" />
            Ghép thẻ game
          </button>
        </div>
      </div>

      {/* FILTER THEO CHỦ ĐỀ (Dùng chung) */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink/50 uppercase tracking-wider">Chủ đề:</span>
          <div className="flex gap-1">
            {(
              [
                { value: "all", label: "Tất cả" },
                { value: "emotion", label: "Cảm xúc 😊" },
                { value: "action", label: "Hành động 🥣" },
                { value: "animal", label: "Con vật 🐶" },
                { value: "food", label: "Trái cây/Quả 🍎" },
              ] as const
            ).map((item) => (
              <button
                key={item.value}
                onClick={() => setCategory(item.value)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer",
                  category === item.value
                    ? "border-[var(--brand-blue)] bg-[var(--brand-blue-soft)]/20 text-blue-600 font-bold"
                    : "border-transparent text-ink/60 hover:bg-slate-50",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "flashcard" && deck.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-ink/50">
            <span className="font-semibold flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                Space
              </span>{" "}
              Lật
            </span>
            <span className="font-semibold flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                ← →
              </span>{" "}
              Di chuyển
            </span>
            <span className="font-semibold flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                Enter
              </span>{" "}
              Đọc âm
            </span>
          </div>
        )}
      </div>

      {/* TAB: THẺ GHI NHỚ FLIPPING CARD (Quizlet Style) */}
      {activeTab === "flashcard" && (
        <div className="space-y-6">
          {deck.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border shadow-sm text-ink/50">
              Không có thẻ nào trong danh mục này.
            </div>
          ) : activeCard ? (
            <>
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-ink/50 px-1">
                  <span>Tiến trình tự học</span>
                  <span>
                    {current + 1} / {deck.length} thẻ
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2.5 rounded-full" />
              </div>

              {/* Quizlet Flipping Card Wrapper */}
              <div className="w-full max-w-xl mx-auto perspective-1000">
                <div
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className={cn(
                    "relative w-full aspect-[4/3] sm:aspect-[1.5] cursor-pointer transform-style-3d transition-transform duration-500 ease-out",
                    isFlipped ? "rotate-y-180" : "",
                  )}
                >
                  {/* FRONT SIDE */}
                  <Card className="absolute inset-0 bg-white rounded-[2rem] border-2 border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.04)] overflow-hidden backface-hidden flex flex-col">
                    <div className="absolute top-4 left-6 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 border-slate-200 text-ink/60 text-xs font-semibold py-1 px-3.5"
                      >
                        {activeCard.category === "animal" ? "Con vật" : "Trái cây / Thực phẩm"}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-6 text-xs font-bold text-ink/30">
                      Mặt trước
                    </div>

                    <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
                      {frontSide === "image" ? (
                        /* Ảnh ở trước */
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                          <img
                            src={activeCard.image}
                            alt={activeCard.label}
                            className="max-h-[60%] max-w-[80%] object-contain drop-shadow-md animate-[float_4s_ease-in-out_infinite]"
                          />
                          {activeCard.soundUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playSound(activeCard);
                              }}
                              className="w-10 h-10 rounded-full bg-[var(--brand-blue-soft)] text-[var(--brand-blue)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              title="Nghe tiếng kêu"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Chữ ở trước */
                        <div className="text-center space-y-3">
                          <h3 className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                            {activeCard.label}
                          </h3>
                          {activeCard.soundText && (
                            <p className="text-xl font-bold text-[var(--brand-blue)] italic">
                              {activeCard.soundText}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>

                    <div className="h-12 border-t border-slate-50 bg-slate-50/50 flex items-center justify-center text-xs font-semibold text-ink/40">
                      💡 Chạm vào thẻ hoặc nhấn Space để lật mặt sau
                    </div>
                  </Card>

                  {/* BACK SIDE */}
                  <Card className="absolute inset-0 bg-white rounded-[2rem] border-2 border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.04)] overflow-hidden backface-hidden rotate-y-180 flex flex-col">
                    <div className="absolute top-4 left-6 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 border-slate-200 text-ink/60 text-xs font-semibold py-1 px-3.5"
                      >
                        Mặt sau của thẻ
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-6 text-xs font-bold text-ink/30">
                      Mặt sau
                    </div>

                    <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
                      {frontSide === "image" ? (
                        /* Chữ ở sau */
                        <div className="text-center space-y-4">
                          <h3 className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                            {activeCard.label}
                          </h3>

                          {activeCard.soundText && (
                            <p className="text-2xl font-bold text-[var(--brand-blue)] italic">
                              {activeCard.soundText}
                            </p>
                          )}

                          <div className="flex justify-center gap-3">
                            {activeCard.soundUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSound(activeCard);
                                }}
                                className="rounded-xl font-bold gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-4 h-4" /> Nghe kêu
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                playVoice(activeCard);
                              }}
                              className="rounded-xl font-bold gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4 text-emerald-500" /> Phát âm từ
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* Ảnh ở sau */
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                          <img
                            src={activeCard.image}
                            alt={activeCard.label}
                            className="max-h-[65%] max-w-[85%] object-contain drop-shadow-md"
                          />
                          <div className="flex gap-2">
                            {activeCard.soundUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSound(activeCard);
                                }}
                                className="w-10 h-10 rounded-full bg-[var(--brand-blue-soft)] text-[var(--brand-blue)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              >
                                <Volume2 className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playVoice(activeCard);
                              }}
                              className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <div className="h-12 border-t border-slate-50 bg-slate-50/50 flex items-center justify-center text-xs font-semibold text-ink/40">
                      💡 Chạm vào thẻ hoặc nhấn Space để lật lại mặt trước
                    </div>
                  </Card>
                </div>
              </div>

              {/* CARD DECK CONTROLS */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto bg-slate-50 p-4 rounded-3xl border border-slate-100">
                {/* Autoplay & Shuffle settings */}
                <div className="flex items-center gap-1.5">
                  {/* Autoplay Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying((v) => !v)}
                    className={cn(
                      "w-10 h-10 rounded-xl cursor-pointer",
                      isPlaying ? "bg-amber-100 text-amber-600" : "hover:bg-slate-200",
                    )}
                    title={isPlaying ? "Tạm dừng chạy tự động" : "Tự động chạy slideshow"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

                  {/* Shuffle Deck */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleShuffle}
                    className={cn(
                      "w-10 h-10 rounded-xl cursor-pointer",
                      isShuffled ? "bg-blue-100 text-blue-600" : "hover:bg-slate-200",
                    )}
                    title={isShuffled ? "Hủy xáo bài" : "Xáo trộn thứ tự bài"}
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>

                  {/* Toggle Audio Auto-speak */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAutoSpeak((v) => !v)}
                    className={cn(
                      "w-10 h-10 rounded-xl cursor-pointer",
                      autoSpeak
                        ? "bg-emerald-100 text-emerald-600"
                        : "hover:bg-slate-200 text-slate-400",
                    )}
                    title={autoSpeak ? "Tắt tự động đọc âm" : "Bật tự động đọc âm"}
                  >
                    {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </Button>

                  {/* Toggle Front Side Mode */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFrontSide((mode) => (mode === "image" ? "word" : "image"))}
                    className="w-10 h-10 rounded-xl hover:bg-slate-200 cursor-pointer"
                    title={
                      frontSide === "image"
                        ? "Mặt trước: Hình ảnh -> Đổi sang Từ"
                        : "Mặt trước: Từ -> Đổi sang Hình ảnh"
                    }
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>

                {/* Next/Prev Navigation Buttons */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-11 h-11 rounded-2xl shadow-sm border-slate-200 cursor-pointer hover:bg-white"
                    onClick={goPrev}
                    disabled={current === 0}
                    aria-label="Thẻ trước"
                  >
                    <ChevronLeft className="w-5 h-5 text-ink" />
                  </Button>

                  <span className="text-sm font-bold text-ink/70 min-w-16 text-center tabular-nums">
                    {current + 1} / {deck.length}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-11 h-11 rounded-2xl shadow-sm border-slate-200 cursor-pointer hover:bg-white"
                    onClick={goNext}
                    disabled={current === deck.length - 1}
                    aria-label="Thẻ sau"
                  >
                    <ChevronRight className="w-5 h-5 text-ink" />
                  </Button>
                </div>
              </div>

              {/* GRID INDEX PREVIEW */}
              <div className="border-t pt-6">
                <p className="text-xs font-bold text-ink/40 uppercase tracking-wider mb-3 px-1">
                  Danh sách thẻ trong bộ:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {deck.map((card, index) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setCurrent(index);
                        setIsFlipped(false);
                        setIsPlaying(false);
                      }}
                      className={cn(
                        "rounded-2xl border-2 p-2 bg-white transition-all text-center hover:scale-105 active:scale-95 hover:shadow-sm cursor-pointer",
                        index === current
                          ? "border-[var(--brand-blue)] bg-blue-50/10"
                          : "border-slate-100 hover:border-slate-200",
                      )}
                    >
                      <img
                        src={card.image}
                        alt={card.label}
                        className="w-full aspect-square object-contain mx-auto"
                      />
                      <p className="text-[10px] font-bold mt-1.5 text-ink/80 truncate">
                        {card.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* TAB: TRÒ CHƠI GHÉP THẺ (Matching Game) */}
      {activeTab === "game" && (
        <MatchingGame cards={deck.length > 0 ? deck : cards} speakCardFn={playVoice} />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// COMPONENT PHỤ: Trò chơi Ghép Thẻ (Matching Game Component)
// -------------------------------------------------------------
interface Tile {
  id: string; // e.g., "cho-word" or "cho-image"
  cardId: string; // e.g., "cho"
  type: "word" | "image";
  content: string; // nhãn từ vựng hoặc đường dẫn ảnh
  isMatched: boolean;
  isSelected: boolean;
  isError: boolean;
}

function MatchingGame({
  cards,
  speakCardFn,
}: {
  cards: Flashcard[];
  speakCardFn: (card: Flashcard) => void;
}) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [firstSelected, setFirstSelected] = useState<Tile | null>(null);
  const [secondSelected, setSecondSelected] = useState<Tile | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Hẹn giờ
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Bắt đầu game
  const initGame = useCallback(() => {
    // Chỉ lấy ngẫu nhiên 4 thẻ từ bộ để tạo thành 8 ô (vừa vặn, đỡ rối mắt cho bé)
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 4);

    const gameTiles: Tile[] = [];
    selectedCards.forEach((card) => {
      // 1. Ô chữ
      gameTiles.push({
        id: `${card.id}-word`,
        cardId: card.id,
        type: "word",
        content: card.label,
        isMatched: false,
        isSelected: false,
        isError: false,
      });
      // 2. Ô ảnh
      gameTiles.push({
        id: `${card.id}-image`,
        cardId: card.id,
        type: "image",
        content: card.image,
        isMatched: false,
        isSelected: false,
        isError: false,
      });
    });

    // Trộn ngẫu nhiên 8 ô này
    setTiles(gameTiles.sort(() => Math.random() - 0.5));
    setFirstSelected(null);
    setSecondSelected(null);
    setSeconds(0);
    setGameStarted(true);
    setGameCompleted(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }, [cards]);

  // Kết thúc trò chơi
  useEffect(() => {
    if (gameStarted && tiles.length > 0 && tiles.every((t) => t.isMatched)) {
      setGameCompleted(true);
      setGameStarted(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [tiles, gameStarted]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Xử lý click chọn ô
  const handleTileClick = (tile: Tile) => {
    if (!gameStarted || tile.isMatched || tile.isSelected || secondSelected) return;

    // Đọc từ vựng khi nhấp nếu là ô chữ
    if (tile.type === "word") {
      const card = cards.find((item) => item.id === tile.cardId);
      if (card) {
        speakCardFn(card);
      }
    }

    const updatedTiles = tiles.map((t) => (t.id === tile.id ? { ...t, isSelected: true } : t));
    setTiles(updatedTiles);

    if (!firstSelected) {
      setFirstSelected(tile);
    } else {
      setSecondSelected(tile);

      // Kiểm tra xem 2 ô có khớp nhau không
      if (firstSelected.cardId === tile.cardId && firstSelected.type !== tile.type) {
        // KHỚP NHAU!
        setTimeout(() => {
          setTiles((prevTiles) =>
            prevTiles.map((t) =>
              t.cardId === tile.cardId ? { ...t, isMatched: true, isSelected: false } : t,
            ),
          );
          setFirstSelected(null);
          setSecondSelected(null);
        }, 500);
      } else {
        // KHÔNG KHỚP! Báo đỏ lỗi
        setTimeout(() => {
          setTiles((prevTiles) =>
            prevTiles.map((t) =>
              t.id === firstSelected.id || t.id === tile.id ? { ...t, isError: true } : t,
            ),
          );
        }, 200);

        // Reset lại trạng thái bình thường sau 1 giây
        setTimeout(() => {
          setTiles((prevTiles) =>
            prevTiles.map((t) =>
              t.id === firstSelected.id || t.id === tile.id
                ? { ...t, isSelected: false, isError: false }
                : t,
            ),
          );
          setFirstSelected(null);
          setSecondSelected(null);
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-inner text-center space-y-6 max-w-2xl mx-auto">
      {!gameStarted && !gameCompleted ? (
        /* Giao diện Start Game */
        <div className="py-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center shadow-sm">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-ink">Trò chơi Ghép Thẻ thú vị</h3>
            <p className="text-sm text-ink/60 max-w-md mx-auto leading-relaxed">
              Trực quan hóa từ vựng! Hãy ghép đôi các thẻ chữ tương ứng với hình ảnh động vật/trái
              cây đúng nhanh nhất có thể.
            </p>
          </div>
          <Button
            size="lg"
            onClick={initGame}
            className="rounded-2xl font-bold px-8 shadow-[4px_4px_0px_#3bb383] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3bb383] cursor-pointer"
            style={{ background: "var(--brand-mint)", color: "white" }}
          >
            Bắt đầu chơi ngay!
          </Button>
        </div>
      ) : gameStarted ? (
        /* Giao diện Đang chơi */
        <div className="space-y-6">
          {/* Timer bar */}
          <div className="flex justify-between items-center bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100/50">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-4 h-4 text-emerald-500" /> Đồng hồ bấm giờ
            </span>
            <span className="text-xl font-black text-ink tabular-nums">{seconds} giây</span>
          </div>

          {/* Grid matching tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className={cn(
                  "aspect-square rounded-[1.5rem] border-2 bg-white flex items-center justify-center p-4 transition-all duration-300 transform cursor-pointer hover:scale-102 hover:shadow-md",
                  tile.isMatched
                    ? "opacity-0 scale-95 pointer-events-none" // Ẩn khi đã ghép đúng
                    : "",
                  tile.isSelected
                    ? "border-blue-400 bg-blue-50/20 scale-102 ring-4 ring-blue-100"
                    : "border-slate-100",
                  tile.isError ? "border-rose-400 bg-rose-50/20 animate-shake" : "",
                )}
              >
                {tile.type === "image" ? (
                  <img
                    src={tile.content}
                    alt="Tile"
                    className="max-h-[85%] max-w-[85%] object-contain"
                  />
                ) : (
                  <span className="text-lg sm:text-xl font-bold text-ink leading-tight select-none">
                    {tile.content}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Reset button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={initGame}
            className="gap-1.5 font-semibold text-ink/50 hover:text-ink cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Bắt đầu lại
          </Button>
        </div>
      ) : (
        /* Giao diện Hoàn thành Game */
        <div className="py-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2 animate-fade-in">
            <h3 className="text-3xl font-extrabold text-ink">Bé giỏi quá! 🎉</h3>
            <p className="text-sm text-ink/70">Đã ghép thành công tất cả các cặp thẻ.</p>
            <div className="inline-block mt-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm font-bold text-ink">
              ⏱️ Thành tích của con:{" "}
              <span className="text-emerald-500 text-lg font-black">{seconds} giây</span>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              size="lg"
              onClick={initGame}
              className="rounded-2xl font-bold px-8 shadow-[4px_4px_0px_#3bb383] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3bb383] cursor-pointer"
              style={{ background: "var(--brand-mint)", color: "white" }}
            >
              Chơi lại lượt mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
