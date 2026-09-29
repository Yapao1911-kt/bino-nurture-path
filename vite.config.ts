import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
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
