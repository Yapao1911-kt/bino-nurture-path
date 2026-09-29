import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, b as getServerFnById } from "./server-DzLy7LQ_.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-D2w7gumW.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$e = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      {
        name: "description",
        content: "Bino is an AI-powered early support ecosystem for children with developmental challenges."
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      {
        property: "og:description",
        content: "Bino is an AI-powered early support ecosystem for children with developmental challenges."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Lovable App" },
      {
        name: "twitter:description",
        content: "Bino is an AI-powered early support ecosystem for children with developmental challenges."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/876e195a-08dd-4bd6-82ed-ca9e0c15611b/id-preview-994ed363--eb0b7f03-f3b0-4081-b7cc-a1e089dee3cc.lovable.app-1780236384522.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/876e195a-08dd-4bd6-82ed-ca9e0c15611b/id-preview-994ed363--eb0b7f03-f3b0-4081-b7cc-a1e089dee3cc.lovable.app-1780236384522.png"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$e.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$d = () => import("./verify-DMJak0P6.mjs");
const Route$d = createFileRoute("/verify")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./progress-tracker-DtDFsSF0.mjs");
const Route$c = createFileRoute("/progress-tracker")({
  head: () => ({
    meta: [{
      title: "Theo dõi Tiến trình — Bino"
    }, {
      name: "description",
      content: "Theo dõi tiến trình phát triển của bé với biểu đồ trực quan và trợ lý AI Bino."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./premium-_TK40eKd.mjs");
const Route$b = createFileRoute("/premium")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./login-BP8vRvO4.mjs");
const Route$a = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
  head: () => ({
    meta: [{
      title: "Đăng nhập — Bino"
    }, {
      name: "description",
      content: "Đăng nhập vào hệ thống Bino để tiếp tục đồng hành cùng bé yêu trên lộ trình can thiệp sớm."
    }]
  })
});
const $$splitComponentImporter$9 = () => import("./library-BK28zwvW.mjs");
const Route$9 = createFileRoute("/library")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./lesson-builder-kgJUPmbo.mjs");
const Route$8 = createFileRoute("/lesson-builder")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  head: () => ({
    meta: [{
      title: "Lesson Builder Studio — Bino"
    }, {
      name: "description",
      content: "Thiết kế bài học trực quan với công cụ kéo thả dành cho giáo viên và phụ huynh."
    }]
  })
});
const $$splitComponentImporter$7 = () => import("./experts-B8scszYh.mjs");
const Route$7 = createFileRoute("/experts")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./create-child-CSUKlWum.mjs");
const Route$6 = createFileRoute("/create-child")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  head: () => ({
    meta: [{
      title: "Tạo hồ sơ cho bé — Bino"
    }, {
      name: "description",
      content: "Tạo hồ sơ mới cho trẻ để Bino xây dựng lộ trình can thiệp sớm cá nhân hóa."
    }]
  })
});
const $$splitComponentImporter$5 = () => import("./checkout-DoJYUaUc.mjs");
const Route$5 = createFileRoute("/checkout")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./ai-assistant-XK_hSN0t.mjs");
const Route$4 = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [{
      title: "Trợ lý AI — Bino"
    }, {
      name: "description",
      content: "Trợ lý AI dịu dàng của Bino giúp bạn xây dựng lộ trình can thiệp sớm cá nhân hóa cho bé."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-Blonk1cR.mjs");
const Route$3 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  head: () => ({
    meta: [{
      title: "Bino — Đồng hành cùng con trên hành trình can thiệp sớm"
    }, {
      name: "description",
      content: "Bino là hệ sinh thái AI dịu dàng, giúp cha mẹ và giáo viên xây dựng lộ trình học cá nhân hóa cho trẻ có nhu cầu đặc biệt."
    }]
  })
});
const $$splitComponentImporter$2 = () => import("./library.index-CSo6qrb0.mjs");
const Route$2 = createFileRoute("/library/")({
  validateSearch: (search) => ({
    tab: search.tab === "materials" ? "materials" : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./library.flashcards-Con5XYxr.mjs");
const Route$1 = createFileRoute("/library/flashcards")({
  validateSearch: (search) => {
    return {
      deck: search.deck
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const $$splitComponentImporter = () => import("./children-BTU5dmpx.mjs");
const Route = createFileRoute("/api/children")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const createChildFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("6269509e4819da66e4e98eb89a24db957367e609b0fc9ed37941f356a1d4c1d8"));
const VerifyRoute = Route$d.update({
  id: "/verify",
  path: "/verify",
  getParentRoute: () => Route$e
});
const ProgressTrackerRoute = Route$c.update({
  id: "/progress-tracker",
  path: "/progress-tracker",
  getParentRoute: () => Route$e
});
const PremiumRoute = Route$b.update({
  id: "/premium",
  path: "/premium",
  getParentRoute: () => Route$e
});
const LoginRoute = Route$a.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$e
});
const LibraryRoute = Route$9.update({
  id: "/library",
  path: "/library",
  getParentRoute: () => Route$e
});
const LessonBuilderRoute = Route$8.update({
  id: "/lesson-builder",
  path: "/lesson-builder",
  getParentRoute: () => Route$e
});
const ExpertsRoute = Route$7.update({
  id: "/experts",
  path: "/experts",
  getParentRoute: () => Route$e
});
const CreateChildRoute = Route$6.update({
  id: "/create-child",
  path: "/create-child",
  getParentRoute: () => Route$e
});
const CheckoutRoute = Route$5.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$e
});
const AiAssistantRoute = Route$4.update({
  id: "/ai-assistant",
  path: "/ai-assistant",
  getParentRoute: () => Route$e
});
const IndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$e
});
const LibraryIndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => LibraryRoute
});
const LibraryFlashcardsRoute = Route$1.update({
  id: "/flashcards",
  path: "/flashcards",
  getParentRoute: () => LibraryRoute
});
const ApiChildrenRoute = Route.update({
  id: "/api/children",
  path: "/api/children",
  getParentRoute: () => Route$e
});
const LibraryRouteChildren = {
  LibraryFlashcardsRoute,
  LibraryIndexRoute
};
const LibraryRouteWithChildren = LibraryRoute._addFileChildren(LibraryRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AiAssistantRoute,
  CheckoutRoute,
  CreateChildRoute,
  ExpertsRoute,
  LessonBuilderRoute,
  LibraryRoute: LibraryRouteWithChildren,
  LoginRoute,
  PremiumRoute,
  ProgressTrackerRoute,
  VerifyRoute,
  ApiChildrenRoute
};
const routeTree = Route$e._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$d as R,
  Route$2 as a,
  Route$1 as b,
  createChildFn as c,
  createSsrRpc as d,
  router as r
};
