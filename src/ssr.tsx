import { getRouter } from "./router";
import { StartServer } from "@tanstack/react-start/server";
import { createMemoryHistory } from "@tanstack/react-router";

export default async function render(url: string) {
  const router = getRouter();
  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  });
  router.update({
    history: memoryHistory,
  } as any);
  await router.load();

  // Actually with @tanstack/react-start, we typically don't manually render like this, 
  // but if the project is relying on it, we might need a default export.
  // Wait, startInstance handles it? Let's export startInstance from start.ts.
}
