import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { LearningLibrary } from "../components/learning-library";
import { SiteFooter } from "../components/site-footer";

const mockUser = {
  isPremium: true,
};

export const Route = createFileRoute("/library/")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: search.tab === "materials" ? "materials" : undefined,
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { tab } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div className="text-xs text-muted-foreground">
              {mockUser.isPremium ? (
                <span className="text-[#75D06A] font-bold">👑 Premium</span>
              ) : (
                <span className="text-[#FFB365] font-bold">⭐ Free User</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Thư viện Học liệu</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Khám phá các tài nguyên giáo dục được thiết kế để hỗ trợ phát triển của con bạn
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LearningLibrary
          initialTab={tab === "materials" ? "Học liệu" : "Kiến thức"}
          userType={mockUser.isPremium ? "premium" : "free"}
        />
      </div>

      <SiteFooter />
    </div>
  );
}
