import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "../components/ui/button";
import { FlashcardViewer } from "../components/flashcard-viewer";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/library/flashcards")({
  component: FlashcardsPage,
});

function FlashcardsPage() {
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
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Flashcard Từ vựng
              </h1>
              <p className="text-muted-foreground mt-1">
                Học từ vựng qua hình ảnh — con vật có tiếng kêu, thực phẩm để
                phụ huynh đọc
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <FlashcardViewer />
      </div>

      <SiteFooter />
    </div>
  );
}
