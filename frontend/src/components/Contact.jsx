import { Mail, Phone, Youtube, ArrowUpRight } from 'lucide-react';
import { CHANNEL_URL } from '@/lib/videos';

export default function Contact({ content = {} }) {
  return (
    <section id="contact" data-testid="contact-section" className="py-16 md:py-24 relative bg-black overflow-hidden">
      {/* Subtle cinematic spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none opacity-50 mix-blend-screen" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-20">
          <div className="max-w-3xl">
            <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-6 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[#888888]" />
              Establish Contact
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-metallic leading-[1.2] tracking-tighter drop-shadow-2xl break-words pb-2">
              {content.contactTitle || "For the journey."}
            </h2>
          </div>
          <div className="md:max-w-sm">
            <p className="font-body text-[#aaaaaa] text-sm md:text-base leading-relaxed">
              {content.contactSubtitle || "Join the universe."}
            </p>
          </div>
        </div>

        {/* Premium Horizontal Contact Rows */}
        <div className="border-t border-white/10 flex flex-col">
          <ContactRow 
            icon={<Mail size={24} strokeWidth={1.5} />} 
            label="Direct Inquiries" 
            value={content.contactEmail || "ekopixofficial@gmail.com"} 
            href={`mailto:${content.contactEmail || "ekopixofficial@gmail.com"}`} 
          />
          <ContactRow 
            icon={<Phone size={24} strokeWidth={1.5} />} 
            label="Global Office" 
            value="+91 7034499883" 
            href="tel:+917034499883" 
          />
          <ContactRow 
            icon={<Youtube size={24} strokeWidth={1.5} />} 
            label="Broadcast Network" 
            value="Ekopix Official" 
            href={CHANNEL_URL} 
            external 
          />
        </div>

      </div>
    </section>
  );
}

function ContactRow({ icon, label, value, href, external }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex flex-col md:flex-row md:items-center justify-between py-6 md:py-10 border-b border-white/10 hover:bg-white/[0.02] transition-colors relative overflow-hidden"
    >
      <div className="flex items-center gap-6 md:gap-10 relative z-10 mb-4 md:mb-0">
        <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all duration-500 group-hover:scale-110 bg-black/50 backdrop-blur-sm">
          {icon}
        </span>
        <span className="font-heading text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#888888] group-hover:text-white/70 transition-colors">
          {label}
        </span>
      </div>
      
      <div className="relative z-10 flex items-center gap-6 md:gap-10 md:pr-10">
        <span className="font-body font-light text-xl md:text-2xl lg:text-3xl text-white/80 group-hover:text-white transition-colors tracking-widest">
          {value}
        </span>
        <ArrowUpRight 
          size={32} 
          strokeWidth={1}
          className="text-white/20 group-hover:text-white transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 hidden md:block" 
        />
      </div>

      {/* Cinematic light sweep effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] ease-in-out pointer-events-none" />
    </a>
  );
}
