import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { playlistService, settingsService, usageService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  Youtube,
  Sparkles,
  Plus,
  PlayCircle,
  Settings,
  TrendingUp,
} from "lucide-react";
import type { Song, Playlist } from "@/services/types";

const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [topPlaylists, setTopPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadedPlaylists = playlistService.getAll();
    setPlaylists(loadedPlaylists);

    const settings = settingsService.get();
    setHasToken(!!settings.token);

    if (loadedPlaylists.length > 0) {
      const top = usageService.getTopPlaylists(loadedPlaylists);
      setTopPlaylists(top);
    }
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
  const videos: Song[] = [];

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

              {topPlaylists.length > 0 && (
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">
                      Suas Playlists Mais Ouvidas
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="group relative bg-card hover:bg-card/80 transition-all duration-300 overflow-hidden border border-border cursor-pointer rounded-lg p-4"
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                            {playlist.songs[0]?.thumbnail ? (
                              <img
                                src={playlist.songs[0].thumbnail}
                                alt={playlist.name}
                                className="h-full w-full object-cover rounded-md"
                              />
                            ) : (
                              <Music className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                              {playlist.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {playlist.songs.length}{" "}
                              {playlist.songs.length === 1
                                ? "música"
                                : "músicas"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Recomendados para você
                </h3>
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                      <VideoCard key={video.id} song={video} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card/50 rounded-lg border border-dashed border-border">
                    <p className="text-muted-foreground">
                      Ainda não temos recomendações para você.
                      <br />
                      {!hasToken
                        ? "Configure seu token de IA e continue ouvindo suas músicas favoritas para receber sugestões personalizadas!"
                        : "Continue ouvindo suas músicas favoritas para receber sugestões personalizadas!"}
                    </p>
                  </div>
                )}
              </section>

              {!hasToken && (
                <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Ative as recomendações com IA
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Configure seu token OpenRouter para receber sugestões
                        personalizadas de artistas.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar
                    </Link>
                  </Button>
                </div>
              )}
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
