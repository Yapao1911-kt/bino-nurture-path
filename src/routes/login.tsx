// ============================================================
// Route: /login
// File: src/routes/login.tsx
// Mô tả: Trang đăng nhập & đăng ký thành viên cho Bino.
//         Hỗ trợ phân quyền rõ ràng giữa Phụ huynh và Giáo viên.
// ============================================================

import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Heart,
  Mail,
  Lock,
  User,
  Loader2,
  GraduationCap,
  Baby,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUser, registerUser } from "@/lib/auth-rpc";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Đăng nhập — Bino" },
      {
        name: "description",
        content:
          "Đăng nhập vào hệ thống Bino để tiếp tục đồng hành cùng bé yêu trên lộ trình can thiệp sớm.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"parent" | "teacher">("parent");

  // Xử lý đăng nhập thật
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ Email và Mật khẩu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await loginUser({
        data: {
          email: email.trim(),
          password: password.trim(),
          role: role,
        },
      });

      if (!res.success || !res.user) {
        setError(res.error || "Email hoặc Mật khẩu không chính xác.");
        return;
      }

      // Lưu thông tin người dùng thật vào localStorage
      const userRole = res.user.role || role;
      const userName = res.user.name || "Người dùng";

      localStorage.setItem("bino_user_role", userRole);
      localStorage.setItem("bino_user_name", userName);
      localStorage.setItem("bino_user_email", res.user.email);
      for (const key of ["bino_user_children", "bino_active_child", "bino_local_children"]) localStorage.removeItem(key);
      localStorage.setItem("bino_user_id", res.user.id);

      // Đồng bộ các key tương thích ngược
      localStorage.setItem("bino_simulated_role", userRole);
      localStorage.setItem("bino_simulated_user", userName);
      localStorage.setItem("bino_simulated_email", res.user.email);

      setSuccess(
        `Đăng nhập thành công với vai trò ${userRole === "teacher" ? "Giáo viên" : "Phụ huynh"}! Đang chuyển hướng...`
      );

      setTimeout(() => {
        navigate({ to: "/" });
      }, 800);
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err?.message || "";
      const isHtml = typeof msg === "string" && (msg.includes("<!doctype") || msg.includes("<html"));
      setError(isHtml ? "Máy chủ đang khởi động hoặc gặp sự cố tạm thời. Vui lòng thử lại sau giây lát." : (msg || "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại."));
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng ký thật
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setError("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải chứa ít nhất 8 ký tự.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await registerUser({
        data: {
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          role: role,
        },
      });

      if (!res.success) {
        setError(res.error || "Có lỗi xảy ra trong quá trình đăng ký.");
        return;
      }

      setSuccess(res.message || "Hãy kiểm tra email xác thực.");
      
      // Giữ lại email đã nhập và chuyển sang tab đăng nhập
      setTimeout(() => {
        setActiveTab("login");
        setError(null);
        setSuccess("Hãy mở liên kết xác thực trong email, sau đó đăng nhập bằng mật khẩu đã đăng ký.");
      }, 1200);
    } catch (err: any) {
      console.error("Register error:", err);
      const msg = err?.message || "";
      const isHtml = typeof msg === "string" && (msg.includes("<!doctype") || msg.includes("<html"));
      setError(isHtml ? "Máy chủ đang khởi động hoặc gặp sự cố tạm thời. Vui lòng thử lại sau giây lát." : (msg || "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--background)" }}
    >
      {/* Background decorations */}
      <div
        className="absolute top-10 -left-20 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#DCEFFB", opacity: 0.55 }}
      />
      <div
        className="absolute -top-10 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#E2F6EC", opacity: 0.55 }}
      />
      <div
        className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#FFE6EB", opacity: 0.55 }}
      />

      <div className="max-w-md w-full space-y-6 relative z-10 animate-fade-in">
        {/* Logo / Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Link>
          <div className="flex justify-center mb-2">
            <span
              className="w-12 h-12 rounded-3xl grid place-items-center shadow-md shadow-brand-blue/30"
              style={{
                background: "linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-mint) 100%)",
              }}
            >
              <Heart className="w-6 h-6 text-white" strokeWidth={2.5} />
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-ink tracking-tight">
            Chào mừng đến với Bino
          </h2>
          <p className="mt-2 text-sm text-ink/60">AI dịu dàng đồng hành cùng con lớn khôn</p>
        </div>

        {/* Auth Forms Card */}
        <Card className="rounded-[2.5rem] border-0 bg-white shadow-[12px_12px_0px_#f3f3f3]">
          <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setActiveTab(val as "login" | "register");
                setError(null);
                setSuccess(null);
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 rounded-2xl p-1 bg-slate-100/80">
                <TabsTrigger
                  value="login"
                  className="rounded-xl font-bold py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Đăng nhập
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-xl font-bold py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Đăng ký
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8 pt-4">
            {error && (
              <Alert variant="destructive" className="mb-4 rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-2 border-[var(--brand-mint)] bg-[var(--brand-mint-soft)] text-ink rounded-2xl">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-mint)]" />
                <AlertDescription className="text-sm font-semibold">{success}</AlertDescription>
              </Alert>
            )}

            {/* Mục chọn vai trò: Phụ huynh hoặc Giáo viên (áp dụng cho cả 2 tab) */}
            <div className="mb-5 space-y-1.5">
              <Label className="text-xs font-bold text-ink/80 flex items-center justify-between">
                <span>Bạn là:</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {role === "parent" ? "Dành cho gia đình" : "Dành cho trường / trung tâm"}
                </span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("parent")}
                  className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    role === "parent"
                      ? "border-[var(--brand-blue)] bg-blue-50/50 text-blue-700 shadow-xs"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Baby className="w-4 h-4 text-blue-600" /> Phụ huynh
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    role === "teacher"
                      ? "border-[var(--brand-mint)] bg-emerald-50/50 text-emerald-700 shadow-xs"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" /> Giáo viên
                </button>
              </div>
            </div>

            {/* TAB: Đăng nhập */}
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-email"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email đăng nhập
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="ten.ban@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-password"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Mật khẩu
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-2xl text-sm font-bold shadow-[4px_4px_0px_#6eb0db] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#6eb0db] active:translate-y-0 active:shadow-[2px_2px_0px_#6eb0db] cursor-pointer"
                  style={{
                    background: role === "teacher" ? "#3bb383" : "var(--brand-blue)",
                    color: "white",
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Đăng nhập (${role === "teacher" ? "Giáo viên" : "Phụ huynh"})`
                  )}
                </Button>
              </form>
            ) : (
              /* TAB: Đăng ký */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-name"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" /> Họ và tên của bạn
                  </Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-email"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Địa chỉ Email
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="ten.ban@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-password"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Tạo mật khẩu
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-2xl text-sm font-bold shadow-[4px_4px_0px_#3bb383] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3bb383] active:translate-y-0 active:shadow-[2px_2px_0px_#3bb383] cursor-pointer"
                  style={{
                    background: role === "teacher" ? "#3bb383" : "var(--brand-blue)",
                    color: "white",
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Đăng ký tài khoản (${role === "teacher" ? "Giáo viên" : "Phụ huynh"})`
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}