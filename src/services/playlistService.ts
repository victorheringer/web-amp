import { Playlist, Song } from "./types";

const PLAYLISTS_STORAGE_KEY = "web-amp-playlists";

const getPlaylists = (): Playlist[] => {
  const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse playlists from localStorage", error);
    return [];
  }
};

const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  window.dispatchEvent(new Event("playlists-changed"));
};

export const playlistService = {
  getAll: (): Playlist[] => {
    const playlists = getPlaylists();
    const now = Date.now();
    const validPlaylists = playlists.filter(
      (p) => !p.expiresAt || p.expiresAt > now
    );

    if (validPlaylists.length !== playlists.length) {
      savePlaylists(validPlaylists);
    }

    return validPlaylists;
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

  update: (
    id: string,
    updates: Partial<Omit<Playlist, "id" | "createdAt" | "songs">>
  ): Playlist | null => {
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

  addSong: (
    playlistId: string,
    song: Omit<Song, "id" | "addedAt">
  ): Playlist | null => {
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

    playlists[index].songs = playlists[index].songs.filter(
      (s) => s.id !== songId
    );
    playlists[index].updatedAt = Date.now();
    savePlaylists(playlists);
    return playlists[index];
  },

  reorderSongs: (playlistId: string, newSongs: Song[]): Playlist | null => {
    const playlists = getPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    playlists[index].songs = newSongs;
    playlists[index].updatedAt = Date.now();
    savePlaylists(playlists);
    return playlists[index];
  },

  importPlaylist: (data: any): Playlist | null => {
    try {
      // Basic validation
      if (
        !data ||
        typeof data !== "object" ||
        !data.name ||
        !Array.isArray(data.songs)
      ) {
        return null;
      }

      const playlists = getPlaylists();

      // Create new playlist structure with new IDs to avoid conflicts
      const newPlaylist: Playlist = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        songs: data.songs.map((song: any) => ({
          id: crypto.randomUUID(),
          title: song.title || "Sem título",
          artist: song.artist || "Desconhecido",
          url: song.url || "",
          originalUrl: song.originalUrl,
          thumbnail: song.thumbnail || "",
          duration: song.duration || "",
          provider: song.provider || "youtube",
          addedAt: Date.now(),
        })),
      };

      playlists.push(newPlaylist);
      savePlaylists(playlists);
      return newPlaylist;
    } catch (error) {
      console.error("Error importing playlist:", error);
      return null;
    }
  },

  importPlaylists: (data: any[]): number => {
    try {
      if (!Array.isArray(data)) return 0;

      const playlists = getPlaylists();
      let count = 0;

      data.forEach((item) => {
        if (
          !item ||
          typeof item !== "object" ||
          !item.name ||
          !Array.isArray(item.songs)
        ) {
          return;
        }

        const newPlaylist: Playlist = {
          id: crypto.randomUUID(),
          name: item.name,
          description: item.description || "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          songs: item.songs.map((song: any) => ({
            id: crypto.randomUUID(),
            title: song.title || "Sem título",
            artist: song.artist || "Desconhecido",
            url: song.url || "",
            originalUrl: song.originalUrl,
            thumbnail: song.thumbnail || "",
            duration: song.duration || "",
            provider: song.provider || "youtube",
            addedAt: Date.now(),
          })),
        };
        playlists.push(newPlaylist);
        count++;
      });

      if (count > 0) {
        savePlaylists(playlists);
      }
      return count;
    } catch (error) {
      console.error("Error importing playlists:", error);
      return 0;
    }
  },

  convertVibeToNormal: (id: string): Playlist | null => {
    const playlists = getPlaylists();
    const index = playlists.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const playlist = playlists[index];
    if (!playlist.isVibe) return playlist;

    const { isVibe, expiresAt, ...rest } = playlist;
    const updatedPlaylist = {
      ...rest,
      updatedAt: Date.now(),
    };

    playlists[index] = updatedPlaylist;
    savePlaylists(playlists);
    return updatedPlaylist;
  },
};
