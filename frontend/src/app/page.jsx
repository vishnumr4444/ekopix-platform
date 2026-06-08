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

      {/* Bottom Right Social Navigation */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9999] pointer-events-auto">
        <div className="flex items-center gap-5 md:gap-6 drop-shadow-xl">
          
          <a href="https://open.spotify.com/artist/63Um2nnNc7cywagZXktWc9" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white hover:scale-110 transition-all" aria-label="Spotify">
            <svg viewBox="0 0 496 512" fill="currentColor" height="24" width="24"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 354.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-72.5-47-157.8-52.6-246.7-35.3-3.9 1.3-8.1 2.6-11.6 2.6-11.1 0-19.8-8.2-19.8-19.2 0-13.6 7.4-20 18.2-22.7 101.4-19.4 195.8-13 280.2 41.5 5.8 3.9 9.4 8.7 9.4 18.2 0 11.3-8.7 19.1-17.4 19.1zm33.4-71.1c-5.8 0-10-2.9-14.2-5.5-84.3-55.5-199.1-61.9-299.1-43.2-6.5 1.3-11.7 2.6-16.2 2.6-14.9 0-25.9-10.7-25.9-24.6 0-15.9 8.7-25.6 24.3-28.5 112.5-21.7 241-15.2 336.9 47.9 6.8 4.5 11 11 11 22.4 0 13.9-9.7 28.9-16.8 28.9z"/></svg>
          </a>
          
          <a href="https://www.youtube.com/@EKOPIXofficial" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white hover:scale-110 transition-all" aria-label="YouTube">
            <svg viewBox="0 0 576 512" fill="currentColor" height="24" width="24"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
          </a>
          
          <a href="https://music.apple.com/in/search?term=ekopix" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white hover:scale-110 transition-all" aria-label="Apple Music">
            <svg viewBox="0 0 384 512" fill="currentColor" height="24" width="24"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
          </a>

<a
  href="https://www.facebook.com/profile.php?id=61587235707518"
  target="_blank"
  rel="noopener noreferrer"
  className="text-white/70 hover:text-white hover:scale-110 transition-all"
  aria-label="Facebook"
>
  <svg
    viewBox="0 0 320 512"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
</a>

          <a href="https://www.instagram.com/ekopix_official/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white hover:scale-110 transition-all" aria-label="Instagram">
            <svg viewBox="0 0 448 512" fill="currentColor" height="24" width="24"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
          </a>
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
