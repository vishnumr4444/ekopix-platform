'use client';
import { useState, useEffect, useRef } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Volume2, Play, Pause, Disc } from 'lucide-react';

const SpotifyIcon = ({ className, size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.136-.668.47-.744 3.856-.88 7.15-.506 9.822 1.13.295.178.387.563.205.859zm1.224-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.183-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.66-1.11 8.225-.563 11.346 1.353.367.226.488.707.26 1.074zm.106-2.833c-3.26-1.937-8.644-2.12-11.76-1.173-.5.152-1.025-.133-1.177-.633-.15-.5.133-1.025.633-1.177 3.616-1.097 9.56-.887 13.313 1.34.45.267.6.845.333 1.295-.267.45-.845.6-1.295.333z"/>
  </svg>
);

const ITunesIcon = ({ className, size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <circle cx="256" cy="256" r="240" />
    <path
      fill="#fff"
      d="M352 128v180.8c0 28.3-23 51.2-51.2 51.2s-51.2-22.9-51.2-51.2 22.9-51.2 51.2-51.2c10.6 0 20.4 3.2 28.8 8.7V184l-89.6 19.2v131.6c0 28.3-23 51.2-51.2 51.2s-51.2-22.9-51.2-51.2 22.9-51.2 51.2-51.2c10.6 0 20.4 3.2 28.8 8.7V167.8c0-13.7 9.7-25.6 23.1-28.5L352 128z"
    />
  </svg>
);

const YoutubeIcon = ({ className, size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const composerInfo = {
  name: "EKOPIX",
  role: "Lead Composer & Arranger",
  bio: "The acoustic architect behind EKOPIX. Exploring emotions through symphonic orchestrations, heavy modern synthesizer layers, and driving rock melodies. Dive into the sonic universe below."
};

const ORIGINAL_SONGS = [
  { id: 'o1', title: "Say My Name", filename: "Orginal/1_Say My Name.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/0b42VTJ8rYijNqDht0oJEB?si=bec3e0ce2f944e65", itunes: "https://music.apple.com/in/song/say-my-name-feat-sreelakshmi/6766093066", youtube: "https://www.youtube.com/watch?v=srKEjrgrXrw" },
  { id: 'o2', title: "I Am The Ocean", filename: "Orginal/2_I Am the Ocean.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/6fIedpIm7KVgFtOTnAjcXP?si=14d66385d6254714", itunes: "https://music.apple.com/in/song/i-am-the-ocean/6766093070", youtube: "https://www.youtube.com/watch?v=joxhlRPMXlU" },
  { id: 'o3', title: "How This Ends", filename: "Orginal/3_How This Ends.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/2RNN6uO4o28qoc2GoFQxEz?si=286b5ed7092a4d60", itunes: "https://music.apple.com/in/song/how-this-ends/6766093071", youtube: "https://www.youtube.com/watch?v=0v_6McF3a9E&list=PLWFjC6DjDNJjNKLLXScxMngy8ZC0q2T9c&index=4" },
  { id: 'o4', title: "I Am Not Afraid", filename: "Orginal/4_I Am Not Afraid.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/2tSpQvZuZ1Z0kmXq9HPnDh?si=a14c4966ef4942f9", itunes: "https://music.apple.com/in/song/i-am-not-afraid/6766093069", youtube: "https://www.youtube.com/watch?v=HxGAwUUY7m8" },
  { id: 'o5', title: "Paralyzed", filename: "Orginal/5_Paralyzed.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/5ZgDKShwtVO9JfWv88z3dE?si=ecc5382d5180481e", itunes: "https://music.apple.com/in/song/paralyzed/1872977110", youtube: "https://youtu.be/1SGwxKpdk3U?si=NuKLttMmm1Rzb6KZ" },
  { id: 'o6', title: "Paralyzed (Unplugged)", filename: "Orginal/6_Paralyzed (Unplugged).wav", start: 0, end: 15, desc: "Acoustic arrangement.", tags: ["Acoustic"], spotify: "https://open.spotify.com/track/6qwGLay2G8SACwzfLdPWoi?si=ff06f114c3c24e2d", itunes: "https://music.apple.com/in/song/paralyzed-feat-kickvicky-unplugged-version/1882039234", youtube: "https://youtu.be/FC3NyZkHkRc?si=NGvrgX6clnf94JvX" },
  { id: 'o7', title: "One Day", filename: "Orginal/7_One Day.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/4iTmGcovXnIAMOEuCAV08t?si=7c7c54ea5c9242a3", itunes: "https://music.apple.com/in/song/one-day/1840647342", youtube: "https://youtu.be/Wk4hEVnOISk?si=HJHMFXiGNdp8hopw" },
  { id: 'o8', title: "Tera Bina", filename: "Orginal/8_Tera Bina.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Hindi"], spotify: "https://open.spotify.com/track/4vUpxx1dmCJnPEQl8Re0Hy?si=28abaa2850364f95", itunes: "https://music.apple.com/in/album/tera-bina-jeena-kya-hai-single/1872858774", youtube: "https://youtu.be/-CBOrb98-54?si=xRdbcu1kGt6UAYEx" },
  { id: 'o9', title: "Love", filename: "Orginal/9_Love.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/placeholder-o9", itunes: "https://music.apple.com/us/album/placeholder-o9", youtube: "https://youtu.be/HI5m4Mce4Bw?si=ge6KmIngXpELZLad" },
  { id: 'o10', title: "Thank You God For a Merry Christmas", filename: "Orginal/10_Thank You God for a Merry Christmas.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Christmas"], spotify: "https://open.spotify.com/track/2l9oLjGwzg2zlm87WSeqHa?si=3784c7365cef4684", itunes: "https://music.apple.com/in/song/thank-you-god-for-a-merry-christmas/1865371376", youtube: "https://youtu.be/Mh1QY_MjVk4?si=XnLe_gEEtEbfkASD" },
  { id: 'o11', title: "Still Tied To you", filename: "Orginal/11_Still Tied To You.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/5nUBHSkOTMzmIOusZ3peQz?si=dddb8810a308442b", itunes: "https://music.apple.com/in/song/still-tied-to-you/1882298083", youtube: "https://youtu.be/_ed3xQ5OVmA?si=DyEsniZLkpLvHoRR" },
  { id: 'o12', title: "All Yours Now", filename: "Orginal/12_All Yours Now.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/placeholder-o12", itunes: "https://music.apple.com/us/album/placeholder-o12", youtube: "https://www.youtube.com/watch?v=A1kxobj6O7w" },
  { id: 'o13', title: "From The Very Begining", filename: "Orginal/13_Beginning.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/2F8woIT5IVNzXzErDYI0TI?si=b3348ae6a8ef4146", itunes: "https://music.apple.com/in/song/from-the-very-beginning/1890238383", youtube: "https://youtube.com/watch?v=placeholder-o13" },
  { id: 'o14', title: "Am I Stronger", filename: "Orginal/14_Stronger.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/3Q8hCnGyfJPM8MLN69MVV9?si=2ecddd413318479b", itunes: "https://music.apple.com/in/song/am-i-stronger/1890328814", youtube: "https://youtube.com/watch?v=placeholder-o14" },
];
const COVER_SONGS = [
  { id: 'c1', title: "We Wish You Merry Christmas", filename: "Cover/1_we wish u.mp3", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/7EdtPzVNW5FyprO1Ji3aSv?si=a1746c80df374627", itunes: "https://music.apple.com/in/song/we-wish-you-a-merry-christmas/1865371378", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH" },
  { id: 'c2', title: "God Rest Ye Merry", filename: "Cover/2_God Rest Ye Merry.mp3", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/4FIYOv63FiiWk3df0Vcams?si=26a1b71ec3754de8", itunes: "https://music.apple.com/in/song/god-rest-ye-merry/1865371379", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH" },
  { id: 'c3', title: "Carol Of The Bells", filename: "Cover/3_carol of the bells cimeroli Pentatonix.mp3", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/4psVZb7wkNkhgVZjo7UqCc?si=cb6c6129bd774d5d", itunes: "https://music.apple.com/in/song/carol-of-the-bells/1865371381", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH" },
  { id: 'c4', title: "Silent Night", filename: "Cover/4_Silent night.mp3", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/6LnP5irqR7Cz1yFaEYTEWT?si=022255d26c8e4146", itunes: "https://music.apple.com/in/song/silent-night-holy-night/1865371383", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH" },
];

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export default function ComposerPage() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [hoveredTrackId, setHoveredTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const [originalSongs, setOriginalSongs] = useState([]);
  const [coverSongs, setCoverSongs] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const hoverIntervalRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const [ytReady, setYtReady] = useState(false);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
      ytPlayerRef.current.pauseVideo();
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
    if (!isPlaying && ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
      ytPlayerRef.current.pauseVideo();
    }
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
  };

  const playPreview = (track) => {
    if (isPlaying) return;

    stopPreview();

    const hasValidFile = track.filename && typeof track.filename === 'string' && track.filename.trim() !== '' && track.filename !== 'undefined' && track.filename !== 'null' && !track.filename.includes('youtube.com') && !track.filename.includes('youtu.be');

    const doYoutubeFallback = () => {
      const ytId = getYoutubeId(track.youtube);
      if (ytId && ytReady && ytPlayerRef.current) {
        ytPlayerRef.current.loadVideoById({
           videoId: ytId,
           startSeconds: track.start || 0
        });
        ytPlayerRef.current.setVolume(40);
        
        hoverIntervalRef.current = setInterval(() => {
          if (ytPlayerRef.current?.getCurrentTime) {
            const curr = ytPlayerRef.current.getCurrentTime();
            if (curr >= (track.end || (track.start || 0) + 15)) {
              stopPreview();
            }
          }
        }, 100);
      } else {
        const previewDuration = (track.end && track.start) ? (track.end - track.start) * 1000 : 15000;
        const startTime = Date.now();
        hoverIntervalRef.current = setInterval(() => {
          if (Date.now() - startTime >= previewDuration) {
            stopPreview();
          }
        }, 100);
      }
    };

    if (!hasValidFile) {
      doYoutubeFallback();
      return;
    }

    const audioPath = `/songs/${track.filename}`;
    const audio = new Audio(audioPath);
    hoverAudioRef.current = audio;
    audio.volume = 0.4;
    audio.currentTime = track.start || 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        hoverIntervalRef.current = setInterval(() => {
          if (!hoverAudioRef.current) return;
          if (hoverAudioRef.current.currentTime >= (track.end || track.start + 15)) {
            stopPreview();
          }
        }, 100);
      }).catch((err) => {
        if (err.name === 'AbortError') return;
        console.warn("Failed to play preview file:", err);
        stopPreview();
        doYoutubeFallback();
      });
    }
  };

  const playFull = (track) => {
    if (activeTrack?.id === track.id && isPlaying) {
      stopAudio();
      return;
    }

    stopAudio();
    stopPreview();

    const hasValidFile = track.filename && typeof track.filename === 'string' && track.filename.trim() !== '' && track.filename !== 'undefined' && track.filename !== 'null' && !track.filename.includes('youtube.com') && !track.filename.includes('youtu.be');

    const doYoutubeFallback = () => {
      const ytId = getYoutubeId(track.youtube);
      if (ytId && ytReady && ytPlayerRef.current) {
        setActiveTrack(track);
        setIsPlaying(true);
        setCurrentTime(0);

        ytPlayerRef.current.loadVideoById({
           videoId: ytId,
           startSeconds: 0
        });
        ytPlayerRef.current.setVolume(volume * 100);

        intervalRef.current = setInterval(() => {
          if (ytPlayerRef.current?.getCurrentTime) {
            const curr = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();
            setCurrentTime(curr);
            if (dur > 0) setDuration(dur);
            if (dur > 0 && curr >= dur - 0.5) {
              stopAudio();
            }
          }
        }, 100);
      } else {
        setActiveTrack(track);
        setIsPlaying(true);
        setCurrentTime(0);
        const mockDuration = track.end || 30;
        setDuration(mockDuration);

        let lastTick = Date.now();
        intervalRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            const now = Date.now();
            const dt = (now - lastTick) / 1000;
            lastTick = now;
            const next = prev + dt;
            if (next >= mockDuration) {
              setTimeout(stopAudio, 0);
              return mockDuration;
            }
            return next;
          });
        }, 100);
      }
    };

    if (!hasValidFile) {
      doYoutubeFallback();
      return;
    }

    const audioPath = `/songs/${track.filename}`;
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    audio.volume = volume;
    audio.currentTime = 0;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setActiveTrack(track);
        setIsPlaying(true);
        setCurrentTime(0);

        intervalRef.current = setInterval(() => {
          if (!audioRef.current) return;
          setCurrentTime(audioRef.current.currentTime);
          if (audioRef.current.ended) {
            stopAudio();
          }
        }, 100);
      }).catch((err) => {
        if (err.name === 'AbortError') {
          setIsPlaying(false);
          return;
        }
        console.warn("Failed to play full file:", err);
        stopAudio();
        doYoutubeFallback();
      });
    }
  };

  useEffect(() => {
    fetch('/api/tracks')
      .then(r => r.json())
      .then(data => {
        const originals = data.filter(t => !t.tags.includes('Cover'));
        const covers = data.filter(t => t.tags.includes('Cover'));
        setOriginalSongs(originals.length > 0 ? originals : ORIGINAL_SONGS);
        setCoverSongs(covers.length > 0 ? covers : COVER_SONGS);
        setLoadingTracks(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tracks:", err);
        setOriginalSongs(ORIGINAL_SONGS);
        setCoverSongs(COVER_SONGS);
        setLoadingTracks(false);
      });

    const initYT = () => {
      if (!window.YT?.Player) return;
      const el = document.getElementById('composer-yt-player');
      if (!el) return;
      ytPlayerRef.current = new window.YT.Player('composer-yt-player', {
        host: 'https://www.youtube-nocookie.com',
        playerVars: { 
          autoplay: 0, 
          controls: 0, 
          showinfo: 0, 
          rel: 0, 
          modestbranding: 1, 
          playsinline: 1, 
          fs: 0,
          origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          widget_referrer: typeof window !== 'undefined' ? window.location.href : ''
        },
        events: {
          onReady: () => setYtReady(true),
        }
      });
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    let ytInterval;
    if (window.YT?.Player) { initYT(); }
    else {
      ytInterval = setInterval(() => { if (window.YT?.Player) { clearInterval(ytInterval); initYT(); } }, 100);
    }

    return () => {
      stopAudio();
      stopPreview();
      if (ytInterval) clearInterval(ytInterval);
      try { ytPlayerRef.current?.destroy(); } catch {}
    };
  }, []);

  const renderTrackList = (trackList, sectionTitle, sectionTag) => (
    <div className="mb-24 relative z-10 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-6 gap-4">
        <div>
          <p className="font-heading uppercase tracking-[0.4em] text-[10px] text-[#888888] mb-3 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#888888]" />
            {sectionTag}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide text-white">
            {sectionTitle}
          </h2>
        </div>
        <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-[#888888]">
          {trackList.length} Tracks
        </span>
      </div>

      <div className="flex flex-col">
        {trackList.map((t, idx) => {
          const isActive = activeTrack?.id === t.id;
          return (
            <div
              key={t.id}
              className={`group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/[0.05] transition-all cursor-pointer ${isActive ? 'bg-white/[0.04] px-6 -mx-6 rounded-2xl border-transparent backdrop-blur-sm' : 'hover:bg-white/[0.02] hover:px-4 hover:-mx-4 hover:rounded-xl hover:border-transparent'}`}
              onClick={() => playFull(t)}
              onMouseEnter={() => { setHoveredTrackId(t.id); playPreview(t); }}
              onMouseLeave={() => { setHoveredTrackId(null); stopPreview(); }}
            >
              <div className="flex items-center gap-5 md:gap-8 min-w-0">
                <span className="font-heading text-xs md:text-sm text-white/20 w-6 tabular-nums font-light">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <button
                  className={`w-12 h-12 md:w-14 md:h-14 shrink-0 flex items-center justify-center rounded-full border transition-all duration-300 ${isActive && isPlaying ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'border-white/15 text-white group-hover:border-white group-hover:scale-105 group-hover:bg-white group-hover:text-black'}`}
                  onClick={(e) => { e.stopPropagation(); playFull(t); }}
                  aria-label={isActive && isPlaying ? "Pause" : "Play"}
                >
                  {isActive && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                </button>

                <div className="min-w-0 pr-4">
                  <h3 className={`font-display text-xl md:text-2xl font-light tracking-wide transition-colors truncate ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {t.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {t.tags.map(tag => (
                      <span key={tag} className="font-heading text-[9px] tracking-widest uppercase text-white/30 group-hover:text-white/50 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`hidden lg:flex flex-1 justify-center items-center transition-all duration-500 ${hoveredTrackId === t.id || (isActive && hoveredTrackId === null) ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-[3px] h-6">
                  <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.2s ease-in-out infinite 0.0s' }} />
                  <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 0.9s ease-in-out infinite 0.1s' }} />
                  <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.3s ease-in-out infinite 0.2s' }} />
                  <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 0.8s ease-in-out infinite 0.3s' }} />
                  <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.1s ease-in-out infinite 0.4s' }} />
                  <div className="w-[2px] bg-white/60 rounded-full" style={{ animation: 'wave 1.4s ease-in-out infinite 0.5s' }} />
                </div>
              </div>

              {/* Streaming Platforms Icons */}
              <div 
                className="flex items-center gap-4 mt-4 md:mt-0 pl-[112px] md:pl-0 z-20 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {t.spotify && (
                  <a
                    href={t.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-[#1DB954] transition-all duration-300 hover:scale-110"
                    title="Listen on Spotify"
                  >
                    <SpotifyIcon size={20} />
                  </a>
                )}
                {t.itunes && (
                  <a
                    href={t.itunes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-[#FC3C44] transition-all duration-300 hover:scale-110"
                    title="Listen on iTunes"
                  >
                    <ITunesIcon size={20} />
                  </a>
                )}
                {t.youtube && (
                  <a
                    href={t.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-[#FF0000] transition-all duration-300 hover:scale-110"
                    title="Watch on YouTube"
                  >
                    <YoutubeIcon size={20} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#020202] text-white font-body relative pb-32 selection:bg-white/20">
      <style>{`
        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: 24px; }
        }
      `}</style>

      {/* Hidden YouTube Player for Audio Streaming */}
      <div className="fixed top-[-9999px] left-[-9999px] w-[300px] h-[300px] pointer-events-none z-[-1]">
        <div id="composer-yt-player" />
      </div>
      
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
        <div className="relative pt-40 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-white/10 mb-16">
          <div className="relative z-10 text-center flex flex-col items-center">
            <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#888888] mb-6 flex items-center justify-center gap-4">
              <span className="w-8 h-[1px] bg-[#888888]" />
              {composerInfo.role}
              <span className="w-8 h-[1px] bg-[#888888]" />
            </p>

            <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl tracking-tight text-white leading-tight">
              {composerInfo.name}
            </h1>

            <p className="mt-8 max-w-2xl text-lg md:text-xl font-light text-[#cccccc] leading-relaxed">
              {composerInfo.bio}
            </p>
          </div>
        </div>

        {/* Track Lists Sections (2 Columns) */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20 grid lg:grid-cols-2 gap-16 lg:gap-24">
          {loadingTracks ? (
            <div className="col-span-2 py-24 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {renderTrackList(originalSongs, "Original Songs", "EKOPIX Originals")}
              {renderTrackList(coverSongs, "Cover Songs", "Reimagined Classics")}
            </>
          )}
        </div>

        {/* Minimal Sticky Audio Player */}
        <div className={`fixed bottom-0 left-0 right-0 bg-[#020202]/90 backdrop-blur-2xl border-t border-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-[999] ${activeTrack ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-white/10 group cursor-pointer -mt-[2px]">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                setCurrentTime(time);
                if (audioRef.current) {
                  audioRef.current.currentTime = time;
                } else if (ytPlayerRef.current && ytReady) {
                  ytPlayerRef.current.seekTo(time, true);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="h-full bg-white transition-all duration-100 ease-linear relative"
              style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_white]" />
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
              {activeTrack && (
                <>
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 border border-white/10 flex items-center justify-center rounded-full">
                    <Disc className={isPlaying ? 'animate-spin-slow text-white' : 'text-[#888888]'} size={20} />
                  </div>
                  <div className="min-w-0 truncate">
                    <h4 className="font-display font-light text-base md:text-lg tracking-wide text-white truncate">{activeTrack.title}</h4>
                    <span className="font-heading text-[9px] tracking-widest uppercase text-[#888888]">{composerInfo.name}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-center shrink-0">
              <button
                onClick={() => {
                  if (isPlaying) stopAudio();
                  else if (activeTrack) playFull(activeTrack);
                }}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 hover:bg-[#e0e0e0] transition-all"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4 flex-1 justify-end group">
              <Volume2 size={16} className="text-[#888888]" />
              <div className="w-24 h-[4px] bg-white/20 rounded-full relative cursor-pointer flex items-center">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setVolume(vol);
                    if (audioRef.current) {
                      audioRef.current.volume = vol;
                    } else if (ytPlayerRef.current && ytReady) {
                      ytPlayerRef.current.setVolume(vol * 100);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full bg-white rounded-full relative pointer-events-none" style={{ width: `${volume * 100}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_white]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
