'use client';
import { useEffect, useState } from 'react';
import { Play, ArrowUpRight, Loader2 } from 'lucide-react';
import { youtubeThumbnail, youtubeThumbnailFallback, youtubeWatchUrl } from '@/lib/videos';

const DEFAULT = {
  youtubeId:   'l7fJ9ZVmwR4',
  title:       'Tere Bina',
  subtitle:    'Official Music Video',
  description: 'A cinematic ballad rendered in anime ink and neon dust. Step inside the world that started it all.',
};

export default function LatestRelease() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setLatest(data?.latestDrop || DEFAULT))
      .catch(() => setLatest(DEFAULT));
  }, []);

  if (!latest) return (
    <section className="py-24 flex items-center justify-center min-h-[50vh]">
      <Loader2 size={32} className="text-white/30 animate-spin" />
    </section>
  );

  return (
    <section data-testid="latest-release-section" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left: Info */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-6 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[#888888]" />
              Latest Drop
            </p>
            
            <h2 className="font-display font-light text-5xl sm:text-6xl lg:text-[4.5rem] text-white leading-[1.05] tracking-tight mb-4">
              {latest.title}
            </h2>
            
            <p className="font-heading text-[10px] tracking-[0.4em] uppercase text-[#aaaaaa] mb-8">
              {latest.subtitle}
            </p>
            
            <p className="font-body text-[#cccccc] text-base md:text-lg font-light leading-relaxed max-w-md mb-12">
              {latest.description}
            </p>

            <div className="flex flex-wrap gap-5">
              <a
                href={youtubeWatchUrl(latest.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="latest-release-watch-cta"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-heading text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-all duration-300"
              >
                Watch Now <ArrowUpRight size={16} />
              </a>
              <a
                href="https://www.youtube.com/@EKOPIXofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-heading text-[10px] tracking-[0.3em] uppercase hover:bg-white/5 hover:border-white/40 hover:scale-105 transition-all duration-300"
              >
                View Channel
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/10 max-w-md">
              {[['HD', '4K Visuals'], ['∞', 'Repeatable'], ['01', 'Volume']].map(([k, v]) => (
                <div key={v}>
                  <div className="font-display font-light text-white text-3xl">{k}</div>
                  <div className="font-heading text-[9px] tracking-[0.35em] uppercase text-[#888888] mt-2">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cinematic Thumbnail */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-110 pointer-events-none" />
            
            <a
              href={youtubeWatchUrl(latest.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="latest-release-thumb-link"
              className="group relative block w-full aspect-[4/3] md:aspect-video lg:aspect-[16/11] overflow-hidden bg-[#080808] transition-all duration-700 hover:scale-[1.02]"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
              }}
              aria-label={`Watch ${latest.title}`}
            >
              <img
                src={youtubeThumbnail(latest.youtubeId)}
                onError={(e) => { e.currentTarget.src = youtubeThumbnailFallback(latest.youtubeId); }}
                alt={latest.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] opacity-70 group-hover:opacity-100"
              />
              
              {/* Vignette & Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,black_100%)] opacity-60 pointer-events-none" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xl">
                  <Play size={20} className="text-black ml-1" fill="black" />
                </div>
              </div>

              {/* Status Pill */}
              <div className="absolute top-[15%] left-[10%] px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
                <span className="font-heading text-[8px] tracking-[0.3em] uppercase text-white/90">
                  Now Playing
                </span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
