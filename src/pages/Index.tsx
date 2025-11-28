import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import Player from "@/components/Player";
import VideoModal from "@/components/VideoModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { playlistService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Music, Youtube, Sparkles, Plus, PlayCircle } from "lucide-react";
import type { Song } from "@/services/types";

const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadedPlaylists = playlistService.getAll();
    setPlaylists(loadedPlaylists);
  }, []);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = playlistService.create(newPlaylistName.trim());
      toast({
        title: "Playlist criada",
        description: `"${newPlaylistName}" foi criada com sucesso.`,
      });
      setIsDialogOpen(false);
      navigate(`/playlist/${newPlaylist.id}`);
    }
  };

  // Mock videos converted to Song format
  const videos: Song[] = [
    {
      id: "1",
      title: "Amazing Rock Performance Live",
      artist: "Rock Band",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
      duration: "4:12",
      addedAt: Date.now(),
    },
    {
      id: "2",
      title: "Acoustic Session in Studio",
      artist: "Indie Artist",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=225&fit=crop",
      duration: "3:45",
      addedAt: Date.now(),
    },
    {
      id: "3",
      title: "Electronic Dance Mix 2024",
      artist: "DJ Master",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=225&fit=crop",
      duration: "5:30",
      addedAt: Date.now(),
    },
    {
      id: "4",
      title: "Jazz Evening Performance",
      artist: "Jazz Quartet",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=225&fit=crop",
      duration: "6:15",
      addedAt: Date.now(),
    },
    {
      id: "5",
      title: "Pop Hits Medley",
      artist: "Various Artists",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=225&fit=crop",
      duration: "3:20",
      addedAt: Date.now(),
    },
    {
      id: "6",
      title: "Classical Piano Concert",
      artist: "Piano Virtuoso",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=225&fit=crop",
      duration: "8:45",
      addedAt: Date.now(),
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pb-32">
          {playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-fade-in">
              <div className="max-w-2xl space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Bem-vindo ao WebAmp
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Sua central de música e vídeo sem limites. Organize,
                    descubra e reproduza seus conteúdos favoritos em um só
                    lugar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                  <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Youtube className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Multi-plataforma</h3>
                    <p className="text-sm text-muted-foreground">
                      Suporte para YouTube, SoundCloud e mais provedores em
                      breve.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Playlists Ilimitadas</h3>
                    <p className="text-sm text-muted-foreground">
                      Crie e organize suas coleções de música do seu jeito.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">IA Inteligente</h3>
                    <p className="text-sm text-muted-foreground">
                      Sugestões personalizadas baseadas no seu gosto (Em breve).
                    </p>
                  </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-primary hover:bg-primary-glow shadow-glow"
                    >
                      <Plus className="mr-2 h-6 w-6" />
                      Criar Primeira Playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Nova Playlist</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="name">Nome da Playlist</Label>
                      <Input
                        id="name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Minha Playlist Incrível"
                        className="mt-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleCreatePlaylist();
                          }
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreatePlaylist}>
                        Criar Playlist
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta</h2>
                <p className="text-muted-foreground">
                  Continue ouvindo suas músicas favoritas
                </p>
              </div>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Recomendados para você
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <VideoCard key={video.id} song={video} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </ScrollArea>
      </main>

      <Player onExpand={() => setIsVideoModalOpen(true)} />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};

export default Index;
