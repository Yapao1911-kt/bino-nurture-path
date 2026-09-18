import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create mock resources
  const resources = [
    {
      id: "k1",
      title: "Dấu hiệu nhận biết sớm tự kỷ ở trẻ",
      description:
        "Video hướng dẫn phụ huynh nhận biết các dấu hiệu sớm của rối loạn phổ tự kỷ ở trẻ nhỏ.",
      category: "Kiến thức",
      ageGroup: JSON.stringify(["0-3 tuổi"]),
      difficulty: JSON.stringify(["Tự kỷ (ASD)"]),
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
      ageGroup: JSON.stringify(["3-6 tuổi", "6-12 tuổi"]),
      difficulty: JSON.stringify(["Tăng động giảm chú ý (ADHD)"]),
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
      ageGroup: JSON.stringify(["0-3 tuổi", "3-6 tuổi"]),
      difficulty: JSON.stringify(["Chậm ngôn ngữ"]),
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
      ageGroup: JSON.stringify(["6-12 tuổi"]),
      difficulty: JSON.stringify(["Khó khăn học tập"]),
      format: "Video",
      accessLevel: "PREMIUM",
      imageUrl:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "m1",
      title: "Flashcard Cảm xúc cơ bản",
      description:
        "Bộ thẻ hình ảnh giúp trẻ gọi tên và nhận biết các cảm xúc cơ bản (Vui, buồn, tức giận, sợ hãi).",
      category: "Học liệu",
      ageGroup: JSON.stringify(["3-6 tuổi"]),
      difficulty: JSON.stringify(["Tự kỷ (ASD)", "Chậm ngôn ngữ"]),
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
      ageGroup: JSON.stringify(["6-12 tuổi"]),
      difficulty: JSON.stringify(["Tăng động giảm chú ý (ADHD)"]),
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
      ageGroup: JSON.stringify(["3-6 tuổi", "0-3 tuổi"]),
      difficulty: JSON.stringify(["Tự kỷ (ASD)", "Chậm ngôn ngữ"]),
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
      ageGroup: JSON.stringify(["3-6 tuổi", "6-12 tuổi"]),
      difficulty: JSON.stringify(["Tự kỷ (ASD)"]),
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
      ageGroup: JSON.stringify(["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"]),
      difficulty: JSON.stringify(["Khó khăn học tập", "Chậm ngôn ngữ", "Tự kỷ (ASD)"]),
      format: "Bài viết",
      accessLevel: "BASIC",
      imageUrl: "https://vitreemkhuyettat.org/qvtekt/Upload/news/cac-dang-khuyet-tat-o-tre-1.jpg",
    },
    {
      id: "m-rongviet-tangdong",
      title: "Những kỹ thuật tương tác với trẻ tăng động",
      description:
        "Cẩm nang kỹ thuật thực hành cho cha mẹ và thầy cô: xây dựng môi trường học tập linh hoạt, khen ngợi tự kiểm soát, hỗ trợ 1 kèm 1 và cơ chế phối hợp chặt chẽ gia đình - nhà trường.",
      category: "Học liệu",
      ageGroup: JSON.stringify(["3-6 tuổi", "6-12 tuổi"]),
      difficulty: JSON.stringify(["Tăng động giảm chú ý (ADHD)"]),
      format: "Bài viết",
      accessLevel: "BASIC",
      imageUrl:
        "https://rongviet.edu.vn/images/bai-viet/cac-hoat-dong/can-thiep-giao-duc/tham-khao/full-nhung-ky-thuat-tuong-tac-voi-tre-tang-dong-1.jpg",
    },
    {
      id: "m-byt-phcn-14",
      title: "Tài liệu số 14: Phục hồi chức năng trẻ chậm phát triển trí tuệ",
      description:
        "Cẩm nang chuyên sâu của Bộ Y tế về PHCN dựa vào cộng đồng: hướng dẫn theo dõi bảng mốc phát triển 0-15 tuổi, 7 bài tập vận động trị liệu, hoạt động trị liệu tự phục vụ và kỹ thuật giao tiếp sớm.",
      category: "Học liệu",
      ageGroup: JSON.stringify(["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"]),
      difficulty: JSON.stringify(["Chậm ngôn ngữ", "Khó khăn học tập", "Tự kỷ (ASD)"]),
      format: "PDF",
      accessLevel: "BASIC",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop",
    },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: resource,
      create: resource,
    });
  }

  // Create mock users
  await prisma.user.upsert({
    where: { email: "free@example.com" },
    update: {},
    create: {
      email: "free@example.com",
      name: "Free User",
      subscription: "FREE",
    },
  });

  await prisma.user.upsert({
    where: { email: "premium@example.com" },
    update: {},
    create: {
      email: "premium@example.com",
      name: "Premium User",
      subscription: "PREMIUM",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
