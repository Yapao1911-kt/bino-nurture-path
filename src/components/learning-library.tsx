import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ResourceCard } from "./resource-card";
import { Filter, SearchX } from "lucide-react";
import { Button } from "./ui/button";
import { mockResources, type ResourceCategory } from "../lib/mock-data";

type LibraryTab = ResourceCategory;

interface LearningLibraryProps {
  initialTab?: LibraryTab;
  userType: "free" | "premium";
  userEmail?: string;
}

export function LearningLibrary({ initialTab = "Kiến thức", userType }: LearningLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);
  const [ageFilter, setAgeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const clearFilters = () => {
    setAgeFilter("all");
    setDifficultyFilter("all");
    setFormatFilter("all");
  };

  const filteredResources = useMemo(() => {
    return mockResources.filter((resource) => {
      if (resource.category !== activeTab) return false;
      if (ageFilter !== "all" && !resource.ageGroup.includes(ageFilter)) return false;
      if (difficultyFilter !== "all" && !resource.difficulty.includes(difficultyFilter))
        return false;
      if (formatFilter !== "all" && resource.format !== formatFilter) return false;
      return true;
    });
  }, [activeTab, ageFilter, difficultyFilter, formatFilter]);

  const activeFilterCount = [ageFilter, difficultyFilter, formatFilter].filter(
    (f) => f !== "all",
  ).length;

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Filter className="w-4 h-4" />
            Bộ lọc tài liệu
            {activeFilterCount > 0 && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
              Xóa bộ lọc
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Độ tuổi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả độ tuổi</SelectItem>
              <SelectItem value="0-3 tuổi">0-3 tuổi</SelectItem>
              <SelectItem value="3-6 tuổi">3-6 tuổi</SelectItem>
              <SelectItem value="6-12 tuổi">6-12 tuổi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Loại khó khăn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vấn đề</SelectItem>
              <SelectItem value="Tự kỷ (ASD)">Tự kỷ (ASD)</SelectItem>
              <SelectItem value="Tăng động giảm chú ý (ADHD)">
                Tăng động giảm chú ý (ADHD)
              </SelectItem>
              <SelectItem value="Chậm ngôn ngữ">Chậm ngôn ngữ</SelectItem>
              <SelectItem value="Khó khăn học tập">Khó khăn học tập</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Định dạng tệp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả định dạng</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Bài viết">Bài viết</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="Hình ảnh">Hình ảnh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as LibraryTab)}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-[420px] grid-cols-2 mb-6">
          <TabsTrigger value="Kiến thức">Thư viện Kiến thức</TabsTrigger>
          <TabsTrigger value="Học liệu">Thư viện Học liệu</TabsTrigger>
        </TabsList>

        {(["Kiến thức", "Học liệu"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0 outline-none">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} userType={userType} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-lg border border-dashed">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Không tìm thấy tài liệu</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        Thử thay đổi hoặc xóa bớt các bộ lọc để xem thêm tài nguyên có sẵn trong thư viện.
      </p>
    </div>
  );
}
