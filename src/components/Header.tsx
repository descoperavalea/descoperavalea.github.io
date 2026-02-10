import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre" },
  { href: "/galerie", label: "Galerie" },
  { href: "/video", label: "Video" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: "IG" },
  { href: "https://facebook.com", label: "Facebook", icon: "FB" },
  { href: "https://youtube.com", label: "YouTube", icon: "YT" },
];

const THEME_STORAGE_KEY = "descopera-valea-theme";

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
  const location = useLocation();

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
            : "bg-transparent",
        )}
      >
        <nav className="container-editorial">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="font-serif text-xl md:text-2xl tracking-tight hover:text-primary transition-colors"
            >
              Descoperă Valea
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm tracking-wide transition-colors hover:text-primary",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
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
              "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300",
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: isMenuOpen ? "350ms" : "0ms" }}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
