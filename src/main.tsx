import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

if (typeof window !== "undefined" && !(window as any).clarity) {
  (function (c: any, l: any, a: any, r: any, i: any) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y?.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", "yy6aw8c0f4");
}

const router = getRouter();

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
