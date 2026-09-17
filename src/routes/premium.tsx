import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown, ArrowRight, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
});

function PremiumPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-white to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4 shadow-sm">
              <Crown className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Nâng cấp Bino Premium
            </h1>
            <p className="text-lg text-slate-600">
              Mở khóa toàn bộ kho học liệu, các công cụ đánh giá chuyên sâu và trợ lý ảo thông minh không giới hạn để đồng hành cùng con tốt nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Basic Plan (Current) */}
          <Card className="p-8 border-slate-200 bg-white shadow-sm flex flex-col relative">
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                Gói hiện tại
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Bino Cơ bản</h3>
              <p className="text-slate-500">Khám phá và trải nghiệm các tính năng cốt lõi.</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">Miễn phí</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              {[
                "Truy cập một phần kho học liệu",
                "Đánh giá sàng lọc cơ bản",
                "Theo dõi tiến độ đơn giản",
                "Tương tác trợ lý AI có giới hạn",
                "Tham gia cộng đồng phụ huynh",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full" disabled>
              Đang sử dụng
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 border-amber-200 bg-gradient-to-b from-amber-50/50 to-white shadow-xl shadow-amber-900/5 flex flex-col relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 
                Phổ biến nhất
              </div>
            </div>
            <div className="space-y-2 mb-6 mt-2">
              <h3 className="text-2xl font-bold text-slate-900">Bino Premium</h3>
              <p className="text-slate-500">Toàn bộ công cụ và tài nguyên cho hành trình can thiệp.</p>
            </div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">180.000đ</span>
              <span className="text-slate-500 font-medium">/ tháng</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              {[
                "Mở khóa 100% video, bài viết và học liệu",
                "Tải xuống PDF không giới hạn",
                "Hệ thống tạo bài giảng, flashcard tự động",
                "Đánh giá chuyên sâu và biểu đồ tiến độ chi tiết",
                "Trợ lý AI không giới hạn số câu hỏi",
                "Hỗ trợ ưu tiên từ chuyên gia",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline"
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800" 
                size="lg"
                onClick={() => alert("Đã kích hoạt dùng thử 14 ngày!")}
              >
                Dùng thử 14 ngày
              </Button>
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-md" 
                size="lg"
                asChild
              >
                <Link to="/checkout">
                  Nâng cấp ngay
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Thanh toán an toàn và bảo mật
            </p>
          </Card>
        </div>
      </div>
      
      {/* FAQ or Extra info */}
      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Bạn có câu hỏi?</h3>
        <p className="text-slate-600 mb-6">
          Nếu bạn cần tư vấn thêm về gói Premium, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của Bino.
        </p>
        <Button variant="outline" onClick={() => alert("Mở form liên hệ hỗ trợ")}>
          Liên hệ hỗ trợ
        </Button>
      </div>
    </div>
  );
}
