export type AgeGroup = "0-3 tuổi" | "3-6 tuổi" | "6-12 tuổi";
export type DifficultyType =
  | "Tự kỷ (ASD)"
  | "Tăng động giảm chú ý (ADHD)"
  | "Chậm ngôn ngữ"
  | "Khó khăn học tập";
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
  articleUrl?: string;
  videoUrl?: string;
  flashcardHref?: string;
}

export const mockResources: Resource[] = [
  // Kiến thức (Knowledge)
  {
    id: "k1",
    title: "Bino Kể Chuyện: Một ngày của bé Hà",
    description:
      "Video kể chuyện trực quan giúp bé luyện chú ý, lắng nghe và làm quen với các tình huống giao tiếp đơn giản.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm ngôn ngữ", "Tự kỷ (ASD)"],
    format: "Video",
    accessLevel: "BASIC",
    imageUrl: "/images/media__1789663586867.png",
    videoUrl: "/videos/video-ke-chuyen-h264.mp4",
  },
  {
    id: "k2",
    title: "Những kỹ thuật tương tác với trẻ tăng động",
    description:
      "Trẻ tăng động thường có cường độ hoạt động cao và kém tập trung, gây khó khăn trong việc tương tác. Bài viết hướng dẫn các kỹ thuật hiệu quả dành cho phụ huynh và giáo viên: tạo môi trường phù hợp, khen ngợi hành vi kiểm soát bản thân, hỗ trợ một kèm một, xây dựng góc điều chỉnh cảm xúc, và phối hợp gia đình – nhà trường.",
    category: "Kiến thức",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tăng động giảm chú ý (ADHD)"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl:
      "https://rongviet.edu.vn/images/bai-viet/cac-hoat-dong/can-thiep-giao-duc/tham-khao/full-nhung-ky-thuat-tuong-tac-voi-tre-tang-dong-1.jpg",
    articleUrl:
      "https://rongviet.edu.vn/cac-hoat-dong/can-thiep-giao-duc/tham-khao/nhung-ky-thuat-tuong-tac-voi-tre-tang-dong",
  },
  {
    id: "k4",
    title: "Can thiệp sớm cho trẻ (Phần 2)",
    description:
      "Video hướng dẫn các chiến lược can thiệp hành vi và tương tác hiệu quả cho trẻ.",
    category: "Kiến thức",
    ageGroup: ["6-12 tuổi"],
    difficulty: ["Khó khăn học tập", "Tăng động giảm chú ý (ADHD)"],
    format: "Video",
    accessLevel: "PREMIUM",
    imageUrl:
      "https://img.youtube.com/vi/xIyesItG1ng/hqdefault.jpg",
    videoUrl: "https://youtu.be/xIyesItG1ng?si=-ntQR1gSwSC6hKL9",
  },
  {
    id: "k5",
    title: "Can thiệp sớm cho trẻ (Phần 1)",
    description:
      "Video bài học hướng dẫn phụ huynh các kỹ năng tương tác và can thiệp sớm cho trẻ tại nhà.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ"],
    format: "Video",
    accessLevel: "BASIC",
    imageUrl: "https://img.youtube.com/vi/GQcICWaAT8o/hqdefault.jpg",
    videoUrl: "https://youtu.be/GQcICWaAT8o?si=_JH9hzA08nlohSgf",
  },
  {
    id: "k6",
    title: "Cách nuôi dạy con không theo khuôn mẫu",
    description:
      "Mỗi đứa trẻ là một cá thể độc lập với nhịp độ phát triển riêng. Thay vì áp đặt, cha mẹ cần học cách tôn trọng sự khác biệt và đồng hành cùng con vượt qua khó khăn học tập.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ", "Tăng động giảm chú ý (ADHD)", "Khó khăn học tập"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
    articleUrl: "#",
  },

  // Học liệu (Materials)
  {
    id: "m1",
    title: "Flashcard Cảm xúc & Hành động cơ bản",
    description:
      "Bộ thẻ hình ảnh minh họa sinh động giúp trẻ gọi tên cảm xúc và sinh hoạt hằng ngày: vui vẻ, khóc, ăn cơm, chải tóc, mặc áo.",
    category: "Học liệu",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ"],
    format: "Hình ảnh",
    accessLevel: "BASIC",
    imageUrl: "/flashcards/vui-ve.png",
    flashcardHref: "/library/flashcards",
  },
  {
    id: "m4",
    title: "Storyboard: Nói chuyện với người khác",
    description:
      "Hình ảnh trực quan hướng dẫn trẻ cách giao tiếp lịch sự: biết lắng nghe, không cắt ngang và trả lời ngoan ngoãn.",
    category: "Học liệu",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ"],
    format: "Hình ảnh",
    accessLevel: "BASIC",
    imageUrl: "/images/media__1789663508704.png",
  },
  {
    id: "m5",
    title: "Bộ Flashcard Từ vựng hằng ngày",
    description:
      "25 thẻ hình ảnh về con vật và thực phẩm, có tiếng kêu hoặc giọng đọc để bé luyện nghe.",
    category: "Học liệu",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm ngôn ngữ", "Tự kỷ (ASD)"],
    format: "Hình ảnh",
    accessLevel: "BASIC",
    imageUrl: "/flashcards/meo.png",
    flashcardHref: "/library/flashcards",
  },
];
