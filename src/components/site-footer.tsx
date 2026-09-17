import { Heart } from "lucide-react";

export function SiteFooter() {
  const cols = [
    {
      title: "Sản phẩm",
      links: [
        { name: "Tính năng", url: "#features" },
        { name: "Học liệu", url: "/library" },
        { name: "Lesson Builder", url: "/lesson-builder" },
        { name: "Bảng giá", url: "#pricing" },
      ],
    },
    {
      title: "Cộng đồng",
      links: [
        { name: "Nhóm phụ huynh", url: "https://www.facebook.com/share/g/1LKLQuChhu/" },
        { name: "Chuyên gia", url: "/experts" },
        { name: "Thử thách 7 ngày", url: "#" },
        { name: "Sự kiện", url: "#" },
      ],
    },
    {
      title: "Công ty",
      links: [
        { name: "Về Bino", url: "#" },
        { name: "Sứ mệnh", url: "#" },
        { name: "Tuyển dụng", url: "#" },
        { name: "Liên hệ", url: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-white/60 backdrop-blur-md border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <img
              src="/logo.png"
              alt="Bino Logo"
              className="h-28 my-[-30px] w-auto object-contain"
            />
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Người bạn đồng hành thông minh trong quá trình can thiệp sớm.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-slate-800">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.url}
                      target={l.url.startsWith("http") ? "_blank" : undefined}
                      rel={l.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {l.name}
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
            <Heart className="w-4 h-4" style={{ color: "#D67B8B", fill: "#FFCAD4" }} />
            Đồng hành cùng con từ những bước đi đầu tiên
          </p>
        </div>
      </div>
    </footer>
  );
}
