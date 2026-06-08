require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ekopix_secret';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ekopix2025';

// ─── Middleware ────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
  credentials: true,
}));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// ─── In-Memory DB (fallback when no MongoDB) ──────────────────
const memDb = {
  statusChecks: [],

  // Dynamic video catalog
  videos: [
    { id: uuidv4(), youtubeId: 'l7fJ9ZVmwR4', title: 'Tere Bina', subtitle: 'Official Music Video', order: 0 },
    { id: uuidv4(), youtubeId: 'HI5m4Mce4Bw', title: 'LOVE', subtitle: 'Official Music Video', order: 1 },
    { id: uuidv4(), youtubeId: '_ed3xQ5OVmA', title: 'Still Tied To You', subtitle: 'Official Lyric Video', order: 2 },
    { id: uuidv4(), youtubeId: '1SGwxKpdk3U', title: 'PARALYZED', subtitle: 'Character Introduction Video', order: 3 },
    { id: uuidv4(), youtubeId: '-CBOrb98-54', title: 'Tere Bina', subtitle: 'Official Lyric Video', order: 4 },
    { id: uuidv4(), youtubeId: 'Wk4hEVnOISk', title: 'ONE DAY', subtitle: 'The Birth of an Indian Anime Music Band', order: 5 },
  ],

  // Composer track catalog
  tracks: [
    { id: '1', title: "Shattered Wings", filename: "1.wav", start: 30, end: 48, desc: "A sweeping symphonic metal theme with dramatic violin crescendos and dual-guitar drives.", tags: ["Orchestral", "Symphonic Metal"], order: 0 },
    { id: '2', title: "Neon Horizon", filename: "2.wav", start: 45, end: 60, desc: "High-octane synthwave theme driving the cyberpunk racing universe log.", tags: ["Synthwave", "Cyberpunk"], order: 1 },
    { id: '3', title: "Ripples of Water", filename: "3.mp3", start: 15, end: 32, desc: "Water Goddess character theme, ambient piano structures meeting harp resonance.", tags: ["Ambient", "Piano Instrumental"], order: 2 },
    { id: '4', title: "Fallen Sky", filename: "4.mp3", start: 55, end: 72, desc: "Heavy modern guitar riffs colliding with deep visualizer synthesizer drops.", tags: ["Cyber-Rock", "Industrial"], order: 3 },
    { id: '5', title: "Lost Resonance", filename: "5.wav", start: 20, end: 38, desc: "Ethereal vocal chop melodies floating over dynamic electro-ambient arrangements.", tags: ["Future Bass", "Melodic"], order: 4 },
    { id: '6', title: "Stardust Pulse", filename: "6.wav", start: 40, end: 58, desc: "Uplifting space-themed EDM log with sparkling lead drop synths.", tags: ["EDM", "Uplifting Space"], order: 5 },
    { id: '7', title: "Crimson Eclipse", filename: "7.wav", start: 35, end: 53, desc: "Aggressive industrial electro theme representing timeline fractures.", tags: ["Industrial Electro", "Dark"], order: 6 },
    { id: '8', title: "Memory Fragment", filename: "8.wav", start: 10, end: 28, desc: "Nostalgic acoustic arrangements paired with sweeping symphonic string ensembles.", tags: ["Acoustic", "Chamber Strings"], order: 7 },
    { id: '9', title: "Glitch Dream", filename: "9.mp3", start: 25, end: 42, desc: "Experimental modular synth structures with complex digital glitch beats.", tags: ["Glitch Hop", "Experimental"], order: 8 },
    { id: '10', title: "Final Convergence", filename: "10.mp3", start: 60, end: 80, desc: "The grand orchestration log combining full electronic band and full orchestra.", tags: ["Symphonic Rock", "Grand Finale"], order: 9 },
    { id: '11', title: "Echoes of Eternity", filename: "11.mp3", start: 20, end: 40, desc: "An orchestrally led cinematic ballad detailing timeline roots.", tags: ["Orchestral", "Epic Ballad"], order: 10 },
    { id: '12', title: "Cybernetic Soul", filename: "12.mp3", start: 5, end: 25, desc: "A pulsing techno/synth soundtrack symbolizing computer systems.", tags: ["Techno", "Cyberpunk"], order: 11 },
  ],

  // Site settings
  settings: {
    hero: {
      backgroundType: 'youtube', // 'youtube' | 'image'
      youtubeId: 'l7fJ9ZVmwR4',
      imageUrl: '',
      startSeconds: 0,
      endSeconds: 60,
    },
    latestDrop: {
      youtubeId: 'l7fJ9ZVmwR4',
      title: 'Tere Bina',
      subtitle: 'Official Music Video',
      description: 'A cinematic ballad rendered in anime ink and neon dust. Step inside the world that started it all.',
    },
    visibility: {
      hero: true,
      latestDrop: true,
      videos: true,
      composer: true,
      contact: true
    },
    content: {
      heroPill: "India's First Anime Music Band",
      heroTagline: "India's Anime Music Experience",
      heroDesc: "Original Hindi & English songs woven into cinematic worlds. Every video is a universe. Every song is a character.",
      aboutLabel: "The Universe",
      aboutTitle: "Every song\\nis a character.",
      aboutDesc: "EKOPIX is India's first anime music band — blending original Hindi and English songs with anime-style animation and storytelling. Every video is a world. Every song is a character.",
      contactTitle: "For the journey.",
      contactSubtitle: "Join the universe.",
      contactEmail: "ekopixuniverse@gmail.com"
    }
  },
};

