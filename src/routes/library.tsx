import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { LearningLibrary } from "../components/learning-library";
import { Link } from "@tanstack/react-router";
import { SiteFooter } from "../components/site-footer";

// Simulated user state - in real app, get from auth context
const mockUser = {
  isPremium: true, // Change to false to test free user experience
};

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                <span className="text-green-600 font-semibold">👑 Premium</span>
              ) : (
                <span className="text-amber-600 font-semibold">⭐ Free User</span>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LearningLibrary userType={mockUser.isPremium ? "premium" : "free"} />
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
