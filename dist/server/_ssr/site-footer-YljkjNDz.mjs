import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Heart } from "../_libs/lucide-react.mjs";
const basicEmotionActionFlashcards = [
  {
    id: "khoc",
    label: "Khóc",
    category: "emotion",
    image: "/flashcards/khoc.png",
    soundText: "Hu hu...",
    voiceUrl: "/flashcards/voices/khoc.mp3"
  },
  {
    id: "vui-ve",
    label: "Vui vẻ",
    category: "emotion",
    image: "/flashcards/vui-ve.png",
    soundText: "Ha ha!",
    voiceUrl: "/flashcards/voices/vui-ve.mp3"
  },
  {
    id: "an-com",
    label: "Ăn cơm",
    category: "action",
    image: "/flashcards/an-com.png",
    soundText: "Ngon quá!",
    voiceUrl: "/flashcards/voices/an-com.mp3"
  },
  {
    id: "chai-toc",
    label: "Chải tóc",
    category: "action",
    image: "/flashcards/chai-toc.png",
    soundText: "Tóc mượt ghê!",
    voiceUrl: "/flashcards/voices/chai-toc.mp3"
  },
  {
    id: "mac-ao",
    label: "Mặc áo",
    category: "action",
    image: "/flashcards/mac-ao.png",
    soundText: "Áo đẹp quá!",
    voiceUrl: "/flashcards/voices/mac-ao.mp3"
  }
];
const dailyVocabularyFlashcards = [
  {
    id: "meo",
    label: "Con mèo",
    category: "animal",
    image: "/flashcards/meo.png",
    soundText: "Meo meo!",
    soundUrl: "/flashcards/sounds/meo.mp3",
    voiceUrl: "/flashcards/voices/meo.mp3"
  },
  {
    id: "cho",
    label: "Con chó",
    category: "animal",
    image: "/flashcards/cho.png",
    soundText: "Gâu gâu!",
    soundUrl: "/flashcards/sounds/cho.mp3",
    voiceUrl: "/flashcards/voices/cho.mp3"
  },
  {
    id: "vit",
    label: "Con vịt",
    category: "animal",
    image: "/flashcards/vit.png",
    soundText: "Cạp cạp!",
    soundUrl: "/flashcards/sounds/vit.mp3",
    voiceUrl: "/flashcards/voices/vit.mp3"
  },
  {
    id: "bo",
    label: "Con bò",
    category: "animal",
    image: "/flashcards/bo.png",
    soundText: "Ùm bò!",
    soundUrl: "/flashcards/sounds/bo.mp3"
  },
  {
    id: "su-tu",
    label: "Con sư tử",
    category: "animal",
    image: "/flashcards/su-tu.png",
    soundText: "Grrr!",
    soundUrl: "/flashcards/sounds/su-tu.mp3",
    voiceUrl: "/flashcards/voices/su-tu.mp3"
  },
  {
    id: "voi",
    label: "Con voi",
    category: "animal",
    image: "/flashcards/voi.png",
    soundText: "Tù tù!",
    soundUrl: "/flashcards/sounds/voi.mp3",
    voiceUrl: "/flashcards/voices/voi.mp3"
  },
  {
    id: "ngua",
    label: "Con ngựa",
    category: "animal",
    image: "/flashcards/ngua.png",
    soundText: "Hí hí!",
    voiceUrl: "/flashcards/voices/ngua.mp3"
  },
  {
    id: "khi",
    label: "Con khỉ",
    category: "animal",
    image: "/flashcards/khi.png",
    soundText: "U u a a!",
    soundUrl: "/flashcards/sounds/khi.mp3",
    voiceUrl: "/flashcards/voices/khi.mp3"
  },
  {
    id: "rua",
    label: "Con rùa",
    category: "animal",
    image: "/flashcards/rua.png"
  },
  {
    id: "kien",
    label: "Con kiến",
    category: "animal",
    image: "/flashcards/kien.png",
    voiceUrl: "/flashcards/voices/kien.mp3"
  },
  {
    id: "tao",
    label: "Quả táo",
    category: "food",
    image: "/flashcards/tao.png",
    voiceUrl: "/flashcards/voices/tao.mp3"
  },
  {
    id: "chuoi",
    label: "Quả chuối",
    category: "food",
    image: "/flashcards/chuoi.png"
  },
  {
    id: "cam",
    label: "Quả cam",
    category: "food",
    image: "/flashcards/cam.png"
  },
  {
    id: "dua-hau",
    label: "Quả dưa hấu",
    category: "food",
    image: "/flashcards/dua-hau.png"
  },
  {
    id: "dau-tay",
    label: "Quả dâu tây",
    category: "food",
    image: "/flashcards/dau-tay.png",
    voiceUrl: "/flashcards/voices/dau-tay.mp3"
  },
  {
    id: "nho",
    label: "Quả nho",
    category: "food",
    image: "/flashcards/nho.png"
  },
  {
    id: "chanh",
    label: "Quả chanh",
    category: "food",
    image: "/flashcards/chanh.png",
    voiceUrl: "/flashcards/voices/chanh.mp3"
  },
  {
    id: "khe",
    label: "Quả khế",
    category: "food",
    image: "/flashcards/khe.png"
  },
  {
    id: "oi",
    label: "Quả ổi",
    category: "food",
    image: "/flashcards/oi.png",
    voiceUrl: "/flashcards/voices/oi.mp3"
  },
  {
    id: "ca-chua",
    label: "Quả cà chua",
    category: "food",
    image: "/flashcards/ca-chua.png",
    voiceUrl: "/flashcards/voices/ca-chua.mp3"
  },
  {
    id: "ca-rot",
    label: "Cà rốt",
    category: "food",
    image: "/flashcards/ca-rot.png",
    voiceUrl: "/flashcards/voices/ca-rot.mp3"
  },
  {
    id: "ot-chuong",
    label: "Ớt chuông",
    category: "food",
    image: "/flashcards/ot-chuong.png"
  },
  {
    id: "khoai-tay",
    label: "Khoai tây",
    category: "food",
    image: "/flashcards/khoai-tay.png",
    voiceUrl: "/flashcards/voices/khoai-tay.mp3"
  },
  {
    id: "hanh-tim",
    label: "Hành tím",
    category: "food",
    image: "/flashcards/hanh-tim.png"
  },
  {
    id: "trung",
    label: "Quả trứng",
    category: "food",
    image: "/flashcards/trung.png",
    voiceUrl: "/flashcards/voices/trung.mp3"
  }
];
const FLASHCARD_STORAGE_KEY = "bino_user_flashcards_v1";
function getAllDefaultFlashcards() {
  return [...basicEmotionActionFlashcards, ...dailyVocabularyFlashcards];
}
function loadStoredFlashcards() {
  if (typeof window === "undefined") return getAllDefaultFlashcards();
  try {
    const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
    if (!raw) {
      const defaults = getAllDefaultFlashcards();
      localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load stored flashcards", e);
  }
  return getAllDefaultFlashcards();
}
function saveStoredFlashcards(cards) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error("Failed to save stored flashcards", e);
  }
}
function speakVietnamese(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/^Con\s+/i, "").replace(/^Quả\s+/i, "").trim();
  const utterance = new SpeechSynthesisUtterance(clean || text);
  utterance.lang = "vi-VN";
  utterance.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find((v) => v.lang.includes("vi-VN") || v.lang.includes("vi_VN"));
  if (viVoice) {
    utterance.voice = viVoice;
  }
  window.speechSynthesis.speak(utterance);
}
function playFlashcardSound(card) {
  if (card.voiceUrl || card.soundUrl) {
    const audio = new Audio(card.voiceUrl || card.soundUrl);
    audio.play().catch(() => {
      speakVietnamese(card.label);
    });
  } else {
    speakVietnamese(card.label);
  }
}
function SiteFooter() {
  const cols = [
    {
      title: "Sản phẩm",
      links: [
        { name: "Tính năng", url: "#features" },
        { name: "Học liệu", url: "/library" },
        { name: "Lesson Builder", url: "/lesson-builder" },
        { name: "Bảng giá", url: "#pricing" }
      ]
    },
    {
      title: "Cộng đồng",
      links: [
        { name: "Nhóm phụ huynh", url: "https://www.facebook.com/share/g/1CFpEpPmEq/" },
        { name: "Chuyên gia", url: "/experts" },
        { name: "Thử thách 7 ngày", url: "#" },
        { name: "Sự kiện", url: "#" }
      ]
    },
    {
      title: "Công ty",
      links: [
        { name: "Về Bino", url: "#" },
        { name: "Sứ mệnh", url: "#" },
        { name: "Tuyển dụng", url: "#" },
        { name: "Liên hệ", url: "#" }
      ]
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-white/60 backdrop-blur-md border-t border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 md:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/logo.png",
            alt: "Bino Logo",
            className: "h-28 my-[-30px] w-auto object-contain"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-slate-600 leading-relaxed", children: "Người bạn đồng hành thông minh trong quá trình can thiệp sớm." })
      ] }),
      cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-slate-800", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: c.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: l.url,
            target: l.url.startsWith("http") ? "_blank" : void 0,
            rel: l.url.startsWith("http") ? "noopener noreferrer" : void 0,
            className: "text-sm text-slate-500 hover:text-slate-800 transition-colors",
            children: l.name
          }
        ) }, l.name)) })
      ] }, c.title))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Bino. Mọi quyền được bảo lưu."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm italic text-slate-700 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4", style: { color: "#D67B8B", fill: "#FFCAD4" } }),
        "Đồng hành cùng con từ những bước đi đầu tiên"
      ] })
    ] })
  ] }) });
}
export {
  SiteFooter as S,
  speakVietnamese as a,
  basicEmotionActionFlashcards as b,
  dailyVocabularyFlashcards as d,
  getAllDefaultFlashcards as g,
  loadStoredFlashcards as l,
  playFlashcardSound as p,
  saveStoredFlashcards as s
};
