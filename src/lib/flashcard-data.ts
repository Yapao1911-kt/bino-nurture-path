export type FlashcardCategory = "animal" | "food";

export interface Flashcard {
  id: string;
  label: string;
  category: FlashcardCategory;
  image: string;
  /** Onomatopoeia shown on card, e.g. "Meo meo!" */
  soundText?: string;
  /** Optional audio clip URL */
  soundUrl?: string;
  /** Optional recorded pronunciation URL */
  voiceUrl?: string;
}

export const dailyVocabularyFlashcards: Flashcard[] = [
  {
    id: "meo",
    label: "Con mèo",
    category: "animal",
    image: "/flashcards/meo.png",
    soundText: "Meo meo!",
    soundUrl: "/flashcards/sounds/meo.mp3",
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
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/682/682-preview.mp3",
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
  },
  {
    id: "tao",
    label: "Quả táo",
    category: "food",
    image: "/flashcards/tao.png",
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
  },
  {
    id: "ca-chua",
    label: "Quả cà chua",
    category: "food",
    image: "/flashcards/ca-chua.png",
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
  },
];
