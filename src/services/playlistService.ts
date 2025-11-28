import { Playlist, Song } from './types';

const PLAYLISTS_STORAGE_KEY = 'web-amp-playlists';

const getPlaylists = (): Playlist[] => {
  const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse playlists from localStorage', error);
    return [];
  }
};

const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
};

export const playlistService = {
  getAll: (): Playlist[] => {
    return getPlaylists();
  },

  getById: (id: string): Playlist | undefined => {
    const playlists = getPlaylists();
    return playlists.find((p) => p.id === id);
  },

  create: (name: string, description?: string): Playlist => {
    const playlists = getPlaylists();
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      description,
      songs: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    playlists.push(newPlaylist);
    savePlaylists(playlists);
    return newPlaylist;
  },

  update: (id: string, updates: Partial<Omit<Playlist, 'id' | 'createdAt' | 'songs'>>): Playlist | null => {
    const playlists = getPlaylists();
    const index = playlists.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedPlaylist = {
      ...playlists[index],
      ...updates,
      updatedAt: Date.now(),
    };
    playlists[index] = updatedPlaylist;
    savePlaylists(playlists);
    return updatedPlaylist;
  },

  delete: (id: string): boolean => {
    const playlists = getPlaylists();
    const filtered = playlists.filter((p) => p.id !== id);
    if (filtered.length === playlists.length) return false;
    savePlaylists(filtered);
    return true;
  },

  addSong: (playlistId: string, song: Omit<Song, 'id' | 'addedAt'>): Playlist | null => {
    const playlists = getPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const newSong: Song = {
      ...song,
      id: crypto.randomUUID(),
      addedAt: Date.now(),
    };

    playlists[index].songs.push(newSong);
    playlists[index].updatedAt = Date.now();
    savePlaylists(playlists);
    return playlists[index];
  },

  removeSong: (playlistId: string, songId: string): Playlist | null => {
    const playlists = getPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    playlists[index].songs = playlists[index].songs.filter((s) => s.id !== songId);
    playlists[index].updatedAt = Date.now();
    savePlaylists(playlists);
    return playlists[index];
  },
};
