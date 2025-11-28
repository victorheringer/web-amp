import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import VideoCard from "@/components/VideoCard";
import { useState, useEffect } from "react";
import VideoModal from "@/components/VideoModal";
import AddSongModal from "@/components/AddSongModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutGrid,
  List,
  Play,
  Plus,
  Settings,
  Trash2,
  Music,
} from "lucide-react";
import { playlistService } from "@/services";
import { useToast } from "@/hooks/use-toast";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [playlist, setPlaylist] = useState<any>(null);
  const [editingName, setEditingName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const foundPlaylist = playlistService.getById(id);
      setPlaylist(foundPlaylist);
      if (foundPlaylist) {
        setEditingName(foundPlaylist.name);
      }
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

  const handleRemoveSong = (songId: string) => {
    if (!id) return;

    try {
      const song = playlist?.songs.find((s: any) => s.id === songId);
      const updatedPlaylist = playlistService.removeSong(id, songId);

      if (updatedPlaylist) {
        setPlaylist(updatedPlaylist);
        toast({
          title: "Música removida",
          description: `"${song?.title || "Música"}" foi removida da playlist.`,
        });
      }
    } catch (error) {
      console.error("Erro ao remover música:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a música.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePlaylist = () => {
    if (!id || !editingName.trim()) return;

    try {
      const updatedPlaylist = playlistService.update(id, { name: editingName });

      if (updatedPlaylist) {
        setPlaylist(updatedPlaylist);
        toast({
          title: "Playlist atualizada",
          description: "O nome da playlist foi atualizado com sucesso.",
        });
        setIsSettingsModalOpen(false);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a playlist.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar playlist:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a playlist.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlaylist = () => {
    if (!id) return;

    try {
      const success = playlistService.delete(id);

      if (success) {
        toast({
          title: "Playlist removida",
          description: `"${playlist?.name}" foi removida com sucesso.`,
        });
        navigate("/");
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível remover a playlist.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao remover playlist:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover a playlist.",
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
              {songs.length > 0 && (
                <Button
                  onClick={() => setIsAddSongModalOpen(true)}
                  className="bg-primary hover:bg-primary-glow"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Música
                </Button>
              )}
              <Button
                onClick={() => setIsSettingsModalOpen(true)}
                variant="outline"
              >
                <Settings className="h-5 w-5 mr-2" />
                Configurações
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

          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="rounded-full bg-muted p-6 mb-6">
                <Music className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">
                Nenhuma música ainda
              </h2>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Sua playlist está esperando por músicas incríveis! Adicione suas
                faixas favoritas do YouTube ou SoundCloud e comece a curtir.
              </p>
              <Button
                onClick={() => setIsAddSongModalOpen(true)}
                className="bg-primary hover:bg-primary-glow"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeira Música
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {songs.map((song) => (
                <VideoCard
                  key={song.id}
                  song={song}
                  onRemove={handleRemoveSong}
                />
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
                    src={
                      song.thumbnail ||
                      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop"
                    }
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

      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configurações da Playlist</DialogTitle>
            <DialogDescription>
              Gerenciar configurações de "{playlist?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Playlist</Label>
              <Input
                id="name"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Nome da playlist"
              />
            </div>

            <Button className="w-full" onClick={handleUpdatePlaylist}>
              Salvar Alterações
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Zona de Perigo
                </span>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                if (
                  confirm(
                    `Tem certeza que deseja remover a playlist "${playlist?.name}"?`
                  )
                ) {
                  handleDeletePlaylist();
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Playlist
            </Button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Playlist;
