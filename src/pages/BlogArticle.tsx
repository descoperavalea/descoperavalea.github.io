import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Layout } from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/content";

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
              Înapoi la blog
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
            Înapoi la blog
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
    </Layout>
  );
}
