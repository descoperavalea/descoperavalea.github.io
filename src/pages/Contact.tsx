import { Layout } from '@/components/Layout';
import { Mail, Phone, Instagram, Facebook, Youtube, MessageCircle, MapPin } from 'lucide-react';

// Import images
import adventure4x4 from '@/assets/gallery-4x4-adventure.jpg';
import heroLandscape from '@/assets/hero-landscape.jpg';

export default function Contact() {
  return (
    <Layout>
      {/* Hero Image */}
      <section className="pt-20 md:pt-24 pb-6">
        <div className="container-editorial">
          <div className="aspect-[21/9] overflow-hidden rounded-xl">
            <img
              src={heroLandscape}
              alt="Valea Jiului"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Header Card */}
      <section className="pb-6">
        <div className="container-editorial">
          <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center">
            <span className="caption block mb-4">Contact</span>
            <h1 className="mb-4">Hai să vorbim</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Suntem mereu bucuroși să auzim de la exploratori pasionați de natură.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container-editorial">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Email Card */}
            <a 
              href="mailto:contact@descopera-valea.ro"
              className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors"
            >
              <Mail className="w-6 h-6 mb-4 text-primary" />
              <span className="caption block mb-2">Email</span>
              <p className="font-serif text-xl group-hover:text-primary transition-colors">
                contact@descopera-valea.ro
              </p>
            </a>

            {/* Phone Card */}
            <a 
              href="tel:+40700000000"
              className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors"
            >
              <Phone className="w-6 h-6 mb-4 text-primary" />
              <span className="caption block mb-2">Telefon</span>
              <p className="font-serif text-xl group-hover:text-primary transition-colors">
                +40 700 000 000
              </p>
            </a>

            {/* WhatsApp Card */}
            <a 
              href="https://wa.me/40700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors"
            >
              <MessageCircle className="w-6 h-6 mb-4 text-primary" />
              <span className="caption block mb-2">WhatsApp</span>
              <p className="font-serif text-xl group-hover:text-primary transition-colors">
                Scrie-ne direct
              </p>
            </a>

            {/* 4x4 Experience Card with Image */}
            <div className="relative overflow-hidden rounded-xl md:col-span-2">
              <img
                src={adventure4x4}
                alt="Experiență 4x4"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="relative p-8 md:p-10 min-h-[240px] flex flex-col justify-center">
                <span className="caption block mb-2 text-primary">Experiențe</span>
                <p className="font-serif text-2xl md:text-3xl mb-3">Aventuri 4x4</p>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Organizăm aventuri off-road personalizate pe drumurile forestiere ale Văii Jiului.
                </p>
                <a
                  href="https://wa.me/40700000000?text=Salut!%20Sunt%20interesat%20de%20o%20experien%C8%9B%C4%83%204x4."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity w-fit"
                >
                  <MessageCircle className="w-4 h-4" />
                  Întreabă pe WhatsApp
                </a>
              </div>
            </div>

            {/* Location & Social Card Combined */}
            <div className="bg-card border border-border rounded-xl p-8">
              <MapPin className="w-6 h-6 mb-4 text-primary" />
              <span className="caption block mb-2">Locație</span>
              <p className="font-serif text-xl">Valea Jiului</p>
              <p className="text-muted-foreground mt-1 mb-6">Hunedoara, România</p>
              
              <div className="pt-6 border-t border-border">
                <span className="caption block mb-4">Urmărește-ne</span>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
