import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre" },
  { href: "/blog", label: "Trasee" },
  { href: "/galerie", label: "Galerie" },
  { href: "/video", label: "Video" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: "IG" },
  { href: "https://facebook.com", label: "Facebook", icon: "FB" },
  { href: "https://youtube.com", label: "YouTube", icon: "YT" },
];

const THEME_STORAGE_KEY = "descopera-valea-theme";

/** Icoană hamburger: linii subtiri, lungi – sus lungă, mijloc mai scurtă, jos egală cu sus, aliniate la dreapta */
function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function getInitialDarkMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;

  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return false;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => getInitialDarkMode());
  const [isScrolled, setIsScrolled] = useState(false);
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0 });
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Poziționare linie sub linkul activ (desktop)
  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const activeIndex = navLinks.findIndex(
      (link) =>
        location.pathname === link.href ||
        (link.href !== "/" && location.pathname.startsWith(link.href))
    );
    const el = activeIndex >= 0 ? linkRefs.current[activeIndex] : null;
    if (!el) {
      setNavIndicator({ left: 0, width: 0 });
      return;
    }
    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const extra = 8; // linia cu 8px mai lungă pe fiecare parte
    setNavIndicator({
      left: rect.left - containerRect.left - extra / 2,
      width: rect.width + extra,
    });
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        isDark ? "dark" : "light",
      );
    } catch {
      // ignore if localStorage is unavailable
    }
  }, [isDark]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border"
            : "bg-[linear-gradient(to_bottom,hsl(var(--background)/0.55)_0%,hsl(var(--background)/0.5)_40%,transparent_100%)] backdrop-blur-sm",
        )}
      >
        <nav className="container-editorial">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center min-w-0 max-w-[300px] md:max-w-[400px] hover:opacity-90 transition-opacity py-1"
              aria-label="Descoperă Valea - Acasă"
            >
              <img
                src={`${import.meta.env.BASE_URL}logo.svg`}
                alt="Descoperă Valea"
                className="max-h-9 md:max-h-12 w-auto max-w-full object-contain object-left invert dark:invert-0 dark:opacity-90"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div ref={navRef} className="relative flex items-center gap-8">
                {navLinks.map((link, index) => {
                  const isActive =
                    location.pathname === link.href ||
                    (link.href !== "/" && location.pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      ref={(el) => {
                        linkRefs.current[index] = el;
                      }}
                      to={link.href}
                      className={cn(
                        "relative pb-2.5 text-sm tracking-wide transition-colors hover:text-primary",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {/* Linie animată sub pagina selectată */}
                <span
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
                  style={{
                    width: navIndicator.width,
                    transform: `translateX(${navIndicator.left}px)`,
                    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
                aria-label="Toggle theme"
              >
{isDark ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 -mr-4 text-foreground hover:opacity-80 transition-opacity"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <HamburgerIcon className="w-7 h-7" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-background transition-all duration-500 md:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "font-serif text-3xl transition-all duration-300",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-foreground hover:text-primary",
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
              style={{
                transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Social Links in Mobile Menu */}
          <div 
            className={cn(
              "flex gap-6 mt-8 transition-all duration-300",
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: isMenuOpen ? "300ms" : "0ms" }}
          >
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Theme Toggle in Mobile */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={cn(
              "flex items-center gap-2 text-sm text-foreground hover:text-primary transition-all duration-300",
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: isMenuOpen ? "350ms" : "0ms" }}
          >
            {isDark ? (
              <>
                <Sun className="w-6 h-6" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-6 h-6" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
