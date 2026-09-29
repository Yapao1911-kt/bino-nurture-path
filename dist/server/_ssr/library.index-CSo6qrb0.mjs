import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn, b as buttonVariants } from "./button-BXrfXN_b.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-4N6Vlhl8.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-l5z66tJ0.mjs";
import { C as Card, d as CardHeader, a as CardContent, c as CardFooter } from "./card-SSxiJ3nX.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { R as Root, P as Portal, a as Content, C as Close, T as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { R as Root2, P as Portal2, a as Content2, T as Title2, D as Description2, C as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { S as SiteFooter, l as loadStoredFlashcards, p as playFlashcardSound, a as speakVietnamese, g as getAllDefaultFlashcards, s as saveStoredFlashcards } from "./site-footer-YljkjNDz.mjs";
import { a as Route$2 } from "./router-BF6gDh8M.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, c as BookOpen, v as Funnel, $ as Search, M as Lock, w as Globe, L as Layers, F as FileText, E as ExternalLink, V as Play, a8 as Sparkles, D as Download, a0 as SearchX, W as Plus, y as Grid3x3, Y as RotateCcw, a as ArrowRight, ak as Volume2, Z as RotateCw, U as Pencil, ae as Trash2, g as Check, I as Image, aj as Video, am as X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-DzLy7LQ_.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const FALLBACK_IMAGE = "/bino-ai-mascot.png";
function ResourceCard({ resource, userType }) {
  const isLocked = resource.accessLevel === "PREMIUM" && userType === "free";
  const [showPreview, setShowPreview] = reactExports.useState(false);
  const [imageSrc, setImageSrc] = reactExports.useState(resource.imageUrl);
  reactExports.useEffect(() => {
    setImageSrc(resource.imageUrl);
  }, [resource.imageUrl]);
  const getFormatIcon = (format) => {
    switch (format) {
      case "Video":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-4 h-4" });
      case "PDF":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" });
      case "Hình ảnh":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" });
    }
  };
  const getActionIcon = (format) => {
    return format === "Video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" });
  };
  const getActionText = (format) => {
    return format === "Video" ? "Xem video" : "Tải xuống";
  };
  const downloadUrl = resource.videoUrl ?? resource.imageUrl;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col overflow-hidden transition-all hover:shadow-md h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 overflow-hidden bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: imageSrc,
          alt: resource.title,
          onError: () => setImageSrc(FALLBACK_IMAGE),
          className: "w-full h-full object-cover transition-transform hover:scale-105"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 flex gap-2", children: resource.accessLevel === "PREMIUM" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", className: "bg-[#FFB365] text-white hover:bg-[#E59845] border-none font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 mr-1" }),
        " Premium"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-[#6ED1CF] text-white hover:bg-[#4BB3B1] border-none font-bold", children: "Basic" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "bg-black/50 text-white border-none flex items-center gap-1 backdrop-blur-sm",
          children: [
            getFormatIcon(resource.format),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", children: resource.format })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-4 pb-2 flex-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mb-2", children: [
        resource.ageGroup.map((age) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs bg-slate-50", children: age }, age)),
        resource.difficulty.map((diff) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs bg-[#1FA7E1]/10 text-[#1FA7E1] border-[#1FA7E1]/30 font-semibold", children: diff }, diff))
      ] }),
      resource.sourceName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5 text-[#1FA7E1] shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: resource.sourceName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg line-clamp-2 leading-tight", children: resource.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 pt-0 flex-grow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-3", children: resource.description }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "p-4 pt-0 flex-none mt-auto", children: isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-amber-500 hover:bg-amber-600 text-white border-none", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/premium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 mr-2" }),
      "Nâng cấp để ",
      getActionText(resource.format).toLowerCase()
    ] }) }) : resource.flashcardHref ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/library/flashcards", search: { deck: resource.id }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 mr-2" }),
      "Mở flashcard"
    ] }) }) : resource.externalUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "text-xs",
          onClick: () => setShowPreview(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 mr-1" }),
            "Xem tóm tắt"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          className: "text-xs bg-[#1FA7E1] hover:bg-[#1994c8] text-white",
          asChild: true,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: resource.externalUrl, target: "_blank", rel: "noopener noreferrer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5 mr-1" }),
            "Mở bài viết"
          ] })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", onClick: () => setShowPreview(true), children: [
      getActionIcon(resource.format),
      "Xem trước"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showPreview, onOpenChange: setShowPreview, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1.5", children: [
          resource.sourceName && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs bg-sky-50 text-sky-700 border border-sky-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 mr-1 text-[#1FA7E1]" }),
            resource.sourceName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: resource.format })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 leading-snug", children: resource.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2 space-y-4", children: [
        resource.format === "Video" ? resource.videoUrl && (resource.videoUrl.includes("youtube") || resource.videoUrl.includes("youtu.be")) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full aspect-video bg-black rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            src: resource.videoUrl.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/").replace(/[?&]si=[^&]*/, ""),
            title: resource.title,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
            className: "w-full h-full rounded-lg"
          }
        ) }) : resource.videoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            src: resource.videoUrl,
            poster: imageSrc,
            controls: true,
            preload: "metadata",
            className: "w-full max-h-[60vh] bg-black rounded-lg"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imageSrc,
              alt: resource.title,
              className: "w-full h-full object-cover opacity-70"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-8 h-8 text-white fill-white ml-1" }) }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full h-52 sm:h-64 rounded-xl overflow-hidden bg-slate-100 border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imageSrc,
            alt: resource.title,
            onError: () => setImageSrc(FALLBACK_IMAGE),
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          resource.ageGroup.map((age) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs bg-slate-50", children: age }, age)),
          resource.difficulty.map((diff) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-xs bg-[#1FA7E1]/10 text-[#1FA7E1] border-[#1FA7E1]/30 font-semibold",
              children: diff
            },
            diff
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 text-sm leading-relaxed", children: resource.description }) }),
        resource.keyPoints && resource.keyPoints.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-amber-500" }),
            "Nội dung trọng tâm & Kỹ thuật can thiệp:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-slate-700 text-xs sm:text-sm pl-1", children: resource.keyPoints.map((point, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#1FA7E1] font-bold shrink-0", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: point })
          ] }, idx)) })
        ] }),
        resource.externalUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 bg-sky-50 border border-sky-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-sky-900", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Đọc bài viết đầy đủ với đầy đủ nội dung chuyên sâu từ nguồn chính thức." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-[#1FA7E1] hover:bg-[#1994c8] text-white shrink-0", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: resource.externalUrl, target: "_blank", rel: "noopener noreferrer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Truy cập nguồn"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex items-center sm:justify-between w-full pt-3 border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mr-auto hidden sm:block", children: [
          resource.format,
          " · ",
          Array.isArray(resource.category) ? resource.category.join(", ") : resource.category
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setShowPreview(false),
              className: "flex-1 sm:flex-none",
              children: "Đóng"
            }
          ),
          resource.externalUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "flex-1 sm:flex-none bg-[#1FA7E1] hover:bg-[#1994c8] text-white",
              asChild: true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: resource.externalUrl, target: "_blank", rel: "noopener noreferrer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 mr-2" }),
                "Mở bài viết gốc"
              ] })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 sm:flex-none",
              onClick: () => {
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = resource.title;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setShowPreview(false);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
                "Tải xuống"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const CATEGORY_MAP = {
  animal: {
    label: "Động vật",
    emoji: "🐾",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    bgGradient: "from-amber-400 to-orange-500",
    description: "Nhận biết các con vật quen thuộc kèm tiếng kêu vui nhộn"
  },
  food: {
    label: "Thực phẩm & Trái cây",
    emoji: "🍎",
    color: "bg-rose-100 text-rose-800 border-rose-300",
    bgGradient: "from-rose-400 to-pink-500",
    description: "Học tên các loại trái cây, rau củ và thực phẩm hằng ngày"
  },
  emotion: {
    label: "Cảm xúc",
    emoji: "😊",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    bgGradient: "from-purple-400 to-violet-500",
    description: "Nhận biết và gọi tên các cảm xúc cơ bản qua hình ảnh"
  },
  action: {
    label: "Hành động",
    emoji: "🏃",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    bgGradient: "from-blue-400 to-indigo-500",
    description: "Các hành động sinh hoạt hằng ngày giúp bé tự phục vụ"
  },
  object: {
    label: "Đồ vật",
    emoji: "🧸",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bgGradient: "from-emerald-400 to-teal-500",
    description: "Nhận biết các đồ vật thường gặp trong cuộc sống"
  },
  other: {
    label: "Khác",
    emoji: "✨",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    bgGradient: "from-slate-400 to-gray-500",
    description: "Các flashcard chủ đề khác"
  }
};
const PRESET_SUGGESTIONS = [
  {
    label: "Con thỏ",
    category: "animal",
    soundText: "Nhún nhảy!",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=600&auto=format&fit=crop"
  },
  {
    label: "Quả cam",
    category: "food",
    soundText: "Chua ngọt!",
    image: "/flashcards/cam.png"
  },
  {
    label: "Uống nước",
    category: "action",
    soundText: "Ực ực mát quá!",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=600&auto=format&fit=crop"
  },
  {
    label: "Ngạc nhiên",
    category: "emotion",
    soundText: "Ồ, lạ quá!",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop"
  },
  {
    label: "Quả bóng",
    category: "object",
    soundText: "Tưng tưng!",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=600&auto=format&fit=crop"
  }
];
const FALLBACK_FLASHCARD_IMG = "/flashcards/meo.png";
function FlashcardLibrary() {
  const [cards, setCards] = reactExports.useState([]);
  const [viewMode, setViewMode] = reactExports.useState("categories");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [flippedCardIds, setFlippedCardIds] = reactExports.useState({});
  const [isCreateOpen, setIsCreateOpen] = reactExports.useState(false);
  const [editingCard, setEditingCard] = reactExports.useState(null);
  const [deletingCard, setDeletingCard] = reactExports.useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = reactExports.useState(false);
  const [formLabel, setFormLabel] = reactExports.useState("");
  const [formCategory, setFormCategory] = reactExports.useState("animal");
  const [formSoundText, setFormSoundText] = reactExports.useState("");
  const [formImage, setFormImage] = reactExports.useState("");
  reactExports.useEffect(() => {
    setCards(loadStoredFlashcards());
  }, []);
  const handleSaveCards = (newCards) => {
    setCards(newCards);
    saveStoredFlashcards(newCards);
  };
  const openCreateDialog = () => {
    setFormLabel("");
    setFormCategory("animal");
    setFormSoundText("");
    setFormImage("");
    setIsCreateOpen(true);
  };
  const openEditDialog = (card) => {
    setEditingCard(card);
    setFormLabel(card.label);
    setFormCategory(card.category);
    setFormSoundText(card.soundText || "");
    setFormImage(card.image);
  };
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formLabel.trim()) return;
    const newCard = {
      id: `custom-${Date.now()}`,
      label: formLabel.trim(),
      category: formCategory,
      soundText: formSoundText.trim() || void 0,
      image: formImage.trim() || FALLBACK_FLASHCARD_IMG,
      isCustom: true
    };
    const updated = [newCard, ...cards];
    handleSaveCards(updated);
    setIsCreateOpen(false);
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingCard || !formLabel.trim()) return;
    const updated = cards.map((c) => {
      if (c.id === editingCard.id) {
        return {
          ...c,
          label: formLabel.trim(),
          category: formCategory,
          soundText: formSoundText.trim() || void 0,
          image: formImage.trim() || c.image
        };
      }
      return c;
    });
    handleSaveCards(updated);
    setEditingCard(null);
  };
  const handleDeleteConfirm = () => {
    if (!deletingCard) return;
    const updated = cards.filter((c) => c.id !== deletingCard.id);
    handleSaveCards(updated);
    setDeletingCard(null);
  };
  const handleResetToDefault = () => {
    const defaults = getAllDefaultFlashcards();
    handleSaveCards(defaults);
    setIsResetConfirmOpen(false);
  };
  const toggleFlip = (id) => {
    setFlippedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const categoryStats = reactExports.useMemo(() => {
    const stats = {};
    for (const cat of Object.keys(CATEGORY_MAP)) {
      const catCards = cards.filter((c) => c.category === cat);
      stats[cat] = {
        count: catCards.length,
        sampleImages: catCards.slice(0, 4).map((c) => c.image)
      };
    }
    return stats;
  }, [cards]);
  const filteredCards = reactExports.useMemo(() => {
    return cards.filter((card) => {
      if (selectedCategory !== "all" && card.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchLabel = card.label.toLowerCase().includes(q);
        const matchSound = card.soundText?.toLowerCase().includes(q);
        const matchCategory = CATEGORY_MAP[card.category]?.label.toLowerCase().includes(q);
        if (!matchLabel && !matchSound && !matchCategory) return false;
      }
      return true;
    });
  }, [cards, selectedCategory, searchQuery]);
  const categoriesWithCards = reactExports.useMemo(() => {
    return Object.keys(CATEGORY_MAP).filter(
      (cat) => (categoryStats[cat]?.count ?? 0) > 0
    );
  }, [categoryStats]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-sky-100 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🎯" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-900", children: "Kho Học liệu Flashcard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#1FA7E1] text-white hover:bg-[#1994c8] border-none font-bold", children: [
            cards.length,
            " thẻ"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 max-w-2xl", children: "Học liệu thẻ tương tác đa giác quan: nhận biết con vật, cảm xúc, sinh hoạt và từ vựng hằng ngày kèm hình ảnh trực quan và giọng đọc chuẩn tiếng Việt." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2.5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openCreateDialog,
            className: "bg-[#1FA7E1] hover:bg-[#178ebf] text-white shadow-sm font-semibold",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
              "Tạo Flashcard mới"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "bg-white hover:bg-slate-50 border-slate-200",
            onClick: () => setViewMode(viewMode === "categories" ? "all-cards" : "categories"),
            children: viewMode === "categories" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-4 h-4 mr-1.5 text-primary" }),
              "Xem tất cả thẻ"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 mr-1.5 text-primary" }),
              "Xem theo chủ đề"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "bg-white hover:bg-slate-50 border-slate-200", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/library/flashcards", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 mr-1.5 text-primary" }),
          "Luyện tập Quizlet"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setIsResetConfirmOpen(true),
            className: "text-xs text-slate-500 hover:text-slate-700",
            title: "Khôi phục 30 thẻ mẫu ban đầu",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5 mr-1" }),
              "Khôi phục mẫu"
            ]
          }
        )
      ] })
    ] }) }),
    viewMode === "categories" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500 font-medium", children: "📂 Chọn chủ đề bạn muốn luyện tập — Bấm vào để mở bài flashcard tương ứng" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5", children: categoriesWithCards.map((cat) => {
        const meta = CATEGORY_MAP[cat];
        const stats = categoryStats[cat];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/library/flashcards",
            search: { deck: cat },
            className: "block group",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-200 cursor-pointer h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-gradient-to-br ${meta.bgGradient} p-5 text-white relative`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: meta.emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg leading-tight", children: meta.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80 text-xs mt-0.5", children: [
                      stats.count,
                      " thẻ"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: meta.description }),
                stats.sampleImages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  stats.sampleImages.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: img,
                          alt: "",
                          onError: (e) => {
                            e.target.src = FALLBACK_FLASHCARD_IMG;
                          },
                          className: "max-h-full max-w-full object-contain"
                        }
                      )
                    },
                    idx
                  )),
                  stats.count > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-500 font-semibold", children: [
                    "+",
                    stats.count - 4
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-[#1FA7E1] font-semibold group-hover:underline pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
                  "Bắt đầu luyện tập"
                ] })
              ] })
            ] })
          },
          cat
        );
      }) })
    ] }) : (
      /* ===== VIEW MODE: ALL CARDS (Individual) ===== */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-xl border shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                placeholder: "Tìm kiếm flashcard theo tên từ vựng, tiếng kêu (ví dụ: con mèo, quả cam, vui vẻ)...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9 pr-8 bg-slate-50 border-slate-200 text-sm w-full"
              }
            ),
            searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSearchQuery(""),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold p-1",
                children: "✕"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-sm no-scrollbar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: selectedCategory === "all" ? "default" : "outline",
                size: "sm",
                onClick: () => setSelectedCategory("all"),
                className: `rounded-full h-8 text-xs font-semibold ${selectedCategory === "all" ? "bg-[#1FA7E1] hover:bg-[#1994c8] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`,
                children: [
                  "Tất cả (",
                  cards.length,
                  ")"
                ]
              }
            ),
            Object.keys(CATEGORY_MAP).map((cat) => {
              const count = cards.filter((c) => c.category === cat).length;
              const meta = CATEGORY_MAP[cat];
              const isSelected = selectedCategory === cat;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: isSelected ? "default" : "outline",
                  size: "sm",
                  onClick: () => setSelectedCategory(cat),
                  className: `rounded-full h-8 text-xs font-semibold shrink-0 ${isSelected ? "bg-[#1FA7E1] hover:bg-[#1994c8] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: meta.emoji }),
                    meta.label,
                    " (",
                    count,
                    ")"
                  ]
                },
                cat
              );
            })
          ] })
        ] }),
        filteredCards.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5", children: filteredCards.map((card) => {
          const isFlipped = Boolean(flippedCardIds[card.id]);
          const meta = CATEGORY_MAP[card.category] || CATEGORY_MAP.other;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "group relative overflow-hidden transition-all duration-200 hover:shadow-md border border-slate-200 flex flex-col bg-white",
              children: !isFlipped ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b border-slate-100", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: card.image,
                      alt: card.label,
                      onError: (e) => {
                        e.target.src = FALLBACK_FLASHCARD_IMG;
                      },
                      className: "max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs font-medium border ${meta.color} bg-white/90 backdrop-blur-sm shadow-xs`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: meta.emoji }),
                          meta.label
                        ]
                      }
                    ),
                    card.isCustom && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-amber-500 text-white border-none", children: "Tự tạo" })
                  ] }),
                  card.soundText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-xs font-medium", children: [
                    "🎵 ",
                    card.soundText
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex-grow flex flex-col justify-between space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-xl text-slate-900 leading-tight", children: card.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "secondary",
                        onClick: (e) => {
                          e.stopPropagation();
                          playFlashcardSound(card);
                        },
                        className: "h-9 w-9 rounded-full bg-sky-100 text-[#1FA7E1] hover:bg-sky-200 hover:text-[#178ebf] shrink-0",
                        title: "Phát âm từ vựng",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleFlip(card.id),
                        className: "flex items-center gap-1 text-[#1FA7E1] hover:underline font-medium",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "w-3.5 h-3.5" }),
                          "Lật mặt sau"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          onClick: (e) => {
                            e.stopPropagation();
                            openEditDialog(card);
                          },
                          className: "h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100",
                          title: "Chỉnh sửa thẻ",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          onClick: (e) => {
                            e.stopPropagation();
                            setDeletingCard(card);
                          },
                          className: "h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50",
                          title: "Xoá thẻ",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }) : (
                /* Back Side */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-[300px] justify-between p-5 bg-gradient-to-b from-sky-50/50 to-white", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-xs font-medium border ${meta.color}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: meta.emoji }),
                            meta.label
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 font-semibold uppercase tracking-wider", children: "Mặt sau" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-2xl text-slate-900", children: card.label }),
                      card.soundText && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[#1FA7E1] font-semibold", children: [
                        '"',
                        card.soundText,
                        '"'
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 shadow-2xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-800 flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }),
                        "Gợi ý tương tác cùng con:"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "leading-relaxed", children: [
                        "Chỉ vào thẻ và hỏi bé: ",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
                          '"',
                          card.label,
                          ' làm như thế nào nhỉ?"'
                        ] }),
                        " hoặc khuyến khích bé nói lặp lại từ này 2-3 lần."
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-slate-100 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => toggleFlip(card.id),
                        className: "text-xs text-slate-600 hover:text-slate-900",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "w-3.5 h-3.5 mr-1" }),
                          "Lật lại mặt trước"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        onClick: () => playFlashcardSound(card),
                        className: "bg-[#1FA7E1] hover:bg-[#1994c8] text-white text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-3.5 h-3.5 mr-1" }),
                          "Nghe đọc"
                        ]
                      }
                    )
                  ] })
                ] })
              )
            },
            card.id
          );
        }) }) : (
          /* Empty State */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-3 text-[#1FA7E1]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-7 h-7" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-slate-900 mb-1", children: "Không tìm thấy flashcard nào" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 max-w-md mb-5", children: "Thử thay đổi bộ lọc, từ khóa tìm kiếm hoặc tạo một thẻ flashcard mới cho bé ngay bên dưới." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreateDialog, className: "bg-[#1FA7E1] hover:bg-[#1994c8] text-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
              "Tạo Flashcard mới"
            ] })
          ] })
        )
      ] })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isCreateOpen, onOpenChange: setIsCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#1FA7E1] text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
          "Tạo học liệu tương tác"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900", children: "Thêm Flashcard mới" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs text-slate-500", children: "Tạo thẻ học từ vựng cho bé với hình ảnh trực quan, tiếng kêu và giọng đọc tiếng Việt." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateSubmit, className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold text-slate-700", children: [
            "Từ vựng / Tên thẻ ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Ví dụ: Con thỏ, Quả táo, Uống nước, Vui vẻ...",
              value: formLabel,
              onChange: (e) => setFormLabel(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Chủ đề phân loại" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: formCategory,
              onValueChange: (val) => setFormCategory(val),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Chọn chủ đề" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.keys(CATEGORY_MAP).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: cat, children: [
                  CATEGORY_MAP[cat].emoji,
                  " ",
                  CATEGORY_MAP[cat].label
                ] }, cat)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Tiếng kêu / Âm thanh vui nhộn (Tùy chọn)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Ví dụ: Meo meo!, Gâu gâu!, Chua ngọt!, Ha ha!",
              value: formSoundText,
              onChange: (e) => setFormSoundText(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Link hình ảnh (URL)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "https://... hoặc đường dẫn ảnh",
              value: formImage,
              onChange: (e) => setFormImage(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-500", children: "Gợi ý mẫu nhanh:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: PRESET_SUGGESTIONS.map((preset, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "h-7 text-xs bg-slate-50 hover:bg-slate-100",
              onClick: () => {
                setFormLabel(preset.label);
                setFormCategory(preset.category);
                setFormSoundText(preset.soundText);
                setFormImage(preset.image);
              },
              children: [
                "+ ",
                preset.label
              ]
            },
            idx
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg bg-white border overflow-hidden flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: formImage || FALLBACK_FLASHCARD_IMG,
              alt: "Xem trước",
              onError: (e) => {
                e.target.src = FALLBACK_FLASHCARD_IMG;
              },
              className: "max-h-full max-w-full object-contain"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-grow min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: "Xem trước thẻ:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900 truncate", children: formLabel || "Tên từ vựng" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
              CATEGORY_MAP[formCategory]?.emoji,
              " ",
              CATEGORY_MAP[formCategory]?.label,
              formSoundText ? ` · "${formSoundText}"` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: () => speakVietnamese(formLabel || "Xem trước"),
              className: "shrink-0 text-xs",
              title: "Nghe thử",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-3.5 h-3.5 mr-1 text-[#1FA7E1]" }),
                "Nghe thử"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setIsCreateOpen(false), children: "Hủy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "bg-[#1FA7E1] hover:bg-[#1994c8] text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-1.5" }),
            "Tạo Flashcard"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: Boolean(editingCard), onOpenChange: (open) => !open && setEditingCard(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-slate-700 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4 text-[#1FA7E1]" }),
          "Chỉnh sửa học liệu"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900", children: "Chỉnh sửa Flashcard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEditSubmit, className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold text-slate-700", children: [
            "Từ vựng / Tên thẻ ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: formLabel,
              onChange: (e) => setFormLabel(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Chủ đề phân loại" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: formCategory,
              onValueChange: (val) => setFormCategory(val),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Chọn chủ đề" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.keys(CATEGORY_MAP).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: cat, children: [
                  CATEGORY_MAP[cat].emoji,
                  " ",
                  CATEGORY_MAP[cat].label
                ] }, cat)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Tiếng kêu / Âm thanh vui nhộn" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: formSoundText,
              onChange: (e) => setFormSoundText(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Link hình ảnh (URL)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: formImage,
              onChange: (e) => setFormImage(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg bg-white border overflow-hidden flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: formImage || FALLBACK_FLASHCARD_IMG,
              alt: "Xem trước",
              onError: (e) => {
                e.target.src = FALLBACK_FLASHCARD_IMG;
              },
              className: "max-h-full max-w-full object-contain"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-grow min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: "Xem trước:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900 truncate", children: formLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
              CATEGORY_MAP[formCategory]?.emoji,
              " ",
              CATEGORY_MAP[formCategory]?.label,
              formSoundText ? ` · "${formSoundText}"` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: () => speakVietnamese(formLabel),
              className: "shrink-0 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-3.5 h-3.5 mr-1 text-[#1FA7E1]" }),
                "Nghe"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setEditingCard(null), children: "Hủy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "bg-[#1FA7E1] hover:bg-[#1994c8] text-white", children: "Lưu thay đổi" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: Boolean(deletingCard), onOpenChange: (open) => !open && setDeletingCard(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "text-rose-600 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5" }),
          "Xóa thẻ Flashcard?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-sm text-slate-600", children: [
          "Bạn có chắc chắn muốn xóa thẻ",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900", children: [
            '"',
            deletingCard?.label,
            '"'
          ] }),
          " khỏi Kho học liệu không? Hành động này sẽ xóa thẻ khỏi danh sách của bạn."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Hủy bỏ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleDeleteConfirm,
            className: "bg-rose-600 hover:bg-rose-700 text-white",
            children: "Xác nhận xóa"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: isResetConfirmOpen, onOpenChange: setIsResetConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "text-slate-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-5 h-5 text-[#1FA7E1]" }),
          "Khôi phục kho thẻ mặc định?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "text-sm text-slate-600", children: "Hành động này sẽ khôi phục lại toàn bộ 30 thẻ flashcard mẫu chuẩn (động vật, thực phẩm, cảm xúc, hành động) về trạng thái gốc của hệ thống." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Hủy bỏ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleResetToDefault,
            className: "bg-[#1FA7E1] hover:bg-[#1994c8] text-white",
            children: "Khôi phục ngay"
          }
        )
      ] })
    ] }) })
  ] });
}
const allResources = [
  {
    id: "k1",
    title: "Video kể chuyện tương tác cho bé",
    description: "Video kể chuyện trực quan giúp bé luyện chú ý, lắng nghe và làm quen với các tình huống giao tiếp đơn giản.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi"],
    difficulty: ["Chậm ngôn ngữ", "Tự kỷ (ASD)"],
    format: "Video",
    accessLevel: "BASIC",
    imageUrl: "/bino-ai-mascot.png",
    videoUrl: "/videos/video-ke-chuyen-h264.mp4"
  },
  {
    id: "m-vitreemkhuyettat-182",
    title: "Các dạng khuyết tật ở trẻ: Biểu hiện và hướng can thiệp",
    description: "Tổng quan 6 dạng khuyết tật ở trẻ theo quy định hiện hành (vận động, nghe nói, thị giác, thần kinh - tâm thần, trí tuệ), dấu hiệu nhận biết sớm và phương pháp can thiệp phục hồi chức năng giúp trẻ hòa nhập cộng đồng.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Khó khăn học tập", "Chậm ngôn ngữ", "Tự kỷ (ASD)"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "https://vitreemkhuyettat.org/qvtekt/Upload/news/cac-dang-khuyet-tat-o-tre-1.jpg",
    externalUrl: "https://vitreemkhuyettat.org/cac-dang-khuyet-tat-o-tre-bieu-hien-va-huong-can-thiep-182.html",
    sourceName: "Quỹ Vì Trẻ Em Khuyết Tật Việt Nam",
    keyPoints: [
      "Quy định 6 dạng khuyết tật chính: Vận động, nghe - nói, thị giác, thần kinh - tâm thần, trí tuệ và khuyết tật khác.",
      "Thực trạng tại Việt Nam: Tỷ lệ khuyết tật ở trẻ là 2,74% (2-4 tuổi) và 2,81% (5-17 tuổi); tỷ lệ phát hiện muộn còn cao do thiếu công cụ chuyên môn.",
      "Dấu hiệu cảnh báo sớm: Trẻ chậm phản xạ với lời nói/âm thanh, khó khăn trong vận động thô và tinh, chậm phát triển ngôn ngữ so với mốc tuổi.",
      "Phương hướng can thiệp: Kết hợp phục hồi chức năng y học, can thiệp tâm lý - giáo dục đặc biệt và thúc đẩy môi trường giáo dục hòa nhập."
    ]
  },
  {
    id: "m-rongviet-tangdong",
    title: "Những kỹ thuật tương tác với trẻ tăng động",
    description: "Cẩm nang kỹ thuật thực hành cho cha mẹ và thầy cô: xây dựng môi trường học tập linh hoạt, khen ngợi tự kiểm soát, hỗ trợ 1 kèm 1 và cơ chế phối hợp chặt chẽ gia đình - nhà trường.",
    category: "Kiến thức",
    ageGroup: ["3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Tăng động giảm chú ý (ADHD)"],
    format: "Bài viết",
    accessLevel: "BASIC",
    imageUrl: "https://rongviet.edu.vn/images/bai-viet/cac-hoat-dong/can-thiep-giao-duc/tham-khao/full-nhung-ky-thuat-tuong-tac-voi-tre-tang-dong-1.jpg",
    externalUrl: "https://rongviet.edu.vn/cac-hoat-dong/can-thiep-giao-duc/tham-khao/nhung-ky-thuat-tuong-tac-voi-tre-tang-dong",
    sourceName: "RongViet Education (Rồng Việt)",
    keyPoints: [
      "1. Môi trường học tập phù hợp: Giao việc có tính kích thích cao, cho phép di chuyển linh hoạt mỗi 15 phút, sắp xếp chỗ ngồi gần người dạy để giảm xao nhãng.",
      "2. Kỹ thuật tương tác: Khen ngợi nỗ lực tự kiểm soát, hỗ trợ cá nhân 1-kèm-1 khi bắt đầu nhiệm vụ, gọi tên trẻ thường xuyên, dùng tín hiệu chạm vai để chuyển hướng chú ý.",
      "3. Thích ứng đặc điểm trẻ: Đa dạng hóa các hoạt động, cho phép sử dụng bàn phím thay viết tay, rút ngắn bài tập, thiết kế 'góc điều chỉnh' yên tĩnh giúp trẻ tự xoa dịu.",
      "4. Phối hợp gia đình - nhà trường: Ngăn ngừa trêu chọc trong lớp học, trao đổi thông tin định kỳ qua email/sổ liên lạc, tổ chức nhóm kỹ năng xã hội bạn bè."
    ]
  },
  {
    id: "m-byt-phcn-14",
    title: "Tài liệu số 14: Phục hồi chức năng trẻ chậm phát triển trí tuệ",
    description: "Cẩm nang chuyên sâu của Bộ Y tế về PHCN dựa vào cộng đồng: hướng dẫn theo dõi bảng mốc phát triển 0-15 tuổi, 7 bài tập vận động trị liệu, hoạt động trị liệu tự phục vụ và kỹ thuật giao tiếp sớm.",
    category: "Kiến thức",
    ageGroup: ["0-3 tuổi", "3-6 tuổi", "6-12 tuổi"],
    difficulty: ["Chậm ngôn ngữ", "Khó khăn học tập", "Tự kỷ (ASD)"],
    format: "PDF",
    accessLevel: "BASIC",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop",
    sourceName: "Bộ Y tế & Ủy ban Y tế Hà Lan - Việt Nam (MCNV)",
    keyPoints: [
      "Bảng chuẩn mốc phát triển thần kinh - vận động và ngôn ngữ - giao tiếp trẻ em từ 1 tháng đến 15 tuổi.",
      "7 bài tập vận động trị liệu chuẩn: Xoa bóp cơ tay/chân/thân, tạo thuận nâng đầu, tập lẫy, giữ thăng bằng ngồi, tập bò trên đùi, ngồi xổm và đứng bám có trợ giúp.",
      "Hoạt động trị liệu sinh hoạt: Chia nhỏ quy trình thành 5 bước (ví dụ: mặc áo, đi dép, xúc thìa ăn cơm) giúp trẻ rèn tính tự lập.",
      "Kích thích giao tiếp sớm: Rèn phản xạ nhìn/nghe, kỹ năng 'bắt chước & lần lượt' (chơi ú oà, lăn bóng, chơi giả vờ), học từ vựng qua cặp thẻ tranh đối lập."
    ]
  }
];
function LearningLibrary({ initialTab = "Kiến thức", userType }) {
  const [activeTab, setActiveTab] = reactExports.useState(initialTab);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [ageFilter, setAgeFilter] = reactExports.useState("all");
  const [difficultyFilter, setDifficultyFilter] = reactExports.useState("all");
  const [formatFilter, setFormatFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const clearFilters = () => {
    setAgeFilter("all");
    setDifficultyFilter("all");
    setFormatFilter("all");
    setSearchQuery("");
  };
  const filteredResources = reactExports.useMemo(() => {
    return allResources.filter((resource) => {
      const matchCategory = Array.isArray(resource.category) ? resource.category.includes(activeTab) : resource.category === activeTab;
      if (!matchCategory) return false;
      if (ageFilter !== "all" && !resource.ageGroup.includes(ageFilter)) return false;
      if (difficultyFilter !== "all" && !resource.difficulty.includes(difficultyFilter))
        return false;
      if (formatFilter !== "all" && resource.format !== formatFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = resource.title.toLowerCase().includes(q);
        const matchDesc = resource.description.toLowerCase().includes(q);
        const matchSource = resource.sourceName?.toLowerCase().includes(q);
        const matchKeyPoints = resource.keyPoints?.some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSource && !matchKeyPoints) return false;
      }
      return true;
    });
  }, [activeTab, ageFilter, difficultyFilter, formatFilter, searchQuery]);
  const activeFilterCount = [
    ageFilter !== "all",
    difficultyFilter !== "all",
    formatFilter !== "all",
    Boolean(searchQuery.trim())
  ].filter(Boolean).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Tabs,
    {
      value: activeTab,
      onValueChange: (val) => setActiveTab(val),
      className: "w-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full md:w-[480px] grid-cols-2 mb-6 h-12 p-1.5 rounded-2xl bg-slate-100 border border-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "Kiến thức",
              className: "rounded-xl font-bold transition-all data-[state=active]:bg-[#7274ED] data-[state=active]:text-white data-[state=active]:shadow-md",
              children: [
                "📚 Thư viện Kiến thức (",
                allResources.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "Học liệu",
              className: "rounded-xl font-bold transition-all data-[state=active]:bg-[#1FA7E1] data-[state=active]:text-white data-[state=active]:shadow-md",
              children: "🎯 Thư viện Học liệu (Flashcard)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "Kiến thức", className: "mt-0 outline-none space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-xl shadow-sm border space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-slate-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-[#7274ED]" }),
                "Bộ lọc & Tìm kiếm bài viết kiến thức",
                activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full", children: activeFilterCount })
              ] }),
              activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: clearFilters, className: "h-8 text-xs", children: "Xóa bộ lọc" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "text",
                  placeholder: "Tìm kiếm bài viết, tài liệu y khoa, kỹ thuật can thiệp...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "pl-9 pr-8 bg-slate-50 border-slate-200 text-sm"
                }
              ),
              searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSearchQuery(""),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold p-1",
                  children: "✕"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: ageFilter, onValueChange: setAgeFilter, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Độ tuổi" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả độ tuổi" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "0-3 tuổi", children: "0-3 tuổi" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "3-6 tuổi", children: "3-6 tuổi" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6-12 tuổi", children: "6-12 tuổi" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: difficultyFilter, onValueChange: setDifficultyFilter, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Loại khó khăn" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả vấn đề" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Tự kỷ (ASD)", children: "Tự kỷ (ASD)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Tăng động giảm chú ý (ADHD)", children: "Tăng động giảm chú ý (ADHD)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Chậm ngôn ngữ", children: "Chậm ngôn ngữ" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Khó khăn học tập", children: "Khó khăn học tập" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formatFilter, onValueChange: setFormatFilter, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Định dạng tệp" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả định dạng" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Video", children: "Video" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Bài viết", children: "Bài viết" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PDF", children: "PDF" })
                ] })
              ] })
            ] })
          ] }),
          filteredResources.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredResources.map((resource) => /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceCard, { resource, userType }, resource.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
        ] }, "Kiến thức"),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "Học liệu", className: "mt-0 outline-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlashcardLibrary, {}) }, "Học liệu")
      ]
    }
  ) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-lg border border-dashed", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchX, { className: "w-6 h-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-1", children: "Không tìm thấy tài liệu" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 max-w-sm", children: "Thử thay đổi hoặc xóa bớt các bộ lọc để xem thêm tài nguyên có sẵn trong thư viện." })
  ] });
}
function LibraryPage() {
  const {
    tab
  } = Route$2.useSearch();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          "Quay lại"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#75D06A] font-bold", children: "👑 Premium" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-foreground", children: "Thư viện Học liệu" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground", children: "Khám phá các tài nguyên giáo dục được thiết kế để hỗ trợ phát triển của con bạn" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LearningLibrary, { initialTab: tab === "materials" ? "Học liệu" : "Kiến thức", userType: "premium" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  LibraryPage as component
};
