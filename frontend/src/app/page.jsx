'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import VideoCarousel from '@/components/VideoCarousel';
import About from '@/components/About';
import LatestRelease from '@/components/LatestRelease';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [visibility, setVisibility] = useState({
    hero: true,
    latestDrop: true,
    videos: true,
    composer: true,
    contact: true
  });
  const [content, setContent] = useState({
    heroPill: "India's First Anime Music Band",
    heroTagline: "India's Anime Music Experience",
    heroDesc: "Original Hindi & English songs woven into cinematic worlds. Every video is a universe. Every song is a character.",
    aboutLabel: "The Universe",
    aboutTitle: "Every song\nis a character.",
    aboutDesc: "EKOPIX is India's first anime music band — blending original Hindi and English songs with anime-style animation and storytelling. Every video is a world. Every song is a character.",
    contactTitle: "For the journey.",
    contactSubtitle: "Join the universe.",
    contactEmail: "ekopixuniverse@gmail.com"
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data?.visibility) setVisibility(data.visibility);
        if (data?.content) setContent(data.content);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative bg-black min-h-screen text-[#c4ccd8] font-body selection:bg-white/20">
      
      {/* ── Ultra-Premium Slate Gradient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black">
        {/* Deep, flawless radial gradient from top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1c23] via-black to-black opacity-90" />
        
        {/* Soft corner glows to add volume to the gradient */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-white/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-white/5 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Bottom Left Navigation */}
      <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[9999] pointer-events-auto">
        <div className="flex items-center gap-6 px-6 py-3.5 rounded-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/15 shadow-2xl hover:border-white/25 hover:bg-[#0a0a0a]/80 transition-all duration-500 group">
          <Link 
            href="/shop" 
            className="font-heading text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
          >
            Shop
          </Link>
          <span className="w-px h-3 bg-white/20 group-hover:bg-white/40 transition-colors duration-500" />
          <Link 
            href="/more" 
            className="font-heading text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
          >
            More
          </Link>
        </div>
      </div>



      <div className="relative z-10">
        <Nav />
        <main>
          {visibility.hero && <Hero content={content} />}
          {visibility.videos && <VideoCarousel />}
          {visibility.composer && <About content={content} />}
          {visibility.latestDrop && <LatestRelease />}
        </main>
        <Footer content={content} visibility={visibility} />
      </div>
    </div>
  );
}
