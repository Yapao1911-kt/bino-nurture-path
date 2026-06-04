export type AgeGroup = "0-3 tuổi" | "3-6 tuổi" | "6-12 tuổi";
export type DifficultyType = "Tự kỷ (ASD)" | "Tăng động giảm chú ý (ADHD)" | "Chậm ngôn ngữ" | "Khó khăn học tập";
export type FileFormat = "Video" | "Bài viết" | "PDF" | "Hình ảnh";
export type ResourceCategory = "Kiến thức" | "Học liệu";
export type AccessLevel = "BASIC" | "PREMIUM";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  ageGroup: AgeGroup[];
  difficulty: DifficultyType[];
  format: FileFormat;
  accessLevel: AccessLevel;
  imageUrl: string;
}

export const mockResources: Resource[] = [
  // Kiến thức (Knowledge)
  {
    id: "k1",
    title: "Dấu hiệu nhận biết sớm tự kỷ ở trẻ",
    description: "Video hướng dẫn phụ huynh nhận biết các dấu hiệu sớm của rối loạn phổ tự kỷ ở trẻ nhỏ.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi"],
    difficulty: ["Tự kỷ (ASD)"],
    format: "Video",
    accessLevel: "BASIC",
    imageUrl: "https://images.unsplash.com/photo-1576086274488-812163351996?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "k2",
    title: "Cẩm nang xử lý cơn ăn vạ",
    description: "Hướng dẫn chi tiết cách xử lý khi trẻ ADHD có cơn bùng nổ cảm xúc hoặc ăn vạ nơi công cộng.",
    category: "Kiến thức",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tăng động giảm chú ý (ADHD)"],
    format: "Bài viết",
    accessLevel: "PREMIUM",
    imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "k3",
    title: "Phương pháp kích thích ngôn ngữ tại nhà",
    description: "Các kỹ thuật đơn giản cha mẹ có thể áp dụng hàng ngày để giúp trẻ chậm nói phát triển ngôn ngữ.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm ngôn ngữ"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "k4",
    title: "Hiểu về khó khăn học tập",
    description: "Video giải thích về các loại khó khăn học tập phổ biến như chứng khó đọc (Dyslexia), khó học toán.",
    category: "Kiến thức",
    ageGroup: ["6-12 tuổi"],
    difficulty: ["Khó khăn học tập"],
    format: "Video",
    accessLevel: "PREMIUM",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
  },

  // Học liệu (Materials)
  {
    id: "m1",
    title: "Flashcard Cảm xúc cơ bản",
    description: "Bộ thẻ hình ảnh giúp trẻ gọi tên và nhận biết các cảm xúc cơ bản (Vui, buồn, tức giận, sợ hãi).",
    category: "Học liệu",
    ageGroup: ["3-6 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ"],
    format: "Hình ảnh",
    accessLevel: "BASIC",
    imageUrl: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m2",
    title: "Bảng tính tập trung chú ý",
    description: "Các bài tập nối điểm, tìm đường đi trong mê cung giúp tăng cường khả năng tập trung.",
    category: "Học liệu",
    ageGroup: ["6-12 tuổi"],
    difficulty: ["Tăng động giảm chú ý (ADHD)"],
    format: "PDF",
    accessLevel: "PREMIUM",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m3",
    title: "Thẻ PECS Lịch trình sinh hoạt",
    description: "Bộ thẻ giao tiếp trao đổi hình ảnh (PECS) hỗ trợ trẻ xây dựng lịch trình đánh răng, đi ngủ, ăn uống.",
    category: "Học liệu",
    ageGroup: ["3-6 tuổi", "0-3 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ"],
    format: "PDF",
    accessLevel: "PREMIUM",
    imageUrl: "https://images.unsplash.com/photo-1616035987010-09c3143c9db6?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m4",
    title: "Storyboard Kỹ năng xã hội",
    description: "Câu chuyện xã hội (Social Story) dạng hình ảnh hướng dẫn cách xếp hàng và chia sẻ đồ chơi.",
    category: "Học liệu",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tự kỷ (ASD)"],
    format: "Hình ảnh",
    accessLevel: "BASIC",
    imageUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=600&auto=format&fit=crop",
  }
];
