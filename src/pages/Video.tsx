import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Play } from "lucide-react";
import { getVideoItems } from "@/lib/content";
import { cn } from "@/lib/utils";

function getYouTubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Short youtu.be links
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`;
      }
    }

    // Standard watch?v= links
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`;
      }
    }
  } catch {
    // ignore invalid URL, fall through to default
  }

  // Fallback: try to use the URL directly
  return url;
}

export default function Video() {
  const videos = getVideoItems();
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);

  const listVideos = videos.slice(1);
  const totalPages = Math.ceil(listVideos.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedVideos = listVideos.slice(start, start + PAGE_SIZE);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-24 md:pt-32 pb-8 md:pb-12">
        <div className="container-editorial">
          <span className="caption block mb-4">Video</span>
          <h1>Clipuri din natură</h1>
        </div>
      </section>

      {/* Featured Video */}
      <section className="pb-12 md:pb-16">
        <div className="container-editorial">
          <button
            type="button"
            className="group cursor-pointer text-left w-full"
            onClick={() => setActiveId("featured")}
          >
            <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
              {activeId === "featured" ? (
                <iframe
                  src={getYouTubeEmbedUrl(videos[0].videoUrl)}
                  title={videos[0].title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={videos[0].thumbnailSrc}
                    alt={videos[0].title}
                    className="w-full h-full object-cover image-hover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <span className="absolute bottom-4 right-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm text-sm rounded">
                    {videos[0].duration}
                  </span>
                </>
              )}
            </div>
            <span className="caption block mb-2">
              {new Date(videos[0].dateAdded).toLocaleDateString("ro-RO", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl mb-2 group-hover:text-primary transition-colors">
              {videos[0].title}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {videos[0].seoDescription}
            </p>
          </button>
        </div>
      </section>

      {/* Video List */}
      <section className="section-space bg-secondary/30 pb-[50px]">
        <div className="container-editorial">
          <h2 className="mb-8 md:mb-12">Toate clipurile</h2>

          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 stagger-children">
            {paginatedVideos.map((video) => (
              // folosim un id stabil pe card pentru a controla playerul
              <article
                key={`${video.title}-${video.dateAdded}`}
                className="video-item group"
                onClick={() =>
                  setActiveId(`${video.title}-${video.dateAdded}`)
                }
              >
                <div className="relative w-full md:w-80 flex-shrink-0">
                  <div className="aspect-video overflow-hidden rounded-xl">
                    {activeId === `${video.title}-${video.dateAdded}` ? (
                      <iframe
                        src={getYouTubeEmbedUrl(video.videoUrl)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <img
                          src={video.thumbnailSrc}
                          alt={video.title}
                          className="video-thumbnail w-full h-full object-cover transition-transform duration-500"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                        {/* Duration */}
                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm text-xs rounded">
                          {video.duration}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <span className="caption block mb-2">
                    {new Date(video.dateAdded).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  {video.seoDescription && (
                    <p className="text-sm text-muted-foreground">
                      {video.seoDescription}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-[80px] flex w-full justify-center">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Pagina anterioară"
                  className="h-9 w-9 rounded-lg border border-border text-sm text-muted-foreground flex items-center justify-center disabled:opacity-40 hover:text-primary hover:border-primary transition-colors"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      className={cn(
                        "h-9 w-9 rounded-lg border border-border text-sm flex items-center justify-center transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-primary hover:border-primary",
                      )}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-label="Pagina următoare"
                  className="h-9 w-9 rounded-lg border border-border text-sm text-muted-foreground flex items-center justify-center disabled:opacity-40 hover:text-primary hover:border-primary transition-colors"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
