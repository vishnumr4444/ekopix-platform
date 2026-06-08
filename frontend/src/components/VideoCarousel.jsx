'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { youtubeEmbed, youtubeThumbnail, youtubeThumbnailFallback, youtubeWatchUrl } from '@/lib/videos';

export default function VideoCarousel() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const containerRef = useRef(null);

  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setVideos(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smoothly scale down as user scrolls through the section
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0px", "48px"]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0.3]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (!videos.length && !loading) return null;

  return (
    <section ref={containerRef} className="relative bg-transparent h-[250vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        
        {/* Global Navigation Arrows */}
        <button onClick={handlePrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md bg-black/20 hidden md:flex">
          <ChevronLeft size={32} />
        </button>
        <button onClick={handleNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md bg-black/20 hidden md:flex">
          <ChevronRight size={32} />
        </button>

        {/* Header Title that fades out */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]), y: useTransform(scrollYProgress, [0, 0.15], [0, -50]) }}
          className="absolute top-32 md:top-40 left-6 md:left-12 z-30 pointer-events-none"
        >
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#888888]" />
            The Archives
          </p>
          <h2 className="font-display font-light text-4xl sm:text-5xl lg:text-7xl text-metallic leading-[1.1] tracking-tight drop-shadow-2xl">
            Cinematic Worlds
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <Loader2 size={40} className="text-white/30 animate-spin" />
          </div>
        ) : (
          <motion.div 
            style={{ scale, opacity }}
            className="relative w-full h-full flex items-center justify-center flex-shrink-0 pointer-events-none perspective-1000"
          >
            {videos.map((v, idx) => {
              let diff = idx - currentIndex;
              const N = videos.length;
              if (diff < -N / 2) diff += N;
              if (diff > N / 2) diff -= N;
              
              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              const xPos = isCenter ? '0%' : isLeft ? '-103%' : isRight ? '103%' : diff < 0 ? '-200%' : '200%';
              const scaleVal = isCenter ? 1 : 0.9;
              const opVal = isCenter ? 1 : (isLeft || isRight ? 0.5 : 0);
              const zIdx = isCenter ? 10 : 5;

              return (
                <motion.div 
                  key={v.youtubeId} 
                  initial={false}
                  animate={{ 
                    x: xPos, 
                    scale: scaleVal, 
                    opacity: opVal,
                  }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ zIndex: zIdx, borderRadius }}
                  className={`absolute inset-0 w-full h-full overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-[#050505] ${isCenter ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                  {/* Pure Cinematic YouTube Video Background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {isCenter ? (
                      <iframe
                        src={`${youtubeEmbed(v.youtubeId)}&autoplay=1&mute=1&loop=1&playlist=${v.youtubeId}&controls=0&showinfo=0&rel=0`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none"
                        style={{ border: 0 }}
                        loading="lazy"
                      />
                    ) : (
                      <img 
                        src={youtubeThumbnail(v.youtubeId)} 
                        onError={(e) => { e.currentTarget.src = youtubeThumbnailFallback(v.youtubeId); }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] object-cover opacity-50"
                        alt="" 
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
