'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Activity, Youtube, Settings, LogOut, RefreshCw, Plus, Shield, ChevronRight, AlertCircle, CheckCircle2, X, Trash2, Edit2, Save, Image as ImgIcon, Disc, ToggleLeft } from 'lucide-react';

function apiUrl(p) { return `/api${p}`; }
function authH() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('ekopix_admin_token') : '';
  return { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [videos, setVideos] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [settings, setSettings] = useState({ hero: { backgroundType: 'youtube', youtubeId: 'l7fJ9ZVmwR4', imageUrl: '' }, latestDrop: { youtubeId: 'l7fJ9ZVmwR4', title: 'Tere Bina', subtitle: 'Official Music Video', description: '' } });
  const [statusChecks, setStatusChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [newVideo, setNewVideo] = useState({ youtubeId: '', title: '', subtitle: '' });
  const [editingVideo, setEditingVideo] = useState(null);
  const [newTrack, setNewTrack] = useState({ title: '', filename: '', start: 0, end: 30, desc: '', tags: '', spotify: '', itunes: '', youtube: '' });
  const [editingTrack, setEditingTrack] = useState(null);
  const [heroForm, setHeroForm] = useState(null);
  const [latestForm, setLatestForm] = useState(null);
  const [visibilityForm, setVisibilityForm] = useState(null);
  const [contentForm, setContentForm] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const logout = () => { localStorage.removeItem('ekopix_admin_token'); router.push('/admin/login'); };

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('ekopix_admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setLoading(true);
    try {
      const [vRes, tRes, sRes, stRes] = await Promise.all([
        fetch(apiUrl('/videos'), { headers: authH() }),
        fetch(apiUrl('/tracks'), { headers: authH() }),
        fetch(apiUrl('/settings'), { headers: authH() }),
        fetch(apiUrl('/status'), { headers: authH() }),
      ]);
      if (vRes.status === 401) { logout(); return; }
      const [vData, tData, sData, stData] = await Promise.all([vRes.json(), tRes.json(), sRes.json(), stRes.json()]);
      if (Array.isArray(vData)) setVideos(vData);
      if (Array.isArray(tData)) setTracks(tData);
      if (sData?.hero) { 
        setSettings(sData); 
        setHeroForm({
          ...sData.hero,
          startSeconds: sData.hero.startSeconds ?? 0,
          endSeconds: sData.hero.endSeconds ?? 60
        }); 
        setLatestForm(sData.latestDrop); 
        setVisibilityForm(sData.visibility || { hero: true, latestDrop: true, videos: true, composer: true, contact: true });
        setContentForm(sData.content || { heroPill: '', heroTagline: '', heroDesc: '', aboutLabel: '', aboutTitle: '', aboutDesc: '', contactTitle: '', contactSubtitle: '', contactEmail: '' });
      }
      if (Array.isArray(stData)) setStatusChecks(stData);
    } catch { showToast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem('ekopix_admin_token')) { router.push('/admin/login'); return; }
    fetchAll();
  }, [fetchAll]);

  // ── Video CRUD ──
  const addVideo = async (e) => {
    e.preventDefault();
    if (!newVideo.youtubeId || !newVideo.title) return showToast('YouTube ID and title required', 'error');
    try {
      const r = await fetch(apiUrl('/videos'), { method: 'POST', headers: authH(), body: JSON.stringify(newVideo) });
      if (r.ok) { setNewVideo({ youtubeId: '', title: '', subtitle: '' }); showToast('Video added!'); fetchAll(); }
      else showToast((await r.json()).message, 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const deleteVideo = async (id) => {
    if (!confirm('Delete this video?')) return;
    try {
      const r = await fetch(apiUrl(`/videos/${id}`), { method: 'DELETE', headers: authH() });
      if (r.ok) { showToast('Video deleted'); fetchAll(); }
    } catch { showToast('Error', 'error'); }
  };

  const saveEditVideo = async () => {
    if (!editingVideo) return;
    try {
      const r = await fetch(apiUrl(`/videos/${editingVideo.id}`), { method: 'PUT', headers: authH(), body: JSON.stringify(editingVideo) });
      if (r.ok) { setEditingVideo(null); showToast('Video updated!'); fetchAll(); }
    } catch { showToast('Error', 'error'); }
  };

  // ── Track CRUD ──
  const addTrack = async (e) => {
    e.preventDefault();
    if (!newTrack.title) return showToast('Title required', 'error');
    try {
      const r = await fetch(apiUrl('/tracks'), { 
        method: 'POST', 
        headers: authH(), 
        body: JSON.stringify({
          ...newTrack,
          start: Number(newTrack.start) || 0,
          end: Number(newTrack.end) || 30
        }) 
      });
      if (r.ok) { 
        setNewTrack({ title: '', filename: '', start: 0, end: 30, desc: '', tags: '', spotify: '', itunes: '', youtube: '' }); 
        showToast('Composer track added!'); 
        fetchAll(); 
      }
      else showToast((await r.json()).message, 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const deleteTrack = async (id) => {
    if (!confirm('Delete this track?')) return;
    try {
      const r = await fetch(apiUrl(`/tracks/${id}`), { method: 'DELETE', headers: authH() });
      if (r.ok) { showToast('Track deleted'); fetchAll(); }
    } catch { showToast('Error', 'error'); }
  };

  const saveEditTrack = async () => {
    if (!editingTrack) return;
    try {
      const r = await fetch(apiUrl(`/tracks/${editingTrack.id}`), { 
        method: 'PUT', 
        headers: authH(), 
        body: JSON.stringify({
          ...editingTrack,
          start: Number(editingTrack.start) || 0,
          end: Number(editingTrack.end) || 30
        }) 
      });
      if (r.ok) { setEditingTrack(null); showToast('Track updated!'); fetchAll(); }
    } catch { showToast('Error', 'error'); }
  };

  // ── Settings ──
  const saveAllContent = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetch(apiUrl('/settings/hero'), { method: 'PUT', headers: authH(), body: JSON.stringify(heroForm) }),
        fetch(apiUrl('/settings/latest-drop'), { method: 'PUT', headers: authH(), body: JSON.stringify(latestForm) }),
        fetch(apiUrl('/settings/visibility'), { method: 'PUT', headers: authH(), body: JSON.stringify(visibilityForm) }),
        fetch(apiUrl('/settings/content'), { method: 'PUT', headers: authH(), body: JSON.stringify(contentForm) }),
      ]);
      showToast('All Site Content & Layout updated successfully!');
    } catch { showToast('Network error saving content', 'error'); }
    finally { setLoading(false); }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Site Content & Layout', icon: Edit2 },
    { id: 'videos', label: 'Video Library', icon: Youtube },
    { id: 'tracks', label: 'Composer Songs', icon: Disc },
    { id: 'status', label: 'Status Checks', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#030305] flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/10 bg-[#06060d] flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="font-display font-black text-xl tracking-[0.15em] text-white">EKO<span className="text-[#888888]">PIX</span></div>
          <div className="flex items-center gap-1.5 mt-1"><Shield size={10} className="text-[#ffffff]" /><span className="font-heading text-[9px] tracking-[0.4em] uppercase text-[#9b9bb1]">Admin Console</span></div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${tab === id ? 'bg-[#ffffff]/20 border border-[#ffffff]/40 text-white' : 'text-[#9b9bb1] hover:text-white hover:bg-white/[0.03]'}`}>
              <Icon size={15} className={tab === id ? 'text-[#cccccc]' : ''} />
              <span className="font-heading text-xs tracking-[0.15em] uppercase">{label}</span>
              {tab === id && <ChevronRight size={12} className="ml-auto text-[#ffffff]" />}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-5 border-t border-white/10 pt-3 space-y-1">
          <button onClick={fetchAll} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#9b9bb1] hover:text-white hover:bg-white/[0.03] transition-all">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /><span className="font-heading text-xs tracking-[0.15em] uppercase">Refresh</span>
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#888888]/70 hover:text-[#888888] hover:bg-[#888888]/10 transition-all">
            <LogOut size={15} /><span className="font-heading text-xs tracking-[0.15em] uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-[#030305]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-lg text-white tracking-wider capitalize">
              {navItems.find(n => n.id === tab)?.label || 'Dashboard'}
            </h1>
            <p className="font-body text-xs text-[#9b9bb1] mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-[#9b9bb1] hover:text-white hover:border-[#ffffff]/40 font-heading text-xs tracking-[0.2em] uppercase transition-all">
            View Site ↗
          </a>
        </header>

        <div className="p-8 space-y-6">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Videos', value: videos.length, color: 'purple' },
                  { label: 'Composer Songs', value: tracks.length, color: 'purple' },
                  { label: 'Status Checks', value: statusChecks.length, color: 'red' },
                  { label: 'Unique Clients', value: new Set(statusChecks.map(c => c.client_name)).size, color: 'purple' },
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl border bg-[#0a0a0a] p-6 ${s.color === 'red' ? 'border-[#888888]/20' : 'border-[#ffffff]/20'}`}>
                    <div className="font-display font-black text-4xl text-white">{loading ? '—' : s.value}</div>
                    <div className="font-heading text-sm text-white/70 tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <Btn onClick={() => setTab('content')}><Edit2 size={14} />Manage Content & Layout</Btn>
                  <Btn onClick={() => setTab('videos')}><Plus size={14} />Add Video</Btn>
                  <Btn onClick={() => setTab('tracks')}><Plus size={14} />Add Composer Song</Btn>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-6 py-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-400" />
                <div><p className="font-heading text-sm text-white">Backend API — Online</p><p className="font-body text-xs text-[#9b9bb1]">Node.js on :5000 · Next.js on :3000</p></div>
              </div>
            </>
          )}

          {/* ── COMPOSER SONGS ── */}
          {tab === 'tracks' && (
            <>
              {/* Add Track Form */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-white mb-5">Add Composer Song</h2>
                <form onSubmit={addTrack} className="grid sm:grid-cols-2 gap-4">
                  <Input label="Song Title" value={newTrack.title} onChange={e => setNewTrack(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Neon Horizon" />
                  <Input label="Filename in public/songs (Optional)" value={newTrack.filename} onChange={e => setNewTrack(p => ({ ...p, filename: e.target.value }))} placeholder="e.g. 1.wav" />
                  <Input label="Loop Start (Seconds)" type="number" value={newTrack.start} onChange={e => setNewTrack(p => ({ ...p, start: e.target.value }))} placeholder="e.g. 15" />
                  <Input label="Loop End (Seconds)" type="number" value={newTrack.end} onChange={e => setNewTrack(p => ({ ...p, end: e.target.value }))} placeholder="e.g. 45" />
                  <Input label="Spotify Link" value={newTrack.spotify} onChange={e => setNewTrack(p => ({ ...p, spotify: e.target.value }))} placeholder="https://open.spotify.com/..." />
                  <Input label="Apple Music / iTunes Link" value={newTrack.itunes} onChange={e => setNewTrack(p => ({ ...p, itunes: e.target.value }))} placeholder="https://music.apple.com/..." />
                  <Input label="YouTube Link" value={newTrack.youtube} onChange={e => setNewTrack(p => ({ ...p, youtube: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
                  <div className="sm:col-span-2">
                    <Input label="Tags (comma-separated)" value={newTrack.tags} onChange={e => setNewTrack(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. Synthwave, Cyberpunk" />
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea label="Description / Specs" value={newTrack.desc} onChange={e => setNewTrack(p => ({ ...p, desc: e.target.value }))} placeholder="A short log describing the song..." />
                  </div>
                  <div className="sm:col-span-2">
                    <Btn type="submit"><Plus size={14} />Add Composer Song</Btn>
                  </div>
                </form>
              </div>

              {/* Tracks List */}
              <div className="space-y-6">
                {[
                  { title: 'Original Songs', data: tracks.filter(t => !t.tags?.includes('Cover')) },
                  { title: 'Cover Songs', data: tracks.filter(t => t.tags?.includes('Cover')) }
                ].map((section, sectionIdx) => (
                  <div key={section.title} className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10">
                      <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-white">{section.title} ({section.data.length} songs)</h2>
                    </div>
                    {section.data.length === 0 ? (
                      <div className="px-6 py-12 text-center font-body text-sm text-[#9b9bb1]">No {section.title.toLowerCase()} yet.</div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {section.data.map((t, idx) => (
                          <div key={t.id} className="px-6 py-5">
                            {editingTrack?.id === t.id ? (
                              <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <Input label="Song Title" value={editingTrack.title} onChange={e => setEditingTrack(p => ({ ...p, title: e.target.value }))} />
                                  <Input label="Filename (Optional)" value={editingTrack.filename} onChange={e => setEditingTrack(p => ({ ...p, filename: e.target.value }))} />
                                  <Input label="Loop Start" type="number" value={editingTrack.start} onChange={e => setEditingTrack(p => ({ ...p, start: e.target.value }))} />
                                  <Input label="Loop End" type="number" value={editingTrack.end} onChange={e => setEditingTrack(p => ({ ...p, end: e.target.value }))} />
                                  <Input label="Spotify Link" value={editingTrack.spotify} onChange={e => setEditingTrack(p => ({ ...p, spotify: e.target.value }))} />
                                  <Input label="Apple Music Link" value={editingTrack.itunes} onChange={e => setEditingTrack(p => ({ ...p, itunes: e.target.value }))} />
                                  <Input label="YouTube Link" value={editingTrack.youtube} onChange={e => setEditingTrack(p => ({ ...p, youtube: e.target.value }))} />
                                  <div className="sm:col-span-2">
                                    <Input label="Tags (comma-separated)" value={Array.isArray(editingTrack.tags) ? editingTrack.tags.join(', ') : editingTrack.tags} onChange={e => setEditingTrack(p => ({ ...p, tags: e.target.value }))} />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <Textarea label="Description" value={editingTrack.desc} onChange={e => setEditingTrack(p => ({ ...p, desc: e.target.value }))} />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Btn onClick={saveEditTrack}><Save size={13} />Save</Btn>
                                  <Btn onClick={() => setEditingTrack(null)} variant="outline"><X size={13} />Cancel</Btn>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-4 justify-between">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#cccccc] shrink-0 font-heading text-xs">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-display font-bold text-white text-base tracking-wide">{t.title}</h3>
                                    <div className="flex gap-1">
                                      {(Array.isArray(t.tags) ? t.tags : []).map(tg => (
                                        <span key={tg} className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/5 font-heading text-[8px] tracking-[0.1em] text-[#9b9bb1]">{tg}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="font-body text-xs text-[#9b9bb1] mt-1 leading-relaxed">{t.desc}</p>
                                  <div className="flex gap-4 mt-2 font-heading text-[9px] tracking-wider text-white/50 uppercase">
                                    <span>File: <span className="text-[#cccccc]">{t.filename || 'None'}</span></span>
                                    <span>Loop: <span className="text-[#888888]">{t.start}s - {t.end}s</span></span>
                                  </div>
                                  <div className="flex gap-3 mt-2 font-heading text-[9px] tracking-wider text-white/40 uppercase">
                                    {t.spotify && <span>✓ Spotify</span>}
                                    {t.itunes && <span>✓ Apple</span>}
                                    {t.youtube && <span>✓ YouTube</span>}
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0 self-center">
                                  <Btn onClick={() => setEditingTrack(t)} variant="outline"><Edit2 size={13} />Edit</Btn>
                                  <Btn onClick={() => deleteTrack(t.id)} variant="danger"><Trash2 size={13} />Delete</Btn>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── VIDEOS ── */}
          {tab === 'videos' && (
            <>
              {/* Add form */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-white mb-5">Add New Video</h2>
                <form onSubmit={addVideo} className="grid sm:grid-cols-3 gap-3">
                  <Input label="YouTube Video ID" value={newVideo.youtubeId} onChange={e => setNewVideo(p => ({ ...p, youtubeId: e.target.value }))} placeholder="e.g. dQw4w9WgXcQ" />
                  <Input label="Title" value={newVideo.title} onChange={e => setNewVideo(p => ({ ...p, title: e.target.value }))} placeholder="Song Title" />
                  <Input label="Subtitle" value={newVideo.subtitle} onChange={e => setNewVideo(p => ({ ...p, subtitle: e.target.value }))} placeholder="Official Music Video" />
                  <div className="sm:col-span-3">
                    <Btn type="submit"><Plus size={14} />Add to Library</Btn>
                  </div>
                </form>
                <p className="mt-3 font-body text-xs text-[#9b9bb1]">💡 Find the YouTube Video ID in the URL: youtube.com/watch?v=<span className="text-[#cccccc]">VIDEO_ID_HERE</span></p>
              </div>

              {/* Video list */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-white">Library ({videos.length} videos)</h2>
                </div>
                {videos.length === 0 ? (
                  <div className="px-6 py-12 text-center font-body text-sm text-[#9b9bb1]">No videos yet. Add one above.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {videos.map((v) => (
                      <div key={v.id} className="px-6 py-4">
                        {editingVideo?.id === v.id ? (
                          <div className="space-y-3">
                            <div className="grid sm:grid-cols-3 gap-3">
                              <Input label="YouTube ID" value={editingVideo.youtubeId} onChange={e => setEditingVideo(p => ({ ...p, youtubeId: e.target.value }))} />
                              <Input label="Title" value={editingVideo.title} onChange={e => setEditingVideo(p => ({ ...p, title: e.target.value }))} />
                              <Input label="Subtitle" value={editingVideo.subtitle} onChange={e => setEditingVideo(p => ({ ...p, subtitle: e.target.value }))} />
                            </div>
                            <div className="flex gap-2">
                              <Btn onClick={saveEditVideo}><Save size={13} />Save</Btn>
                              <Btn onClick={() => setEditingVideo(null)} variant="outline"><X size={13} />Cancel</Btn>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <img src={`https://img.youtube.com/vi/${v.youtubeId}/default.jpg`} alt={v.title} className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-heading text-xs tracking-[0.3em] uppercase text-[#888888]">{v.subtitle}</p>
                              <p className="font-display font-bold text-white tracking-wider truncate">{v.title}</p>
                              <p className="font-body text-xs text-[#9b9bb1] mt-0.5">ID: {v.youtubeId}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Btn onClick={() => setEditingVideo(v)} variant="outline"><Edit2 size={13} />Edit</Btn>
                              <Btn onClick={() => deleteVideo(v.id)} variant="danger"><Trash2 size={13} />Delete</Btn>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── UNIFIED SITE CONTENT & LAYOUT ── */}
          {tab === 'content' && heroForm && latestForm && visibilityForm && contentForm && (
            <div className="space-y-10">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-white/[0.05] to-transparent border border-white/10">
                <div>
                  <h2 className="font-heading text-lg tracking-[0.2em] uppercase text-white">Global CMS</h2>
                  <p className="font-body text-xs text-[#9b9bb1] mt-1">Manage visibility toggles, background media, and text content all in one place.</p>
                </div>
                <Btn onClick={saveAllContent} className="shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105"><Save size={14} />Save All Changes</Btn>
              </div>

              {/* Hero Section */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[#06060d] border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-heading text-xs tracking-[0.3em] text-[#cccccc] uppercase flex items-center gap-3">
                    <ImgIcon size={14} className="text-white/40" /> Hero Section
                  </h3>
                  <Toggle label="Visible on Site" checked={visibilityForm.hero} onChange={v => setVisibilityForm(p => ({ ...p, hero: v }))} />
                </div>
                <div className={`p-6 space-y-8 transition-all ${!visibilityForm.hero && 'opacity-30 pointer-events-none'}`}>
                  
                  {/* Background settings */}
                  <div className="space-y-4 border-b border-white/5 pb-8">
                    <h4 className="font-heading text-[9px] tracking-[0.2em] text-[#888888] uppercase">Background Media</h4>
                    <div className="flex gap-3">
                      {['youtube', 'image'].map(t => (
                        <button key={t} onClick={() => setHeroForm(p => ({ ...p, backgroundType: t }))}
                          className={`px-5 py-2.5 rounded-xl font-heading text-[10px] tracking-[0.2em] uppercase border transition-all ${heroForm.backgroundType === t ? 'bg-[#ffffff]/20 border-[#ffffff]/60 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-white/10 text-[#9b9bb1] hover:border-[#ffffff]/30'}`}>
                          {t === 'youtube' ? '▶ YouTube Video' : '🖼 Image URL'}
                        </button>
                      ))}
                    </div>
                    {heroForm.backgroundType === 'youtube' ? (
                      <div className="grid sm:grid-cols-3 gap-4">
                        <Input label="YouTube Video ID" value={heroForm.youtubeId} onChange={e => setHeroForm(p => ({ ...p, youtubeId: e.target.value }))} placeholder="e.g. l7fJ9ZVmwR4" />
                        <Input label="Loop Start (Sec)" type="number" value={heroForm.startSeconds ?? 0} onChange={e => setHeroForm(p => ({ ...p, startSeconds: parseInt(e.target.value) || 0 }))} />
                        <Input label="Loop End (Sec)" type="number" value={heroForm.endSeconds ?? 60} onChange={e => setHeroForm(p => ({ ...p, endSeconds: parseInt(e.target.value) || 0 }))} />
                      </div>
                    ) : (
                      <Input label="Image URL" value={heroForm.imageUrl} onChange={e => setHeroForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/image.jpg" />
                    )}
                  </div>

                  {/* Content Settings */}
                  <div className="space-y-4">
                    <h4 className="font-heading text-[9px] tracking-[0.2em] text-[#888888] uppercase">Typography & Text</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Top Pill Label" value={contentForm.heroPill} onChange={e => setContentForm(p => ({ ...p, heroPill: e.target.value }))} placeholder="India's First Anime Music Band" />
                      <Input label="Tagline" value={contentForm.heroTagline} onChange={e => setContentForm(p => ({ ...p, heroTagline: e.target.value }))} placeholder="India's Anime Music Experience" />
                      <div className="sm:col-span-2">
                        <Textarea label="Main Description" value={contentForm.heroDesc} onChange={e => setContentForm(p => ({ ...p, heroDesc: e.target.value }))} placeholder="Original Hindi & English songs..." />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Video Carousel Archive Section */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[#06060d] flex items-center justify-between">
                  <h3 className="font-heading text-xs tracking-[0.3em] text-[#cccccc] uppercase flex items-center gap-3">
                    <Youtube size={14} className="text-white/40" /> Video Carousel Archive
                  </h3>
                  <Toggle label="Visible on Site" checked={visibilityForm.videos} onChange={v => setVisibilityForm(p => ({ ...p, videos: v }))} />
                </div>
              </div>

              {/* Composer Section */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[#06060d] border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-heading text-xs tracking-[0.3em] text-[#cccccc] uppercase flex items-center gap-3">
                    <Disc size={14} className="text-white/40" /> Composer Section
                  </h3>
                  <Toggle label="Visible on Site" checked={visibilityForm.composer} onChange={v => setVisibilityForm(p => ({ ...p, composer: v }))} />
                </div>
                <div className={`p-6 transition-all ${!visibilityForm.composer && 'opacity-30 pointer-events-none'}`}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Section Label" value={contentForm.aboutLabel} onChange={e => setContentForm(p => ({ ...p, aboutLabel: e.target.value }))} placeholder="The Universe" />
                    <Input label="Main Title" value={contentForm.aboutTitle} onChange={e => setContentForm(p => ({ ...p, aboutTitle: e.target.value }))} placeholder="Every song is a character." />
                    <div className="sm:col-span-2">
                      <Textarea label="Description / Bio" value={contentForm.aboutDesc} onChange={e => setContentForm(p => ({ ...p, aboutDesc: e.target.value }))} placeholder="EKOPIX is India's first anime music band..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Drop Section */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[#06060d] border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-heading text-xs tracking-[0.3em] text-[#cccccc] uppercase flex items-center gap-3">
                    <Activity size={14} className="text-white/40" /> Latest Drop Section
                  </h3>
                  <Toggle label="Visible on Site" checked={visibilityForm.latestDrop} onChange={v => setVisibilityForm(p => ({ ...p, latestDrop: v }))} />
                </div>
                <div className={`p-6 transition-all ${!visibilityForm.latestDrop && 'opacity-30 pointer-events-none'}`}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="YouTube Video ID" value={latestForm.youtubeId} onChange={e => setLatestForm(p => ({ ...p, youtubeId: e.target.value }))} placeholder="e.g. l7fJ9ZVmwR4" />
                    <Input label="Subtitle / Label" value={latestForm.subtitle} onChange={e => setLatestForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="Official Music Video" />
                    <div className="sm:col-span-2">
                      <Input label="Main Title" value={latestForm.title} onChange={e => setLatestForm(p => ({ ...p, title: e.target.value }))} placeholder="Song Title" />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea label="Description" value={latestForm.description} onChange={e => setLatestForm(p => ({ ...p, description: e.target.value }))} placeholder="Description shown under the title…" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[#06060d] border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-heading text-xs tracking-[0.3em] text-[#cccccc] uppercase flex items-center gap-3">
                    <Edit2 size={14} className="text-white/40" /> Contact & Footer Section
                  </h3>
                  <Toggle label="Visible on Site" checked={visibilityForm.contact} onChange={v => setVisibilityForm(p => ({ ...p, contact: v }))} />
                </div>
                <div className={`p-6 transition-all ${!visibilityForm.contact && 'opacity-30 pointer-events-none'}`}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Main Title" value={contentForm.contactTitle} onChange={e => setContentForm(p => ({ ...p, contactTitle: e.target.value }))} placeholder="For the journey." />
                    <Input label="Subtitle" value={contentForm.contactSubtitle} onChange={e => setContentForm(p => ({ ...p, contactSubtitle: e.target.value }))} placeholder="Join the universe." />
                    <Input label="Contact Email" value={contentForm.contactEmail} onChange={e => setContentForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="ekopixuniverse@gmail.com" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── STATUS CHECKS ── */}
          {tab === 'status' && (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-white">Status Checks ({statusChecks.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-white/10">
                    {['ID', 'Client', 'Timestamp'].map(h => <th key={h} className="px-6 py-3 text-left font-heading text-[10px] tracking-[0.3em] uppercase text-[#9b9bb1]">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {statusChecks.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-10 text-center font-body text-sm text-[#9b9bb1]">No records.</td></tr>
                    ) : statusChecks.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-body text-xs text-[#9b9bb1]">{String(c.id).slice(0, 8)}…</td>
                        <td className="px-6 py-3 font-body text-sm text-white">{c.client_name}</td>
                        <td className="px-6 py-3 font-body text-xs text-[#9b9bb1]">{new Date(c.timestamp).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Toast */}
      {toast && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-md shadow-2xl ${toast.type === 'error' ? 'border-[#888888]/40 bg-[#888888]/10 text-[#888888]' : 'border-[#ffffff]/40 bg-[#ffffff]/10 text-[#cccccc]'}`}>
          {toast.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span className="font-body text-sm">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-1 opacity-60 hover:opacity-100"><X size={13} /></button>
        </div>
      )}
    </div>
  );
}

// ─── Module-level helper components ───────────────────────────
// IMPORTANT: These MUST be outside AdminDashboard so React doesn't
// remount them on every parent re-render (which would kill focus/typing).

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block font-heading text-[10px] tracking-[0.3em] uppercase text-[#9b9bb1]">{label}</label>}
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0d0d18] text-white placeholder-[#9b9bb1]/40 font-body text-sm focus:outline-none focus:border-[#ffffff]/60 transition-all"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block font-heading text-[10px] tracking-[0.3em] uppercase text-[#9b9bb1]">{label}</label>}
      <textarea
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0d0d18] text-white placeholder-[#9b9bb1]/40 font-body text-sm focus:outline-none focus:border-[#ffffff]/60 transition-all resize-none"
      />
    </div>
  );
}

function Btn({ onClick, children, variant = 'primary', type = 'button', disabled }) {
  const cls =
    variant === 'primary'
      ? 'bg-white text-black hover:bg-[#e0e0e0] font-bold'
      : variant === 'danger'
      ? 'border border-[#888888]/40 text-[#888888] hover:bg-[#888888]/10'
      : 'border border-white/10 text-[#9b9bb1] hover:text-white hover:border-[#ffffff]/40';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      {label && <span className="font-heading text-[10px] tracking-[0.2em] uppercase text-[#888888] group-hover:text-white transition-colors">{label}</span>}
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-white' : 'bg-[#1a1a24]'}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${checked ? 'translate-x-5 bg-black' : 'translate-x-0 bg-[#888888]'}`} />
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
    </label>
  );
}
