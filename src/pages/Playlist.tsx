import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import VideoCard from "@/components/VideoCard";
import { useState, useEffect } from "react";
import VideoModal from "@/components/VideoModal";
import AddSongModal from "@/components/AddSongModal";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Play, Plus } from "lucide-react";
import { playlistService } from "@/services";
import { useToast } from "@/hooks/use-toast";

const Playlist = () => {
  const { id } = useParams();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [playlist, setPlaylist] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const foundPlaylist = playlistService.getById(id);
      setPlaylist(foundPlaylist);
    }
  }, [id]);

  const handleAddSong = (songData: any) => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID da playlist não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (!playlist) {
      toast({
        title: "Erro",
        description: "Playlist não carregada.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedPlaylist = playlistService.addSong(id, {
        title: songData.title,
        artist: songData.artist,
        url: songData.url,
        provider: songData.provider,
        thumbnail: songData.thumbnail || "",
        duration: songData.duration || "",
      });

      if (updatedPlaylist) {
        setPlaylist(updatedPlaylist);
        toast({
          title: "Música adicionada",
          description: `"${songData.title}" foi adicionada à playlist.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a música.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a música.",
        variant: "destructive",
      });
    }
  };

  const songs = playlist?.songs || [];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                {playlist?.name || "Playlist não encontrada"}
              </h1>
              <p className="text-muted-foreground">
                {songs.length} {songs.length === 1 ? "música" : "músicas"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddSongModalOpen(true)}
                className="bg-primary hover:bg-primary-glow"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Música
              </Button>
              <Button
                size="icon"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {songs.map((song) => (
                <VideoCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-card/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedVideo(song.url)}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(song.url);
                    }}
                  >
                    <Play className="h-5 w-5 fill-current" />
                  </Button>

                  <img
                    src={song.thumbnail || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop"}
                    alt={song.title}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {song.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {song.duration || "0:00"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Player onExpand={() => setSelectedVideo(songs[0]?.url || null)} />

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <AddSongModal
        isOpen={isAddSongModalOpen}
        onClose={() => setIsAddSongModalOpen(false)}
        onAddSong={handleAddSong}
      />
    </div>
  );
};

export default Playlist;
