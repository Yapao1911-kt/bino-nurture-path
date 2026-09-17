import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Calendar,
  Video,
  ShieldCheck,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/experts")({
  component: ExpertsPage,
});

const BOOKING_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfPoOpxqdcIosrH-8au0tQ9r0D9ChcZNwGxIQh4ENl1U6-IJg/viewform?usp=sharing&ouid=100130526630793132114";

const EXPERTS = [
  {
    id: "doctor",
    name: "BS. CKI Lê Hoàng Phong",
    title: "Bác sĩ Nội thần kinh Nhi",
    hospital: "Bệnh viện Đại học Y Dược",
    experience: "12 năm kinh nghiệm",
    rating: 5.0,
    reviews: 215,
    specialties: ["Khó khăn học tập", "Rối loạn giấc ngủ", "Theo dõi phát triển"],
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600&auto=format&fit=crop",
    price: "600.000đ/giờ",
  },
  {
    id: "specialist",
    name: "ThS. Trần Thị Mai",
    title: "Chuyên gia Âm ngữ trị liệu",
    hospital: "Trung tâm Can thiệp sớm Nắng Mai",
    experience: "10 năm kinh nghiệm",
    rating: 4.8,
    reviews: 94,
    specialties: ["Chậm nói", "Khó khăn giao tiếp", "Can thiệp sớm"],
    imageUrl:
      "https://images.unsplash.com/photo-1594824436998-dd40b49c5eb1?q=80&w=600&auto=format&fit=crop",
    price: "400.000đ/giờ",
  },
];

function ExpertsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Mạng Lưới Chuyên Gia
            </h1>
            <p className="text-lg text-slate-600">
              Kết nối với bác sĩ và chuyên gia trị liệu đã được xác thực để nhận hỗ trợ phù hợp
              cho hành trình phát triển của bé.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Chuyên môn được xác thực</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-500" />
                <span>Tư vấn trực tuyến linh hoạt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EXPERTS.map((expert) => {
            return (
              <Card
                key={expert.id}
                className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group border-slate-200/60"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                        {expert.name}
                      </h3>
                      <p className="text-sm font-medium text-blue-600 line-clamp-1">
                        {expert.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-semibold text-amber-700">{expert.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 mt-3 text-slate-500">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="text-xs line-clamp-2">{expert.hospital}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex-1 flex flex-col">
                  <div className="space-y-3 mb-5">
                    <p className="text-sm text-slate-500">{expert.experience}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {expert.specialties.map((spec) => (
                        <Badge
                          key={spec}
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200 font-normal text-xs"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Chi phí:</span>
                      <span className="font-semibold text-slate-900">{expert.price}</span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        window.open(BOOKING_FORM_URL, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Đặt lịch ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
