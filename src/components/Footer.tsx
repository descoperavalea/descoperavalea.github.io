import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container-editorial py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link to="/" className="font-serif text-xl">
              Descoperă Valea
            </Link>
            <p className="text-sm text-muted-foreground">
              Valea Jiului, România
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-background border border-border rounded-full hover:border-primary hover:text-primary transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Descoperă Valea</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/despre" className="hover:text-primary transition-colors">Despre</Link>
            <Link to="/blog" className="hover:text-primary transition-colors">Trasee</Link>
            <Link to="/galerie" className="hover:text-primary transition-colors">Galerie</Link>
            <Link to="/video" className="hover:text-primary transition-colors">Video</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
