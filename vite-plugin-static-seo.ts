import fs from "fs";
import path from "path";

type SeoPage = {
  path: string;
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  index?: boolean;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHead(seo: SeoPage, canonicalUrl: string, baseUrl: string): string {
  const basePath = (() => {
    try {
      const p = new URL(baseUrl).pathname.replace(/\/$/, "");
      return p ? `${p}/favicon.ico` : "/favicon.ico";
    } catch {
      return "/favicon.ico";
    }
  })();
  const parts: string[] = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<link rel="icon" href="${escapeHtml(basePath)}">`,
    `<title>${escapeHtml(seo.title)}</title>`,
  ];

  if (seo.description) {
    parts.push(`<meta name="description" content="${escapeHtml(seo.description)}">`);
  }

  parts.push(`<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`);

  if (seo.index === false) {
    parts.push('<meta name="robots" content="noindex, nofollow">');
  }

  parts.push('<meta property="og:type" content="website">');
  parts.push(`<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`);
  if (seo.ogTitle) parts.push(`<meta property="og:title" content="${escapeHtml(seo.ogTitle)}">`);
  if (seo.ogDescription) parts.push(`<meta property="og:description" content="${escapeHtml(seo.ogDescription)}">`);
  if (seo.ogImage) {
    const ogImageUrl = seo.ogImage.startsWith("http") ? seo.ogImage : `${baseUrl.replace(/\/$/, "")}${seo.ogImage}`;
    parts.push(`<meta property="og:image" content="${escapeHtml(ogImageUrl)}">`);
  }

  return parts.join("\n    ");
}

function extractBodyAndAssetTags(html: string): { body: string; headAssets: string } {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const headInner = headMatch ? headMatch[1] : "";
  const body = bodyMatch ? bodyMatch[0] : "<body><div id=\"root\"></div></body>";

  const scriptMatches = [...headInner.matchAll(/<script[^>]*>[\s\S]*?<\/script>|<script[^>]*\/>/gi)];
  const linkMatches = [...headInner.matchAll(/<link[^>]+>/gi)];
  const headAssets: string[] = [];
  scriptMatches.forEach((m) => headAssets.push(m[0]));
  linkMatches.forEach((m) => {
    const tag = m[0];
    if (/rel=["']?(?:stylesheet|icon|preload)["']?/i.test(tag) || /\.(css|js)/.test(tag)) {
      headAssets.push(tag);
    }
  });
  return { body, headAssets: headAssets.join("\n    ") };
}

export function vitePluginStaticSeo() {
  let outDir: string;
  let baseUrl: string;
  let contentDir: string;

  return {
    name: "vite-plugin-static-seo",
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
    },
    writeBundle() {
      const seoPath = path.join(contentDir, "seo.json");
      if (!fs.existsSync(seoPath)) return;

      const seoData = JSON.parse(fs.readFileSync(seoPath, "utf-8")) as { pages: SeoPage[] };
      const pages: SeoPage[] = seoData.pages ?? [];
      if (pages.length === 0) return;

      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const html = fs.readFileSync(indexPath, "utf-8");
      const { body, headAssets } = extractBodyAndAssetTags(html);

      for (const seo of pages) {
        const pathNorm = seo.path.replace(/\/$/, "") || "/";
        const canonicalUrl = pathNorm === "/" ? baseUrl : `${baseUrl}${pathNorm}`;

        const headContent = buildHead(seo, canonicalUrl, baseUrl);
        const fullHead = `  <head>\n    ${headContent}\n    ${headAssets}\n  </head>`;

        const fullHtml = `<!DOCTYPE html>\n<html lang="ro">\n${fullHead}\n  ${body}\n</html>`;

        if (pathNorm === "/") {
          fs.writeFileSync(indexPath, fullHtml, "utf-8");
        } else {
          const dir = path.join(outDir, pathNorm.slice(1));
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), fullHtml, "utf-8");
        }
      }
    },
  };
}
