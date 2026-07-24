// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/KI8SE/EXE201/GITHUB/EDUCare/node_modules/vite/dist/node/index.js";
import react from "file:///D:/KI8SE/EXE201/GITHUB/EDUCare/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/KI8SE/EXE201/GITHUB/EDUCare/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\KI8SE\\EXE201\\GITHUB\\EDUCare\\frontend";
var vite_config_default = defineConfig(({ mode }) => {
  const frontendEnv = loadEnv(mode, __vite_injected_original_dirname, "");
  const rootEnv = loadEnv(mode, path.resolve(__vite_injected_original_dirname, ".."), "");
  const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID?.trim() || frontendEnv.VITE_GOOGLE_CLIENT_ID?.trim() || process.env.GOOGLE_CLIENT_ID?.trim() || rootEnv.GOOGLE_CLIENT_ID?.trim() || "";
  if (googleClientId) {
    process.env.VITE_GOOGLE_CLIENT_ID = googleClientId;
  }
  return {
    server: {
      host: "::",
      port: 5173,
      strictPort: true,
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      hmr: {
        overlay: true
      },
      proxy: {
        "/api": {
          target: "http://localhost:8081",
          changeOrigin: true
        },
        "/ws": {
          target: "ws://localhost:8081",
          ws: true,
          changeOrigin: true
        }
      }
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxLSThTRVxcXFxFWEUyMDFcXFxcR0lUSFVCXFxcXEVEVUNhcmVcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEtJOFNFXFxcXEVYRTIwMVxcXFxHSVRIVUJcXFxcRURVQ2FyZVxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovS0k4U0UvRVhFMjAxL0dJVEhVQi9FRFVDYXJlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZnJvbnRlbmRFbnYgPSBsb2FkRW52KG1vZGUsIF9fZGlybmFtZSwgXCJcIik7XHJcbiAgY29uc3Qgcm9vdEVudiA9IGxvYWRFbnYobW9kZSwgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiKSwgXCJcIik7XHJcbiAgY29uc3QgZ29vZ2xlQ2xpZW50SWQgPVxyXG4gICAgcHJvY2Vzcy5lbnYuVklURV9HT09HTEVfQ0xJRU5UX0lEPy50cmltKClcclxuICAgIHx8IGZyb250ZW5kRW52LlZJVEVfR09PR0xFX0NMSUVOVF9JRD8udHJpbSgpXHJcbiAgICB8fCBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEPy50cmltKClcclxuICAgIHx8IHJvb3RFbnYuR09PR0xFX0NMSUVOVF9JRD8udHJpbSgpXHJcbiAgICB8fCBcIlwiO1xyXG5cclxuICBpZiAoZ29vZ2xlQ2xpZW50SWQpIHtcclxuICAgIHByb2Nlc3MuZW52LlZJVEVfR09PR0xFX0NMSUVOVF9JRCA9IGdvb2dsZUNsaWVudElkO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA1MTczLFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgXCJDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeVwiOiBcInNhbWUtb3JpZ2luLWFsbG93LXBvcHVwc1wiLFxyXG4gICAgICBcIlJlZmVycmVyLVBvbGljeVwiOiBcInN0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW5cIixcclxuICAgIH0sXHJcbiAgICBobXI6IHtcclxuICAgICAgb3ZlcmxheTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjgwODFcIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiL3dzXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwid3M6Ly9sb2NhbGhvc3Q6ODA4MVwiLFxyXG4gICAgICAgIHdzOiB0cnVlLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGNvbXBvbmVudFRhZ2dlcigpXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ULFNBQVMsY0FBYyxlQUFlO0FBQ3pWLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxjQUFjLFFBQVEsTUFBTSxrQ0FBVyxFQUFFO0FBQy9DLFFBQU0sVUFBVSxRQUFRLE1BQU0sS0FBSyxRQUFRLGtDQUFXLElBQUksR0FBRyxFQUFFO0FBQy9ELFFBQU0saUJBQ0osUUFBUSxJQUFJLHVCQUF1QixLQUFLLEtBQ3JDLFlBQVksdUJBQXVCLEtBQUssS0FDeEMsUUFBUSxJQUFJLGtCQUFrQixLQUFLLEtBQ25DLFFBQVEsa0JBQWtCLEtBQUssS0FDL0I7QUFFTCxNQUFJLGdCQUFnQjtBQUNsQixZQUFRLElBQUksd0JBQXdCO0FBQUEsRUFDdEM7QUFFQSxTQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixTQUFTO0FBQUEsUUFDUCw4QkFBOEI7QUFBQSxRQUM5QixtQkFBbUI7QUFBQSxNQUNyQjtBQUFBLE1BQ0EsS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxRQUNoQjtBQUFBLFFBQ0EsT0FBTztBQUFBLFVBQ0wsUUFBUTtBQUFBLFVBQ1IsSUFBSTtBQUFBLFVBQ0osY0FBYztBQUFBLFFBQ2hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxpQkFBaUIsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUM5RSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsRUFDQTtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
