import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { subscriptionStatus, startTrial } from "@/lib/subscription-rpc";
export const Route = createFileRoute("/premium")({ component: PremiumPage });
type Status = Awaited<ReturnType<typeof subscriptionStatus>>;
function PremiumPage() {
  const [status, setStatus] = useState<Status | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    subscriptionStatus()
      .then((s) => {
        if (active) setStatus(s);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function trial() {
    setBusy(true);
    setError("");
    try {
      setStatus(await startTrial());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa kích hoạt được dùng thử.");
    } finally {
      setBusy(false);
    }
  }
  const end = status?.premiumEndsAt || (status?.premium ? status.trialEndsAt : null);
  return (
    <>
      <main className="min-h-screen bg-[#faf9f6] px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <Link to="/">← Về trang chủ</Link>
          <header className="text-center max-w-2xl mx-auto space-y-4">
            <Crown className="mx-auto text-amber-500" size={48} />
            <p className="font-semibold text-amber-700">BINO PREMIUM</p>
            <h1 className="text-3xl sm:text-5xl font-bold">Thêm công cụ, cùng con tiến bộ</h1>
            <p className="text-muted-foreground">
              Chuyển khoản một lần, xác nhận bởi đội ngũ Bino, không tự động gia hạn.
            </p>
          </header>
          {loading ? (
            <p role="status">Đang kiểm tra gói…</p>
          ) : (
            status && (
              <section className="rounded-3xl border bg-white p-6 space-y-2">
                <h2 className="font-bold">
                  {status.premium ? "Premium đang hoạt động" : "Bạn đang dùng gói Cơ bản"}
                </h2>
                <p>
                  {end
                    ? `Quyền Premium đến ${new Date(end).toLocaleString("vi-VN")}`
                    : status.premium
                      ? "Premium không thời hạn"
                      : status.trialStartedAt
                        ? "Bạn đã sử dụng thời gian dùng thử."
                        : "Bạn có thể dùng thử miễn phí 14 ngày."}
                </p>
                <Link to="/checkout" className="text-amber-700 underline">
                  Quản lý đơn hàng →
                </Link>
              </section>
            )
          )}
          {error && (
            <p role="alert" className="bg-red-50 p-4 rounded-xl text-red-700">
              {error}
            </p>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "Bino Cơ bản",
                price: "Miễn phí",
                features: [
                  "Hồ sơ và nhật ký hoạt động của con",
                  "Biểu đồ theo dõi tiến độ",
                  "Học liệu cơ bản và công cụ sàng lọc",
                  "Lưu tối đa 3 lộ trình mỗi hồ sơ",
                ],
                premium: false,
              },
              {
                name: "Bino Premium",
                price: "180.000đ",
                features: [
                  "Lưu đến 100 lộ trình AI cho mỗi hồ sơ",
                  "Tiếp tục sử dụng hồ sơ, nhật ký và biểu đồ",
                  "Lộ trình AI cá nhân hóa khi dịch vụ khả dụng",
                ],
                premium: true,
              },
            ].map((plan) => (
              <section
                key={plan.name}
                className={`rounded-3xl border p-8 bg-white flex flex-col gap-6 ${plan.premium ? "border-amber-300 shadow-lg shadow-amber-100" : ""}`}
              >
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p>
                  <strong className="text-4xl">{plan.price}</strong>
                  {plan.premium && " / 30 ngày"}
                </p>
                <ul className="space-y-4 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="shrink-0 text-green-600" size={20} />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.premium ? (
                  <>
                    <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black">
                      <Link to={status ? "/checkout" : "/login"}>
                        {status?.premium ? "Gia hạn Premium" : "Nâng cấp Premium"}
                      </Link>
                    </Button>
                    {status && !status.trialStartedAt && !status.premium && (
                      <Button variant="outline" disabled={busy || loading} onClick={trial}>
                        {busy ? "Đang kích hoạt…" : "Dùng thử 14 ngày miễn phí"}
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      AI có giới hạn theo năng lực hệ thống và quota nhà cung cấp. Gói không bao gồm
                      phí tư vấn chuyên gia.
                    </p>
                  </>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/progress-tracker">Mở nhật ký của con</Link>
                  </Button>
                )}
              </section>
            ))}
          </div>
          <section className="rounded-3xl bg-green-50 p-7 space-y-3">
            <h2 className="font-bold">Kích hoạt sau khi đối soát</h2>
            <p>
              Tạo đơn, quét QR và chuyển đúng số tiền cùng nội dung. Người vận hành xác nhận tiền
              nhận được để mở Premium 30 ngày. Gia hạn được cộng tiếp thời gian còn lại.
            </p>
            <p>
              Cần hỗ trợ giao dịch? Liên hệ{" "}
              <a className="underline" href="mailto:baotg.ce190584@gmail.com">
                baotg.ce190584@gmail.com
              </a>{" "}
              kèm mã đơn.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
