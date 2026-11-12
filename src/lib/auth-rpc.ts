import {randomBytes} from "node:crypto";
import { getRequest, setCookie } from "@tanstack/react-start/server";
import { signSession, readSession, SESSION_COOKIE } from "./session";
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

    if (password.length < 8) {
      return { success: false, error: "Mật khẩu phải chứa ít nhất 8 ký tự." };
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return { success: false, error: "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác." };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password.trim(), salt);
    const verificationToken = randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: fullName.trim(),
        role: role === "teacher" ? "teacher" : "parent",
        verificationToken,
        isEmailVerified: false,
        verificationExpiresAt: new Date(Date.now()+86400000),
      },
    });

    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (err) {
      console.error("Verification mail failed");
      return {success:false,error:"Tài khoản đã tạo nhưng chưa gửi được email xác thực. Vui lòng liên hệ hỗ trợ để gửi lại email."};
    }

    return {
      success: true,
      message: "Đã đăng ký. Vui lòng xác thực qua email trước khi đăng nhập.",
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

    if(!user.isEmailVerified) return {success:false,error:"Vui lòng xác thực email trước khi đăng nhập."};

    // Cập nhật vai trò nếu người dùng chọn vai trò cụ thể khi đăng nhập
    let effectiveRole = user.role || role || "parent";
    if (role && (role === "teacher" || role === "parent") && user.role !== role) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
      effectiveRole = role;
    }

    setCookie(SESSION_COOKIE, signSession(user.id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 43200 });
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

    if (!user || !user.verificationExpiresAt || user.verificationExpiresAt.getTime() < Date.now()) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationExpiresAt: null,
      },
    });

    return { success: true, message: "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay." };
  });

export const logoutUser = createServerFn({ method: "POST" })
  .handler(async () => {
    setCookie(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
    return { success: true };
  });

export const getSessionUser = createServerFn({ method: "GET" })
  .handler(async () => {
    const id = readSession(getRequest());
    return id ? prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, subscription: true } }) : null;
  });
