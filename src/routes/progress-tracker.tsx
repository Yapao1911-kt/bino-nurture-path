import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  Loader2,
  Plus,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import {
  fetchAndSyncChildren,
  getActiveChild,
  setActiveChild,
  type ChildData,
} from "@/lib/child-storage";
import { getActivityEntries, recordActivity } from "@/lib/care-rpc";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/progress-tracker")({
  head: () => ({ meta: [{ title: "Hành trình cùng con — Bino" }] }),
  component: Progress,
});
type Entry = Awaited<ReturnType<typeof getActivityEntries>>[number];
const field =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10 disabled:opacity-60";
const panel =
  "rounded-[28px] border border-white bg-white/95 shadow-[0_6px_32px_rgba(47,69,91,0.045)]";
const dateLabel = (date: Date | string) =>
  new Date(date).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" });

function Progress() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [child, setChild] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const loading = profilesLoading || entriesLoading;
  const [days, setDays] = useState<7 | 30>(7);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    setVisibleCount(10);
  }, [child, days, query]);
  const titleRef = useRef<HTMLInputElement>(null);
  const selected = children.find((c) => c.id === child);

  useEffect(() => {
    let active = true;
    fetchAndSyncChildren()
      .then((list) => {
        if (!active) return;
        setChildren(list);
        const preferred = getActiveChild()?.id;
        setChild(list.some((c) => c.id === preferred) ? preferred! : list[0]?.id || "");
      })
      .catch(() => {
        if (active) setError("Chưa tải được hồ sơ. Bạn hãy thử lại nhé.");
      })
      .finally(() => {
        if (active) setProfilesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refresh]);

  useEffect(() => {
    setEntries([]);
    setSaved(false);
    setExpanded(null);
    if (!child) {
      setEntriesLoading(false);
      return;
    }
    let active = true;
    setEntriesLoading(true);
    setError("");
    getActivityEntries({ data: { childId: child } })
      .then((rows) => {
        if (active) setEntries(rows);
      })
      .catch(() => {
        if (active) setError("Chưa tải được nhật ký. Hãy kiểm tra đăng nhập và thử lại.");
      })
      .finally(() => {
        if (active) setEntriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [child, refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const created = await recordActivity({
        data: {
          childId: child,
          title: String(data.get("title")),
          notes: String(data.get("notes")),
          minutes: Number(data.get("minutes")),
          words: Number(data.get("words")),
        },
      });
      setEntries((current) => [created, ...current].slice(0, 500));
      form.reset();
      setSaved(true);
    } catch {
      setError("Chưa lưu được nhật ký. Nội dung bạn nhập vẫn còn, hãy thử lại nhé.");
    } finally {
      setBusy(false);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - days + 1);
  const period = entries.filter((e) => new Date(e.createdAt) >= start);
  const minutes = period.reduce((n, e) => n + e.minutes, 0);
  const words = period.reduce((n, e) => n + e.words, 0);
  const activeDays = new Set(period.map((e) => new Date(e.createdAt).toLocaleDateString("vi-VN")))
    .size;
  const chart = Array.from({ length: days }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return {
      date,
      count: period.filter((e) => new Date(e.createdAt) >= date && new Date(e.createdAt) < next)
        .length,
    };
  });
  const max = Math.max(1, ...chart.map((d) => d.count));
  const filtered = period.filter((e) =>
    `${e.title} ${e.notes}`.toLocaleLowerCase("vi-VN").includes(query.toLocaleLowerCase("vi-VN")),
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-700">
      <div
        aria-hidden="true"
        className="h-1.5 bg-gradient-to-r from-brand-blue via-brand-mint to-brand-pink"
      />
      <header className="border-b border-slate-100 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link
            to="/"
            aria-label="Trang chủ Bino"
            className="flex h-14 w-28 items-center justify-center overflow-hidden"
          >
            <img src="/logo.png" alt="Bino" className="h-28 w-auto max-w-none shrink-0" />
          </Link>
          <nav
            aria-label="Điều hướng sản phẩm"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Link
              to="/library"
              search={{ tab: undefined }}
              className="hidden rounded-xl px-3 py-2 hover:bg-slate-50 sm:block"
            >
              Học liệu
            </Link>
            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 rounded-full bg-brand-blue-soft px-4 py-2.5 text-sky-800"
            >
              <Sparkles size={16} />
              Trợ lý Bino
            </Link>
          </nav>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8 sm:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-12 h-72 w-72 rounded-full bg-brand-peach-soft/50 blur-3xl"
        />
        <Link
          to="/"
          className="relative mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Về trang chủ
        </Link>
        <section className="relative mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-teal-700 shadow-sm">
              <Sprout size={14} /> THEO DÕI TIẾN TRÌNH
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Mỗi ngày một <span className="text-teal-600">bước nhỏ</span>
              <span aria-hidden="true"> 🌱</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Ghi lại những khoảnh khắc cùng con. Mỗi nỗ lực đều xứng đáng được nhìn thấy.
            </p>
          </div>
          {selected && (
            <button
              onClick={() => titleRef.current?.focus()}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-[0_5px_0_#1684b4] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
            >
              <Plus size={18} />
              Ghi hoạt động mới
            </button>
          )}
        </section>
        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {error}
            <button className="font-bold underline" onClick={() => setRefresh((r) => r + 1)}>
              Thử tải lại
            </button>
          </div>
        )}
        {loading && !selected ? (
          <div role="status" className={`${panel} flex min-h-56 items-center justify-center gap-3`}>
            <Loader2 className="animate-spin text-brand-blue" />
            Đang mở hành trình của bé…
          </div>
        ) : !selected ? (
          <section className={`${panel} px-6 py-14 text-center`}>
            <span className="text-5xl" aria-hidden="true">
              🌻
            </span>
            <h2 className="mt-5 text-2xl font-bold text-slate-800">Bắt đầu từ những điều nhỏ bé</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
              Thêm hồ sơ cho bé để lưu hoạt động, nhìn lại hành trình và nhận gợi ý phù hợp.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/create-child"
                className="rounded-2xl bg-brand-blue px-5 py-3 font-bold text-white"
              >
                Tạo hồ sơ cho bé
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold"
              >
                Đăng nhập
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section
              className={`${panel} mb-6 flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6`}
              aria-label="Hồ sơ và thời gian theo dõi"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-yellow-soft text-3xl"
                >
                  {selected.avatar}
                </span>
                <div className="min-w-0">
                  <label htmlFor="progress-child" className="text-xs font-semibold text-slate-500">
                    ĐANG ĐỒNG HÀNH CÙNG
                  </label>
                  <select
                    id="progress-child"
                    value={child}
                    disabled={busy}
                    onChange={(e) => {
                      setChild(e.target.value);
                      const c = children.find((c) => c.id === e.target.value);
                      if (c) setActiveChild(c);
                    }}
                    className="mt-1 block w-full max-w-72 rounded-lg bg-transparent py-1 pr-5 text-lg font-bold text-slate-800 focus:outline-sky-600"
                  >
                    {children.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} · {c.age} tuổi
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <CalendarDays size={16} className="text-slate-400" />
                <span className="text-xs text-slate-500">
                  {dateLabel(start)} – {dateLabel(today)}
                </span>
                <div
                  className="flex rounded-xl bg-slate-100 p-1"
                  role="group"
                  aria-label="Khoảng thời gian"
                >
                  {([7, 30] as const).map((n) => (
                    <button
                      key={n}
                      aria-pressed={days === n}
                      onClick={() => setDays(n)}
                      className={`min-h-10 rounded-lg px-3 text-xs font-bold transition ${days === n ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      {n} ngày
                    </button>
                  ))}
                </div>
              </div>
            </section>
            <section
              aria-label="Tổng quan hoạt động đã ghi"
              className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-5"
            >
              {[
                {
                  label: "Hoạt động cùng con",
                  value: period.length,
                  unit: "hoạt động",
                  Icon: CheckCircle2,
                  bg: "bg-brand-blue-soft",
                  ink: "text-sky-700",
                },
                {
                  label: "Thời gian kết nối",
                  value: minutes,
                  unit: "phút",
                  Icon: Clock3,
                  bg: "bg-brand-mint-soft",
                  ink: "text-teal-700",
                },
                {
                  label: "Từ mới ghi nhận",
                  value: words,
                  unit: "từ",
                  Icon: BookOpen,
                  bg: "bg-brand-pink-soft",
                  ink: "text-rose-700",
                },
                {
                  label: "Ngày có hoạt động",
                  value: activeDays,
                  unit: `/ ${days} ngày`,
                  Icon: Heart,
                  bg: "bg-brand-yellow-soft",
                  ink: "text-amber-700",
                },
              ].map(({ label, value, unit, Icon, bg, ink }) => (
                <article key={label} className={`${panel} p-4 sm:p-5`}>
                  <div
                    className={`mb-4 grid h-10 w-10 place-items-center rounded-2xl ${bg} ${ink}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
                  <p className="flex flex-wrap items-baseline gap-2">
                    <strong className="text-3xl font-extrabold text-slate-800">
                      {loading ? "—" : value}
                    </strong>
                    <span className="text-xs text-slate-500">{unit}</span>
                  </p>
                </article>
              ))}
            </section>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <div className="min-w-0 space-y-6">
                <section className={`${panel} p-5 sm:p-7`} aria-labelledby="rhythm-heading">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 id="rhythm-heading" className="text-lg font-bold text-slate-800">
                        Nhịp đồng hành
                      </h2>
                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        Số hoạt động gia đình đã ghi mỗi ngày
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-mint-soft px-3 py-1.5 text-xs font-bold text-teal-800">
                      {days} ngày qua
                    </span>
                  </div>
                  {loading ? (
                    <p role="status" className="py-12 text-center text-sm text-slate-500">
                      Đang tải nhật ký…
                    </p>
                  ) : (
                    <>
                      <div
                        className="mt-8 flex h-36 items-end gap-1.5 border-b border-dashed border-slate-200 pb-1 sm:gap-2"
                        role="img"
                        aria-label={chart
                          .map((d) => `${dateLabel(d.date)}: ${d.count} hoạt động`)
                          .join("; ")}
                      >
                        {chart.map((d, i) => (
                          <div
                            key={i}
                            className="group relative flex h-full min-w-0 flex-1 items-end"
                          >
                            <div
                              title={`${dateLabel(d.date)}: ${d.count} hoạt động`}
                              className={`w-full rounded-t-lg ${d.count ? "bg-gradient-to-t from-brand-mint to-brand-blue" : "bg-slate-100"}`}
                              style={{
                                height: d.count ? `${Math.max(12, (d.count / max) * 100)}%` : "5px",
                              }}
                            />
                            {days === 7 && (
                              <span className="absolute -top-5 w-full text-center text-xs font-bold text-sky-800">
                                {d.count || ""}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div
                        aria-hidden="true"
                        className="mt-3 flex justify-between text-[11px] text-slate-400"
                      >
                        {(days === 7
                          ? chart
                          : chart.filter((_, i) => i === 0 || i === 14 || i === 29)
                        ).map((d, i) => (
                          <span key={i}>{dateLabel(d.date)}</span>
                        ))}
                      </div>
                      <p className="mt-6 rounded-2xl bg-brand-mint-soft/60 p-4 text-sm leading-6 text-teal-900">
                        {period.length
                          ? `${activeDays} ngày có những khoảnh khắc cùng con. Cứ đi theo nhịp của gia đình mình nhé.`
                          : "Hành trình đang chờ những ghi nhận đầu tiên. Chỉ vài phút bên con cũng là một khởi đầu đáng quý."}
                      </p>
                    </>
                  )}
                </section>
                <section className={`${panel} p-5 sm:p-7`} aria-labelledby="journal-heading">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 id="journal-heading" className="text-lg font-bold text-slate-800">
                      Những khoảnh khắc đã ghi
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                      {filtered.length}
                    </span>
                  </div>
                  <label htmlFor="journal-search" className="sr-only">
                    Tìm trong nhật ký
                  </label>
                  <input
                    id="journal-search"
                    type="search"
                    placeholder="Tìm hoạt động hoặc ghi chú…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`${field} mb-5 mt-0`}
                  />
                  {!loading && !filtered.length && (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center">
                      <Sprout className="mx-auto mb-3 text-teal-500" />
                      <p className="text-sm font-semibold">
                        {query
                          ? "Chưa tìm thấy hoạt động phù hợp"
                          : "Chưa có nhật ký trong khoảng thời gian này"}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {query
                          ? "Thử một từ khóa khác hoặc chọn khoảng thời gian dài hơn."
                          : "Ghi lại hoạt động đầu tiên để bắt đầu nhìn lại hành trình."}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {filtered.slice(0, visibleCount).map((e) => (
                      <article
                        key={e.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                      >
                        <div className="flex gap-3">
                          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-mint-soft text-teal-700">
                            <Check size={17} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="break-words text-sm font-bold text-slate-800">
                              {e.title}
                            </h3>
                            <time
                              dateTime={new Date(e.createdAt).toISOString()}
                              className="mt-1 block text-xs text-slate-400"
                            >
                              {new Date(e.createdAt).toLocaleString("vi-VN", {
                                day: "numeric",
                                month: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </time>
                            <div className="my-3 flex flex-wrap gap-2 text-[11px] font-semibold">
                              <span className="rounded-full bg-white px-2.5 py-1 text-slate-600">
                                {e.minutes} phút kết nối
                              </span>
                              {e.words > 0 && (
                                <span className="rounded-full bg-brand-pink-soft px-2.5 py-1 text-rose-800">
                                  {e.words} từ mới
                                </span>
                              )}
                            </div>
                            <p
                              className={`whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 ${expanded !== e.id ? "line-clamp-3" : ""}`}
                            >
                              {e.notes}
                            </p>
                            {e.notes.length > 120 && (
                              <button
                                aria-expanded={expanded === e.id}
                                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                                className="mt-2 min-h-10 text-xs font-bold text-sky-700"
                              >
                                {expanded === e.id ? "Thu gọn" : "Đọc thêm ghi chú"}
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  {filtered.length > visibleCount && (
                    <button
                      onClick={() => setVisibleCount((n) => n + 10)}
                      className="mt-5 min-h-11 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Xem thêm hoạt động ({filtered.length - visibleCount})
                    </button>
                  )}
                </section>
              </div>
              <aside className="min-w-0 space-y-6">
                <section
                  id="new-entry"
                  className={`${panel} scroll-mt-5 p-5 sm:p-7`}
                  aria-labelledby="record-heading"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-yellow-soft text-amber-700">
                      <Plus size={20} />
                    </span>
                    <div>
                      <h2 id="record-heading" className="text-lg font-bold text-slate-800">
                        Hôm nay con thế nào?
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Một ghi nhận nhỏ, một kỷ niệm đẹp.
                      </p>
                    </div>
                  </div>
                  {saved && (
                    <div
                      role="status"
                      className="mb-4 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800"
                    >
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>Đã lưu khoảnh khắc của gia đình!</span>
                      <button
                        aria-label="Đóng thông báo"
                        onClick={() => setSaved(false)}
                        className="ml-auto"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <form onSubmit={submit} className="space-y-4">
                    <fieldset disabled={busy || loading} className="space-y-4">
                      <label className="block text-xs font-bold text-slate-700">
                        Tên hoạt động <span className="text-rose-500">*</span>
                        <input
                          ref={titleRef}
                          name="title"
                          required
                          maxLength={200}
                          placeholder="Ví dụ: Chơi xe đồ chơi cùng con"
                          className={field}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block text-xs font-bold">
                          Thời lượng (phút) <span className="text-rose-500">*</span>
                          <input
                            name="minutes"
                            type="number"
                            required
                            min={1}
                            max={240}
                            defaultValue={10}
                            className={field}
                          />
                        </label>
                        <label className="block text-xs font-bold">
                          Từ mới ghi nhận
                          <input
                            name="words"
                            type="number"
                            required
                            min={0}
                            max={100}
                            defaultValue={0}
                            className={field}
                          />
                        </label>
                      </div>
                      <label className="block text-xs font-bold">
                        Điều bạn quan sát được <span className="text-rose-500">*</span>
                        <textarea
                          name="notes"
                          required
                          maxLength={4000}
                          rows={5}
                          placeholder="Con đã thử điều gì? Con cần bạn hỗ trợ ra sao? Ghi lại bằng lời của bạn nhé…"
                          className={`${field} resize-y`}
                        />
                      </label>
                      <p className="text-xs leading-6 text-slate-400">
                        Không cần ghi thật dài. Một phản ứng, một từ mới hay một niềm vui của con
                        đều đáng nhớ.
                      </p>
                      <button
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue px-4 py-3 text-sm font-bold text-white shadow-[0_4px_0_#1684b4] transition hover:brightness-105 disabled:opacity-60"
                        disabled={busy || loading || !child}
                      >
                        {busy ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <Heart size={17} />
                        )}
                        {busy ? "Đang lưu khoảnh khắc…" : "Lưu nhật ký cùng con"}
                      </button>
                    </fieldset>
                  </form>
                </section>
                <section className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-brand-blue-soft p-6">
                  <Sparkles className="mb-4 text-violet-500" size={25} />
                  <h2 className="text-lg font-bold text-slate-800">Bước tiếp theo, có Bino</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Dùng những ghi nhận của bạn để gợi ý hoạt động phù hợp với mục tiêu của con.
                  </p>
                  <Link
                    to="/ai-assistant"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-sm"
                  >
                    Khám phá lộ trình
                    <ArrowRight size={16} />
                  </Link>
                </section>
                <p className="px-2 text-xs leading-6 text-slate-400">
                  Số liệu phản ánh nhật ký gia đình đã ghi, không phải điểm đánh giá phát triển hay
                  chẩn đoán. Từ mới được tổng hợp theo các lần ghi nhận.
                </p>
              </aside>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
