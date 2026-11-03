import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ResourceCard } from "./resource-card";
import { FlashcardLibrary } from "./flashcard-library";
import { Filter, SearchX, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type LibraryTab = "Kiến thức" | "Học liệu";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: LibraryTab | LibraryTab[];
  ageGroup: string[];
  difficulty: string[];
  format: string;
  accessLevel: "BASIC" | "PREMIUM";
  imageUrl: string;
  videoUrl?: string;
  flashcardHref?: string;
  externalUrl?: string;
  sourceName?: string;
  keyPoints?: string[];
}

const allResources: Resource[] = [
  {
    id: "k-video-can-thiep-som-bino",
    title: "Video hướng dẫn thực hành can thiệp sớm cho bé",
    description:
      "Video tài liệu trực quan hướng dẫn phụ huynh và giáo viên các kỹ thuật tương tác, trò chơi phát triển kỹ năng giao tiếp và chú ý chung cho trẻ.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Chậm nói / Chậm ngôn ngữ", "Rối loạn phổ tự kỷ (ASD)", "Tăng động giảm chú ý (ADHD)"],
    format: "Video",
    accessLevel: "BASIC",
    imageUrl: "/language-delay-1.png",
    videoUrl: "/videos/video-thuc-hanh-can-thiep-som.mp4",
    sourceName: "Chương trình can thiệp sớm Bino",
    keyPoints: [
      "Kỹ thuật tương tác và thu hút sự chú ý chung (Joint Attention) qua trò chơi tự nhiên.",
      "Cách làm mẫu ngôn ngữ, nói chậm rõ ràng và tạo khoảng dừng để trẻ chủ động phản hồi.",
      "Rèn luyện kỹ năng vận động và tương tác tích cực không gây áp lực cho bé.",
    ],
  },
  {
    id: "k1",
    title: "Video kể chuyện tương tác cho bé",
    description:
      "Video kể chuyện trực quan giúp bé luyện chú ý, lắng nghe và làm quen với các tình huống giao tiếp đơn giản.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm nói / Chậm ngôn ngữ", "Rối loạn phổ tự kỷ (ASD)"],
    format: "Video",
    accessLevel: "BASIC",
    imageUrl: "/bino-ai-mascot.png",
    videoUrl: "/videos/video-ke-chuyen-h264.mp4",
  },
  {
    id: "m-vitreemkhuyettat-182",
    title: "Các dạng khuyết tật ở trẻ: Biểu hiện và hướng can thiệp",
    description:
      "Tổng quan 6 dạng khuyết tật ở trẻ theo quy định hiện hành (vận động, nghe nói, thị giác, thần kinh - tâm thần, trí tuệ), dấu hiệu nhận biết sớm và phương pháp can thiệp phục hồi chức năng giúp trẻ hòa nhập cộng đồng.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Chậm phát triển trí tuệ", "Chậm nói / Chậm ngôn ngữ", "Rối loạn phổ tự kỷ (ASD)"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "https://vitreemkhuyettat.org/qvtekt/Upload/news/cac-dang-khuyet-tat-o-tre-1.jpg",
    externalUrl:
      "https://vitreemkhuyettat.org/cac-dang-khuyet-tat-o-tre-bieu-hien-va-huong-can-thiep-182.html",
    sourceName: "Quỹ Vì Trẻ Em Khuyết Tật Việt Nam",
    keyPoints: [
      "Quy định 6 dạng khuyết tật chính: Vận động, nghe - nói, thị giác, thần kinh - tâm thần, trí tuệ và khuyết tật khác.",
      "Thực trạng tại Việt Nam: Tỷ lệ khuyết tật ở trẻ là 2,74% (2-4 tuổi) và 2,81% (5-17 tuổi); tỷ lệ phát hiện muộn còn cao do thiếu công cụ chuyên môn.",
      "Dấu hiệu cảnh báo sớm: Trẻ chậm phản xạ với lời nói/âm thanh, khó khăn trong vận động thô và tinh, chậm phát triển ngôn ngữ so với mốc tuổi.",
      "Phương hướng can thiệp: Kết hợp phục hồi chức năng y học, can thiệp tâm lý - giáo dục đặc biệt và thúc đẩy môi trường giáo dục hòa nhập.",
    ],
  },
  {
    id: "m-rongviet-tangdong",
    title: "Những kỹ thuật tương tác với trẻ tăng động",
    description:
      "Cẩm nang kỹ thuật thực hành cho cha mẹ và thầy cô: xây dựng môi trường học tập linh hoạt, khen ngợi tự kiểm soát, hỗ trợ 1 kèm 1 và cơ chế phối hợp chặt chẽ gia đình - nhà trường.",
    category: "Kiến thức",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tăng động giảm chú ý (ADHD)"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl:
      "https://rongviet.edu.vn/images/bai-viet/cac-hoat-dong/can-thiep-giao-duc/tham-khao/full-nhung-ky-thuat-tuong-tac-voi-tre-tang-dong-1.jpg",
    externalUrl:
      "https://rongviet.edu.vn/cac-hoat-dong/can-thiep-giao-duc/tham-khao/nhung-ky-thuat-tuong-tac-voi-tre-tang-dong",
    sourceName: "RongViet Education (Rồng Việt)",
    keyPoints: [
      "1. Môi trường học tập phù hợp: Giao việc có tính kích thích cao, cho phép di chuyển linh hoạt mỗi 15 phút, sắp xếp chỗ ngồi gần người dạy để giảm xao nhãng.",
      "2. Kỹ thuật tương tác: Khen ngợi nỗ lực tự kiểm soát, hỗ trợ cá nhân 1-kèm-1 khi bắt đầu nhiệm vụ, gọi tên trẻ thường xuyên, dùng tín hiệu chạm vai để chuyển hướng chú ý.",
      "3. Thích ứng đặc điểm trẻ: Đa dạng hóa các hoạt động, cho phép sử dụng bàn phím thay viết tay, rút ngắn bài tập, thiết kế 'góc điều chỉnh' yên tĩnh giúp trẻ tự xoa dịu.",
      "4. Phối hợp gia đình - nhà trường: Ngăn ngừa trêu chọc trong lớp học, trao đổi thông tin định kỳ qua email/sổ liên lạc, tổ chức nhóm kỹ năng xã hội bạn bè.",
    ],
  },
  {
    id: "m-byt-phcn-14",
    title: "Tài liệu số 14: Phục hồi chức năng trẻ chậm phát triển trí tuệ",
    description:
      "Cẩm nang chuyên sâu của Bộ Y tế về PHCN dựa vào cộng đồng: hướng dẫn theo dõi bảng mốc phát triển 0-15 tuổi, 7 bài tập vận động trị liệu, hoạt động trị liệu tự phục vụ và kỹ thuật giao tiếp sớm.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Chậm nói / Chậm ngôn ngữ", "Chậm phát triển trí tuệ", "Rối loạn phổ tự kỷ (ASD)"],
    format: "PDF",
    accessLevel: "BASIC",
    imageUrl: "/intellectual-disability.png",
    sourceName: "Bộ Y tế & Ủy ban Y tế Hà Lan - Việt Nam (MCNV)",
    keyPoints: [
      "Bảng chuẩn mốc phát triển thần kinh - vận động và ngôn ngữ - giao tiếp trẻ em từ 1 tháng đến 15 tuổi.",
      "7 bài tập vận động trị liệu chuẩn: Xoa bóp cơ tay/chân/thân, tạo thuận nâng đầu, tập lẫy, giữ thăng bằng ngồi, tập bò trên đùi, ngồi xổm và đứng bám có trợ giúp.",
      "Hoạt động trị liệu sinh hoạt: Chia nhỏ quy trình thành 5 bước (ví dụ: mặc áo, đi dép, xúc thìa ăn cơm) giúp trẻ rèn tính tự lập.",
      "Kích thích giao tiếp sớm: Rèn phản xạ nhìn/nghe, kỹ năng 'bắt chước & lần lượt' (chơi ú oà, lăn bóng, chơi giả vờ), học từ vựng qua cặp thẻ tranh đối lập.",
    ],
  },
  {
    id: "new-1",
    title: "Cách nhận biết bệnh down ở trẻ sơ sinh mà mẹ cần lưu ý",
    description: "Những thông tin cơ bản và các dấu hiệu nhận biết sớm hội chứng Down ở trẻ sơ sinh và thai nhi, giúp cha mẹ có sự chuẩn bị tốt nhất.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi"],
    difficulty: ["Hội chứng Down"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "/down-syndrome.png",
    externalUrl: "https://hellobacsi.com/nuoi-day-con/nhi-khoa/roi-loan-hanh-vi-phat-trien/tim-hieu-hoi-chung-down-o-thai-nhi/",
    sourceName: "Hello Bacsi",
    keyPoints: [
      "Tổng quan về hội chứng Down và nguyên nhân do dư thừa NST số 21.",
      "Dấu hiệu nhận biết sớm qua siêu âm thai kỳ và các xét nghiệm tầm soát.",
      "Đặc điểm thể chất của trẻ sơ sinh mắc hội chứng Down (Khuôn mặt, trương lực cơ).",
      "Lời khuyên về can thiệp sớm và cách chăm sóc đặc biệt."
    ],
  },
  {
    id: "new-2",
    title: "CÁCH DẠY TRẺ CHẬM PHÁT TRIỂN NGÔN NGỮ CHA MẸ NÊN BIẾT",
    description: "Cẩm nang hướng dẫn cha mẹ các phương pháp tiếp cận và tương tác để giúp trẻ phát triển khả năng ngôn ngữ một cách tự nhiên và hiệu quả.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm nói / Chậm ngôn ngữ"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "/language-delay-1.png",
    externalUrl: "https://tamanhhospital.vn/cach-day-tre-cham-phat-trien-ngon-ngu/",
    sourceName: "Bệnh viện Tâm Anh",
    keyPoints: [
      "Nguyên tắc dạy trẻ chậm nói: Trò chuyện thường xuyên, sử dụng ngôn ngữ cơ thể và tạo môi trường giao tiếp tích cực.",
      "Kết hợp chơi và học: Các trò chơi tương tác như giả vờ, hát, đọc sách giúp trẻ ghi nhớ từ vựng dễ hơn.",
      "Tầm quan trọng của việc hạn chế thiết bị điện tử.",
      "Vai trò của chuyên gia ngôn ngữ trị liệu."
    ],
  },
  {
    id: "new-3",
    title: "Bài tập dạy trẻ chậm nói tại nhà",
    description: "Tổng hợp các bài tập thực hành đơn giản và dễ áp dụng tại nhà giúp cha mẹ rèn luyện kỹ năng phát âm và giao tiếp cho trẻ.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm nói / Chậm ngôn ngữ"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "/language-delay-2.png",
    externalUrl: "https://ngaymoiedu.com/bai-viet/bai-tap-day-tre-cham-noi-tai-nha.html",
    sourceName: "Ngày Mới Education",
    keyPoints: [
      "Bài tập luyện cơ quan phát âm: Mát xa cơ miệng, tập thổi bong bóng, chu môi.",
      "Bài tập bắt chước âm thanh: Tiếng kêu con vật, tiếng còi xe.",
      "Bài tập chỉ tay và gọi tên đồ vật xung quanh.",
      "Bài tập phát triển vốn từ qua tranh ảnh và hoạt động hàng ngày."
    ],
  },
  {
    id: "new-4",
    title: "Phục hồi chức năng trẻ chậm phát triển trí tuệ",
    description: "Tài liệu chuyên môn chi tiết hướng dẫn phương pháp phục hồi chức năng và giáo dục đặc biệt dành cho trẻ chậm phát triển trí tuệ.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Chậm phát triển trí tuệ"],
    format: "PDF",
    accessLevel: "BASIC",
    imageUrl: "/intellectual-disability.png",
    externalUrl: "https://caritasvietnam.org/datafiles/files/1591167191_14_phcn_tre-cham-phat-trien-tri-tue.pdf",
    sourceName: "Caritas Việt Nam",
    keyPoints: [
      "Đánh giá mức độ chậm phát triển trí tuệ.",
      "Kế hoạch can thiệp cá nhân hóa (IEP) cho trẻ.",
      "Kỹ năng tự phục vụ, giao tiếp và xã hội.",
      "Hỗ trợ tâm lý cho gia đình và trẻ."
    ],
  },
  {
    id: "new-5",
    title: "Đặc điểm của ngôn ngữ ký hiệu Việt Nam",
    description: "Tìm hiểu về ngôn ngữ ký hiệu, một công cụ giao tiếp quan trọng hỗ trợ trẻ khiếm thính và trẻ gặp khó khăn trong ngôn ngữ nói.",
    category: "Kiến thức",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Chậm nói / Chậm ngôn ngữ"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "/sign-language.png",
    externalUrl: "https://donghanhviet.vn/dac-diem-cua-ngon-ngu-ky-hieu-viet-nam/",
    sourceName: "Đồng Hành Việt",
    keyPoints: [
      "Sự phong phú và đa dạng của ngôn ngữ ký hiệu theo từng vùng miền.",
      "Cấu trúc ngữ pháp cơ bản của ngôn ngữ ký hiệu Việt Nam.",
      "Lợi ích của ngôn ngữ ký hiệu trong việc phát triển tư duy.",
      "Khuyến khích giao tiếp phi ngôn ngữ kết hợp biểu cảm khuôn mặt."
    ],
  }
];

