export type FlashcardCategory = "animal" | "food" | "emotion" | "action" | "object" | "other";

export interface Flashcard {
  id: string;
  label: string;
  category: FlashcardCategory;
  image: string;
  /** Onomatopoeia shown on card, e.g. "Meo meo!" */
  soundText?: string;
  /** Optional sound effect URL */
  soundUrl?: string;
  /** Optional recorded pronunciation URL */
  voiceUrl?: string;
  /** Optional custom creation flag */
  isCustom?: boolean;
}

export const basicEmotionActionFlashcards: Flashcard[] = [
  {
    id: "khoc",
    label: "Khóc",
    category: "emotion",
    image: "/flashcards/khoc.png",
    soundText: "Hu hu...",
    voiceUrl: "/flashcards/voices/khoc.mp3",
  },
  {
    id: "vui-ve",
    label: "Vui vẻ",
    category: "emotion",
    image: "/flashcards/vui-ve.png",
    soundText: "Ha ha!",
    voiceUrl: "/flashcards/voices/vui-ve.mp3",
  },
  {
    id: "an-com",
    label: "Ăn cơm",
    category: "action",
    image: "/flashcards/an-com.png",
    soundText: "Ngon quá!",
    voiceUrl: "/flashcards/voices/an-com.mp3",
  },
  {
    id: "chai-toc",
    label: "Chải tóc",
    category: "action",
    image: "/flashcards/chai-toc.png",
    soundText: "Tóc mượt ghê!",
    voiceUrl: "/flashcards/voices/chai-toc.mp3",
  },
  {
    id: "mac-ao",
    label: "Mặc áo",
    category: "action",
    image: "/flashcards/mac-ao.png",
    soundText: "Áo đẹp quá!",
    voiceUrl: "/flashcards/voices/mac-ao.mp3",
  },
];

