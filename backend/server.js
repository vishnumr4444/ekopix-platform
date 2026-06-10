require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const functions = require('firebase-functions');

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
    { id: 'o1', title: "Say My Name", filename: "Orginal/1_Say My Name.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/0b42VTJ8rYijNqDht0oJEB?si=bec3e0ce2f944e65", itunes: "https://music.apple.com/in/song/say-my-name-feat-sreelakshmi/6766093066", youtube: "https://www.youtube.com/watch?v=srKEjrgrXrw", order: 0 },
    { id: 'o2', title: "I Am The Ocean", filename: "Orginal/2_I Am the Ocean.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/6fIedpIm7KVgFtOTnAjcXP?si=14d66385d6254714", itunes: "https://music.apple.com/in/song/i-am-the-ocean/6766093070", youtube: "https://www.youtube.com/watch?v=joxhlRPMXlU", order: 1 },
    { id: 'o3', title: "How This Ends", filename: "Orginal/3_How This Ends.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/2RNN6uO4o28qoc2GoFQxEz?si=286b5ed7092a4d60", itunes: "https://music.apple.com/in/song/how-this-ends/6766093071", youtube: "https://www.youtube.com/watch?v=0v_6McF3a9E&list=PLWFjC6DjDNJjNKLLXScxMngy8ZC0q2T9c&index=4", order: 2 },
    { id: 'o4', title: "I Am Not Afraid", filename: "Orginal/4_I Am Not Afraid.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/2tSpQvZuZ1Z0kmXq9HPnDh?si=a14c4966ef4942f9", itunes: "https://music.apple.com/in/song/i-am-not-afraid/6766093069", youtube: "https://www.youtube.com/watch?v=HxGAwUUY7m8", order: 3 },
    { id: 'o5', title: "Paralyzed", filename: "Orginal/5_Paralyzed.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/5ZgDKShwtVO9JfWv88z3dE?si=ecc5382d5180481e", itunes: "https://music.apple.com/in/song/paralyzed/1872977110", youtube: "https://youtu.be/1SGwxKpdk3U?si=NuKLttMmm1Rzb6KZ", order: 4 },
    { id: 'o6', title: "Paralyzed (Unplugged)", filename: "Orginal/6_Paralyzed (Unplugged).wav", start: 0, end: 15, desc: "Acoustic arrangement.", tags: ["Acoustic"], spotify: "https://open.spotify.com/track/6qwGLay2G8SACwzfLdPWoi?si=ff06f114c3c24e2d", itunes: "https://music.apple.com/in/song/paralyzed-feat-kickvicky-unplugged-version/1882039234", youtube: "https://youtu.be/FC3NyZkHkRc?si=NGvrgX6clnf94JvX", order: 5 },
    { id: 'o7', title: "One Day", filename: "Orginal/7_One Day.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/4iTmGcovXnIAMOEuCAV08t?si=7c7c54ea5c9242a3", itunes: "https://music.apple.com/in/song/one-day/1840647342", youtube: "https://youtu.be/Wk4hEVnOISk?si=HJHMFXiGNdp8hopw", order: 6 },
    { id: 'o8', title: "Tera Bina", filename: "Orginal/8_Tera Bina.mp3", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Hindi"], spotify: "https://open.spotify.com/track/4vUpxx1dmCJnPEQl8Re0Hy?si=28abaa2850364f95", itunes: "https://music.apple.com/in/album/tera-bina-jeena-kya-hai-single/1872858774", youtube: "https://youtu.be/-CBOrb98-54?si=xRdbcu1kGt6UAYEx", order: 7 },
    { id: 'o9', title: "Love", filename: "Orginal/9_Love.aif", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/placeholder-o9", itunes: "https://music.apple.com/us/album/placeholder-o9", youtube: "https://youtu.be/HI5m4Mce4Bw?si=ge6KmIngXpELZLad", order: 8 },
    { id: 'o10', title: "Thank You God For a Merry Christmas", filename: "Orginal/10_Thank You God for a Merry Christmas.aif", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Christmas"], spotify: "https://open.spotify.com/track/2l9oLjGwzg2zlm87WSeqHa?si=3784c7365cef4684", itunes: "https://music.apple.com/in/song/thank-you-god-for-a-merry-christmas/1865371376", youtube: "https://youtu.be/Mh1QY_MjVk4?si=XnLe_gEEtEbfkASD", order: 9 },
    { id: 'o11', title: "Still Tied To you", filename: "Orginal/11_Still Tied To You.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/5nUBHSkOTMzmIOusZ3peQz?si=dddb8810a308442b", itunes: "https://music.apple.com/in/song/still-tied-to-you/1882298083", youtube: "https://youtu.be/_ed3xQ5OVmA?si=DyEsniZLkpLvHoRR", order: 10 },
    { id: 'o12', title: "All Yours Now", filename: "Orginal/12_All Yours Now.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/placeholder-o12", itunes: "https://music.apple.com/us/album/placeholder-o12", youtube: "https://www.youtube.com/watch?v=A1kxobj6O7w", order: 11 },
    { id: 'o13', title: "From The Very Begining", filename: "Orginal/13_Beginning.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/2F8woIT5IVNzXzErDYI0TI?si=b3348ae6a8ef4146", itunes: "https://music.apple.com/in/song/from-the-very-beginning/1890238383", youtube: "https://youtube.com/watch?v=placeholder-o13", order: 12 },
    { id: 'o14', title: "Am I Stronger", filename: "Orginal/14_Stronger.wav", start: 0, end: 15, desc: "Original EKOPIX composition.", tags: ["Original"], spotify: "https://open.spotify.com/track/3Q8hCnGyfJPM8MLN69MVV9?si=2ecddd413318479b", itunes: "https://music.apple.com/in/song/am-i-stronger/1890328814", youtube: "https://youtube.com/watch?v=placeholder-o14", order: 13 },
    { id: 'c1', title: "We Wish You Merry Christmas", filename: "Cover/1_we wish u.aif", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/7EdtPzVNW5FyprO1Ji3aSv?si=a1746c80df374627", itunes: "https://music.apple.com/in/song/we-wish-you-a-merry-christmas/1865371378", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH", order: 14 },
    { id: 'c2', title: "God Rest Ye Merry", filename: "Cover/2_God Rest Ye Merry.aif", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/4FIYOv63FiiWk3df0Vcams?si=26a1b71ec3754de8", itunes: "https://music.apple.com/in/song/god-rest-ye-merry/1865371379", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH", order: 15 },
    { id: 'c3', title: "Carol Of The Bells", filename: "Cover/3_carol of the bells cimeroli Pentatonix.aif", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/4psVZb7wkNkhgVZjo7UqCc?si=cb6c6129bd774d5d", itunes: "https://music.apple.com/in/song/carol-of-the-bells/1865371381", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH", order: 16 },
    { id: 'c4', title: "Silent Night", filename: "Cover/4_Silent night.aif", start: 0, end: 15, desc: "EKOPIX Cover arrangement.", tags: ["Cover", "Christmas"], spotify: "https://open.spotify.com/track/6LnP5irqR7Cz1yFaEYTEWT?si=022255d26c8e4146", itunes: "https://music.apple.com/in/song/silent-night-holy-night/1865371383", youtube: "https://youtu.be/Mh1QY_MjVk4?si=Ue2PywTYLhxKi3YH", order: 17 },
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
    if (mongoose.connection.readyState === 1) {
      useInMemory = false;
      return;
    }
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
    VideoModel = mongoose.models.Video || mongoose.model('Video', videoSchema);

    const trackSchema = new mongoose.Schema({
      id: { type: String, default: uuidv4 },
      title: String,
      filename: String,
      start: { type: Number, default: 0 },
      end: { type: Number, default: 30 },
      desc: String,
      tags: [String],
      spotify: String,
      itunes: String,
      youtube: String,
      order: { type: Number, default: 0 },
    });
    TrackModel = mongoose.models.Track || mongoose.model('Track', trackSchema);

    const settingsSchema = new mongoose.Schema({
      key: { type: String, unique: true },
      value: mongoose.Schema.Types.Mixed,
    });
    SettingsModel = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

    const statusSchema = new mongoose.Schema({
      id: { type: String, default: uuidv4 },
      client_name: String,
      timestamp: { type: Date, default: Date.now },
    });
    StatusModel = mongoose.models.StatusCheck || mongoose.model('StatusCheck', statusSchema);

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
    const { title, filename, start, end, desc, tags, spotify, itunes, youtube } = req.body;
    if (!title) return res.status(400).json({ message: 'title required.' });
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
        spotify: spotify || '',
        itunes: itunes || '',
        youtube: youtube || '',
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
      spotify: spotify || '',
      itunes: itunes || '',
      youtube: youtube || '',
      order: count 
    });
    await t.save();
    res.status(201).json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/tracks/:id', auth, async (req, res) => {
  try {
    const { title, filename, start, end, desc, tags, spotify, itunes, youtube, order } = req.body;
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
        spotify: spotify !== undefined ? spotify : memDb.tracks[idx].spotify,
        itunes: itunes !== undefined ? itunes : memDb.tracks[idx].itunes,
        youtube: youtube !== undefined ? youtube : memDb.tracks[idx].youtube,
        order: order !== undefined ? Number(order) : memDb.tracks[idx].order 
      };
      return res.json(memDb.tracks[idx]);
    }
    const t = await TrackModel.findOneAndUpdate(
      { id: req.params.id }, 
      { title, filename, start, end, desc, tags: tagList, spotify, itunes, youtube, order }, 
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

// Check if running in a Firebase environment vs standalone
if (!process.env.FUNCTION_NAME && !process.env.FIREBASE_CONFIG) {
  connectDB().then(() => {
    startServer(typeof PORT === 'string' ? parseInt(PORT, 10) : PORT);
  });
} else {
  // We're in Firebase: Connect DB explicitly for cloud functions
  connectDB();
}

exports.api = functions.https.onRequest(app);
