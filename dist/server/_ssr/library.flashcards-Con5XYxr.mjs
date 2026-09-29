import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { C as Card, a as CardContent } from "./card-SSxiJ3nX.mjs";
import { R as Root, I as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { l as loadStoredFlashcards, g as getAllDefaultFlashcards, b as basicEmotionActionFlashcards, S as SiteFooter, d as dailyVocabularyFlashcards } from "./site-footer-YljkjNDz.mjs";
import { b as Route$1 } from "./router-BF6gDh8M.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, L as Layers, a8 as Sparkles, c as BookOpen, G as Gamepad2, ak as Volume2, T as Pause, V as Play, a6 as Shuffle, al as VolumeX, a3 as Settings, i as ChevronLeft, j as ChevronRight, p as Clock, Y as RotateCcw, o as CircleCheckBig } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-DzLy7LQ_.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const Progress = reactExports.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = Root.displayName;
function FlashcardViewer({
  cards = dailyVocabularyFlashcards,
  title = "Bộ Flashcard Từ vựng hàng ngày"
}) {
  const [activeTab, setActiveTab] = reactExports.useState("flashcard");
  const [category, setCategory] = reactExports.useState("all");
  const [current, setCurrent] = reactExports.useState(0);
  const [deck, setDeck] = reactExports.useState([]);
  const [isFlipped, setIsFlipped] = reactExports.useState(false);
  const [isShuffled, setIsShuffled] = reactExports.useState(false);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = reactExports.useState(4e3);
  const [frontSide, setFrontSide] = reactExports.useState("image");
  const [autoSpeak, setAutoSpeak] = reactExports.useState(true);
  const audioRef = reactExports.useRef(null);
  const autoplayTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let filtered = category === "all" ? cards : cards.filter((card) => card.category === category);
    if (isShuffled) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    setDeck(filtered);
    setCurrent(0);
    setIsFlipped(false);
    setIsPlaying(false);
  }, [category, cards, isShuffled]);
  const stopAudio = reactExports.useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);
  reactExports.useEffect(() => {
    return () => {
      stopAudio();
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [stopAudio]);
  const speakVietnamese = reactExports.useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace("Con ", "").replace("Quả ", "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";
    utterance.rate = 0.85;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes("vi-VN"));
    if (viVoice) {
      utterance.voice = viVoice;
    }
    window.speechSynthesis.speak(utterance);
  }, []);
  const playAudioFile = reactExports.useCallback(
    (audioUrl, fallbackText) => {
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
    [speakVietnamese]
  );
  const playVoice = reactExports.useCallback(
    (card) => {
      if (card.voiceUrl) {
        playAudioFile(card.voiceUrl, card.label);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        speakVietnamese(card.label);
      }
    },
    [playAudioFile, speakVietnamese]
  );
  const playSound = reactExports.useCallback(
    (card) => {
      if (card.soundUrl) {
        playAudioFile(card.soundUrl, card.label);
      } else {
        playVoice(card);
      }
    },
    [playAudioFile, playVoice]
  );
  const activeCard = deck[current];
  reactExports.useEffect(() => {
    if (!activeCard) return;
    if (autoSpeak) {
      const shouldSpeak = frontSide === "word" && !isFlipped || frontSide === "image" && isFlipped;
      if (shouldSpeak) {
        playVoice(activeCard);
      } else if (frontSide === "image" && !isFlipped && activeCard.soundUrl) {
        playSound(activeCard);
      }
    }
  }, [current, isFlipped, frontSide, autoSpeak, activeCard, playSound, playVoice]);
  reactExports.useEffect(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    if (!isPlaying || deck.length === 0) return;
    let step = 0;
    autoplayTimerRef.current = setInterval(() => {
      if (step === 0) {
        setIsFlipped(true);
        step = 1;
      } else {
        setIsFlipped(false);
        step = 0;
        setCurrent((prev) => {
          if (prev >= deck.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }
    }, autoplaySpeed / 2);
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, deck.length, autoplaySpeed]);
  reactExports.useEffect(() => {
    if (activeTab !== "flashcard") return;
    const handleKeyDown = (e) => {
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
    stopAudio();
    setIsFlipped(false);
    setCurrent((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    stopAudio();
    setIsFlipped(false);
    setCurrent((i) => Math.min(deck.length - 1, i + 1));
  };
  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };
  const progressPercent = deck.length > 0 ? (current + 1) / deck.length * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-extrabold text-ink flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-amber-500" }),
          title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-ink/60 mt-1", children: "Học tập qua thẻ từ vựng thông minh và trò chơi tương tác." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-slate-100/80 p-1.5 rounded-2xl self-start md:self-auto shadow-inner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              stopAudio();
              setActiveTab("flashcard");
            },
            className: cn(
              "px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "flashcard" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
              "Thẻ ghi nhớ"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              stopAudio();
              setActiveTab("game");
            },
            className: cn(
              "px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "game" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-4 h-4 text-emerald-500" }),
              "Ghép thẻ game"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-ink/50 uppercase tracking-wider", children: "Chủ đề:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [
          { value: "all", label: "Tất cả" },
          { value: "emotion", label: "Cảm xúc 😊" },
          { value: "action", label: "Hành động 🥣" },
          { value: "animal", label: "Con vật 🐶" },
          { value: "food", label: "Trái cây/Quả 🍎" }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              stopAudio();
              setCategory(item.value);
            },
            className: cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer",
              category === item.value ? "border-[var(--brand-blue)] bg-[var(--brand-blue-soft)]/20 text-blue-600 font-bold" : "border-transparent text-ink/60 hover:bg-slate-50"
            ),
            children: item.label
          },
          item.value
        )) })
      ] }),
      activeTab === "flashcard" && deck.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-ink/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200", children: "Space" }),
          " ",
          "Lật"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200", children: "← →" }),
          " ",
          "Di chuyển"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200", children: "Enter" }),
          " ",
          "Đọc âm"
        ] })
      ] })
    ] }),
    activeTab === "flashcard" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: deck.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 bg-white rounded-3xl border shadow-sm text-ink/50", children: "Không có thẻ nào trong danh mục này." }) : activeCard ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-bold text-ink/50 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tiến trình tự học" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            current + 1,
            " / ",
            deck.length,
            " thẻ"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progressPercent, className: "h-2.5 rounded-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-xl mx-auto perspective-1000", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => setIsFlipped((prev) => !prev),
          className: cn(
            "relative w-full aspect-[4/3] sm:aspect-[1.5] cursor-pointer transform-style-3d transition-transform duration-500 ease-out",
            isFlipped ? "rotate-y-180" : ""
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "absolute inset-0 bg-white rounded-[2rem] border-2 border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.04)] overflow-hidden backface-hidden flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-6 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "bg-slate-50 border-slate-200 text-ink/60 text-xs font-semibold py-1 px-3.5",
                  children: activeCard.category === "animal" ? "Con vật" : "Trái cây / Thực phẩm"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-6 text-xs font-bold text-ink/30", children: "Mặt trước" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 flex flex-col items-center justify-center p-8", children: frontSide === "image" ? (
                /* Ảnh ở trước */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: activeCard.image,
                      alt: activeCard.label,
                      className: "max-h-[60%] max-w-[80%] object-contain drop-shadow-md animate-[float_4s_ease-in-out_infinite]"
                    }
                  ),
                  activeCard.soundUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        playSound(activeCard);
                      },
                      className: "w-10 h-10 rounded-full bg-[var(--brand-blue-soft)] text-[var(--brand-blue)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer",
                      title: "Nghe tiếng kêu",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5" })
                    }
                  )
                ] })
              ) : (
                /* Chữ ở trước */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl sm:text-5xl font-extrabold text-ink tracking-tight", children: activeCard.label }),
                  activeCard.soundText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-[var(--brand-blue)] italic", children: activeCard.soundText })
                ] })
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 border-t border-slate-50 bg-slate-50/50 flex items-center justify-center text-xs font-semibold text-ink/40", children: "💡 Chạm vào thẻ hoặc nhấn Space để lật mặt sau" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "absolute inset-0 bg-white rounded-[2rem] border-2 border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.04)] overflow-hidden backface-hidden rotate-y-180 flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-6 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "bg-slate-50 border-slate-200 text-ink/60 text-xs font-semibold py-1 px-3.5",
                  children: "Mặt sau của thẻ"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-6 text-xs font-bold text-ink/30", children: "Mặt sau" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 flex flex-col items-center justify-center p-8", children: frontSide === "image" ? (
                /* Chữ ở sau */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl sm:text-5xl font-extrabold text-ink tracking-tight", children: activeCard.label }),
                  activeCard.soundText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-[var(--brand-blue)] italic", children: activeCard.soundText }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3", children: [
                    activeCard.soundUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: (e) => {
                          e.stopPropagation();
                          playSound(activeCard);
                        },
                        className: "rounded-xl font-bold gap-1.5 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-4 h-4" }),
                          " Nghe kêu"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: (e) => {
                          e.stopPropagation();
                          playVoice(activeCard);
                        },
                        className: "rounded-xl font-bold gap-1.5 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-emerald-500" }),
                          " Phát âm từ"
                        ]
                      }
                    )
                  ] })
                ] })
              ) : (
                /* Ảnh ở sau */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: activeCard.image,
                      alt: activeCard.label,
                      className: "max-h-[65%] max-w-[85%] object-contain drop-shadow-md"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    activeCard.soundUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          playSound(activeCard);
                        },
                        className: "w-10 h-10 rounded-full bg-[var(--brand-blue-soft)] text-[var(--brand-blue)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          playVoice(activeCard);
                        },
                        className: "w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer",
                        title: "Nghe phát âm",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5" })
                      }
                    )
                  ] })
                ] })
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 border-t border-slate-50 bg-slate-50/50 flex items-center justify-center text-xs font-semibold text-ink/40", children: "💡 Chạm vào thẻ hoặc nhấn Space để lật lại mặt trước" })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto bg-slate-50 p-4 rounded-3xl border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setIsPlaying((v) => !v),
              className: cn(
                "w-10 h-10 rounded-xl cursor-pointer",
                isPlaying ? "bg-amber-100 text-amber-600" : "hover:bg-slate-200"
              ),
              title: isPlaying ? "Tạm dừng chạy tự động" : "Tự động chạy slideshow",
              children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: toggleShuffle,
              className: cn(
                "w-10 h-10 rounded-xl cursor-pointer",
                isShuffled ? "bg-blue-100 text-blue-600" : "hover:bg-slate-200"
              ),
              title: isShuffled ? "Hủy xáo bài" : "Xáo trộn thứ tự bài",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setAutoSpeak((v) => !v),
              className: cn(
                "w-10 h-10 rounded-xl cursor-pointer",
                autoSpeak ? "bg-emerald-100 text-emerald-600" : "hover:bg-slate-200 text-slate-400"
              ),
              title: autoSpeak ? "Tắt tự động đọc âm" : "Bật tự động đọc âm",
              children: autoSpeak ? /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setFrontSide((mode) => mode === "image" ? "word" : "image"),
              className: "w-10 h-10 rounded-xl hover:bg-slate-200 cursor-pointer",
              title: frontSide === "image" ? "Mặt trước: Hình ảnh -> Đổi sang Từ" : "Mặt trước: Từ -> Đổi sang Hình ảnh",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "w-11 h-11 rounded-2xl shadow-sm border-slate-200 cursor-pointer hover:bg-white",
              onClick: goPrev,
              disabled: current === 0,
              "aria-label": "Thẻ trước",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-ink" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-ink/70 min-w-16 text-center tabular-nums", children: [
            current + 1,
            " / ",
            deck.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "w-11 h-11 rounded-2xl shadow-sm border-slate-200 cursor-pointer hover:bg-white",
              onClick: goNext,
              disabled: current === deck.length - 1,
              "aria-label": "Thẻ sau",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5 text-ink" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-ink/40 uppercase tracking-wider mb-3 px-1", children: "Danh sách thẻ trong bộ:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3", children: deck.map((card, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setCurrent(index);
              setIsFlipped(false);
              setIsPlaying(false);
            },
            className: cn(
              "rounded-2xl border-2 p-2 bg-white transition-all text-center hover:scale-105 active:scale-95 hover:shadow-sm cursor-pointer",
              index === current ? "border-[var(--brand-blue)] bg-blue-50/10" : "border-slate-100 hover:border-slate-200"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: card.image,
                  alt: card.label,
                  className: "w-full aspect-square object-contain mx-auto"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold mt-1.5 text-ink/80 truncate", children: card.label })
            ]
          },
          card.id
        )) })
      ] })
    ] }) : null }),
    activeTab === "game" && /* @__PURE__ */ jsxRuntimeExports.jsx(MatchingGame, { cards: deck.length > 0 ? deck : cards, speakCardFn: playVoice, stopAudioFn: stopAudio })
  ] });
}
function MatchingGame({
  cards,
  speakCardFn,
  stopAudioFn
}) {
  const [tiles, setTiles] = reactExports.useState([]);
  const [firstSelected, setFirstSelected] = reactExports.useState(null);
  const [secondSelected, setSecondSelected] = reactExports.useState(null);
  const [gameStarted, setGameStarted] = reactExports.useState(false);
  const [gameCompleted, setGameCompleted] = reactExports.useState(false);
  const [seconds, setSeconds] = reactExports.useState(0);
  const timerRef = reactExports.useRef(null);
  const initGame = reactExports.useCallback(() => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 4);
    const gameTiles = [];
    selectedCards.forEach((card) => {
      gameTiles.push({
        id: `${card.id}-word`,
        cardId: card.id,
        type: "word",
        content: card.label,
        isMatched: false,
        isSelected: false,
        isError: false
      });
      gameTiles.push({
        id: `${card.id}-image`,
        cardId: card.id,
        type: "image",
        content: card.image,
        isMatched: false,
        isSelected: false,
        isError: false
      });
    });
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
    }, 1e3);
  }, [cards]);
  reactExports.useEffect(() => {
    if (gameStarted && tiles.length > 0 && tiles.every((t) => t.isMatched)) {
      setGameCompleted(true);
      setGameStarted(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [tiles, gameStarted]);
  reactExports.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  const handleTileClick = (tile) => {
    if (!gameStarted || tile.isMatched || tile.isSelected || secondSelected) return;
    stopAudioFn();
    if (tile.type === "word") {
      const card = cards.find((item) => item.id === tile.cardId);
      if (card) {
        speakCardFn(card);
      }
    }
    const updatedTiles = tiles.map((t) => t.id === tile.id ? { ...t, isSelected: true } : t);
    setTiles(updatedTiles);
    if (!firstSelected) {
      setFirstSelected(tile);
    } else {
      setSecondSelected(tile);
      if (firstSelected.cardId === tile.cardId && firstSelected.type !== tile.type) {
        setTimeout(() => {
          setTiles(
            (prevTiles) => prevTiles.map(
              (t) => t.cardId === tile.cardId ? { ...t, isMatched: true, isSelected: false } : t
            )
          );
          setFirstSelected(null);
          setSecondSelected(null);
        }, 500);
      } else {
        setTimeout(() => {
          setTiles(
            (prevTiles) => prevTiles.map(
              (t) => t.id === firstSelected.id || t.id === tile.id ? { ...t, isError: true } : t
            )
          );
        }, 200);
        setTimeout(() => {
          setTiles(
            (prevTiles) => prevTiles.map(
              (t) => t.id === firstSelected.id || t.id === tile.id ? { ...t, isSelected: false, isError: false } : t
            )
          );
          setFirstSelected(null);
          setSecondSelected(null);
        }, 1e3);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-inner text-center space-y-6 max-w-2xl mx-auto", children: !gameStarted && !gameCompleted ? (
    /* Giao diện Start Game */
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-10 h-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-ink", children: "Trò chơi Ghép Thẻ thú vị" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-ink/60 max-w-md mx-auto leading-relaxed", children: "Trực quan hóa từ vựng! Hãy ghép đôi các thẻ chữ tương ứng với hình ảnh động vật/trái cây đúng nhanh nhất có thể." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          onClick: initGame,
          className: "rounded-2xl font-bold px-8 shadow-[4px_4px_0px_#3bb383] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3bb383] cursor-pointer",
          style: { background: "var(--brand-mint)", color: "white" },
          children: "Bắt đầu chơi ngay!"
        }
      )
    ] })
  ) : gameStarted ? (
    /* Giao diện Đang chơi */
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-emerald-500" }),
          " Đồng hồ bấm giờ"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-black text-ink tabular-nums", children: [
          seconds,
          " giây"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: tiles.map((tile) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => handleTileClick(tile),
          className: cn(
            "aspect-square rounded-[1.5rem] border-2 bg-white flex items-center justify-center p-4 transition-all duration-300 transform cursor-pointer hover:scale-102 hover:shadow-md",
            tile.isMatched ? "opacity-0 scale-95 pointer-events-none" : "",
            tile.isSelected ? "border-blue-400 bg-blue-50/20 scale-102 ring-4 ring-blue-100" : "border-slate-100",
            tile.isError ? "border-rose-400 bg-rose-50/20 animate-shake" : ""
          ),
          children: tile.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: tile.content,
              alt: "Tile",
              className: "max-h-[85%] max-w-[85%] object-contain"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg sm:text-xl font-bold text-ink leading-tight select-none", children: tile.content })
        },
        tile.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: initGame,
          className: "gap-1.5 font-semibold text-ink/50 hover:text-ink cursor-pointer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
            " Bắt đầu lại"
          ]
        }
      )
    ] })
  ) : (
    /* Giao diện Hoàn thành Game */
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-10 h-10 animate-bounce" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-extrabold text-ink", children: "Bé giỏi quá! 🎉" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-ink/70", children: "Đã ghép thành công tất cả các cặp thẻ." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-block mt-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm font-bold text-ink", children: [
          "⏱️ Thành tích của con:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-500 text-lg font-black", children: [
            seconds,
            " giây"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          onClick: initGame,
          className: "rounded-2xl font-bold px-8 shadow-[4px_4px_0px_#3bb383] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3bb383] cursor-pointer",
          style: { background: "var(--brand-mint)", color: "white" },
          children: "Chơi lại lượt mới"
        }
      ) })
    ] })
  ) });
}
const CATEGORY_TITLES = {
  animal: {
    title: "Flashcard Động vật",
    description: "Bộ sưu tập thẻ hình ảnh các con vật quen thuộc kèm tiếng kêu vui nhộn giúp bé nhận biết thế giới động vật.",
    emoji: "🐾"
  },
  emotion: {
    title: "Flashcard Cảm xúc",
    description: "Bộ thẻ giúp bé nhận biết và gọi tên các cảm xúc cơ bản như vui, buồn, khóc qua hình ảnh trực quan.",
    emoji: "😊"
  },
  action: {
    title: "Flashcard Hành động",
    description: "Bộ thẻ hình ảnh các hành động sinh hoạt hằng ngày giúp bé làm quen với hoạt động tự phục vụ.",
    emoji: "🏃"
  },
  food: {
    title: "Flashcard Thực phẩm & Trái cây",
    description: "Bộ thẻ hình ảnh các loại trái cây và rau củ giúp bé nhận biết thực phẩm hằng ngày.",
    emoji: "🍎"
  }
};
function FlashcardsPage() {
  const {
    deck
  } = Route$1.useSearch();
  const [allStoredCards, setAllStoredCards] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setAllStoredCards(loadStoredFlashcards());
  }, []);
  const validCategories = ["animal", "emotion", "action", "food", "object", "other"];
  const isCategoryDeck = deck && validCategories.includes(deck);
  const isBasicDeck = deck === "m1";
  let cards;
  if (isCategoryDeck) {
    const category = deck;
    cards = allStoredCards.length > 0 ? allStoredCards.filter((c) => c.category === category) : getAllDefaultFlashcards().filter((c) => c.category === category);
  } else if (isBasicDeck) {
    cards = allStoredCards.length > 0 ? allStoredCards.filter((c) => c.category === "emotion" || c.category === "action") : basicEmotionActionFlashcards;
  } else {
    cards = allStoredCards.length > 0 ? allStoredCards : getAllDefaultFlashcards();
  }
  const categoryMeta = isCategoryDeck ? CATEGORY_TITLES[deck] : null;
  const title = categoryMeta ? `${categoryMeta.emoji} ${categoryMeta.title}` : isBasicDeck ? "Flashcard Cảm xúc & Hành động cơ bản" : "Kho Flashcard Toàn diện & Luyện tập Quizlet";
  const description = categoryMeta ? categoryMeta.description : isBasicDeck ? "Học tập qua thẻ hình ảnh minh họa sinh động về cảm xúc và sinh hoạt hằng ngày." : "Học từ vựng qua hình ảnh, tiếng kêu, giọng đọc tiếng Việt và mini-game ghép thẻ.";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/library", search: {
        tab: "materials"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        "Quay lại thư viện học liệu"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-8 h-8 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: description })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlashcardViewer, { cards, title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  FlashcardsPage as component
};
