// EKOPIX video catalog
export const VIDEOS = [
  { id: 'l7fJ9ZVmwR4', title: 'Tere Bina', subtitle: 'Official Music Video' },
  { id: 'HI5m4Mce4Bw', title: 'LOVE', subtitle: 'Official Music Video' },
  { id: '_ed3xQ5OVmA', title: 'Still Tied To You', subtitle: 'Official Lyric Video' },
  { id: '1SGwxKpdk3U', title: 'PARALYZED', subtitle: 'Character Introduction Video' },
  { id: '-CBOrb98-54', title: 'Tere Bina', subtitle: 'Official Lyric Video' },
  { id: 'Wk4hEVnOISk', title: 'ONE DAY', subtitle: 'The Birth of an Indian Anime Music Band' },
];

export const youtubeWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumbnail = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
export const youtubeThumbnailFallback = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
export const youtubeEmbed = (id, { autoplay = 1, mute = 1, loop = 1, controls = 0 } = {}) =>
  `https://www.youtube.com/embed/${id}?autoplay=${autoplay}&mute=${mute}&loop=${loop}&controls=${controls}&playlist=${id}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1`;
export const CHANNEL_URL = 'https://www.youtube.com/@EKOPIXofficial';
