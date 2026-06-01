// ============================================================
// Route: /create-child
// File: src/routes/create-child.tsx
// Mô tả: Trang tạo hồ sơ trẻ — sử dụng TanStack Router
//         file-based routing. File này sẽ tự động được nhận
//         diện và đăng ký route /create-child.
// ============================================================

import { createFileRoute } from "@tanstack/react-router";
import CreateChildForm from "@/components/CreateChildForm";

export const Route = createFileRoute("/create-child")({
  component: CreateChildPage,
  head: () => ({
    meta: [
      { title: "Tạo hồ sơ cho bé — Bino" },
      {
        name: "description",
        content:
          "Tạo hồ sơ mới cho trẻ để Bino xây dựng lộ trình can thiệp sớm cá nhân hóa.",
      },
    ],
  }),
});

function CreateChildPage() {
  return <CreateChildForm />;
}
