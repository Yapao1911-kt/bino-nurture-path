import { createServerFn } from "@tanstack/react-start";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hàm mô phỏng lấy user hiện tại (trong thực tế sẽ lấy từ session/cookie)
const getCurrentUser = async (userEmail: string = "free@example.com") => {
  return await prisma.user.findUnique({
    where: { email: userEmail },
  });
};

export const getResourcesFn = createServerFn({ method: "GET" })
  .validator((data: { category: string; ageGroup?: string; difficulty?: string; format?: string; userEmail?: string }) => data)
  .handler(async ({ data }) => {
    const { category, ageGroup, difficulty, format, userEmail } = data;

    // Build Prisma query
    const where: any = { category };

    if (ageGroup && ageGroup !== "all") {
      where.ageGroup = { contains: ageGroup };
    }
    
    if (difficulty && difficulty !== "all") {
      where.difficulty = { contains: difficulty };
    }
    
    if (format && format !== "all") {
      where.format = format;
    }

    const resources = await prisma.resource.findMany({ where });

    // Trả về kèm thông tin user (để frontend xử lý khóa tài nguyên)
    const user = await getCurrentUser(userEmail || "free@example.com");

    return {
      resources: resources.map(res => ({
        ...res,
        // Chuyển JSON string trở lại mảng cho Frontend dễ dùng
        ageGroup: JSON.parse(res.ageGroup),
        difficulty: JSON.parse(res.difficulty)
      })),
      userType: user?.subscription === "PREMIUM" ? "premium" : "free",
    };
  });
