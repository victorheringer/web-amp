import { OpenRouter } from "@openrouter/sdk";
import { settingsService } from "./settingsService";
import { usageService } from "./usageService";
import { Playlist, Song } from "./types";

const MODEL = "x-ai/grok-4.1-fast:free";
const STORAGE_KEY = "web-amp-recommendations";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface StoredData {
  recommendations: Song[];
  timestamp: number;
}

export const recommendationService = {
  getRecommendations: async (
    allPlaylists: Playlist[],
    limit: number = 8,
    forceUpdate: boolean = false
  ): Promise<Song[]> => {
    // Check cache first
    if (!forceUpdate) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const data: StoredData = JSON.parse(stored);
          const now = Date.now();
          if (now - data.timestamp < CACHE_DURATION) {
            return data.recommendations;
          }
        } catch (e) {
          console.error("Failed to parse stored recommendations", e);
        }
      }
    }

    const token = settingsService.getToken();
    if (!token) {
      throw new Error("Token OpenRouter não configurado");
    }

    const client = new OpenRouter({
      apiKey: token,
      httpReferer: window.location.origin,
      xTitle: "Web Amp",
    });

    const topPlaylists = usageService.getTopPlaylists(allPlaylists, 3);

    // Collect some context
    // Shuffle songs to ensure variety in the prompt context
    const allSongs = topPlaylists.flatMap((p) => p.songs);
    const shuffledSongs = allSongs.sort(() => 0.5 - Math.random()).slice(0, 20);

    if (shuffledSongs.length === 0) {
      return [];
    }

    const contextString = shuffledSongs
      .map((s) => `${s.title} - ${s.artist}`)
      .join("\n");

    // Add a random seed or instruction to the prompt
    const vibes = [
      "joias escondidas e menos conhecidas",
      "clássicos essenciais do gênero",
      "lançamentos mais recentes",
      "músicas com alta energia",
      "músicas para relaxar",
      "artistas relacionados mas diferentes",
    ];
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];

    const prompt = `
      Com base nas seguintes músicas que o usuário gosta:
      ${contextString}

      Recomende ${limit} músicas similares.
      Foco da recomendação de hoje: ${randomVibe}.
      IMPORTANTE: Não recomende músicas que já estão na lista fornecida.
      
      Retorne APENAS um array JSON válido onde cada objeto tem:
      - title: nome da música
      - artist: nome do artista
      - reason: breve motivo da recomendação em português (max 10 palavras)
      
      Não inclua markdown, apenas o JSON cru.
    `;

    try {
      const completion = await client.chat.send({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente especialista em música. Responda apenas com JSON.",
          },
          { role: "user", content: prompt },
        ],
      });

      const content = completion.choices?.[0]?.message?.content;
      if (!content) return [];

      let contentStr = "";
      if (typeof content === "string") {
        contentStr = content;
      } else if (Array.isArray(content)) {
        contentStr = content
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text || "")
          .join("");
      }

      // Clean up markdown code blocks if present
      const jsonStr = contentStr
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      interface RecResponse {
        title: string;
        artist: string;
        reason: string;
      }

      let recommendations: RecResponse[] = [];
      try {
        recommendations = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse recommendation JSON", e);
        return [];
      }

      const result = recommendations.map((rec) => ({
        id: crypto.randomUUID(),
        title: rec.title,
        artist: rec.artist,
        url: "", // No URL yet
        provider: "youtube" as const,
        addedAt: Date.now(),
        thumbnail: "",
        duration: "",
        recommendationReason: rec.reason,
      }));

      // Cache the results
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          recommendations: result,
          timestamp: Date.now(),
        })
      );

      return result;
    } catch (error) {
      console.error("Erro ao obter recomendações:", error);
      throw error;
    }
  },

  createVibePlaylist: async (
    allPlaylists: Playlist[],
    vibe: string
  ): Promise<{ name: string; songIds: string[] }> => {
    const token = settingsService.getToken();
    if (!token) {
      throw new Error("Token OpenRouter não configurado");
    }

    const client = new OpenRouter({
      apiKey: token,
      httpReferer: window.location.origin,
      xTitle: "Web Amp",
    });

    // Collect all unique songs from all playlists
    const allSongs = new Map<
      string,
      { title: string; artist: string; id: string }
    >();

    allPlaylists.forEach((playlist) => {
      playlist.songs.forEach((song) => {
        // Create a unique key based on title and artist to avoid duplicates
        const key = `${song.title.toLowerCase()}-${song.artist.toLowerCase()}`;
        if (!allSongs.has(key)) {
          allSongs.set(key, {
            title: song.title,
            artist: song.artist,
            id: song.id, // We'll use the first ID found for this song
          });
        }
      });
    });

    const songsList = Array.from(allSongs.values());

    if (songsList.length === 0) {
      return { name: "", songIds: [] };
    }

    // Prepare the list for the prompt (index: Title - Artist)
    const songsPromptList = songsList
      .map((s, index) => `${index}: ${s.title} - ${s.artist}`)
      .join("\n");

    const prompt = `
      O usuário está se sentindo assim: "${vibe}"

      Abaixo está a lista de todas as músicas disponíveis nas playlists dele:
      ${songsPromptList}

      Sua tarefa é selecionar quais dessas músicas combinam com o sentimento/vibe do usuário.
      Também sugira um nome curto e criativo para a playlist (máximo 30 caracteres).
      
      Retorne APENAS um objeto JSON com o seguinte formato:
      {
        "name": "Nome da Playlist",
        "indices": [0, 5, 12, 15]
      }
      
      Não inclua markdown, apenas o JSON cru.
    `;

    try {
      const completion = await client.chat.send({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Você é um DJ especialista em criar playlists baseadas em sentimentos. Responda apenas com JSON.",
          },
          { role: "user", content: prompt },
        ],
      });

      const content = completion.choices?.[0]?.message?.content;
      if (!content) return { name: "", songIds: [] };

      let contentStr = "";
      if (typeof content === "string") {
        contentStr = content;
      } else if (Array.isArray(content)) {
        contentStr = content
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text || "")
          .join("");
      }

      // Clean up markdown code blocks if present
      const jsonStr = contentStr
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let result: { name: string; indices: number[] } = {
        name: "",
        indices: [],
      };
      try {
        result = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse vibe playlist JSON", e);
        return { name: "", songIds: [] };
      }

      // Map indices back to song IDs
      const selectedSongIds = result.indices
        .filter((index) => index >= 0 && index < songsList.length)
        .map((index) => songsList[index].id);

      return {
        name: result.name || vibe,
        songIds: selectedSongIds,
      };
    } catch (error) {
      console.error("Erro ao criar playlist de vibe:", error);
      throw error;
    }
  },
};
