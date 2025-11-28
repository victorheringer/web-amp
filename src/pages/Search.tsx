import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import VideoModal from "@/components/VideoModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Play, Music } from "lucide-react";
import { playlistService } from "@/services";
import { usePlayer } from "@/contexts/PlayerContext";
import { Song } from "@/services/types";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { play } = usePlayer();

  useEffect(() => {
    const loadedPlaylists = playlistService.getAll();
    setPlaylists(loadedPlaylists);
  }, []);

  useEffect(() => {
    // Update URL param when query changes
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results: any[] = [];

      playlists.forEach((playlist) => {
        playlist.songs.forEach((song: Song) => {
          if (
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
          ) {
            results.push({
              ...song,
              playlistId: playlist.id,
              playlistName: playlist.name,
              contextSongs: playlist.songs,
            });
          }
        });
      });

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, playlists, setSearchParams]);

  const handlePlaySearchResult = (song: any) => {
    play(song, song.contextSongs, song.playlistId);
  };

  return (
    <div className="flex h-screen bg-background w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ScrollArea className="flex-1">
          <div className="p-8 pb-32">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">Buscar</h1>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="O que você quer ouvir?"
                    className="pl-10 h-10 bg-secondary/50 border-transparent focus:bg-secondary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {searchQuery ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Resultados ({searchResults.length})
                  </h2>
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((song) => (
                        <div
                          key={`${song.id}-${song.playlistId}`}
                          className="flex items-center p-3 rounded-md hover:bg-secondary/50 group transition-colors cursor-pointer"
                          onClick={() => handlePlaySearchResult(song)}
                        >
                          <div className="mr-4 relative">
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Music className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded transition-all">
                              <Play className="h-5 w-5 text-white fill-current" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{song.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {song.artist} • {song.playlistName}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {song.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      Nenhuma música encontrada para "{searchQuery}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Digite algo para buscar em suas playlists</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <Player onExpand={() => setIsVideoModalOpen(true)} />
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Search;
