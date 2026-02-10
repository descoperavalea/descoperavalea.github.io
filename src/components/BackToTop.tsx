import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'back-to-top',
        isVisible && 'visible'
      )}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
