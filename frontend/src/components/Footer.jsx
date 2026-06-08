import { Youtube, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CHANNEL_URL } from '@/lib/videos';

export default function Footer({ content = {}, visibility = { contact: true } }) {
  if (!visibility.contact) return null;

  return (
    <footer data-testid="site-footer" id="contact" className="pt-24 pb-10">

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#888888]" />
            Establish Contact
          </p>
          <h2 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            {content.contactTitle || "For the journey."}
          </h2>
          <p className="font-body text-[#888888] mt-4">{content.contactSubtitle || "Join the universe."}</p>
        </div>
        <div className="flex flex-col md:items-end gap-5 mt-8 md:mt-0">
          <a href={`mailto:${content.contactEmail || "ekopixuniverse@gmail.com"}`} className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/90 hover:text-white transition-colors flex items-center gap-4">
            <Mail size={16} /> {content.contactEmail || "ekopixuniverse@gmail.com"}
          </a>
          <a href="tel:+911234567890" className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/90 hover:text-white transition-colors flex items-center gap-4">
            <Phone size={16} /> +91 12345 67890
          </a>
        </div>
      </div>

      {/* Single top rule — ultra thin */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="h-px w-full bg-white/10 mb-14" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="EKOPIX home">
            <div className="relative w-24 h-24 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <Image src="/images/logo.png" alt="EKOPIX" fill sizes="96px" className="object-contain" />
            </div>
          </Link>

          <p className="font-heading text-[10px] tracking-[0.4em] uppercase text-white/60">
            India&apos;s Anime Music Experience
          </p>

   
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white/60">
           ©EKOPIXOFFICIAL All rights reserved.
          </p>
          <nav className="flex items-center gap-6 font-heading text-[10px] tracking-[0.3em] uppercase text-white/60">
            <a href="#videos"  data-testid="footer-link-videos"  className="hover:text-white transition-colors">Videos</a>
            <a href="#about"   data-testid="footer-link-about"   className="hover:text-white transition-colors">About</a>
            <a href="#contact" data-testid="footer-link-contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
