import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { sendVerificationEmail } from "../server/mail";

export const registerUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string; fullName: string; role: string }) => data)
  .handler(async ({ data }) => {
    const { email, password, fullName, role } = data;
    
    if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
      return { success: false, error: "Vui lòng điền đầy đủ tất cả các trường." };
    }

    if (password.length < 6) {
      return { success: false, error: "Mật khẩu phải chứa ít nhất 6 ký tự." };
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return { success: false, error: "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác." };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password.trim(), salt);
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: fullName.trim(),
        role: role === "teacher" ? "teacher" : "parent",
        verificationToken,
        isEmailVerified: true, // Auto verify tài khoản thật ngay lập tức
      },
    });

    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (err) {
      // Bỏ qua nếu chưa cấu hình SMTP, tài khoản vẫn dùng bình thường
      console.warn("SMTP not configured or failed to send email, proceeding with auto-verify:", err);
    }

    return {
      success: true,
      message: "Đăng ký thành công! Bạn có thể đăng nhập ngay.",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  });

export const loginUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string; role?: string }) => data)
  .handler(async ({ data }) => {
    const { email, password, role } = data;
    
    if (!email?.trim() || !password?.trim()) {
      return { success: false, error: "Vui lòng điền đầy đủ Email và Mật khẩu." };
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    
    if (!user) {
      return { success: false, error: "Email hoặc mật khẩu không chính xác." };
    }

    const isMatch = await bcrypt.compare(password.trim(), user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Email hoặc mật khẩu không chính xác." };
    }

    // Tự động kích hoạt tài khoản nếu chưa kích hoạt
    if (!user.isEmailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
    }

    // Cập nhật vai trò nếu người dùng chọn vai trò cụ thể khi đăng nhập
    let effectiveRole = user.role || role || "parent";
    if (role && (role === "teacher" || role === "parent") && user.role !== role) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
      effectiveRole = role;
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "Người dùng",
        role: effectiveRole,
      },
    };
  });

export const verifyEmail = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    if (!token) {
      throw new Error("Token không hợp lệ.");
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
      },
    });

    return { success: true, message: "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay." };
  });

export const logoutUser = createServerFn({ method: "POST" })
  .handler(async () => {
    return { success: true };
  });

export const getSessionUser = createServerFn({ method: "GET" })
  .handler(async () => {
    // Session is handled via localStorage on client now
    return null;
  });
