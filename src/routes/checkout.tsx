import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const [copied, setCopied] = useState(false);
  const bankInfo = {
    bank: "BIDV - CN CAN THO",
    accountName: "NGUYEN CONG THINH",
    accountNumber: "8850568524",
    amount: "180.000 VND",
    content: "BINO PREMIUM [Số điện thoại của bạn]",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 -ml-4 text-slate-500 hover:text-slate-900">
          <Link to="/premium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Thanh toán Premium</h1>
          <p className="text-slate-500 mt-2">Quét mã QR dưới đây để hoàn tất nâng cấp gói Bino Premium.</p>
        </div>

        <Card className="p-8 shadow-sm border-slate-200 bg-white">
          <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
            
            {/* QR Code Section */}
            <div className="flex-1 flex flex-col items-center border border-slate-100 p-6 rounded-2xl bg-slate-50">
              <div className="w-56 h-56 bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-slate-100 flex items-center justify-center p-2">
                <img 
                  src="/qr-thanh-toan.png" 
                  alt="QR Code Thanh Toán" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"; // Fallback demo QR
                  }}
                />
              </div>
              <p className="text-sm font-semibold text-slate-700">Mở App Ngân hàng để quét mã</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-[#005B96] text-white text-[10px] font-bold rounded">BIDV</span>
                <span className="px-2 py-1 bg-[#EE0033] text-white text-[10px] font-bold rounded">VietQR</span>
              </div>
            </div>

            {/* Manual Transfer Info */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Hoặc chuyển khoản thủ công</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                    <span className="text-slate-500">Ngân hàng</span>
                    <span className="font-semibold text-slate-900 text-right">{bankInfo.bank}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                    <span className="text-slate-500">Chủ tài khoản</span>
                    <span className="font-semibold text-slate-900 text-right">{bankInfo.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500">Số tài khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 text-base">{bankInfo.accountNumber}</span>
                      <button onClick={() => handleCopy(bankInfo.accountNumber)} className="text-slate-400 hover:text-slate-700">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-slate-500">Số tiền</span>
                    <span className="font-bold text-amber-600 text-base">{bankInfo.amount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-500 mr-4">Nội dung</span>
                    <div className="flex items-center gap-2 text-right">
                      <span className="font-medium text-slate-800 break-all">{bankInfo.content}</span>
                      <button onClick={() => handleCopy(bankInfo.content)} className="text-slate-400 hover:text-slate-700 shrink-0">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Button className="w-full sm:w-auto bg-brand-mint hover:bg-emerald-500 text-white min-w-[200px]" size="lg" onClick={() => alert("Chúng tôi đang xác nhận thanh toán của bạn. Tài khoản sẽ được nâng cấp trong vòng 5-10 phút!")}>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Tôi đã thanh toán
            </Button>
            <p className="text-xs text-slate-400 mt-4">
              Sau khi thanh toán thành công, hệ thống sẽ tự động cập nhật trạng thái trong ít phút.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
