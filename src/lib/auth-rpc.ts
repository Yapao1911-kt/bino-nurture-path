import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { sendVerificationEmail } from "../server/mail";

export const registerUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string; fullName: string; role: string }) => data)
  .handler(async ({ data }) => {
    const { email, password, fullName, role } = data;
    
    if (!email || !password || !fullName) {
      throw new Error("Vui lòng điền đầy đủ tất cả các trường.");
    }

    if (password.length < 6) {
      throw new Error("Mật khẩu phải chứa ít nhất 6 ký tự.");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email này đã được sử dụng.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: fullName,
        role,
        verificationToken,
        isEmailVerified: true, // AUTO VERIFY CHO HỆ THỐNG THẬT KHI CHƯA CÓ EMAIL
      },
    });

    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    return { success: true, message: "Đăng ký thành công! Bạn có thể đăng nhập ngay." };
  });

export const loginUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;
    
    if (!email || !password) {
      throw new Error("Vui lòng điền đầy đủ Email và Mật khẩu.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    if (!user.isEmailVerified) {
      throw new Error("Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn.");
    }

    return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
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
