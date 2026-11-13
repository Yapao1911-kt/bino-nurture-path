import { PremiumOperations } from "@/components/premium-operations";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { appointmentQueue, confirmAppointment } from "@/lib/operations-rpc";
export const Route = createFileRoute("/operations")({
  head: () => ({
    meta: [{ title: "Vận hành — Bino" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: Operations,
});
function Operations() {
  const [items, setItems] = useState<any[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    appointmentQueue()
      .then(setItems)
      .catch(() => setError("Cần đăng nhập tài khoản vận hành được cấu hình trên server."));
  }, []);
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-5">
      <Link to="/">← Trang chủ</Link>
      <h1 className="text-3xl font-bold">Yêu cầu tư vấn chờ xử lý</h1>
      <p>
        Liên hệ phụ huynh qua email và thống nhất chuyên gia, thời gian trước khi đánh dấu xác nhận.
      </p>
      {error && <p role="alert">{error}</p>}
      {items.map((a) => (
        <article key={a.id} className="border p-4 rounded space-y-2">
          <h2>{a.child.name}</h2>
          <p>{a.child.user.email}</p>
          <p>{new Date(a.requestedAt).toLocaleString("vi-VN")}</p>
          <p>{a.topic}</p>
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await confirmAppointment({ data: { id: a.id } });
                setItems(await appointmentQueue());
              } catch {
                setError("Chưa cập nhật được.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Đã thống nhất lịch với phụ huynh
          </button>
        </article>
      ))}
      <PremiumOperations />
    </main>
  );
}
