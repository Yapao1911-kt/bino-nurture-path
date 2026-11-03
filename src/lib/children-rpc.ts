import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./db";

export interface ChildData {
  id: string;
  userId: string;
  name: string;
  age: number;
  dateOfBirth?: string | null;
  condition?: string | null;
  developmentalChallenges: string[];
  communicationLevel?: string | null;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export const saveChildProfile = createServerFn({ method: "POST" })
  .validator(
    (data: {
      userId?: string;
      userEmail?: string;
      name: string;
      age: number;
      condition?: string;
      developmentalChallenges?: string[];
      communicationLevel?: string;
      avatar?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const { userId, userEmail, name, age, condition, developmentalChallenges, communicationLevel, avatar } = data;

      if (!name || !name.trim()) {
        return { success: false, error: "Vui lòng nhập tên của trẻ." };
      }

      if (age === undefined || age === null || isNaN(age) || age < 0 || age > 18) {
        return { success: false, error: "Tuổi của trẻ phải từ 0 đến 18 tuổi." };
      }

      // Tìm user trong database
      let targetUser = null;
      if (userId) {
        targetUser = await prisma.user.findUnique({ where: { id: userId } });
      }
      if (!targetUser && userEmail) {
        targetUser = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase().trim() } });
      }

      if (!targetUser) {
        // Lấy user đầu tiên hoặc tạo hồ sơ dự phòng nếu chưa có ID
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          targetUser = firstUser;
        } else {
          return {
            success: false,
            error: "Không tìm thấy thông tin tài khoản đăng nhập. Vui lòng đăng nhập lại.",
          };
        }
      }

      const challenges = developmentalChallenges && developmentalChallenges.length > 0
        ? developmentalChallenges
        : [condition || "Phát triển bình thường"];

      // Tính ngày sinh ước lượng từ tuổi
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - Number(age);
      const dob = new Date(birthYear, 0, 1);

      // Random avatar đáng yêu nếu chưa có
      const defaultAvatars = ["🌻", "🍅", "🎃", "⭐", "🐰", "🐻", "🦁"];
      const chosenAvatar = avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

      const created = await prisma.child.create({
        data: {
          userId: targetUser.id,
          name: name.trim(),
          age: Number(age),
          dateOfBirth: dob,
          condition: condition || "Phát triển bình thường",
          developmentalChallenges: challenges,
          communicationLevel: communicationLevel || "Bình thường",
          avatar: chosenAvatar,
        },
      });

      return {
        success: true,
        child: {
          id: created.id,
          userId: created.userId,
          name: created.name,
          age: created.age,
          dateOfBirth: created.dateOfBirth?.toISOString() || null,
          condition: created.condition,
          developmentalChallenges: created.developmentalChallenges,
          communicationLevel: created.communicationLevel,
          avatar: created.avatar,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        },
      };
    } catch (err: any) {
      console.error("[saveChildProfile] error:", err);
      return { success: false, error: err.message || "Lỗi lưu hồ sơ trẻ vào hệ thống." };
    }
  });

export const getUserChildren = createServerFn({ method: "POST" })
  .validator((data: { userId?: string; userEmail?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { userId, userEmail } = data;

      let targetUserId = userId;
      if (!targetUserId && userEmail) {
        const u = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase().trim() } });
        if (u) targetUserId = u.id;
      }

      if (!targetUserId) {
        return { success: true, children: [] };
      }

      const children = await prisma.child.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: "desc" },
      });

      return {
        success: true,
        children: children.map((c) => ({
          id: c.id,
          userId: c.userId,
          name: c.name,
          age: c.age,
          dateOfBirth: c.dateOfBirth?.toISOString() || null,
          condition: c.condition,
          developmentalChallenges: c.developmentalChallenges,
          communicationLevel: c.communicationLevel,
          avatar: c.avatar,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        })),
      };
    } catch (err: any) {
      console.error("[getUserChildren] error:", err);
      return { success: false, error: err.message, children: [] };
    }
  });

export const deleteChildProfile = createServerFn({ method: "POST" })
  .validator((data: { childId: string; userId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { childId, userId } = data;
      if (!childId) return { success: false, error: "Thiếu mã hồ sơ bé." };

      if (userId) {
        await prisma.child.deleteMany({
          where: { id: childId, userId: userId },
        });
      } else {
        await prisma.child.delete({
          where: { id: childId },
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("[deleteChildProfile] error:", err);
      return { success: false, error: err.message };
    }
  });
