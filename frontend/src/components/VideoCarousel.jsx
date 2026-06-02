'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { youtubeEmbed, youtubeThumbnail, youtubeThumbnailFallback, youtubeWatchUrl } from '@/lib/videos';

export default function VideoCarousel() {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Create a massive duplicated array so the carousel feels seamlessly infinite
  const displayVideos = videos.length > 0 ? Array(20).fill(videos).flat() : [];
  
  const targetRef = useRef(null);

  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setVideos(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Measure card width for accurate horizontal translation limit
  useEffect(() => {
    const measure = () => {
      const card = document.querySelector('.video-carousel-card');
      if (card) {
        const gap = window.innerWidth >= 768 ? 48 : 24; // md:gap-12 is 48px, gap-6 is 24px
        setCardWidth(card.offsetWidth + gap);
      }
    };
    measure();
    const t = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, [videos]);

  // Lock scroll only up to the 2nd video (1 card width)
  const maxScroll = cardWidth > 0 ? cardWidth * 1 : 0; 

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 40,
    mass: 0.8
  });

  // Scroll strictly limits to 1 card
  const scrollX = useTransform(smoothProgress, [0, 1], [0, -maxScroll]);
  const manualX = useSpring(0, { damping: 30, stiffness: 40, mass: 0.8 });
  
  // Framer-motion maps the combined progress natively into horizontal movement
  const x = useTransform(() => scrollX.get() + manualX.get());

  // Calculate current active index based on combined horizontal progress
  useMotionValueEvent(x, "change", (latestX) => {
    if (cardWidth > 0) {
      const index = Math.round(Math.abs(latestX) / cardWidth);
      if (index !== currentIndex && index >= 0 && index < displayVideos.length) {
        setCurrentIndex(index);
      }
    }
  });

  // Delay heavy iframe mounting until after the sliding animation settles
  // This prevents the browser main thread from freezing during the framer-motion transition
  useEffect(() => {
    const t = setTimeout(() => setPlayingIndex(currentIndex), 600);
    return () => clearTimeout(t);
  }, [currentIndex]);

  // Auto-play by smoothly scrolling the window if the section is heavily in view
  useEffect(() => {
    if (loading || !displayVideos.length || cardWidth === 0 || isHovered) return;

    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && currentIndex < displayVideos.length - 1) {
          timer = setInterval(() => {
            if (currentIndex < displayVideos.length - 1) {
               manualX.set(manualX.get() - cardWidth);
            }
          }, 4000);
        } else {
          clearInterval(timer);
        }
      },
      { threshold: 0.8 } // Only auto-play if they are mostly looking at the sticky section
    );

    const stickyContainer = document.querySelector('.carousel-sticky-container');
    if (stickyContainer) observer.observe(stickyContainer);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [loading, displayVideos.length, cardWidth, maxScroll, currentIndex, isHovered]);

  const scrollNext = () => {
    if (currentIndex < displayVideos.length - 1) {
      manualX.set(manualX.get() - cardWidth);
    }
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      manualX.set(manualX.get() + cardWidth);
    }
  };

  if (!displayVideos.length && !loading) return null;

  return (
    <section className="relative bg-transparent">
      
      {/* Header in normal document flow, positioned above the sticky carousel */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 pt-24 pb-8 md:pt-32 md:pb-12 flex justify-between items-end relative z-20">
        <div>
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#888888]" />
            The Archives
          </p>
          <h2 className="font-display font-light text-4xl sm:text-5xl text-metallic leading-[1.1] tracking-tight drop-shadow-2xl">
            Cinematic Worlds
          </h2>
        </div>
      </div>

      {/* targetRef creates the scroll-jacking height container.
          Its progress is 0 exactly when it hits the top of the viewport. */}
      <div id="videos" ref={targetRef} style={{ height: `calc(100vh + ${maxScroll}px)` }}>
        
        {/* Sticky container natively stops vertical scroll and pins to viewport */}
        <div 
          className="carousel-sticky-container sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows */}
          <div className="absolute inset-0 max-w-[1600px] mx-auto w-full pointer-events-none z-50 hidden md:block">
            <button onClick={scrollPrev} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md group shadow-2xl bg-black/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:-translate-x-1 transition-transform">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={scrollNext} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md group shadow-2xl bg-black/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Carousel Tracks horizontally translated by framer-motion */}
          <motion.div style={{ x, willChange: 'transform' }} className="flex gap-6 md:gap-12 px-[7.5vw] md:px-[12.5vw] lg:px-[15vw] w-[max-content] items-center">
            {loading ? (
               <div className="flex w-[85vw] md:w-[75vw] lg:w-[70vw] items-center justify-center py-32 px-10 border border-white/10 rounded-3xl bg-black/50">
                 <Loader2 size={32} className="text-white/30 animate-spin" />
               </div>
            ) : (
              displayVideos.map((v, index) => {
                const isActive = index === currentIndex;
                // Since videos are duplicated, we need a truly unique key for React rendering
                const uniqueKey = `${v.youtubeId}-${index}`;
                
                return (
                  <div 
                    key={uniqueKey} 
                    data-youtube-id={v.youtubeId}
                    style={{ willChange: 'transform, opacity' }}
                    className={`video-carousel-card relative w-[85vw] md:w-[75vw] lg:w-[70vw] max-w-none aspect-[16/10] md:aspect-video border border-white/10 rounded-3xl group overflow-hidden bg-black transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? 'scale-100 opacity-100' : 'scale-[0.95] opacity-50'}`}
                  >
                    {/* Cinematic Auto-Playing Background Video */}
                    {index === playingIndex && (
                      <iframe
                        src={`${youtubeEmbed(v.youtubeId)}&autoplay=1&mute=1`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none scale-105"
                        style={{ border: 0 }}
                        loading="lazy"
                      />
                    )}
                    
                    {/* Thumbnail mask that fades out gracefully */}
                    <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-[1200ms] ease-in-out pointer-events-none ${index === playingIndex ? 'opacity-0 delay-500' : 'opacity-100'}`}>
                      <img
                        src={youtubeThumbnail(v.youtubeId)}
                        onError={(e) => { e.currentTarget.src = youtubeThumbnailFallback(v.youtubeId); }}
                        alt={v.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-[2000ms] ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    {/* UI Overlay always visible, no play button required since it auto-plays */}
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <p className="font-heading text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#aaaaaa] mb-3 drop-shadow-md">
                            {v.subtitle || 'Official Release'}
                          </p>
                          <h3 className="font-display font-light text-3xl md:text-5xl lg:text-6xl text-metallic leading-tight tracking-tight drop-shadow-2xl max-w-2xl">
                            {v.title}
                          </h3>
                        </div>
                        <div className="pointer-events-auto">
                          <a
                            href={youtubeWatchUrl(v.youtubeId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/20 bg-black/40 text-white/80 font-heading text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all backdrop-blur-md"
                          >
                            Watch Full <ArrowUpRight size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