interface LearningLibraryProps {
  initialTab?: LibraryTab;
  userType: "free" | "premium";
  userEmail?: string;
}

export function LearningLibrary({ initialTab = "Kiến thức", userType }: LearningLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
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
    setSearchQuery("");
  };

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      const matchCategory = Array.isArray(resource.category)
        ? resource.category.includes(activeTab)
        : resource.category === activeTab;
      if (!matchCategory) return false;
      if (ageFilter !== "all" && !resource.ageGroup.includes(ageFilter)) return false;
      if (difficultyFilter !== "all" && !resource.difficulty.includes(difficultyFilter))
        return false;
      if (formatFilter !== "all" && resource.format !== formatFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = resource.title.toLowerCase().includes(q);
        const matchDesc = resource.description.toLowerCase().includes(q);
        const matchSource = resource.sourceName?.toLowerCase().includes(q);
        const matchKeyPoints = resource.keyPoints?.some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSource && !matchKeyPoints) return false;
      }
      return true;
    });
  }, [activeTab, ageFilter, difficultyFilter, formatFilter, searchQuery]);

  const activeFilterCount = [
    ageFilter !== "all",
    difficultyFilter !== "all",
    formatFilter !== "all",
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as LibraryTab)}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-[480px] grid-cols-2 mb-6 h-12 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <TabsTrigger
            value="Kiến thức"
            className="rounded-xl font-bold transition-all data-[state=active]:bg-[#7274ED] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            📚 Thư viện Kiến thức ({allResources.length})
          </TabsTrigger>
          <TabsTrigger
            value="Học liệu"
            className="rounded-xl font-bold transition-all data-[state=active]:bg-[#1FA7E1] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            🎯 Thư viện Học liệu (Flashcard)
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: THƯ VIỆN KIẾN THỨC (Bài viết, cẩm nang, tài liệu chuyên môn, video) */}
        <TabsContent key="Kiến thức" value="Kiến thức" className="mt-0 outline-none space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Filter className="w-4 h-4 text-[#7274ED]" />
                Bộ lọc & Tìm kiếm bài viết kiến thức
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

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết, tài liệu y khoa, kỹ thuật can thiệp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 bg-slate-50 border-slate-200 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
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
                  <SelectItem value="Rối loạn phổ tự kỷ (ASD)">Rối loạn phổ tự kỷ (ASD)</SelectItem>
                  <SelectItem value="Tăng động giảm chú ý (ADHD)">Tăng động giảm chú ý (ADHD)</SelectItem>
                  <SelectItem value="Chậm nói / Chậm ngôn ngữ">Chậm nói / Chậm ngôn ngữ</SelectItem>
                  <SelectItem value="Chậm phát triển trí tuệ">Chậm phát triển trí tuệ</SelectItem>
                  <SelectItem value="Hội chứng Down">Hội chứng Down</SelectItem>
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
                </SelectContent>
              </Select>
            </div>
          </div>

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

        {/* Tab 2: THƯ VIỆN HỌC LIỆU (Chuyên biệt Flashcard với đầy đủ Thêm/Sửa/Xoá/Tạo) */}
        <TabsContent key="Học liệu" value="Học liệu" className="mt-0 outline-none">
          <FlashcardLibrary />
        </TabsContent>
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
