import { Heart } from "lucide-react";

function BinoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <span
      className={`${className} rounded-3xl grid place-items-center shadow-sm`}
      style={{
        background:
          "linear-gradient(135deg, var(--brand-blue, #8ECDF8) 0%, var(--brand-mint, #A8E6CF) 100%)",
      }}
    >
      <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
    </span>
  );
}

export function SiteFooter() {
  const cols = [
    {
      title: "Sản phẩm",
      links: ["Tính năng", "Học liệu", "Lesson Builder", "Bảng giá"],
    },
    {
      title: "Cộng đồng",
      links: ["Nhóm phụ huynh", "Chuyên gia", "Thử thách 7 ngày", "Sự kiện"],
    },
    {
      title: "Công ty",
      links: ["Về Bino", "Sứ mệnh", "Tuyển dụng", "Liên hệ"],
    },
  ];

  return (
    <footer className="bg-white/60 backdrop-blur-md border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <BinoMark />
              <span className="text-xl font-bold text-slate-800">Bino</span>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Người bạn đồng hành thông minh trong quá trình can thiệp sớm.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-slate-800">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Bino. Mọi quyền được bảo lưu.
          </p>
          <p className="text-sm italic text-slate-700 flex items-center gap-2">
            <Heart
              className="w-4 h-4"
              style={{ color: "#D67B8B", fill: "#FFCAD4" }}
            />
            Đồng hành cùng con từ những bước đi đầu tiên
          </p>
        </div>
      </div>
    </footer>
  );
}
