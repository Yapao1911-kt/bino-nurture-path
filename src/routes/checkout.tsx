import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  myPremiumOrders,
  createPremiumOrder,
  submitPremiumPayment,
  cancelPremiumOrder,
} from "@/lib/premium-rpc";
import { PAYMENT_ACCOUNT, ORDER_LABELS, paymentQr } from "@/lib/premium-plan";
export const Route = createFileRoute("/checkout")({ component: Checkout });
type Order = Awaited<ReturnType<typeof myPremiumOrders>>[number];
function Checkout() {
  const [orders, setOrders] = useState<Order[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [copied, setCopied] = useState(""),
    [qrError, setQrError] = useState(false);
  useEffect(() => {
    let active = true;
    myPremiumOrders()
      .then((v) => {
        if (active) setOrders(v);
      })
      .catch(() => {
        if (active) setError("Vui lòng đăng nhập để quản lý đơn Premium.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function act(action: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await action();
      setOrders(await myPremiumOrders());
      setQrError(false);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Chưa thực hiện được. Làm mới để kiểm tra trước khi thử lại.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
    } catch {
      setError("Không sao chép được. Hãy chọn và sao chép thông tin bên dưới.");
    }
  }
  const current = orders.find((o) => ["PENDING", "AWAITING_REVIEW"].includes(o.status));
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/premium">← Gói dịch vụ</Link>
        <h1 className="text-3xl font-bold">Nâng cấp Premium</h1>
        <p>180.000đ / 30 ngày · Chuyển khoản BIDV · Không tự động gia hạn</p>
        {error && (
          <p role="alert" className="bg-red-50 text-red-700 rounded-xl p-4">
            {error}{" "}
            <Link to="/login" className="underline">
              Đăng nhập
            </Link>
          </p>
        )}
        {loading ? (
          <p role="status">Đang tải đơn hàng…</p>
        ) : current ? (
          <section className="bg-white rounded-3xl border p-6 space-y-5">
            <h2 className="font-bold break-all">
              Đơn {current.code} · {ORDER_LABELS[current.status]}
            </h2>
            {current.status === "PENDING" ? (
              <>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    {qrError ? (
                      <p>QR chưa tải được. Hãy dùng thông tin chuyển khoản bên cạnh.</p>
                    ) : (
                      <img
                        key={current.id}
                        src={paymentQr(current.code, current.amount)}
                        alt={`QR chuyển khoản BIDV, nội dung ${current.code}`}
                        className="w-full max-w-[300px] mx-auto"
                        referrerPolicy="no-referrer"
                        onError={() => setQrError(true)}
                      />
                    )}
                  </div>
                  <dl className="space-y-4">
                    {[
                      ["Ngân hàng", PAYMENT_ACCOUNT.bank],
                      ["Chủ tài khoản", PAYMENT_ACCOUNT.name],
                      ["Số tài khoản", PAYMENT_ACCOUNT.number],
                      ["Số tiền", `${current.amount.toLocaleString("vi-VN")}đ`],
                      ["Nội dung", current.code],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-sm text-muted-foreground">{label}</dt>
                        <dd className="font-semibold break-all">
                          {value}
                          {["Số tài khoản", "Nội dung"].includes(label) && (
                            <button className="ml-3 text-sm underline" onClick={() => copy(value)}>
                              {copied === value ? "Đã chép" : "Sao chép"}
                            </button>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="rounded-xl bg-amber-50 p-4 text-sm">
                  Kiểm tra tên người nhận trong ứng dụng ngân hàng phải là TRAN GIA BAO. Chuyển đúng
                  số tiền và nội dung. Chỉ bấm xác nhận sau khi chuyển thành công. Đơn nhận báo
                  chuyển khoản đến {new Date(current.expiresAt).toLocaleString("vi-VN")}.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={busy}
                    onClick={() => act(() => submitPremiumPayment({ data: { id: current.id } }))}
                  >
                    Tôi đã chuyển khoản
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => act(() => cancelPremiumOrder({ data: { id: current.id } }))}
                  >
                    Hủy đơn chưa thanh toán
                  </Button>
                </div>
              </>
            ) : (
              <p className="rounded-xl bg-green-50 p-5">
                Đã nhận thông báo chuyển khoản. Đội ngũ Bino sẽ đối soát tiền vào tài khoản trước
                khi kích hoạt. Bạn không cần chuyển thêm tiền. Bấm làm mới để kiểm tra kết quả.
              </p>
            )}
          </section>
        ) : (
          <section className="rounded-3xl border bg-white p-8 space-y-4">
            <h2 className="text-xl font-bold">Bino Premium · 30 ngày · 180.000đ</h2>
            <p>
              Quyền được mở sau khi đối soát. Gia hạn được cộng tiếp thời gian Premium hoặc dùng thử
              còn lại.
            </p>
            <Button disabled={busy} onClick={() => act(createPremiumOrder)}>
              Tạo đơn và nhận mã QR
            </Button>
          </section>
        )}
        <Button variant="outline" disabled={busy || loading} onClick={() => act(myPremiumOrders)}>
          Làm mới trạng thái
        </Button>
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Lịch sử đơn hàng</h2>
          {!loading && !orders.length && <p>Chưa có đơn hàng.</p>}
          {orders.map((o) => (
            <article key={o.id} className="rounded-2xl border bg-white p-5 space-y-2">
              <div className="flex flex-wrap justify-between gap-2">
                <strong className="break-all">{o.code}</strong>
                <span>{ORDER_LABELS[o.status]}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {o.amount.toLocaleString("vi-VN")}đ · {o.days} ngày ·{" "}
                {new Date(o.createdAt).toLocaleString("vi-VN")}
              </p>
              {o.grantedUntil && (
                <p>Premium đến {new Date(o.grantedUntil).toLocaleString("vi-VN")}</p>
              )}
              {o.reviewNote && <p>Phản hồi: {o.reviewNote}</p>}
            </article>
          ))}
        </section>
        <p className="text-sm text-muted-foreground">
          Đã chuyển tiền nhưng đơn hết hạn hoặc cần hoàn tiền? Gửi mã đơn và mã giao dịch đến{" "}
          <a className="underline" href="mailto:baotg.ce190584@gmail.com">
            baotg.ce190584@gmail.com
          </a>{" "}
          để đối soát; không chuyển thêm tiền.
        </p>
      </div>
    </main>
  );
}
