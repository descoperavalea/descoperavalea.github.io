import heroLandscape from "@/assets/hero-landscape.jpg";
import forestTrail from "@/assets/gallery-forest-trail.jpg";
import adventure4x4 from "@/assets/gallery-4x4-adventure.jpg";
import mountainStream from "@/assets/gallery-mountain-stream.jpg";
import peakView from "@/assets/gallery-peak-view.jpg";
import mountainRoad from "@/assets/gallery-mountain-road.jpg";

// JSON content managed by Sveltia
// eslint-disable-next-line @typescript-eslint/no-var-requires
import galleryData from "../../content/gallery.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import videosData from "../../content/videos.json";

import { marked } from "marked";

type RawGalleryItem = {
  image: string;
  title: string;
  location?: string;
  dateAdded: string;
};

type RawVideoItem = {
  videoUrl: string;
  title: string;
  thumbnail: string;
  duration?: string;
  seoTitle?: string;
  seoDescription?: string;
  dateAdded: string;
};

export type GalleryItem = RawGalleryItem & {
  src: string;
};

export type VideoItem = RawVideoItem & {
  thumbnailSrc: string;
};

export type BlogMeta = {
  title: string;
  slug: string;
  cover?: string;
  seoTitle?: string;
  seoDescription?: string;
  dateAdded: string;
};

export type BlogPost = BlogMeta & {
  content: string;
  html: string;
};

const imageMap: Record<string, string> = {
  "hero-landscape": heroLandscape,
  "gallery-forest-trail": forestTrail,
  "gallery-4x4-adventure": adventure4x4,
  "gallery-mountain-stream": mountainStream,
  "gallery-peak-view": peakView,
  "gallery-mountain-road": mountainRoad,
};

function resolveImagePath(value: string): string {
  // If it's a known key from demo assets, map to imported image
  if (imageMap[value]) {
    return imageMap[value];
  }

  // Otherwise assume it's a direct URL or /uploads path from Sveltia
  return value;
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id || null;
    }
  } catch {
    // ignore invalid URL
  }
  return null;
}

function resolveCoverPath(raw?: string): string | undefined {
  if (!raw) return undefined;

  // If frontmatter uses an explicit src/assets path, try to map it by filename
  if (raw.startsWith("/src/assets/")) {
    const file = raw.split("/").pop() || "";
    const key = file.replace(/\.[^/.]+$/, ""); // remove extension
    return resolveImagePath(key);
  }

  // Otherwise, let resolveImagePath handle keys or direct URLs (/uploads, external)
  return resolveImagePath(raw);
}

export function getGalleryItems(): GalleryItem[] {
  const items = (galleryData.items || []) as RawGalleryItem[];
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
    )
    .map((item) => ({
      ...item,
      src: resolveImagePath(item.image),
    }));
}

export function getVideoItems(): VideoItem[] {
  const items = (videosData.items || []) as RawVideoItem[];
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
    )
    .map((item) => ({
      ...item,
      thumbnailSrc: (() => {
        const id = getYouTubeId(item.videoUrl);
        if (id) {
          // Use YouTube thumbnail so ce se vede în listă
          // este chiar frame-ul din video
          return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        }
        return resolveImagePath(item.thumbnail);
      })(),
    }));
}

// Blog content from Markdown
const blogModules = import.meta.glob("../../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  // Very small frontmatter parser for simple "key: value" YAML blocks
  const FRONTMATTER_BOUNDARY = "---";
  const trimmed = raw.trimStart();

  if (!trimmed.startsWith(FRONTMATTER_BOUNDARY)) {
    return { data: {}, content: raw };
  }

  const endIndex = trimmed.indexOf(`\n${FRONTMATTER_BOUNDARY}`, FRONTMATTER_BOUNDARY.length);
  if (endIndex === -1) {
    return { data: {}, content: raw };
  }

  const frontmatterBlock = trimmed.slice(FRONTMATTER_BOUNDARY.length, endIndex).trim();
  const rest = trimmed.slice(endIndex + (`\n${FRONTMATTER_BOUNDARY}`).length).trimStart();

  const data: Record<string, string> = {};
  const lines = frontmatterBlock.split("\n");

  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    // Strip surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content: rest };
}

const allBlogPosts: BlogPost[] = Object.entries(blogModules)
  .map(([, fileContent]) => {
    const fileContentString = fileContent as string;
    const { data, content } = parseFrontmatter(fileContentString);
    const html = marked.parse(content) as string;

    const meta: BlogMeta = {
      title: data.title,
      slug: data.slug,
      cover: resolveCoverPath(data.cover),
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      dateAdded: data.dateAdded,
    };

    return {
      ...meta,
      content,
      html,
    };
  })
  .filter((post) => post.slug?.trim())
  .sort(
    (a, b) =>
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
  );

export function getAllBlogMeta(): BlogMeta[] {
  return allBlogPosts.map(
    ({ content, html, ...meta }) => meta,
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return allBlogPosts.find((post) => post.slug === slug) ?? null;
}

export function getLatestGalleryItems(limit: number): GalleryItem[] {
  return getGalleryItems().slice(0, limit);
}

export function getLatestVideoItems(limit: number): VideoItem[] {
  return getVideoItems().slice(0, limit);
}

export function getLatestBlogMeta(limit: number): BlogMeta[] {
  return getAllBlogMeta().slice(0, limit);
}

