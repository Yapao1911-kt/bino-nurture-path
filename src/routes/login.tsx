// ============================================================
// Route: /login
// File: src/routes/login.tsx
// Mô tả: Trang đăng nhập & đăng ký thành viên cho Bino.
//         Hỗ trợ cả đăng nhập thật bằng Supabase và đăng nhập
//         giả lập (Demo Mode) tiện lợi.
// ============================================================

import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Heart,
  Sparkles,
  Smile,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  GraduationCap,
  Baby,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Xử lý đăng nhập thật bằng server function
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
      // Clear simulation data first
      localStorage.removeItem("bino_simulated_role");
      localStorage.removeItem("bino_simulated_user");
      localStorage.removeItem("bino_simulated_email");

      const { loginUser } = await import("@/lib/auth-rpc");
      await loginUser({ data: { email: email.trim(), password: password.trim() } });

      setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Email hoặc Mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng ký thật bằng server function
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setError("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { registerUser } = await import("@/lib/auth-rpc");
      const res = await registerUser({
        data: {
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          role: role,
        }
      });

      setSuccess(res.message || "Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.");
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err: any) {
      console.error("Register error:", err);
      setError(err.message || "Có lỗi xảy ra trong quá trình đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng nhập giả lập để chạy thử nhanh (Offline/Demo Mode)
  const handleSimulatedLogin = (simulatedRole: "parent" | "teacher") => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    setTimeout(async () => {
      try {
        // Đăng xuất session thật nếu có
        await supabase.auth.signOut();
      } catch (e) {
        // Ignore
      }

      // Thiết lập thông tin demo trong LocalStorage
      localStorage.setItem("bino_simulated_role", simulatedRole);
      localStorage.setItem(
        "bino_simulated_user",
        simulatedRole === "parent" ? "Mẹ Bé Minh An (Demo)" : "Cô giáo Mai Anh (Demo)",
      );
      localStorage.setItem(
        "bino_simulated_email",
        simulatedRole === "parent" ? "parent.demo@bino.edu.vn" : "teacher.demo@bino.edu.vn",
      );

      // Kích hoạt thay đổi auth state bằng cách reload nhẹ hoặc redirect
      setSuccess(
        `Đăng nhập thành công ở chế độ Demo với vai trò ${simulatedRole === "parent" ? "Phụ huynh" : "Giáo viên"}!`,
      );
      setIsLoading(false);

      setTimeout(() => {
        navigate({ to: "/" });
      }, 1000);
    }, 600);
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
              defaultValue="login"
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
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-2 border-[var(--brand-mint)] bg-[var(--brand-mint-soft)] text-ink rounded-2xl">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-mint)]" />
                <AlertDescription className="text-sm font-semibold">{success}</AlertDescription>
              </Alert>
            )}

            {/* TAB: Đăng nhập */}
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-email"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="TenCuaBan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-password"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Mật khẩu
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-2xl text-sm font-bold shadow-[4px_4px_0px_#6eb0db] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#6eb0db] active:translate-y-0 active:shadow-[2px_2px_0px_#6eb0db]"
                  style={{ background: "var(--brand-blue)", color: "white" }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đăng nhập ngay"}
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
                    <User className="w-3.5 h-3.5" /> Họ và tên của bạn
                  </Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-email"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Địa chỉ Email
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="ten.ban@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-password"
                    className="text-xs font-bold text-ink/80 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Tạo mật khẩu
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-ink/80">
                    Bạn đăng ký với vai trò là:
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("parent")}
                      className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        role === "parent"
                          ? "border-[var(--brand-blue)] bg-[var(--brand-blue-soft)]/20 text-blue-600"
                          : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Baby className="w-4 h-4" /> Phụ huynh
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("teacher")}
                      className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        role === "teacher"
                          ? "border-[var(--brand-mint)] bg-[var(--brand-mint-soft)]/20 text-emerald-600"
                          : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" /> Giáo viên
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-2xl text-sm font-bold shadow-[4px_4px_0px_#3bb383] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3bb383] active:translate-y-0 active:shadow-[2px_2px_0px_#3bb383]"
                  style={{ background: "var(--brand-mint)", color: "white" }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đăng ký tài khoản"}
                </Button>
              </form>
            )}

            {/* Quick Demo Logins Section */}
            <div className="relative my-6 text-center">
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100"></span>
              <span className="relative px-3 bg-white text-xs font-semibold text-slate-400">
                HOẶC DÙNG THỬ NHANH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSimulatedLogin("parent")}
                disabled={isLoading}
                className="h-12 rounded-2xl border-2 border-slate-100 shadow-[2px_2px_0px_#eee] hover:border-[var(--brand-blue)] hover:bg-blue-50/20 text-xs font-bold flex flex-col items-center justify-center pt-2.5 pb-2"
              >
                <Baby className="w-4 h-4 text-blue-500 mb-0.5" />
                <span>Bản Phụ huynh</span>
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSimulatedLogin("teacher")}
                disabled={isLoading}
                className="h-12 rounded-2xl border-2 border-slate-100 shadow-[2px_2px_0px_#eee] hover:border-[var(--brand-mint)] hover:bg-emerald-50/20 text-xs font-bold flex flex-col items-center justify-center pt-2.5 pb-2"
              >
                <GraduationCap className="w-4 h-4 text-emerald-500 mb-0.5" />
                <span>Bản Giáo viên</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friendly Tip footer */}
        <div className="flex justify-center">
          <div className="px-5 py-2.5 rounded-2xl bg-white border-2 border-white shadow-[4px_4px_0px_var(--brand-yellow-soft)] flex items-center gap-2 rotate-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-ink">
              Hệ thống dùng thử không yêu cầu email thật!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
