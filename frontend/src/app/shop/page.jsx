'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ShopPage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-body selection:bg-white/20 flex flex-col justify-center overflow-hidden">
      
      {/* Background Texture - Pure minimalist black with extremely subtle noise */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        {/* Soft center spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03),_transparent_70%)]" />
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-20">
        <Link href="/" className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors group font-heading text-[10px] tracking-[0.2em] uppercase">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Archives
        </Link>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 w-full text-center mt-8">
        
        <p className="font-heading uppercase tracking-[0.5em] text-xs text-white/40 mb-8 flex items-center justify-center gap-6">
          <span className="w-16 h-[1px] bg-white/20" />
          Ekopix Store
          <span className="w-16 h-[1px] bg-white/20" />
        </p>

        <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl text-metallic leading-tight tracking-tight drop-shadow-2xl mb-6">
          Opening Soon
        </h1>
        
        <p className="font-body font-light text-lg md:text-xl text-white/60 mb-16 max-w-2xl mx-auto tracking-wide leading-relaxed">
          The Ekopix Store is currently being forged. Drop your email below for exclusive early access to our limited edition hoodies, original music t-shirts, and physical vinyl drops.
        </p>

        {/* Email Capture Form */}
        <form className="max-w-md mx-auto relative group" onSubmit={(e) => e.preventDefault()}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-sm rounded-full" />
          <div className="relative flex items-center bg-black border border-white/20 rounded-full p-2 hover:border-white/40 transition-colors duration-500 shadow-2xl">
            <input 
              type="email" 
              placeholder="ENTER EMAIL ADDRESS" 
              required
              className="w-full bg-transparent border-none outline-none text-white font-heading text-xs tracking-[0.2em] px-6 py-4 placeholder:text-white/30"
            />
            <button 
              type="submit"
              className="bg-white text-black font-heading text-[10px] tracking-[0.25em] uppercase px-8 py-4 rounded-full hover:bg-[#e0e0e0] hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Get Access
            </button>
          </div>
        </form>

      </main>

      {/* Footer minimal */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-20">
        <p className="font-heading text-[9px] tracking-[0.3em] uppercase text-white/20">
          ©  Ekopixofficial. All Rights Reserved.
        </p>
      </div>

    </div>
  );
}
