'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function About({ content = {} }) {
  const [isOpen, setIsOpen]   = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    requestAnimationFrame(() => setTimeout(() => setIsZoomed(true), 50));
  };
  const handleClose = () => {
    setIsZoomed(false);
    setTimeout(() => setIsOpen(false), 1100);
  };

  const mainImage = "https://static.prod-images.emergentagent.com/jobs/3bd09f98-b2a4-4aae-8ec0-e1c4210fe6be/images/8241829546ae6506a8b662bebc51aea4172aa6eccdbfca9c5841975cf8f30124.png";
  const pastImage = "/images/past.png";

  return (
    <section id="about" data-testid="about-section" className="py-12 md:py-16">

      {/* Modal backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 transition-all duration-[1100ms] pointer-events-none ${
          isZoomed ? 'bg-black/85 backdrop-blur-sm opacity-100 !pointer-events-auto' : 'opacity-0'
        }`}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

        {/* Text */}
        <div className="lg:col-span-7">
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-6 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#888888]" />
            {content.aboutLabel || "The Universe"}
          </p>

          <h2 className="font-display font-light text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-[1.1] tracking-tight whitespace-pre-line">
            {content.aboutTitle || "Every song is a character."}
          </h2>

          <p className="mt-8 max-w-lg text-base md:text-lg font-light text-[#cccccc] leading-relaxed whitespace-pre-line">
            {content.aboutDesc || "EKOPIX is India's first anime music band — blending original Hindi and English songs with anime-style animation and storytelling. Every video is a world. Every song is a character."}
          </p>

          <div className="grid grid-cols-3 gap-8 mt-14 max-w-sm">
            {[['06', 'Releases'], ['∞', 'Worlds'], ['1st', 'India']].map(([k, v]) => (
              <div key={v} data-testid={`about-stat-${v.toLowerCase()}`}>
                <div className="font-display font-light text-3xl text-white">{k}</div>
                <div className="font-heading uppercase text-[9px] tracking-[0.35em] text-[#888888] mt-2">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Art card */}
        <div className="lg:col-span-5">
          <div
            data-testid="about-illustration"
            onClick={handleOpen}
            className="group relative w-full aspect-[4/5] animate-float cursor-pointer transition-all duration-500 flex items-center justify-center"
          >
            <img
              src={mainImage}
              alt="EKOPIX universe key art"
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ 
                maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)', 
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)' 
              }}
              loading="lazy"
            />
            
            {/* Subtle hover instruction */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="font-heading uppercase text-[8px] tracking-[0.4em] text-white/50 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                Click to Expand
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <button
            onClick={handleClose}
            className={`absolute top-6 right-6 z-50 w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/35 transition-all pointer-events-auto ${
              isZoomed ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Image container moving to the left AND flipping */}
          <div
            onClick={handleClose}
            style={{ transitionDuration: '1100ms' }}
            className={`fixed z-50 -translate-y-1/2 w-full max-w-[340px] md:max-w-[420px] aspect-[4/5] cursor-pointer perspective-1000 pointer-events-auto transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isZoomed
                ? 'left-1/2 md:left-[15%] lg:left-[25%] -translate-x-1/2 md:translate-x-0 top-1/2 scale-100 opacity-100'
                : 'left-1/2 top-[75%] lg:left-[72%] lg:top-[56%] -translate-x-1/2 scale-[0.85] opacity-0'
            }`}
          >
            <div
              style={{ transitionDuration: '1100ms' }}
              className={`relative w-full h-full transform-style-3d transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] ${isZoomed ? 'rotate-y-180' : 'rotate-y-0'}`}
            >
              {/* Front: The Main Image */}
              <div className="absolute inset-0 overflow-hidden border border-white/10 bg-[#0a0a0a] backface-hidden">
                <img src={mainImage} alt="EKOPIX key art" className="w-full h-full object-cover" />
              </div>
              {/* Back: The Past Timeline Image */}
              <div className="absolute inset-0 overflow-hidden border border-white/10 bg-[#080808] backface-hidden rotate-y-180 flex flex-col p-2">
                <div className="flex-1 min-h-0 flex items-center justify-center bg-black/30">
                  <img src={pastImage} alt="Past Timeline" className="w-full h-full object-contain" />
                </div>
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                  <span className="font-heading text-[8px] tracking-[0.3em] uppercase text-white/40">PAST TIMELINE</span>
                  <span className="font-heading text-[8px] tracking-[0.2em] uppercase text-white/25">VOL. 00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lore text animating in on the right */}
          <div 
            className={`fixed z-50 top-1/2 -translate-y-1/2 left-1/2 md:left-[55%] lg:left-[55%] w-full max-w-lg px-6 md:px-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
              isZoomed ? 'opacity-100 translate-y-0 md:translate-x-0' : 'opacity-0 translate-y-10 md:translate-x-10 md:translate-y-0'
            }`}
            style={{ transitionDelay: isZoomed ? '600ms' : '0ms' }}
          >
            <h3 className="font-heading uppercase tracking-[0.4em] text-[10px] text-[#888888] mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[#888888]" />
              Character Lore
            </h3>
            <h2 className="font-display font-light text-4xl md:text-6xl text-metallic mb-8 tracking-tight">
              The Water Goddess
            </h2>
            <div className="font-body text-[#aaaaaa] text-sm md:text-base leading-relaxed space-y-6 max-w-md">
              <p>
                Born from the first tears of a shattered timeline, she wanders the cosmic oceans. Her melodies carry the memories of sunken worlds and forgotten civilizations.
              </p>
              <p>
                As the universe fractured, her acoustic resonance became the only thread capable of stitching the dimensions back together. She is not just a musician—she is the architect of the cosmic tide, washing away the corrupted fragments of the past.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
