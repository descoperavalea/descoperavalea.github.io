import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";
import heroLandscape from "@/assets/hero-landscape.jpg";
import {
  getLatestGalleryItems,
  getLatestBlogMeta,
  getLatestVideoItems,
} from "@/lib/content";

function getYouTubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`;
      }
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`;
      }
    }
  } catch {
    // ignore invalid URL
  }

  return url;
}

export default function Home() {
  const latestPhotos = getLatestGalleryItems(3);
  const latestArticles = getLatestBlogMeta(3);
  const latestVideos = getLatestVideoItems(3);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  return (
    <div>
      {/* Hero Video Section */}
      <section className="relative">
        {/* 
          Hero Video Component
          Pentru a adăuga video-uri reale, setează:
          - desktopVideoUrl: URL video 16:9 pentru desktop
          - mobileVideoUrl: URL video 9:16 pentru mobil
          
          Exemplu:
          <HeroVideo 
            desktopVideoUrl="/videos/hero-desktop.mp4"
            mobileVideoUrl="/videos/hero-mobile.mp4"
            posterImage={heroLandscape}
          />
        */}
        <HeroVideo 
          posterImage={heroLandscape}
          // desktopVideoUrl="/videos/hero-desktop.mp4"
          // mobileVideoUrl="/videos/hero-mobile.mp4"
        />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end container-editorial pb-12 md:pb-20">
          <div className="max-w-2xl animate-fade-in">
            <span className="caption block mb-4">Valea Jiului, România</span>
            <h1 className="text-balance mb-4">
              Descoperă natura sălbatică
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Peisaje montane, trasee forestiere și aventuri off-road în inima Carpaților.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Photos Section */}
      <section className="section-space">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <span className="caption block mb-2">Galerie</span>
              <h2>Imagini recente</h2>
            </div>
            <Link 
              to="/galerie"
              className="hidden md:flex items-center gap-2 text-sm hover:text-primary transition-colors group"
            >
              Vezi toate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {latestPhotos.map((photo) => (
              <Link 
                key={`${photo.title}-${photo.dateAdded}`} 
                to="/galerie"
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl mb-3">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover image-hover"
                  />
                </div>
                <h3 className="font-serif text-lg group-hover:text-primary transition-colors">
                  {photo.title}
                </h3>
                <p className="text-sm text-muted-foreground">{photo.location}</p>
              </Link>
            ))}
          </div>

          <Link 
            to="/galerie"
            className="flex md:hidden items-center gap-2 text-sm hover:text-primary transition-colors mt-8"
          >
            Vezi toate imaginile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="section-space bg-secondary/30">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <span className="caption block mb-2">Blog</span>
              <h2>Articole recente</h2>
            </div>
            <Link 
              to="/blog"
              className="hidden md:flex items-center gap-2 text-sm hover:text-primary transition-colors group"
            >
              Vezi toate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {latestArticles.map((article) => (
              <Link 
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="article-card"
              >
                <div className="aspect-[3/2] overflow-hidden rounded-xl mb-4">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full h-full object-cover image-hover"
                  />
                </div>
                <time className="caption block mb-2">
                  {new Date(article.dateAdded).toLocaleDateString("ro-RO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <h3 className="font-serif text-xl mb-2">{article.title}</h3>
                {article.seoDescription && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.seoDescription}
                  </p>
                )}
              </Link>
            ))}
          </div>

          <Link 
            to="/blog"
            className="flex md:hidden items-center gap-2 text-sm hover:text-primary transition-colors mt-8"
          >
            Vezi toate articolele
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="section-space">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <span className="caption block mb-2">Video</span>
              <h2>Clipuri recente</h2>
            </div>
            <Link 
              to="/video"
              className="hidden md:flex items-center gap-2 text-sm hover:text-primary transition-colors group"
            >
              Vezi toate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {latestVideos.map((video) => {
              const id = `${video.title}-${video.dateAdded}`;
              const isActive = activeVideoId === id;
              return (
                <div key={id} className="group block">
                  <button
                    type="button"
                    className="relative aspect-video overflow-hidden rounded-xl mb-3 w-full"
                    onClick={() => setActiveVideoId(isActive ? null : id)}
                  >
                    {isActive ? (
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
                          className="w-full h-full object-cover image-hover"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                        {/* Duration badge */}
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm text-xs rounded">
                            {video.duration}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                  <Link
                    to="/video"
                    className="font-serif text-lg group-hover:text-primary transition-colors"
                  >
                    {video.title}
                  </Link>
                </div>
              );
            })}
          </div>

          <Link 
            to="/video"
            className="flex md:hidden items-center gap-2 text-sm hover:text-primary transition-colors mt-8"
          >
            Vezi toate clipurile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-space bg-primary text-primary-foreground">
        <div className="container-editorial text-center">
          <span className="caption block mb-4 opacity-70">Aventură</span>
          <h2 className="mb-4">Experiențe 4x4</h2>
          <p className="text-lg opacity-80 max-w-xl mx-auto mb-8">
            Explorează drumurile forestiere ale Văii Jiului alături de ghizi locali experimentați.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-sm hover:opacity-90 transition-opacity"
          >
            Contactează-ne
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
