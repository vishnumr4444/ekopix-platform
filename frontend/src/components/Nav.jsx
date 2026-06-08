'use client';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { id: 'videos',   label: 'Videos',   href: '/#videos' },
  { id: 'about',    label: 'About',    href: '/#about' },
  { id: 'composer', label: 'Songs', href: '/composer', isRoute: true },
  { id: 'contact',  label: 'Contact',  href: '/#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLinkClick = (e, link) => {
    setOpen(false);
    if (pathname === '/' && !link.isRoute) {
      e.preventDefault();
      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isScrolled = scrolled || pathname !== '/';

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#020202]/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">

        {/* ── Logo: image mark + wordmark ── */}
        <Link
          data-testid="nav-logo"
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="EKOPIX home"
        >
          {/* Logo image */}
          <div className="relative w-20 h-20 shrink-0 transition-opacity duration-300 group-hover:opacity-80">
            <Image
              src="/images/logo.png"
              alt="EKOPIX mark"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          {/* Wordmark */}

        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => {
            const active = pathname === l.href || (l.href.startsWith('/#') && pathname === '/');
            return (
              <Link
                key={l.id}
                data-testid={`nav-link-${l.id}`}
                href={l.href}
                onClick={(e) => handleLinkClick(e, l)}
                className={`relative font-heading text-[12px] tracking-[0.2em] uppercase transition-colors duration-300 group ${
                  active ? 'text-white' : 'text-white/90 hover:text-white'
                }`}
              >
                {l.label}
                <span
                  className="absolute -bottom-1 left-0 h-px bg-white transition-all duration-500 w-0 group-hover:w-full"
                />
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="ml-1 px-5 py-2 border border-white/30 font-heading text-[12px] tracking-[0.2em] uppercase text-white/90 hover:text-white hover:border-white transition-all duration-300"
          >
            Admin
          </Link>
        </nav>

        {/* ── Mobile toggle ── */}
        <button
          data-testid="nav-menu-toggle"
          className="md:hidden text-white/60 hover:text-white transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile panel ── */}
      {open && (
        <div
          data-testid="nav-mobile-panel"
          className="md:hidden border-t border-white/[0.07] bg-[#020202]/95 backdrop-blur-lg"
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            {links.map((l) => (
              <Link
                key={l.id}
                data-testid={`nav-mobile-link-${l.id}`}
                href={l.href}
                onClick={(e) => handleLinkClick(e, l)}
                className={`font-heading uppercase text-sm tracking-[0.22em] transition-colors ${
                  pathname === l.href ? 'text-white' : 'text-white/45 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="font-heading uppercase text-sm tracking-[0.22em] text-white/30 pt-4 border-t border-white/[0.07] hover:text-white/60 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
