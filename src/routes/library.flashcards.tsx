import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "../components/ui/button";
import { FlashcardViewer } from "../components/flashcard-viewer";
import { SiteFooter } from "../components/site-footer";
import { basicEmotionActionFlashcards, dailyVocabularyFlashcards } from "../lib/flashcard-data";

type SearchParams = {
  deck?: string;
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

  const isBasicDeck = deck === "m1";
  const cards = isBasicDeck ? basicEmotionActionFlashcards : dailyVocabularyFlashcards;
  const title = isBasicDeck
    ? "Flashcard Cảm xúc & Hành động cơ bản"
    : "Bộ Flashcard Từ vựng hằng ngày";
  const description = isBasicDeck
    ? "Học tập qua thẻ hình ảnh minh họa sinh động về cảm xúc và sinh hoạt hằng ngày."
    : "Học từ vựng qua hình ảnh, tiếng kêu và giọng đọc để bé luyện nghe.";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/library" search={{ tab: "materials" }}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại thư viện
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
