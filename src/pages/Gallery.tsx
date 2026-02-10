import { useState } from "react";
import { Layout } from "@/components/Layout";
import { X } from "lucide-react";
import { getGalleryItems, type GalleryItem } from "@/lib/content";

export default function Gallery() {
  const images = getGalleryItems();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-24 md:pt-32 pb-8 md:pb-12">
        <div className="container-editorial">
          <span className="caption block mb-4">Galerie foto</span>
          <h1>Peisaje din Valea Jiului</h1>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container-editorial">
          <div className="gallery-grid stagger-children">
            {images.map((image) => (
              <button
                key={`${image.title}-${image.dateAdded}`}
                onClick={() => setSelectedImage(image)}
                className="group text-left"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl mb-3">
                  <img src={image.src} alt={image.title} className="w-full h-full object-cover image-hover" />
                </div>
                <h3 className="font-serif text-lg group-hover:text-primary transition-colors">
                  {image.title}
                </h3>
                <p className="text-sm text-muted-foreground">{image.location}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="lightbox-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-2 hover:bg-muted rounded-full transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-center">
              <h3 className="font-serif text-xl mb-1">{selectedImage.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
