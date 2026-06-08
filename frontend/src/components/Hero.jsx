'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ─────────────────────────────────────────────────────────────
   EKOPIX Hero — Editorial Split Layout
   ─ Pure black & white. No gradients. No shadows.
   ─ Left: structured metadata column
   ─ Center: oversized typographic mark
   ─ Bottom: marquee ticker strip + stats row
───────────────────────────────────────────────────────────── */
export default function Hero({ content = {} }) {
  const [heroSettings, setHeroSettings] = useState({
    backgroundType: 'youtube',
    youtubeId: 'l7fJ9ZVmwR4',
    imageUrl: '',
    startSeconds: 0,
    endSeconds: 60,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [visible, setVisible]   = useState(false);
  const playerRef = useRef(null);

  /* load settings */
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.hero) setHeroSettings({ ...data.hero, startSeconds: data.hero.startSeconds ?? 0, endSeconds: data.hero.endSeconds ?? 60 });
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  /* stagger-in */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* YT player */
  useEffect(() => {
    if (!isLoaded || heroSettings.backgroundType !== 'youtube' || !heroSettings.youtubeId) return;
    let checkInterval, player;

    const onStateChange = (e) => {
      if (e.data === window.YT?.PlayerState?.PLAYING) {
        clearInterval(checkInterval);
        checkInterval = setInterval(() => {
          if (!player?.getCurrentTime) return;
          const curr = player.getCurrentTime();
          const s = heroSettings.startSeconds || 0, end = heroSettings.endSeconds || 0;
          if (s > 0 && curr < s - 0.5) player.seekTo(s);
          else if (end > s && curr >= end) player.seekTo(s);
        }, 200);
      } else if (e.data === window.YT?.PlayerState?.ENDED) {
        clearInterval(checkInterval);
        if (player?.seekTo) {
          player.seekTo(heroSettings.startSeconds || 0);
          player.playVideo();
        }
      } else { clearInterval(checkInterval); }
    };

    const init = () => {
      if (!window.YT?.Player) return;
      const el = document.getElementById('hero-yt-player');
      if (!el) return;
      player = new window.YT.Player('hero-yt-player', {
        videoId: heroSettings.youtubeId,
        playerVars: { autoplay:1,mute:1,controls:0,showinfo:0,rel:0,start:heroSettings.startSeconds||0,end:heroSettings.endSeconds||undefined,modestbranding:1,iv_load_policy:3,playsinline:1,fs:0,autohide:1 },
        events: {
          onReady: (e) => { e.target.mute(); if (heroSettings.startSeconds > 0) e.target.seekTo(heroSettings.startSeconds); e.target.playVideo(); },
          onStateChange: onStateChange,
        },
      });
      playerRef.current = player;
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.getElementsByTagName('script')[0].before(tag);
    }

    if (window.YT?.Player) { init(); }
    else {
      const t = setInterval(() => { if (window.YT?.Player) { clearInterval(t); init(); } }, 100);
      return () => { clearInterval(t); clearInterval(checkInterval); try { playerRef.current?.destroy(); } catch {} };
    }
    return () => { clearInterval(checkInterval); try { playerRef.current?.destroy(); } catch {} };
  }, [isLoaded, heroSettings.backgroundType, heroSettings.youtubeId, heroSettings.startSeconds, heroSettings.endSeconds]);

  const isImage = heroSettings.backgroundType === 'image' && heroSettings.imageUrl;

  /* ticker content */
  const tickerItems = [
    'Anime Music Band', 'Original Compositions', 'Hindi & English', 'Cinematic Worlds',
    "India's First", 'EKOPIX Universe', 'Anime Music Band', 'Original Compositions',
    'Hindi & English', 'Cinematic Worlds', "India's First", 'EKOPIX Universe',
  ];

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col"
    >
      {/* ── Video background ─────────────────────────────── */}
      {isImage ? (
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${heroSettings.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      ) : (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div id="hero-yt-player" className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 scale-[1.15]" />
        </div>
      )}

      {/* ── Sleek Gradient Film — Lets video shine through center ────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black z-0 pointer-events-none" />

      {/* ── Main content grid (Centered, Uncluttered) ─────────────────────────────── */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 flex flex-col justify-center items-center text-center mt-20">

        {/* Label pill */}
        <div
          className="inline-flex items-center gap-3 mb-8 px-6 py-2.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl shadow-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          <span className="font-heading uppercase tracking-[0.4em] text-[10px] text-white/90">
            {content.heroPill || "India's First Anime Music Band"}
          </span>
        </div>

        {/* Massive Central Logo */}
        <div 
          className="relative w-[70vw] max-w-[500px] aspect-[2/1] mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(1.1)',
            transition: 'all 1.8s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }}
        >
          <Image 
            src="/images/logo.png" 
            alt="EKOPIX" 
            fill 
            sizes="(max-width: 768px) 70vw, 500px"
            priority
            className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
          />
        </div>

        {/* Horizontal rule below wordmark */}
        <div
          className="w-24 h-px bg-white/20 mb-8"
          style={{
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 1.2s',
          }}
        />

        {/* Tagline + description */}
        <div
          className="flex flex-col items-center gap-4 max-w-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 1.0s',
          }}
        >
          <p
            data-testid="hero-tagline"
            className="font-heading uppercase tracking-[0.5em] text-xs md:text-sm text-metallic drop-shadow-xl"
          >
            {content.heroTagline || "India's Anime Music Experience"}
          </p>
          <p className="font-body text-base md:text-lg text-white/60 leading-relaxed drop-shadow-md whitespace-pre-line">
            {content.heroDesc || "Original Westernized Indian song mix woven into cinematic worlds.\nEvery video is a universe. Every song is a character."}
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="mt-12 flex flex-col sm:flex-row items-center gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 1.15s',
          }}
        >
          <button
            onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 rounded-full bg-white text-black font-heading text-xs tracking-[0.3em] uppercase hover:scale-105 hover:bg-[#f0f0f0] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Watch Now
          </button>
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 rounded-full border border-white/30 text-white font-heading text-xs tracking-[0.3em] uppercase hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300 backdrop-blur-md"
          >
            Our Story
          </button>
        </div>
      </div>

      {/* ── Bottom section ────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 1.3s',
        }}
      >
        {/* Marquee ticker — fainter for cinematic depth */}
        <div className="overflow-hidden py-3 opacity-60">
          <div className="marquee-inner flex whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-6 font-heading text-[9px] tracking-[0.35em] uppercase text-white/10">
                <span className="w-1 h-1 rounded-full bg-white/10" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          {/* Scroll cue */}
          <button
            data-testid="hero-scroll-cue"
            onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3 font-heading text-[9px] tracking-[0.35em] uppercase text-white/30 hover:text-white/60 transition-colors group"
            aria-label="Scroll to videos"
          >
            <span className="w-6 h-px bg-white/20 group-hover:w-10 transition-all duration-500" />
            Scroll to explore
          </button>

          {/* Mobile stats (only shown on mobile since side columns are hidden) */}
          <div className="flex items-center gap-8 lg:hidden">
            {[['06', 'Releases'], ['∞', 'Worlds']].map(([k, v]) => (
              <div key={v} className="text-right">
                <div className="font-display font-light text-white text-base leading-none">{k}</div>
                <div className="font-heading text-[8px] tracking-[0.3em] uppercase text-white/25 mt-0.5">{v}</div>
              </div>
            ))}
          </div>

  
        </div>
      </div>
    </section>
  );
}
