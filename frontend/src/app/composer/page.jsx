'use client';
import { useState, useEffect, useRef } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Volume2, Play, Pause, Disc } from 'lucide-react';

const composerInfo = {
  name: "EKOPIX",
  role: "Lead Composer & Arranger",
  bio: "The acoustic architect behind EKOPIX. It blends symphonic orchestrations, heavy modern synthesizer layers, and driving rock melodies to define the soundscapes of the universe. Explore the selected works below."
};

const DEFAULT_TRACKS = [
  { id: '1', title: "Shattered Wings", filename: "1.wav", start: 30, end: 48, desc: "A sweeping symphonic metal theme with dramatic violin crescendos and dual-guitar drives.", tags: ["Orchestral", "Symphonic Metal"] },
  { id: '2', title: "Neon Horizon", filename: "2.wav", start: 45, end: 60, desc: "High-octane synthwave theme driving the cyberpunk racing universe log.", tags: ["Synthwave", "Cyberpunk"] },
  { id: '3', title: "Ripples of Water", filename: "3.mp3", start: 15, end: 32, desc: "Water Goddess character theme, ambient piano structures meeting harp resonance.", tags: ["Ambient", "Piano Instrumental"] },
  { id: '4', title: "Fallen Sky", filename: "4.mp3", start: 55, end: 72, desc: "Heavy modern guitar riffs colliding with deep visualizer synthesizer drops.", tags: ["Cyber-Rock", "Industrial"] },
  { id: '5', title: "Lost Resonance", filename: "5.wav", start: 20, end: 38, desc: "Ethereal vocal chop melodies floating over dynamic electro-ambient arrangements.", tags: ["Future Bass", "Melodic"] },
  { id: '6', title: "Stardust Pulse", filename: "6.wav", start: 40, end: 58, desc: "Uplifting space-themed EDM log with sparkling lead drop synths.", tags: ["EDM", "Uplifting Space"] },
  { id: '7', title: "Crimson Eclipse", filename: "7.wav", start: 35, end: 53, desc: "Aggressive industrial electro theme representing timeline fractures.", tags: ["Industrial Electro", "Dark"] },
  { id: '8', title: "Memory Fragment", filename: "8.mp3", start: 10, end: 28, desc: "Nostalgic acoustic arrangements paired with sweeping symphonic string ensembles.", tags: ["Acoustic", "Chamber Strings"] },
  { id: '9', title: "Glitch Dream", filename: "9.mp3", start: 25, end: 42, desc: "Experimental modular synth structures with complex digital glitch beats.", tags: ["Glitch Hop", "Experimental"] },
  { id: '10', title: "Final Convergence", filename: "10.mp3", start: 60, end: 80, desc: "The grand orchestration log combining full electronic band and full orchestra.", tags: ["Symphonic Rock", "Grand Finale"] },
  { id: '11', title: "Echoes of Eternity", filename: "11.mp3", start: 20, end: 40, desc: "An orchestrally led cinematic ballad detailing timeline roots.", tags: ["Orchestral", "Epic Ballad"] },
  { id: '12', title: "Cybernetic Soul", filename: "12.mp3", start: 5, end: 25, desc: "A pulsing techno/synth soundtrack symbolizing computer systems.", tags: ["Techno", "Cyberpunk"] }
];