// ─── MongoDB (optional) ───────────────────────────────────────
let mongoose, VideoModel, SettingsModel, StatusModel, TrackModel;
let useInMemory = true;

async function connectDB() {
  if (!process.env.MONGO_URL) {
    console.warn('⚠️  MONGO_URL not set — using in-memory store.');
    return;
  }
  try {
    mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connected');
    useInMemory = false;

    const videoSchema = new mongoose.Schema({
      id: { type: String, default: uuidv4 },
      youtubeId: String,
      title: String,
      subtitle: String,
      order: { type: Number, default: 0 },
    });
    VideoModel = mongoose.model('Video', videoSchema);

    const trackSchema = new mongoose.Schema({
      id: { type: String, default: uuidv4 },
      title: String,
      filename: String,
      start: { type: Number, default: 0 },
      end: { type: Number, default: 30 },
      desc: String,
      tags: [String],
      order: { type: Number, default: 0 },
    });
    TrackModel = mongoose.model('Track', trackSchema);

    const settingsSchema = new mongoose.Schema({
      key: { type: String, unique: true },
      value: mongoose.Schema.Types.Mixed,
    });
    SettingsModel = mongoose.model('Settings', settingsSchema);

    const statusSchema = new mongoose.Schema({
      id: { type: String, default: uuidv4 },
      client_name: String,
      timestamp: { type: Date, default: Date.now },
    });
    StatusModel = mongoose.model('StatusCheck', statusSchema);

    // Seed or sync default tracks in MongoDB
    const trackCount = await TrackModel.countDocuments();
    if (trackCount === 0) {
      console.log('Seeding default composer tracks into MongoDB...');
      for (const t of memDb.tracks) {
        await new TrackModel(t).save();
      }
    } else {
      console.log('Syncing composer track extensions in MongoDB...');
      for (const t of memDb.tracks) {
        await TrackModel.findOneAndUpdate({ order: t.order }, { filename: t.filename });
      }
    }
  } catch (err) {
    console.warn(`⚠️  MongoDB failed (${err.message}) — using in-memory.`);
    useInMemory = true;
  }
}

// ─── JWT Auth ─────────────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token.' });
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

// ─── Routes ───────────────────────────────────────────────────

app.get('/', (req, res) => res.json({ status: 'online', message: 'EKOPIX Backend', mode: useInMemory ? 'memory' : 'mongodb' }));
app.get('/api/', (req, res) => res.json({ message: 'EKOPIX API v2', status: 'online' }));

// ── Admin Login
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });
  if (username !== ADMIN_USER || password !== ADMIN_PASS) return res.status(401).json({ message: 'Invalid credentials.' });
  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, username, role: 'admin' });
});