export const dailyVocabularyFlashcards: Flashcard[] = [
  {
    id: "meo",
    label: "Con mèo",
    category: "animal",
    image: "/flashcards/meo.png",
    soundText: "Meo meo!",
    soundUrl: "/flashcards/sounds/meo.mp3",
    voiceUrl: "/flashcards/voices/meo.mp3",
  },
  {
    id: "cho",
    label: "Con chó",
    category: "animal",
    image: "/flashcards/cho.png",
    soundText: "Gâu gâu!",
    soundUrl: "/flashcards/sounds/cho.mp3",
    voiceUrl: "/flashcards/voices/cho.mp3",
  },
  {
    id: "vit",
    label: "Con vịt",
    category: "animal",
    image: "/flashcards/vit.png",
    soundText: "Cạp cạp!",
    soundUrl: "/flashcards/sounds/vit.mp3",
    voiceUrl: "/flashcards/voices/vit.mp3",
  },
  {
    id: "bo",
    label: "Con bò",
    category: "animal",
    image: "/flashcards/bo.png",
    soundText: "Ùm bò!",
    soundUrl: "/flashcards/sounds/bo.mp3",
  },
  {
    id: "su-tu",
    label: "Con sư tử",
    category: "animal",
    image: "/flashcards/su-tu.png",
    soundText: "Grrr!",
    soundUrl: "/flashcards/sounds/su-tu.mp3",
    voiceUrl: "/flashcards/voices/su-tu.mp3",
  },
  {
    id: "voi",
    label: "Con voi",
    category: "animal",
    image: "/flashcards/voi.png",
    soundText: "Tù tù!",
    soundUrl: "/flashcards/sounds/voi.mp3",
    voiceUrl: "/flashcards/voices/voi.mp3",
  },
  {
    id: "ngua",
    label: "Con ngựa",
    category: "animal",
    image: "/flashcards/ngua.png",
    soundText: "Hí hí!",
    voiceUrl: "/flashcards/voices/ngua.mp3",
  },
  {
    id: "khi",
    label: "Con khỉ",
    category: "animal",
    image: "/flashcards/khi.png",
    soundText: "U u a a!",
    soundUrl: "/flashcards/sounds/khi.mp3",
    voiceUrl: "/flashcards/voices/khi.mp3",
  },
  {
    id: "rua",
    label: "Con rùa",
    category: "animal",
    image: "/flashcards/rua.png",
  },
  {
    id: "kien",
    label: "Con kiến",
    category: "animal",
    image: "/flashcards/kien.png",
    voiceUrl: "/flashcards/voices/kien.mp3",
  },
  {
    id: "tao",
    label: "Quả táo",
    category: "food",
    image: "/flashcards/tao.png",
    voiceUrl: "/flashcards/voices/tao.mp3",
  },
  {
    id: "chuoi",
    label: "Quả chuối",
    category: "food",
    image: "/flashcards/chuoi.png",
  },
  {
    id: "cam",
    label: "Quả cam",
    category: "food",
    image: "/flashcards/cam.png",
  },
  {
    id: "dua-hau",
    label: "Quả dưa hấu",
    category: "food",
    image: "/flashcards/dua-hau.png",
  },
  {
    id: "dau-tay",
    label: "Quả dâu tây",
    category: "food",
    image: "/flashcards/dau-tay.png",
    voiceUrl: "/flashcards/voices/dau-tay.mp3",
  },
  {
    id: "nho",
    label: "Quả nho",
    category: "food",
    image: "/flashcards/nho.png",
  },
  {
    id: "chanh",
    label: "Quả chanh",
    category: "food",
    image: "/flashcards/chanh.png",
    voiceUrl: "/flashcards/voices/chanh.mp3",
  },
  {
    id: "khe",
    label: "Quả khế",
    category: "food",
    image: "/flashcards/khe.png",
  },
  {
    id: "oi",
    label: "Quả ổi",
    category: "food",
    image: "/flashcards/oi.png",
    voiceUrl: "/flashcards/voices/oi.mp3",
  },
  {
    id: "ca-chua",
    label: "Quả cà chua",
    category: "food",
    image: "/flashcards/ca-chua.png",
    voiceUrl: "/flashcards/voices/ca-chua.mp3",
  },
  {
    id: "ca-rot",
    label: "Cà rốt",
    category: "food",
    image: "/flashcards/ca-rot.png",
    voiceUrl: "/flashcards/voices/ca-rot.mp3",
  },
  {
    id: "ot-chuong",
    label: "Ớt chuông",
    category: "food",
    image: "/flashcards/ot-chuong.png",
  },
  {
    id: "khoai-tay",
    label: "Khoai tây",
    category: "food",
    image: "/flashcards/khoai-tay.png",
    voiceUrl: "/flashcards/voices/khoai-tay.mp3",
  },
  {
    id: "hanh-tim",
    label: "Hành tím",
    category: "food",
    image: "/flashcards/hanh-tim.png",
  },
  {
    id: "trung",
    label: "Quả trứng",
    category: "food",
    image: "/flashcards/trung.png",
    voiceUrl: "/flashcards/voices/trung.mp3",
  },
];

export const FLASHCARD_STORAGE_KEY = "bino_user_flashcards_v1";

export function getAllDefaultFlashcards(): Flashcard[] {
  return [...basicEmotionActionFlashcards, ...dailyVocabularyFlashcards];
}

export function loadStoredFlashcards(): Flashcard[] {
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

export function saveStoredFlashcards(cards: Flashcard[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error("Failed to save stored flashcards", e);
  }
}

export function speakVietnamese(text: string) {
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

export function playFlashcardSound(card: Flashcard) {
  if (card.voiceUrl || card.soundUrl) {
    const audio = new Audio(card.voiceUrl || card.soundUrl);
    audio.play().catch(() => {
      speakVietnamese(card.label);
    });
  } else {
    speakVietnamese(card.label);
  }
}
