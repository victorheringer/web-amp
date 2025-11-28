export type VideoProvider = "youtube" | "soundcloud" | "vimeo" | "dailymotion";

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string; // Link for embedded
  originalUrl?: string; // Original link for sharing
  provider: VideoProvider;
  thumbnail?: string;
  duration?: string;
  addedAt: number;
  recommendationReason?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: number;
  updatedAt: number;
  isVibe?: boolean;
  expiresAt?: number;
}

export interface KeyboardShortcuts {
  playPause: string;
  next: string;
  previous: string;
  shuffle: string;
  repeat: string;
}

export interface AppSettings {
  token?: string;
  theme?: "light" | "dark" | "system";
  viewMode?: "grid" | "list";
  searchProvider?: "youtube";
  shortcuts?: KeyboardShortcuts;
}