// ────────────────────────────────────────────────────────────────
// VIDEOS (public GET, protected POST/PUT/DELETE)
// ────────────────────────────────────────────────────────────────
app.get('/api/videos', async (req, res) => {
  try {
    if (useInMemory) return res.json([...memDb.videos].sort((a, b) => a.order - b.order));
    const vids = await VideoModel.find({}, '-_id -__v').sort({ order: 1 });
    res.json(vids);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/videos', auth, async (req, res) => {
  try {
    const { youtubeId, title, subtitle } = req.body;
    if (!youtubeId || !title) return res.status(400).json({ message: 'youtubeId and title required.' });
    if (useInMemory) {
      const v = { id: uuidv4(), youtubeId, title, subtitle: subtitle || '', order: memDb.videos.length };
      memDb.videos.push(v);
      return res.status(201).json(v);
    }
    const count = await VideoModel.countDocuments();
    const v = new VideoModel({ id: uuidv4(), youtubeId, title, subtitle: subtitle || '', order: count });
    await v.save();
    res.status(201).json({ id: v.id, youtubeId: v.youtubeId, title: v.title, subtitle: v.subtitle, order: v.order });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/videos/:id', auth, async (req, res) => {
  try {
    const { youtubeId, title, subtitle, order } = req.body;
    if (useInMemory) {
      const idx = memDb.videos.findIndex((v) => v.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Not found.' });
      memDb.videos[idx] = { ...memDb.videos[idx], youtubeId, title, subtitle, order: order ?? memDb.videos[idx].order };
      return res.json(memDb.videos[idx]);
    }
    const v = await VideoModel.findOneAndUpdate({ id: req.params.id }, { youtubeId, title, subtitle, order }, { new: true });
    if (!v) return res.status(404).json({ message: 'Not found.' });
    res.json({ id: v.id, youtubeId: v.youtubeId, title: v.title, subtitle: v.subtitle, order: v.order });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/videos/:id', auth, async (req, res) => {
  try {
    if (useInMemory) {
      const idx = memDb.videos.findIndex((v) => v.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Not found.' });
      memDb.videos.splice(idx, 1);
      return res.json({ message: 'Deleted.' });
    }
    const result = await VideoModel.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ────────────────────────────────────────────────────────────────
// COMPOSER TRACKS (public GET, protected POST/PUT/DELETE)
// ────────────────────────────────────────────────────────────────
app.get('/api/tracks', async (req, res) => {
  try {
    if (useInMemory) return res.json([...memDb.tracks].sort((a, b) => a.order - b.order));
    const trks = await TrackModel.find({}, '-_id -__v').sort({ order: 1 });
    res.json(trks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/tracks', auth, async (req, res) => {
  try {
    const { title, filename, start, end, desc, tags } = req.body;
    if (!title || !filename) return res.status(400).json({ message: 'title and filename required.' });
    const tagList = Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(s => s.trim()) : []);
    
    if (useInMemory) {
      const t = { 
        id: uuidv4(), 
        title, 
        filename, 
        start: Number(start) || 0, 
        end: Number(end) || 30, 
        desc: desc || '', 
        tags: tagList,
        order: memDb.tracks.length 
      };
      memDb.tracks.push(t);
      return res.status(201).json(t);
    }
    const count = await TrackModel.countDocuments();
    const t = new TrackModel({ 
      id: uuidv4(), 
      title, 
      filename, 
      start: Number(start) || 0, 
      end: Number(end) || 30, 
      desc: desc || '', 
      tags: tagList,
      order: count 
    });
    await t.save();
    res.status(201).json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/tracks/:id', auth, async (req, res) => {
  try {
    const { title, filename, start, end, desc, tags, order } = req.body;
    const tagList = Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(s => s.trim()) : []);
    
    if (useInMemory) {
      const idx = memDb.tracks.findIndex((t) => t.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Not found.' });
      memDb.tracks[idx] = { 
        ...memDb.tracks[idx], 
        title: title || memDb.tracks[idx].title, 
        filename: filename || memDb.tracks[idx].filename, 
        start: start !== undefined ? Number(start) : memDb.tracks[idx].start, 
        end: end !== undefined ? Number(end) : memDb.tracks[idx].end, 
        desc: desc !== undefined ? desc : memDb.tracks[idx].desc, 
        tags: tags !== undefined ? tagList : memDb.tracks[idx].tags,
        order: order !== undefined ? Number(order) : memDb.tracks[idx].order 
      };
      return res.json(memDb.tracks[idx]);
    }
    const t = await TrackModel.findOneAndUpdate(
      { id: req.params.id }, 
      { title, filename, start, end, desc, tags: tagList, order }, 
      { new: true }
    );
    if (!t) return res.status(404).json({ message: 'Not found.' });
    res.json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/tracks/:id', auth, async (req, res) => {
  try {
    if (useInMemory) {
      const idx = memDb.tracks.findIndex((t) => t.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Not found.' });
      memDb.tracks.splice(idx, 1);
      return res.json({ message: 'Deleted.' });
    }
    const result = await TrackModel.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ────────────────────────────────────────────────────────────────
// SITE SETTINGS (public GET, protected PUT)
// ────────────────────────────────────────────────────────────────
app.get('/api/settings', async (req, res) => {
  try {
    if (useInMemory) return res.json(memDb.settings);
    const heroDoc = await SettingsModel.findOne({ key: 'hero' });
    const latestDoc = await SettingsModel.findOne({ key: 'latestDrop' });
    const visibilityDoc = await SettingsModel.findOne({ key: 'visibility' });
    const contentDoc = await SettingsModel.findOne({ key: 'content' });
    res.json({
      hero: heroDoc?.value || memDb.settings.hero,
      latestDrop: latestDoc?.value || memDb.settings.latestDrop,
      visibility: visibilityDoc?.value || memDb.settings.visibility,
      content: contentDoc?.value || memDb.settings.content,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/settings/hero', auth, async (req, res) => {
  try {
    const { backgroundType, youtubeId, imageUrl, startSeconds, endSeconds } = req.body;
    const val = { 
      backgroundType, 
      youtubeId, 
      imageUrl, 
      startSeconds: Number(startSeconds) || 0, 
      endSeconds: Number(endSeconds) || 0 
    };
    if (useInMemory) { memDb.settings.hero = val; return res.json(val); }
    await SettingsModel.findOneAndUpdate({ key: 'hero' }, { value: val }, { upsert: true });
    res.json(val);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/settings/latest-drop', auth, async (req, res) => {
  try {
    const { youtubeId, title, subtitle, description } = req.body;
    const val = { youtubeId, title, subtitle, description };
    if (useInMemory) { memDb.settings.latestDrop = val; return res.json(val); }
    await SettingsModel.findOneAndUpdate({ key: 'latestDrop' }, { value: val }, { upsert: true });
    res.json(val);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/settings/visibility', auth, async (req, res) => {
  try {
    const val = req.body;
    if (useInMemory) { memDb.settings.visibility = val; return res.json(val); }
    await SettingsModel.findOneAndUpdate({ key: 'visibility' }, { value: val }, { upsert: true });
    res.json(val);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/settings/content', auth, async (req, res) => {
  try {
    const val = req.body;
    if (useInMemory) { memDb.settings.content = val; return res.json(val); }
    await SettingsModel.findOneAndUpdate({ key: 'content' }, { value: val }, { upsert: true });
    res.json(val);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ────────────────────────────────────────────────────────────────
// STATUS CHECKS
// ────────────────────────────────────────────────────────────────
app.post('/api/status', async (req, res) => {
  try {
    const { client_name } = req.body;
    if (!client_name) return res.status(400).json({ message: 'client_name required.' });
    if (useInMemory) {
      const r = { id: uuidv4(), client_name, timestamp: new Date() };
      memDb.statusChecks.push(r);
      return res.status(201).json(r);
    }
    const s = new StatusModel({ id: uuidv4(), client_name });
    await s.save();
    res.status(201).json({ id: s.id, client_name: s.client_name, timestamp: s.timestamp });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/status', auth, async (req, res) => {
  try {
    if (useInMemory) return res.json([...memDb.statusChecks].reverse());
    const all = await StatusModel.find({}, '-_id -__v').sort({ timestamp: -1 });
    res.json(all);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/status/:id', auth, async (req, res) => {
  try {
    if (useInMemory) {
      const idx = memDb.statusChecks.findIndex((c) => c.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Not found.' });
      memDb.statusChecks.splice(idx, 1);
      return res.json({ message: 'Deleted.' });
    }
    const r = await StatusModel.findOneAndDelete({ id: req.params.id });
    if (!r) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/stats', auth, async (req, res) => {
  try {
    const all = useInMemory ? memDb.statusChecks : await StatusModel.find({});
    const today = new Date(); today.setHours(0, 0, 0, 0);
    res.json({
      total_checks: all.length,
      today_checks: all.filter((c) => new Date(c.timestamp) >= today).length,
      unique_clients: new Set(all.map((c) => c.client_name)).size,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

// ─── Start ────────────────────────────────────────────────────
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n🚀 EKOPIX Backend  →  http://localhost:${port}`);
    console.log(`🔐 Admin login     →  POST /api/admin/login`);
    console.log(`🎬 Videos API      →  GET  /api/videos`);
    console.log(`⚙️  Settings API    →  GET  /api/settings`);
    if (useInMemory) console.log(`\n⚠️  IN-MEMORY mode (set MONGO_URL in .env for persistence)\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
};

connectDB().then(() => {
  startServer(typeof PORT === 'string' ? parseInt(PORT, 10) : PORT);
});
