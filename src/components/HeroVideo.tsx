import { useEffect, useRef, useState } from 'react';
import heroLandscape from '@/assets/hero-landscape.jpg';

interface HeroVideoProps {
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
  posterImage?: string;
}

export function HeroVideo({ 
  desktopVideoUrl = '', 
  mobileVideoUrl = '',
  posterImage = heroLandscape 
}: HeroVideoProps) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Play the appropriate video when visibility changes
  useEffect(() => {
    if (isMobile && mobileVideoRef.current) {
      mobileVideoRef.current.play().catch(() => {});
    } else if (!isMobile && desktopVideoRef.current) {
      desktopVideoRef.current.play().catch(() => {});
    }
  }, [isMobile]);

  const hasDesktopVideo = desktopVideoUrl && desktopVideoUrl.length > 0;
  const hasMobileVideo = mobileVideoUrl && mobileVideoUrl.length > 0;

  return (
    <div className="hero-video-wrapper overflow-hidden">
      {/* Desktop Video (16:9) */}
      {hasDesktopVideo ? (
        <video
          ref={desktopVideoRef}
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterImage}
        >
          <source src={desktopVideoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={posterImage}
          alt="Hero background"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Mobile Video (9:16) */}
      {hasMobileVideo ? (
        <video
          ref={mobileVideoRef}
          className="md:hidden absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterImage}
        >
          <source src={mobileVideoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={posterImage}
          alt="Hero background"
          className="md:hidden absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
    </div>
  );
}
