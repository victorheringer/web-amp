import { Playlist } from "./types";

const USAGE_STORAGE_KEY = "web-amp-usage-data";

interface PlaylistUsage {
  playCount: number;
  listenTime: number; // in seconds
  lastPlayed: number;
}

interface UsageData {
  playlists: Record<string, PlaylistUsage>;
}

const getUsageData = (): UsageData => {
  const stored = localStorage.getItem(USAGE_STORAGE_KEY);
  if (!stored) return { playlists: {} };
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse usage data", error);
    return { playlists: {} };
  }
};

const saveUsageData = (data: UsageData) => {
  localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(data));
};

export const usageService = {
  recordPlay: (playlistId: string) => {
    const data = getUsageData();
    if (!data.playlists[playlistId]) {
      data.playlists[playlistId] = {
        playCount: 0,
        listenTime: 0,
        lastPlayed: 0,
      };
    }
    data.playlists[playlistId].playCount += 1;
    data.playlists[playlistId].lastPlayed = Date.now();
    saveUsageData(data);
  },

  recordListenTime: (playlistId: string, seconds: number) => {
    const data = getUsageData();
    if (!data.playlists[playlistId]) {
      data.playlists[playlistId] = {
        playCount: 0,
        listenTime: 0,
        lastPlayed: 0,
      };
    }
    data.playlists[playlistId].listenTime += seconds;
    data.playlists[playlistId].lastPlayed = Date.now();
    saveUsageData(data);
  },

  getTopPlaylists: (
    allPlaylists: Playlist[],
    limit: number = 3
  ): Playlist[] => {
    const data = getUsageData();

    // Calculate score for each playlist
    // Score = (Play Count * 10) + (Listen Time in Minutes * 1)
    const scoredPlaylists = allPlaylists.map((playlist) => {
      const usage = data.playlists[playlist.id] || {
        playCount: 0,
        listenTime: 0,
      };
      const score = usage.playCount * 10 + usage.listenTime / 60;
      return { playlist, score };
    });

    // Sort by score descending
    scoredPlaylists.sort((a, b) => b.score - a.score);

    // Return top N playlists
    return scoredPlaylists.slice(0, limit).map((item) => item.playlist);
  },
};
