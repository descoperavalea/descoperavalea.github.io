import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Layout } from "@/components/Layout";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogPostBySlug, getAllBlogMeta } from "@/lib/content";

const SANITIZE_OPTIONS: DOMPurify.Config = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "blockquote", "pre", "code", "img",
    "figure", "figcaption", "hr", "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getBlogPostBySlug(slug) : null;

  if (!article) {
    return (
      <Layout>
        <section className="pt-24 md:pt-32 section-space">
          <div className="container-editorial text-center">
            <h1 className="mb-4">Articol negăsit</h1>
            <p className="text-muted-foreground mb-8">
              Articolul pe care îl căutați nu există.
            </p>
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Înapoi la Trasee
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  useEffect(() => {
    const title = article.seoTitle || article.title;
    document.title = title ? `${title} | Descoperă Valea` : "Descoperă Valea";
    return () => {
      document.title = "Descoperă Valea";
    };
  }, [article.seoTitle, article.title]);

  const latestThree = getAllBlogMeta()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-24 md:pt-32">
        <div className="container-editorial">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la Trasee
          </Link>
          
          <div className="max-w-3xl">
            <span className="caption block mb-4">
              {new Date(article.dateAdded).toLocaleDateString("ro-RO", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h1 className="text-balance">{article.title}</h1>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8 md:py-12">
        <div className="container-editorial">
          <div className="aspect-[21/9] overflow-hidden rounded-xl">
            {article.cover && (
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 md:pb-24">
        <div className="container-editorial">
            <article 
            className="prose prose-lg max-w-3xl mx-auto
              prose-headings:font-serif prose-headings:font-normal
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.html, SANITIZE_OPTIONS) }}
          />
        </div>
      </section>

      {/* Ultimele 3 articole */}
      {latestThree.length > 0 && (
          <section className="section-space bg-secondary/30 border-t border-border/50">
            <div className="container-editorial">
              <h2 className="mb-8 md:mb-12">Alte trasee</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestThree.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/blog/${item.slug}`}
                    className="article-card group block"
                  >
                    <div className="aspect-[3/2] overflow-hidden rounded-xl mb-4">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover image-hover"
                      />
                    </div>
                    <span className="caption block mb-2">
                      {new Date(item.dateAdded).toLocaleDateString("ro-RO", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.seoDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.seoDescription}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-medium mt-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Citește
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Toate traseele
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
      )}
    </Layout>
  );
}
