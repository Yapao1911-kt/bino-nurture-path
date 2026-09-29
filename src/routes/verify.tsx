import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/auth-rpc";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
});

function VerifyPage() {
  const { token } = Route.useSearch() as { token: string };
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xác thực tài khoản của bạn...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token xác thực không hợp lệ hoặc không tồn tại.");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail({ data: token });
        setStatus("success");
        setMessage(res.message);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Xác thực thất bại. Vui lòng thử lại.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#1FA7E1] animate-spin" />
            <h2 className="text-xl font-bold text-slate-800">{message}</h2>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Tuyệt vời!</h2>
            <p className="text-slate-600">{message}</p>
            <Button className="w-full mt-4" asChild>
              <Link to="/login">Đến trang Đăng nhập</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Rất tiếc</h2>
            <p className="text-slate-600">{message}</p>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link to="/login">Quay lại Đăng nhập</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
