import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const frontendEnv = loadEnv(mode, __dirname, "");
  const rootEnv = loadEnv(mode, path.resolve(__dirname, ".."), "");
  const googleClientId =
    process.env.VITE_GOOGLE_CLIENT_ID?.trim()
    || frontendEnv.VITE_GOOGLE_CLIENT_ID?.trim()
    || process.env.GOOGLE_CLIENT_ID?.trim()
    || rootEnv.GOOGLE_CLIENT_ID?.trim()
    || "";

  if (googleClientId) {
    process.env.VITE_GOOGLE_CLIENT_ID = googleClientId;
  }

  return ({
  server: {
    host: "::",
    port: 5173,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    hmr: {
      overlay: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:8081",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  });
});
