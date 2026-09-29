import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { FlashcardViewer } from "../components/flashcard-viewer";
import { SiteFooter } from "../components/site-footer";
import {
  type Flashcard,
  type FlashcardCategory,
  loadStoredFlashcards,
  basicEmotionActionFlashcards,
  dailyVocabularyFlashcards,
  getAllDefaultFlashcards,
} from "../lib/flashcard-data";

type SearchParams = {
  deck?: string;
};

const CATEGORY_TITLES: Record<string, { title: string; description: string; emoji: string }> = {
  animal: {
    title: "Flashcard Động vật",
    description: "Bộ sưu tập thẻ hình ảnh các con vật quen thuộc kèm tiếng kêu vui nhộn giúp bé nhận biết thế giới động vật.",
    emoji: "🐾",
  },
  emotion: {
    title: "Flashcard Cảm xúc",
    description: "Bộ thẻ giúp bé nhận biết và gọi tên các cảm xúc cơ bản như vui, buồn, khóc qua hình ảnh trực quan.",
    emoji: "😊",
  },
  action: {
    title: "Flashcard Hành động",
    description: "Bộ thẻ hình ảnh các hành động sinh hoạt hằng ngày giúp bé làm quen với hoạt động tự phục vụ.",
    emoji: "🏃",
  },
  food: {
    title: "Flashcard Thực phẩm & Trái cây",
    description: "Bộ thẻ hình ảnh các loại trái cây và rau củ giúp bé nhận biết thực phẩm hằng ngày.",
    emoji: "🍎",
  },
};

export const Route = createFileRoute("/library/flashcards")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      deck: search.deck as string | undefined,
    };
  },
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const { deck } = Route.useSearch();
  const [allStoredCards, setAllStoredCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    setAllStoredCards(loadStoredFlashcards());
  }, []);

  // Determine which cards to show based on deck param
  const validCategories: FlashcardCategory[] = ["animal", "emotion", "action", "food", "object", "other"];
  const isCategoryDeck = deck && validCategories.includes(deck as FlashcardCategory);
  const isBasicDeck = deck === "m1";

  let cards: Flashcard[];
  if (isCategoryDeck) {
    // Category-based deck: filter by category
    const category = deck as FlashcardCategory;
    cards =
      allStoredCards.length > 0
        ? allStoredCards.filter((c) => c.category === category)
        : getAllDefaultFlashcards().filter((c) => c.category === category);
  } else if (isBasicDeck) {
    // Legacy m1 deck: emotion + action
    cards =
      allStoredCards.length > 0
        ? allStoredCards.filter((c) => c.category === "emotion" || c.category === "action")
        : basicEmotionActionFlashcards;
  } else {
    // Full deck
    cards = allStoredCards.length > 0 ? allStoredCards : getAllDefaultFlashcards();
  }

  const categoryMeta = isCategoryDeck ? CATEGORY_TITLES[deck!] : null;
  const title = categoryMeta
    ? `${categoryMeta.emoji} ${categoryMeta.title}`
    : isBasicDeck
      ? "Flashcard Cảm xúc & Hành động cơ bản"
      : "Kho Flashcard Toàn diện & Luyện tập Quizlet";
  const description = categoryMeta
    ? categoryMeta.description
    : isBasicDeck
      ? "Học tập qua thẻ hình ảnh minh họa sinh động về cảm xúc và sinh hoạt hằng ngày."
      : "Học từ vựng qua hình ảnh, tiếng kêu, giọng đọc tiếng Việt và mini-game ghép thẻ.";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/library" search={{ tab: "materials" }}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại thư viện học liệu
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <FlashcardViewer cards={cards} title={title} />
      </div>

      <SiteFooter />
    </div>
  );
}
