import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const asyncHooksPolyfillPath = path.resolve(__dirname, "src/lib/async-hooks-browser.ts");

function asyncHooksClientShim() {
  return {
    name: "async-hooks-client-shim",
    enforce: "pre" as const,
    resolveId(id: string, _importer: string | undefined, options?: { ssr?: boolean }) {
      if (!options?.ssr && (id === "node:async_hooks" || id === "async_hooks")) {
        return asyncHooksPolyfillPath;
      }
      if (id === "#tanstack-router-entry") {
        return path.resolve(__dirname, "src/router.tsx");
      }
      if (id === "#tanstack-start-entry") {
        return path.resolve(__dirname, "src/start.ts");
      }
      return null;
    },
  };
}

export default defineConfig({
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
  tanstackStart: {
    appDirectory: "src",
  },
  vite: {
    plugins: [asyncHooksClientShim()],
    resolve: {
      alias: [
        {
          find: /^(node:)?async_hooks$/,
          replacement: asyncHooksPolyfillPath,
        },
        {
          find: "#tanstack-router-entry",
          replacement: path.resolve(__dirname, "src/router.tsx"),
        },
        {
          find: "#tanstack-start-entry",
          replacement: path.resolve(__dirname, "src/start.ts"),
        },
      ],
    },
    optimizeDeps: {
      exclude: [
        "@tanstack/react-start",
        "@tanstack/react-start-client",
        "@tanstack/start-client-core",
        "@tanstack/start-storage-context",
      ],
      esbuildOptions: {
        plugins: [
          {
            name: "async-hooks-esbuild-shim",
            setup(build) {
              build.onResolve({ filter: /^(node:)?async_hooks$/ }, () => {
                return { path: asyncHooksPolyfillPath };
              });
              build.onResolve({ filter: /^#tanstack-router-entry$/ }, () => {
                return { path: path.resolve(__dirname, "src/router.tsx") };
              });
              build.onResolve({ filter: /^#tanstack-start-entry$/ }, () => {
                return { path: path.resolve(__dirname, "src/start.ts") };
              });
            },
          },
        ],
      },
    },
    ssr: {
      external: ["@prisma/client", "bcryptjs", "nodemailer", "prisma"],
    },
    build: {
      rollupOptions: {
        external: ["@prisma/client", "prisma"],
      },
    },
  },
});

