/// <reference types="vite/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start-client";
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

const Client = StartClient as any;

hydrateRoot(document.getElementById("root") || document, <Client router={router} />);
