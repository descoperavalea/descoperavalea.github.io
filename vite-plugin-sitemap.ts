import fs from "fs";
import path from "path";

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly" as const, priority: "1.0" },
  { path: "/despre", changefreq: "monthly" as const, priority: "0.8" },
  { path: "/galerie", changefreq: "weekly" as const, priority: "0.9" },
  { path: "/video", changefreq: "weekly" as const, priority: "0.9" },
  { path: "/blog", changefreq: "weekly" as const, priority: "0.9" },
  { path: "/contact", changefreq: "monthly" as const, priority: "0.7" },
];

function parseFrontmatter(raw: string): Record<string, string> {
  const FRONTMATTER_BOUNDARY = "---";
  const trimmed = raw.trimStart();
  if (!trimmed.startsWith(FRONTMATTER_BOUNDARY)) return {};
  const endIndex = trimmed.indexOf(`\n${FRONTMATTER_BOUNDARY}`, FRONTMATTER_BOUNDARY.length);
  if (endIndex === -1) return {};
  const block = trimmed.slice(FRONTMATTER_BOUNDARY.length, endIndex).trim();
  const data: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
      value = value.slice(1, -1);
    data[line.slice(0, idx).trim()] = value;
  }
  return data;
}

function getBlogSlugs(contentDir: string): { slug: string; lastmod?: string }[] {
  const blogDir = path.join(contentDir, "blog");
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const fullPath = path.join(blogDir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const data = parseFrontmatter(raw);
    const slug = data.slug || file.replace(/\.md$/, "");
    const lastmod = data.dateAdded ? new Date(data.dateAdded).toISOString().slice(0, 10) : undefined;
    return { slug, lastmod };
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function vitePluginSitemap() {
  let outDir: string;
  let baseUrl: string;
  let contentDir: string;
  let publicDir: string;

  return {
    name: "vite-plugin-sitemap",
    configResolved(config: { root: string; outDir: string; base: string }) {
      outDir = path.resolve(config.root, config.outDir || "dist");
      const base = config.base === "/" ? "" : config.base.replace(/\/$/, "");
      baseUrl =
        process.env.VITE_SITE_URL ||
        process.env.SITE_URL ||
        "https://descoperavalea.github.io";
      baseUrl = baseUrl.replace(/\/$/, "");
      if (base) baseUrl += base;
      contentDir = path.resolve(config.root, "content");
      publicDir = path.resolve(config.root, "public");
    },
    writeBundle() {
      const urls: string[] = [];

      for (const route of STATIC_ROUTES) {
        const loc = `${baseUrl}${route.path}`;
        urls.push(
          `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
        );
      }

      const blogEntries = getBlogSlugs(contentDir);
      for (const { slug, lastmod } of blogEntries) {
        const loc = `${baseUrl}/blog/${encodeURIComponent(slug)}`;
        const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
        urls.push(
          `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>${lastmodTag}\n  </url>`
        );
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf-8");

      // Actualizează robots.txt în dist cu Sitemap
      const robotsPath = path.join(publicDir, "robots.txt");
      let robotsContent = fs.existsSync(robotsPath)
        ? fs.readFileSync(robotsPath, "utf-8")
        : "User-agent: *\nAllow: /";
      const sitemapLine = `Sitemap: ${baseUrl}/sitemap.xml`;
      if (!robotsContent.includes("Sitemap:")) {
        robotsContent = robotsContent.trimEnd() + "\n\n" + sitemapLine + "\n";
      }
      fs.writeFileSync(path.join(outDir, "robots.txt"), robotsContent, "utf-8");
    },
  };
}
