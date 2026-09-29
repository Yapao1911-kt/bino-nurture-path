import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { C as Card } from "./card-SSxiJ3nX.mjs";
import { A as ArrowLeft, s as Copy, n as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function CheckoutPage() {
  const [copied, setCopied] = reactExports.useState(false);
  const bankInfo = {
    bank: "BIDV - CN CAN THO",
    accountName: "NGUYEN CONG THINH",
    accountNumber: "8850568524",
    amount: "180.000 VND",
    content: "BINO PREMIUM [Số điện thoại của bạn]"
  };
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", asChild: true, className: "mb-6 -ml-4 text-slate-500 hover:text-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/premium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
      " Quay lại"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Thanh toán Premium" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 mt-2", children: "Quét mã QR dưới đây để hoàn tất nâng cấp gói Bino Premium." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 shadow-sm border-slate-200 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-10 items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center border border-slate-100 p-6 rounded-2xl bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-56 h-56 bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-slate-100 flex items-center justify-center p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/qr-thanh-toan.png", alt: "QR Code Thanh Toán", className: "w-full h-full object-contain", onError: (e) => {
            const target = e.target;
            target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png";
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-700", children: "Mở App Ngân hàng để quét mã" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-[#005B96] text-white text-[10px] font-bold rounded", children: "BIDV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-[#EE0033] text-white text-[10px] font-bold rounded", children: "VietQR" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 w-full space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-4 border-b pb-2", children: "Hoặc chuyển khoản thủ công" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start border-b border-slate-50 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Ngân hàng" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900 text-right", children: bankInfo.bank })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start border-b border-slate-50 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Chủ tài khoản" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900 text-right", children: bankInfo.accountName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-slate-50 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Số tài khoản" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-600 text-base", children: bankInfo.accountNumber }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleCopy(bankInfo.accountNumber), className: "text-slate-400 hover:text-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-slate-50 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Số tiền" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-amber-600 text-base", children: bankInfo.amount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 mr-4", children: "Nội dung" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800 break-all", children: bankInfo.content }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleCopy(bankInfo.content), className: "text-slate-400 hover:text-slate-700 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }) })
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-6 border-t border-slate-100 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full sm:w-auto bg-brand-mint hover:bg-emerald-500 text-white min-w-[200px]", size: "lg", onClick: () => alert("Chúng tôi đang xác nhận thanh toán của bạn. Tài khoản sẽ được nâng cấp trong vòng 5-10 phút!"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 mr-2" }),
          "Tôi đã thanh toán"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-4", children: "Sau khi thanh toán thành công, hệ thống sẽ tự động cập nhật trạng thái trong ít phút." })
      ] })
    ] })
  ] }) });
}
export {
  CheckoutPage as component
};