export default function ComposerPage() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [activeIdx, setActiveIdx] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const hoverIntervalRef = useRef(null);

  useEffect(() => {
    fetch('/api/tracks')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
        }
      })
      .catch((err) => {
        console.warn("Using fallback composer tracks:", err);
      });
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const stopPreview = () => {
    if (hoverAudioRef.current) {
      hoverAudioRef.current.pause();
      hoverAudioRef.current = null;
    }
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
  };

  const playPreview = (track, idx) => {
    if (isPlaying) return; // Don't interrupt full playback

    stopPreview();

    const audioPath = `/songs/${track.filename}`;
    const audio = new Audio(audioPath);
    hoverAudioRef.current = audio;
    audio.volume = 0.4; // Slightly quieter for preview
    audio.currentTime = track.start || 0;

    audio.play()
      .then(() => {
        hoverIntervalRef.current = setInterval(() => {
          if (!hoverAudioRef.current) return;
          
          if (hoverAudioRef.current.currentTime >= (track.end || track.start + 15)) {
            stopPreview();
          }
        }, 100);
      })
      .catch((err) => {
        // Browsers might block autoplay on hover, we catch silently
      });
  };

  const playFull = (track, idx) => {
    if (activeIdx === idx && isPlaying) {
      stopAudio();
      return;
    }

    stopAudio();
    stopPreview();

    const audioPath = `/songs/${track.filename}`;
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    audio.volume = 0.7;
    audio.currentTime = 0;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.play()
      .then(() => {
        setActiveIdx(idx);
        setIsPlaying(true);
        setCurrentTime(0);

        intervalRef.current = setInterval(() => {
          if (!audioRef.current) return;
          setCurrentTime(audioRef.current.currentTime);

          if (audioRef.current.ended) {
            stopAudio();
          }
        }, 100);
      })
      .catch((err) => {
        console.warn("Audio play blocked or file missing:", err);
      });
  };

  useEffect(() => {
    return () => {
      stopAudio();
      stopPreview();
    };
  }, []);

  const activeTrack = activeIdx !== null ? tracks[activeIdx] : null;

  return (
    <div className="min-h-screen bg-[#020202] text-white font-body relative pb-32 selection:bg-white/20">
      <style>{`
        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: 24px; }
        }
      `}</style>
      {/* ── Metallic Silver Environmental Lighting & Texture ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,_rgba(200,210,225,0.06),_transparent_60%)]" />
        <div className="absolute -bottom-48 -left-48 w-[1400px] h-[1400px] bg-[radial-gradient(circle_at_center,_rgba(160,175,195,0.04),_transparent_60%)]" />
        <div className="absolute top-[40%] -left-[20%] w-[140%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent rotate-12 blur-[2px]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative z-10">
        <Nav />

        {/* Hero Section */}
        <div className="relative pt-48 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-white/10">

        <div className="relative z-10">
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-6 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#888888]" />
            {composerInfo.role}
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
            {composerInfo.name}
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl font-light text-[#cccccc] leading-relaxed">
            {composerInfo.bio}
          </p>
        </div>
      </div>

      {/* Track List Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-3xl font-light tracking-wide text-white">Selected Works</h2>
          <span className="font-heading text-xs tracking-[0.3em] uppercase text-[#888888]">{tracks.length} Compositions</span>
        </div>

        <div className="flex flex-col border-t border-white/10">
          {tracks.map((t, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={t.id}
                className={`group flex items-center justify-between py-8 border-b border-white/10 transition-all cursor-pointer ${isActive ? 'bg-white/[0.03] px-6 -mx-6 rounded-2xl border-transparent' : 'hover:bg-white/[0.02] hover:px-4 hover:-mx-4 hover:rounded-xl hover:border-transparent'}`}
                onClick={() => playFull(t, idx)}
                onMouseEnter={() => { setHoveredIdx(idx); playPreview(t, idx); }}
                onMouseLeave={() => { setHoveredIdx(null); stopPreview(); }}
              >
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="font-heading text-sm text-white/30 w-8 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <button
                    className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-full border transition-all duration-300 ${isActive && isPlaying ? 'bg-white text-black border-white scale-105' : 'border-white/20 text-white group-hover:border-white group-hover:scale-105 group-hover:bg-white group-hover:text-black'}`}
                    onClick={(e) => { e.stopPropagation(); playFull(t, idx); }}
                  >
                    {isActive && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </button>

                  <div>
                    <h3 className={`font-display text-2xl md:text-3xl font-light tracking-wide transition-colors ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {t.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {(Array.isArray(t.tags) ? t.tags : String(t.tags).split(',').map(s => s.trim())).map(tag => (
                        <span key={tag} className="font-heading text-[10px] tracking-widest uppercase text-[#888888]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`hidden lg:flex flex-1 justify-center items-center transition-all duration-500 ${hoveredIdx === idx || (isActive && hoveredIdx === null) ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center gap-[3px] h-6">
                    <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.2s ease-in-out infinite 0.0s' }} />
                    <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 0.9s ease-in-out infinite 0.1s' }} />
                    <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.3s ease-in-out infinite 0.2s' }} />
                    <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 0.8s ease-in-out infinite 0.3s' }} />
                    <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.1s ease-in-out infinite 0.4s' }} />
                    <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.4s ease-in-out infinite 0.5s' }} />
                  </div>
                </div>

                <div className="hidden lg:block max-w-sm text-right">
                  <p className="font-body text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                    {t.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimal Sticky Audio Player */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#020202]/90 backdrop-blur-2xl border-t border-white/10 transition-transform duration-700 ease-in-out z-50 ${activeTrack ? 'translate-y-0' : 'translate-y-full'}`}>

        {/* Progress bar line at top of player */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between gap-6">

          <div className="flex items-center gap-6 flex-1 min-w-0">
            {activeTrack && (
              <>
                <div className="w-12 h-12 shrink-0 border border-white/10 flex items-center justify-center rounded-full">
                  <Disc className={isPlaying ? 'animate-spin-slow text-white' : 'text-[#888888]'} size={20} />
                </div>
                <div className="min-w-0 truncate">
                  <h4 className="font-display text-lg tracking-wide text-white truncate">{activeTrack.title}</h4>
                  <span className="font-heading text-[10px] tracking-widest uppercase text-[#888888]">{composerInfo.name}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                if (isPlaying) stopAudio();
                else if (activeTrack) playFull(activeTrack, activeIdx);
              }}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 hover:bg-[#e0e0e0] transition-all"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            <Volume2 size={18} className="text-[#888888]" />
            <div className="w-32 h-[2px] bg-white/20 rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-white" />
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
}
