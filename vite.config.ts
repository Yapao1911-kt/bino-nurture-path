import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    }
  },
  tanstackStart: {
    appDirectory: "src",
  },
  vite: {
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
