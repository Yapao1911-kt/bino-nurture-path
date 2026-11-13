import { useEffect, useState } from "react";
import { premiumOrderQueue, reviewPremiumOrder } from "@/lib/premium-rpc";
import { ORDER_LABELS } from "@/lib/premium-plan";
import { Button } from "@/components/ui/button";
type Order = Awaited<ReturnType<typeof premiumOrderQueue>>[number];
export function PremiumOperations() {
  const [orders, setOrders] = useState<Order[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  async function refresh() {
    setLoading(true);
    try {
      setOrders(await premiumOrderQueue());
      setError("");
    } catch {
      setError("Không tải được đơn hàng. Cần tài khoản vận hành đã xác thực.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    premiumOrderQueue()
      .then((v) => {
        if (active) setOrders(v);
      })
      .catch(() => {
        if (active) setError("Cần tài khoản vận hành đã xác thực.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function review(id: string, approve: boolean, bankReference: string, note: string) {
    setBusy(true);
    setError("");
    try {
      await reviewPremiumOrder({ data: { id, approve, bankReference, note } });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa xử lý được đơn.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-4 border-t pt-8">
      <h2 className="text-2xl font-bold">Đối soát Premium</h2>
      <p>
        Chỉ xác nhận sau khi kiểm tra tiền đã vào BIDV 7500908855, đúng số tiền và nội dung. Mã giao
        dịch ngân hàng chỉ dùng một lần.
      </p>
      <Button variant="outline" disabled={busy || loading} onClick={refresh}>
        Làm mới đơn hàng
      </Button>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {loading && <p role="status">Đang tải đơn…</p>}
      {!loading && !orders.length && <p>Chưa có đơn cần đối soát.</p>}
      {orders.map((o) => (
        <OrderReview key={o.id} order={o} busy={busy} onReview={review} />
      ))}
    </section>
  );
}
function OrderReview({
  order: o,
  busy,
  onReview,
}: {
  order: Order;
  busy: boolean;
  onReview: (id: string, approve: boolean, reference: string, note: string) => Promise<void>;
}) {
  const [reference, setReference] = useState(""),
    [note, setNote] = useState(""),
    [checked, setChecked] = useState(false);
  return (
    <article className="rounded-2xl border p-5 space-y-3 bg-white">
      <h3 className="font-bold break-all">
        {o.code} · {ORDER_LABELS[o.status]}
      </h3>
      <p>
        {o.user.name} · {o.user.email}
      </p>
      <p>
        {o.amount.toLocaleString("vi-VN")}đ · {o.days} ngày ·{" "}
        {new Date(o.createdAt).toLocaleString("vi-VN")}
      </p>
      {o.status === "AWAITING_REVIEW" ? (
        <>
          <label className="block">
            Mã giao dịch trên sao kê
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              maxLength={100}
              className="border rounded-lg p-2 block w-full"
            />
          </label>
          <label className="block">
            Ghi chú / lý do chưa xác nhận
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              className="border rounded-lg p-2 block w-full"
            />
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            Đã kiểm tra tiền thực nhận, đúng số tiền và nội dung đơn
          </label>
          <div className="flex flex-wrap gap-3">
            <Button
              disabled={busy || !checked || reference.trim().length < 4}
              onClick={() => onReview(o.id, true, reference, note)}
            >
              Xác nhận và kích hoạt 30 ngày
            </Button>
            <Button
              variant="outline"
              disabled={busy || !note.trim()}
              onClick={() => onReview(o.id, false, reference, note)}
            >
              Chưa xác nhận giao dịch
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>
            Mã giao dịch: {o.bankReference || "—"} · Xử lý bởi {o.reviewedBy}
          </p>
          {o.grantedUntil && <p>Đã cấp đến {new Date(o.grantedUntil).toLocaleString("vi-VN")}</p>}
          {o.reviewNote && <p>{o.reviewNote}</p>}
        </>
      )}
    </article>
  );
}
