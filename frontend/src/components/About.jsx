'use client';
import { useState } from 'react';
import { Lock, ChevronLeft, ChevronRight, X } from 'lucide-react';

const mainImage = "https://static.prod-images.emergentagent.com/jobs/3bd09f98-b2a4-4aae-8ec0-e1c4210fe6be/images/8241829546ae6506a8b662bebc51aea4172aa6eccdbfca9c5841975cf8f30124.png";

const characters = [
  { 
    name: 'Neelavai', 
    image: '/images/Neelavai-old.jpeg', 
    backImage: '/images/Neelavai-new.jpeg',
    locked: false,
    title: 'The Water Goddess',
    lore: [
      'Born from the first tears of a shattered timeline, she wanders the cosmic oceans. Her melodies carry the memories of sunken worlds and forgotten civilizations.',
      'As the universe fractured, her acoustic resonance became the only thread capable of stitching the dimensions back together. She is not just a musician—she is the architect of the cosmic tide, washing away the corrupted fragments of the past.',
      'When the Yuganta event threatened to unravel Bhoomi, Neelavai was the first of the Tridiva to awaken. Her presence brings both overwhelming peace and the terrifying power of the deep abyss.'
    ]
  },
  { name: 'Agharni', image: mainImage, locked: true },
  { name: 'Aranya', image: mainImage, locked: true },
  { name: 'Unknown', image: mainImage, locked: true },
  { name: 'Unknown', image: mainImage, locked: true },
  { name: 'Unknown', image: mainImage, locked: true },
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Lightbox state
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeChar, setActiveChar] = useState(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % characters.length);
  };

  const handleOpen = (char) => {
    if (char.locked) return;
    setActiveChar(char);
    setIsOpen(true);
    requestAnimationFrame(() => setTimeout(() => setIsZoomed(true), 50));
  };

  const handleClose = () => {
    setIsZoomed(false);
    setTimeout(() => {
      setIsOpen(false);
      setActiveChar(null);
    }, 1100);
  };

  return (
    <section id="about" data-testid="about-section" className="py-24 md:py-32 relative bg-transparent overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-gradient-to-br from-white/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[50%] bg-gradient-to-tl from-white/5 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Background Modal overlay to dim the rest of the site when lightbox is open */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 transition-all duration-[1100ms] pointer-events-none ${
          isZoomed ? 'bg-black/90 backdrop-blur-md opacity-100 !pointer-events-auto' : 'opacity-0'
        }`}
      />

      <div className="max-w-[1300px] mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* ── UNIFIED STORY HEADER ── */}
        <div className="text-center mb-10 relative">
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-6 drop-shadow-sm flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-[#888888]" />
            The Epic
            <span className="w-12 h-[1px] bg-[#888888]" />
          </p>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-[4.5rem] text-white leading-[1.1] tracking-tighter drop-shadow-lg max-w-4xl mx-auto">
            Yugantara: The Last Odyssey
          </h2>
        </div>

        {/* ── SEAMLESS STORY CONTENT ── */}
        <div className="relative w-full max-w-4xl text-center space-y-8 font-body text-[#bbbbbb] leading-relaxed mb-12">
          <p className="font-light text-white/90 text-xl md:text-2xl drop-shadow-sm leading-snug">
            To stop Yuganta.. the universe created a path called Yugantara so that the Tridiva elemental gods and goddesses can save Bhoomi in time.
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 pt-6 border-t border-white/[0.05] mt-8 text-left md:text-center">
            <p className="flex-1 italic text-white/50 text-sm md:text-base">
              "Before the end, the universe chose its warriors.<br/>
              <strong className="text-white/70 font-normal">Yuganta is coming. Yugantara is the answer.</strong>"
            </p>
            <div className="hidden md:block w-px bg-white/[0.05]" />
            <p className="flex-1 italic text-white/50 text-sm md:text-base">
              "Yuganta wrote the end. Yugantara refused it.<br/>
              <strong className="text-white/70 font-normal">When the universe faced its end - it chose them.</strong>"
            </p>
          </div>
        </div>

        {/* ── UNIFIED CHARACTERS GRID ── */}
        <div className="w-full relative flex flex-col items-center">
          
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-12 flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-[#888888]" />
            Our Superheros
            <span className="w-12 h-[1px] bg-[#888888]" />
          </p>

          <div className="relative w-full max-w-[1200px] h-[460px] md:h-[530px] flex items-center justify-center overflow-visible">
            
            {/* Carousel Controls Overlay */}
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 text-white/40 hover:text-white bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm -ml-4 md:-ml-8 transition-all"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 text-white/40 hover:text-white bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm -mr-4 md:-mr-8 transition-all"
            >
              <ChevronRight size={28} />
            </button>

            {/* Cards Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-visible perspective-1000">
              {characters.map((char, idx) => {
                let diff = idx - activeIndex;
                const N = characters.length;
                if (diff < -N / 2) diff += N;
                if (diff > N / 2) diff -= N;
                
                const isCenter = diff === 0;
                
                // Set position class
                let posClass = 'card-pos-back';
                if (diff === 0) posClass = 'card-pos-0';
                else if (diff === 1) posClass = 'card-pos-1';
                else if (diff === -1) posClass = 'card-pos-minus-1';
                else if (diff === 2) posClass = 'card-pos-2';
                else if (diff === -2) posClass = 'card-pos-minus-2';

                return (
                  <div 
                    key={idx} 
                    className={`card-3d shrink-0 w-[220px] md:w-[260px] flex flex-col items-center gap-6 ${posClass} ${!char.locked ? 'cursor-pointer group/card' : ''}`}
                    onClick={() => {
                      if (isCenter) {
                        handleOpen(char);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                  >
                    {/* Blended faded card */}
                    <div className="relative w-full aspect-[3/4] flex items-center justify-center overflow-visible">
                      {!char.locked ? (
                        <div className="w-full h-full relative animate-float" style={{ animationDelay: `${idx * 0.2}s` }}>
                          <img 
                            src={char.image} 
                            alt={char.name} 
                            className="w-full h-full object-contain transition-transform duration-700 group-hover/card:scale-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                            style={{ 
                              maskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)', 
                              WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)' 
                            }}
                            loading="lazy"
                          />
                          {isCenter && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                              <span className="font-heading uppercase text-[8px] md:text-[9px] tracking-[0.4em] text-white/90 bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 whitespace-nowrap shadow-xl">
                                Discover
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full relative opacity-80 bg-white/[0.02] rounded-3xl border border-white/[0.03] overflow-hidden group hover:bg-white/[0.05] transition-colors">
                          <img 
                            src={char.image} 
                            className="absolute inset-0 w-full h-full object-contain blur-2xl grayscale opacity-20 mix-blend-overlay" 
                            alt="Locked" 
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:border-white/20 transition-all">
                              <Lock className="w-5 h-5 text-white/40" />
                            </div>
                            <span className="font-heading uppercase text-[8px] tracking-[0.4em] text-white/30">Locked</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Character Details */}
                    <div className="text-center w-full">
                      <h3 className={`font-heading text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ${!char.locked ? 'text-white group-hover/card:text-white/80' : 'text-white/50'}`}>
                        {char.name}
                      </h3>
                      <p className={`mt-2 font-body text-xs md:text-sm transition-colors ${!char.locked ? 'text-white/50 group-hover/card:text-white/70' : 'text-white/30'}`}>
                        {char.title || "Unknown Entity"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {isOpen && activeChar && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all pointer-events-auto backdrop-blur-md ${
              isZoomed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            aria-label="Close"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          {/* Huge Image container moving to the left AND flipping */}
          <div
            onClick={handleClose}
            style={{ transitionDuration: '1100ms' }}
            className={`fixed z-50 w-[50vw] max-w-[200px] md:w-full md:max-w-[400px] lg:max-w-[500px] aspect-[4/5] cursor-pointer perspective-1000 pointer-events-auto transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isZoomed
                ? 'top-[12%] md:top-1/2 left-1/2 md:left-[8%] lg:left-[18%] -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 scale-100 opacity-100'
                : 'top-[80%] left-1/2 -translate-x-1/2 md:-translate-y-1/2 scale-[0.6] opacity-0'
            }`}
          >
            <div
              style={{ transitionDuration: '1100ms' }}
              className={`relative w-full h-full transform-style-3d transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] ${isZoomed ? 'rotate-y-180' : 'rotate-y-0'}`}
            >
              {/* Front Face: Original Image (Neelavai-old) */}
              <div className="absolute inset-0 overflow-hidden bg-[#050505] backface-hidden rounded-xl border border-white/10 flex flex-col justify-center items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
                <img 
                  src={activeChar.image} 
                  alt={activeChar.name} 
                  className="relative z-10 w-full h-full object-contain scale-110 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
                />
              </div>
              
              {/* Back Face: New Image (Neelavai-new) */}
              <div className="absolute inset-0 overflow-hidden backface-hidden rotate-y-180 flex flex-col rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-[#050505]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
                
                <img 
                  src={activeChar.backImage || activeChar.image} 
                  alt={activeChar.name} 
                  className="relative z-10 w-full h-full object-contain scale-110 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
                />
              </div>
            </div>
          </div>

          {/* Lore text animating in on the right */}
          <div 
            className={`fixed z-50 w-full max-w-sm md:max-w-md lg:max-w-xl px-6 md:px-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none flex flex-col justify-center ${
              isZoomed 
                ? 'top-[45%] md:top-1/2 left-1/2 md:left-[50%] lg:left-[55%] -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 opacity-100' 
                : 'top-[80%] md:top-[60%] left-1/2 md:left-[50%] lg:left-[55%] -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 opacity-0'
            }`}
            style={{ transitionDelay: isZoomed ? '600ms' : '0ms' }}
          >
            <div className="h-full overflow-y-auto max-h-[50vh] md:max-h-[80vh] hide-scrollbar pb-10 md:pb-0">
              <h3 className="font-heading uppercase tracking-[0.4em] text-[9px] md:text-[10px] text-[#888888] mb-3 md:mb-4 flex items-center gap-3 md:gap-4 drop-shadow-md">
                <span className="w-8 md:w-12 h-[1px] bg-[#888888]" />
                Character Lore
              </h3>
              
              <h2 className="font-display font-light text-4xl md:text-6xl lg:text-7xl text-white mb-2 tracking-tight drop-shadow-lg">
                {activeChar.name}
              </h2>
              <h4 className="font-heading uppercase tracking-[0.2em] text-[9px] md:text-xs text-white/50 mb-6 md:mb-10">
                {activeChar.title}
              </h4>
              
              <div className="font-body text-[#bbbbbb] text-xs md:text-base lg:text-lg leading-relaxed space-y-4 md:space-y-6 max-w-lg">
                {activeChar.lore?.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .card-3d {
          position: absolute;
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s, z-index 0.8s;
          will-change: transform, opacity;
        }
        
        .card-pos-0 {
          transform: translateX(0) translateZ(0) rotateY(0deg) scale(1.1);
          opacity: 1;
          z-index: 10;
        }
        
        .card-pos-1 {
          transform: translateX(65%) translateZ(-150px) rotateY(-40deg) scale(0.85);
          opacity: 0.9;
          z-index: 8;
        }
        @media (min-width: 768px) {
          .card-pos-1 {
            transform: translateX(95%) translateZ(-150px) rotateY(-35deg) scale(0.85);
          }
        }
        
        .card-pos-minus-1 {
          transform: translateX(-65%) translateZ(-150px) rotateY(40deg) scale(0.85);
          opacity: 0.9;
          z-index: 8;
        }
        @media (min-width: 768px) {
          .card-pos-minus-1 {
            transform: translateX(-95%) translateZ(-150px) rotateY(35deg) scale(0.85);
          }
        }
        
        .card-pos-2 {
          transform: translateX(115%) translateZ(-300px) rotateY(-60deg) scale(0.7);
          opacity: 0.7;
          z-index: 6;
        }
        @media (min-width: 768px) {
          .card-pos-2 {
            transform: translateX(175%) translateZ(-300px) rotateY(-55deg) scale(0.75);
          }
        }
        
        .card-pos-minus-2 {
          transform: translateX(-115%) translateZ(-300px) rotateY(60deg) scale(0.7);
          opacity: 0.7;
          z-index: 6;
        }
        @media (min-width: 768px) {
          .card-pos-minus-2 {
            transform: translateX(-175%) translateZ(-300px) rotateY(55deg) scale(0.75);
          }
        }
        
        .card-pos-back {
          transform: translateX(0) translateZ(-500px) rotateY(180deg) scale(0.5);
          opacity: 0;
          z-index: 0;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
