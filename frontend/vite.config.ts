import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Frontend-only config. The dev proxy keeps the browser same-origin so the
// backend needs zero CORS changes (backend stays frozen per .clinerules).
const proxyTarget = process.env.TOKEY_API_PROXY_TARGET || "http://127.0.0.1:8787";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/v1": { target: proxyTarget, changeOrigin: true },
      "/health": { target: proxyTarget, changeOrigin: true },
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
});
