import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { getAllBlogMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function Blog() {
  const articles = getAllBlogMeta();
  const [featuredArticle, ...restArticles] = articles;

  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  const listArticles = restArticles;
  const totalPages = Math.ceil(listArticles.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedArticles = listArticles.slice(start, start + PAGE_SIZE);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-24 md:pt-32 pb-8 md:pb-12">
        <div className="container-editorial">
          <span className="caption block mb-4">Blog</span>
          <h1>Povești din natură</h1>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="pb-12 md:pb-16">
          <div className="container-editorial">
            <Link
              to={`/blog/${featuredArticle.slug}`}
              className="group block lg:flex lg:items-center lg:gap-12"
            >
              <div className="overflow-hidden rounded-xl h-[300px] md:h-[400px] lg:h-[460px] lg:basis-[65%] lg:flex-shrink-0">
                <img
                  src={featuredArticle.cover}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover image-hover"
                />
              </div>
              <div className="flex flex-col justify-center mt-6 lg:mt-0 lg:basis-[35%]">
                <span className="caption block mb-3">
                  {new Date(featuredArticle.dateAdded).toLocaleDateString(
                    "ro-RO",
                    { day: "2-digit", month: "long", year: "numeric" },
                  )}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl mb-4 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
                {featuredArticle.seoDescription && (
                  <p className="text-muted-foreground mb-6">
                    {featuredArticle.seoDescription}
                  </p>
                )}
                <span className="flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                  Citește articolul
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="section-space bg-secondary/30 pb-[50px]">
        <div className="container-editorial">
          <h2 className="mb-8 md:mb-12">Toate articolele</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {paginatedArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="article-card group"
              >
                <div className="aspect-[3/2] overflow-hidden rounded-xl mb-4">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full h-full object-cover image-hover"
                  />
                </div>
                <span className="caption block mb-2">
                  {new Date(article.dateAdded).toLocaleDateString("ro-RO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <h3 className="font-serif text-xl mb-2">{article.title}</h3>
                {article.seoDescription && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.seoDescription}
                  </p>
                )}
              </Link>
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
