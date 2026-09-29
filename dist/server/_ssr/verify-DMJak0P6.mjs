import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { verifyEmail } from "./auth-rpc-oco_g-ub.mjs";
import { R as Route$d } from "./router-BF6gDh8M.mjs";
import "../_libs/seroval.mjs";
import { K as LoaderCircle, n as CircleCheck, m as CircleAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-DzLy7LQ_.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function VerifyPage() {
  const {
    token
  } = Route$d.useSearch();
  useNavigate();
  const [status, setStatus] = reactExports.useState("loading");
  const [message, setMessage] = reactExports.useState("Đang xác thực tài khoản của bạn...");
  reactExports.useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token xác thực không hợp lệ hoặc không tồn tại.");
      return;
    }
    const verify = async () => {
      try {
        const res = await verifyEmail({
          data: token
        });
        setStatus("success");
        setMessage(res.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Xác thực thất bại. Vui lòng thử lại.");
      }
    };
    verify();
  }, [token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full text-center space-y-6", children: [
    status === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-12 h-12 text-[#1FA7E1] animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-800", children: message })
    ] }),
    status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-emerald-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-800", children: "Tuyệt vời!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600", children: message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full mt-4", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Đến trang Đăng nhập" }) })
    ] }),
    status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 text-rose-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-800", children: "Rất tiếc" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600", children: message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full mt-4", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Quay lại Đăng nhập" }) })
    ] })
  ] }) });
}
export {
  VerifyPage as component
};
