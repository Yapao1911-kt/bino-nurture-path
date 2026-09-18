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
  category: ResourceCategory | ResourceCategory[];
  ageGroup: AgeGroup[];
  difficulty: DifficultyType[];
  format: FileFormat;
  accessLevel: AccessLevel;
  imageUrl: string;
  videoUrl?: string;
  flashcardHref?: string;
  externalUrl?: string;
  sourceName?: string;
  keyPoints?: string[];
}

export const mockResources: Resource[] = [
  // Kiến thức (Knowledge)
  {
    id: "k1",
    title: "Dấu hiệu nhận biết sớm tự kỷ ở trẻ",
    description:
      "Video hướng dẫn phụ huynh nhận biết các dấu hiệu sớm của rối loạn phổ tự kỷ ở trẻ nhỏ.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi"],
    difficulty: ["Tự kỷ (ASD)"],
    format: "Video",
    accessLevel: "BASIC",
    imageUrl:
      "https://images.unsplash.com/photo-1576086274488-812163351996?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "k2",
    title: "Cẩm nang xử lý cơn ăn vạ",
    description:
      "Hướng dẫn chi tiết cách xử lý khi trẻ ADHD có cơn bùng nổ cảm xúc hoặc ăn vạ nơi công cộng.",
    category: "Kiến thức",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tăng động giảm chú ý (ADHD)"],
    format: "Bài viết",
    accessLevel: "PREMIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "k3",
    title: "Phương pháp kích thích ngôn ngữ tại nhà",
    description:
      "Các kỹ thuật đơn giản cha mẹ có thể áp dụng hàng ngày để giúp trẻ chậm nói phát triển ngôn ngữ.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm ngôn ngữ"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl:
      "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "k4",
    title: "Hiểu về khó khăn học tập",
    description:
      "Video giải thích về các loại khó khăn học tập phổ biến như chứng khó đọc (Dyslexia), khó học toán.",
    category: "Kiến thức",
    ageGroup: ["6-12 tuổi"],
    difficulty: ["Khó khăn học tập"],
    format: "Video",
    accessLevel: "PREMIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
  },

  // Học liệu (Materials)
  {
    id: "m1",
    title: "Flashcard Cảm xúc cơ bản",
    description:
      "Bộ thẻ hình ảnh giúp trẻ gọi tên và nhận biết các cảm xúc cơ bản (Vui, buồn, tức giận, sợ hãi).",
    category: "Học liệu",
    ageGroup: ["3-6 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ"],
    format: "Hình ảnh",
    accessLevel: "BASIC",
    imageUrl:
      "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m2",
    title: "Bảng tính tập trung chú ý",
    description:
      "Các bài tập nối điểm, tìm đường đi trong mê cung giúp tăng cường khả năng tập trung.",
    category: "Học liệu",
    ageGroup: ["6-12 tuổi"],
    difficulty: ["Tăng động giảm chú ý (ADHD)"],
    format: "PDF",
    accessLevel: "PREMIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m3",
    title: "Thẻ PECS Lịch trình sinh hoạt",
    description:
      "Bộ thẻ giao tiếp trao đổi hình ảnh (PECS) hỗ trợ trẻ xây dựng lịch trình đánh răng, đi ngủ, ăn uống.",
    category: "Học liệu",
    ageGroup: ["3-6 tuổi", "0-3 tuổi"],
    difficulty: ["Tự kỷ (ASD)", "Chậm ngôn ngữ"],
    format: "PDF",
    accessLevel: "PREMIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1616035987010-09c3143c9db6?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m4",
    title: "Storyboard Kỹ năng xã hội",
    description:
      "Câu chuyện xã hội (Social Story) dạng hình ảnh hướng dẫn cách xếp hàng và chia sẻ đồ chơi.",
    category: "Học liệu",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tự kỷ (ASD)"],
    format: "Hình ảnh",
    accessLevel: "BASIC",
    imageUrl:
      "https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m-vitreemkhuyettat-182",
    title: "Các dạng khuyết tật ở trẻ: Biểu hiện và hướng can thiệp",
    description:
      "Tổng quan 6 dạng khuyết tật ở trẻ theo quy định hiện hành (vận động, nghe nói, thị giác, thần kinh - tâm thần, trí tuệ), dấu hiệu nhận biết sớm và phương pháp can thiệp phục hồi chức năng giúp trẻ hòa nhập cộng đồng.",
    category: "Học liệu",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Khó khăn học tập", "Chậm ngôn ngữ", "Tự kỷ (ASD)"],
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
    category: "Học liệu",
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
    category: "Học liệu",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Chậm ngôn ngữ", "Khó khăn học tập", "Tự kỷ (ASD)"],
    format: "PDF",
    accessLevel: "BASIC",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop",
    sourceName: "Bộ Y tế & Ủy ban Y tế Hà Lan - Việt Nam (MCNV)",
    keyPoints: [
      "Bảng chuẩn mốc phát triển thần kinh - vận động và ngôn ngữ - giao tiếp trẻ em từ 1 tháng đến 15 tuổi.",
      "7 bài tập vận động trị liệu chuẩn: Xoa bóp cơ tay/chân/thân, tạo thuận nâng đầu, tập lẫy, giữ thăng bằng ngồi, tập bò trên đùi, ngồi xổm và đứng bám có trợ giúp.",
      "Hoạt động trị liệu sinh hoạt: Chia nhỏ quy trình thành 5 bước (ví dụ: mặc áo, đi dép, xúc thìa ăn cơm) giúp trẻ rèn tính tự lập.",
      "Kích thích giao tiếp sớm: Rèn phản xạ nhìn/nghe, kỹ năng 'bắt chước & lần lượt' (chơi ú oà, lăn bóng, chơi giả vờ), học từ vựng qua cặp thẻ tranh đối lập.",
    ],
  },
];
