import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { vitePluginSitemap } from "./vite-plugin-sitemap";
import { vitePluginStaticSeo } from "./vite-plugin-static-seo";

// https://vitejs.dev/config/
// URL țintă: descoperavalea.github.io (repo numit descoperavalea.github.io) → base "/"
// Pentru project page (alt nume repo): setează VITE_BASE_PATH="/nume-repo/"
export default defineConfig(({ mode }) => {
  const base =
    process.env.VITE_BASE_PATH ??
    (mode === "development" ? "/" : "/");
  const baseNoSlash = base.replace(/\/$/, "");

  const plugins = [
    react(),
    mode === "development" && componentTagger(),
    vitePluginSitemap(),
    vitePluginStaticSeo(),
    baseNoSlash
      ? {
          name: "redirect-base-no-trailing-slash",
          configureServer(server: { middlewares: { use: (fn: (req: unknown, res: unknown, next: () => void) => void) => void } }) {
            server.middlewares.use((req, res, next) => {
              const r = req as { url?: string };
              const w = res as { statusCode: number; setHeader: (n: string, v: string) => void; end: () => void };
              const pathname = r.url?.split("?")[0] ?? "";
              const qs = r.url?.includes("?") ? r.url.slice(r.url.indexOf("?")) : "";
              if (pathname === baseNoSlash) {
                w.statusCode = 301;
                w.setHeader("Location", `${baseNoSlash}/${qs}`);
                w.end();
                return;
              }
              next();
            });
          },
        }
      : null,
  ].filter(Boolean);

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
