import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./supabase-BG92hIum.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { A as Alert, a as AlertDescription, L as Label } from "./alert-BUJEp_BX.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { C as Card, d as CardHeader, a as CardContent } from "./card-SSxiJ3nX.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger } from "./tabs-4N6Vlhl8.mjs";
import { A as ArrowLeft, H as Heart, m as CircleAlert, n as CircleCheck, N as Mail, M as Lock, K as LoaderCircle, ah as User, B as Baby, x as GraduationCap, a8 as Sparkles } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("login");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("parent");
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ Email và Mật khẩu.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      localStorage.removeItem("bino_simulated_role");
      localStorage.removeItem("bino_simulated_user");
      localStorage.removeItem("bino_simulated_email");
      const {
        loginUser
      } = await import("./auth-rpc-oco_g-ub.mjs");
      await loginUser({
        data: {
          email: email.trim(),
          password: password.trim()
        }
      });
      setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1e3);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Email hoặc Mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async (e) => {
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
      const {
        registerUser
      } = await import("./auth-rpc-oco_g-ub.mjs");
      const res = await registerUser({
        data: {
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          role
        }
      });
      setSuccess(res.message || "Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.");
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Có lỗi xảy ra trong quá trình đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSimulatedLogin = (simulatedRole) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
      } catch (e) {
      }
      localStorage.setItem("bino_simulated_role", simulatedRole);
      localStorage.setItem("bino_simulated_user", simulatedRole === "parent" ? "Mẹ Bé Minh An (Demo)" : "Cô giáo Mai Anh (Demo)");
      localStorage.setItem("bino_simulated_email", simulatedRole === "parent" ? "parent.demo@bino.edu.vn" : "teacher.demo@bino.edu.vn");
      setSuccess(`Đăng nhập thành công ở chế độ Demo với vai trò ${simulatedRole === "parent" ? "Phụ huynh" : "Giáo viên"}!`);
      setIsLoading(false);
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1e3);
    }, 600);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", style: {
    background: "var(--background)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 -left-20 w-96 h-96 rounded-full blur-3xl", style: {
      backgroundColor: "#DCEFFB",
      opacity: 0.55
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-10 right-0 w-96 h-96 rounded-full blur-3xl", style: {
      backgroundColor: "#E2F6EC",
      opacity: 0.55
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-3xl", style: {
      backgroundColor: "#FFE6EB",
      opacity: 0.55
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full space-y-6 relative z-10 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink transition-colors mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Về trang chủ"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12 h-12 rounded-3xl grid place-items-center shadow-md shadow-brand-blue/30", style: {
          background: "linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-mint) 100%)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-6 h-6 text-white", strokeWidth: 2.5 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-ink tracking-tight", children: "Chào mừng đến với Bino" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-ink/60", children: "AI dịu dàng đồng hành cùng con lớn khôn" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-[2.5rem] border-0 bg-white shadow-[12px_12px_0px_#f3f3f3]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-6 px-6 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { defaultValue: "login", onValueChange: (val) => {
          setActiveTab(val);
          setError(null);
          setSuccess(null);
        }, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-2 rounded-2xl p-1 bg-slate-100/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "login", className: "rounded-xl font-bold py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm", children: "Đăng nhập" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "register", className: "rounded-xl font-bold py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm", children: "Đăng ký" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-6 sm:px-8 pb-8 pt-4", children: [
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4 rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm", children: error })
          ] }),
          success && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mb-4 border-2 border-[var(--brand-mint)] bg-[var(--brand-mint-soft)] text-ink rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-[var(--brand-mint)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm font-semibold", children: success })
          ] }),
          activeTab === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "login-email", className: "text-xs font-bold text-ink/80 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
                " Email"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "login-email", type: "email", placeholder: "TenCuaBan@example.com", value: email, onChange: (e) => setEmail(e.target.value), disabled: isLoading, className: "h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "login-password", className: "text-xs font-bold text-ink/80 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" }),
                " Mật khẩu"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "login-password", type: "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), disabled: isLoading, className: "h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isLoading, className: "w-full h-11 rounded-2xl text-sm font-bold shadow-[4px_4px_0px_#6eb0db] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#6eb0db] active:translate-y-0 active:shadow-[2px_2px_0px_#6eb0db]", style: {
              background: "var(--brand-blue)",
              color: "white"
            }, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Đăng nhập ngay" })
          ] }) : (
            /* TAB: Đăng ký */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegister, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-name", className: "text-xs font-bold text-ink/80 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5" }),
                  " Họ và tên của bạn"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reg-name", type: "text", placeholder: "Ví dụ: Nguyễn Văn A", value: fullName, onChange: (e) => setFullName(e.target.value), disabled: isLoading, className: "h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-email", className: "text-xs font-bold text-ink/80 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
                  " Địa chỉ Email"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reg-email", type: "email", placeholder: "ten.ban@gmail.com", value: email, onChange: (e) => setEmail(e.target.value), disabled: isLoading, className: "h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-password", className: "text-xs font-bold text-ink/80 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" }),
                  " Tạo mật khẩu"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reg-password", type: "password", placeholder: "Tối thiểu 6 ký tự", value: password, onChange: (e) => setPassword(e.target.value), disabled: isLoading, className: "h-11 rounded-xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 focus-visible:border-[var(--brand-blue)]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-ink/80", children: "Bạn đăng ký với vai trò là:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setRole("parent"), className: `h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${role === "parent" ? "border-[var(--brand-blue)] bg-[var(--brand-blue-soft)]/20 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Baby, { className: "w-4 h-4" }),
                    " Phụ huynh"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setRole("teacher"), className: `h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${role === "teacher" ? "border-[var(--brand-mint)] bg-[var(--brand-mint-soft)]/20 text-emerald-600" : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-4 h-4" }),
                    " Giáo viên"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isLoading, className: "w-full h-11 rounded-2xl text-sm font-bold shadow-[4px_4px_0px_#3bb383] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3bb383] active:translate-y-0 active:shadow-[2px_2px_0px_#3bb383]", style: {
                background: "var(--brand-mint)",
                color: "white"
              }, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Đăng ký tài khoản" })
            ] })
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative px-3 bg-white text-xs font-semibold text-slate-400", children: "HOẶC DÙNG THỬ NHANH" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", type: "button", onClick: () => handleSimulatedLogin("parent"), disabled: isLoading, className: "h-12 rounded-2xl border-2 border-slate-100 shadow-[2px_2px_0px_#eee] hover:border-[var(--brand-blue)] hover:bg-blue-50/20 text-xs font-bold flex flex-col items-center justify-center pt-2.5 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Baby, { className: "w-4 h-4 text-blue-500 mb-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bản Phụ huynh" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", type: "button", onClick: () => handleSimulatedLogin("teacher"), disabled: isLoading, className: "h-12 rounded-2xl border-2 border-slate-100 shadow-[2px_2px_0px_#eee] hover:border-[var(--brand-mint)] hover:bg-emerald-50/20 text-xs font-bold flex flex-col items-center justify-center pt-2.5 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-4 h-4 text-emerald-500 mb-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bản Giáo viên" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-2.5 rounded-2xl bg-white border-2 border-white shadow-[4px_4px_0px_var(--brand-yellow-soft)] flex items-center gap-2 rotate-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-ink", children: "Hệ thống dùng thử không yêu cầu email thật!" })
      ] }) })
    ] })
  ] });
}
export {
  LoginPage as component
};
