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
}

export interface AppSettings {
  token?: string;
  theme?: "light" | "dark" | "system";
  viewMode?: "grid" | "list";
}
