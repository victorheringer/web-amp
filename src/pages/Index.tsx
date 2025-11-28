import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import RecommendationCard from "@/components/RecommendationCard";
import Player from "@/components/Player";
import VideoModal from "@/components/VideoModal";
import VibeModal from "@/components/VibeModal";
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
import {
  playlistService,
  settingsService,
  usageService,
  recommendationService,
} from "@/services";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  Youtube,
  Sparkles,
  Plus,
  PlayCircle,
  Settings,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import type { Song, Playlist } from "@/services/types";

const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [topPlaylists, setTopPlaylists] = useState<Playlist[]>([]);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVibeModalOpen, setIsVibeModalOpen] = useState(false);
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

      if (settings.token) {
        loadRecommendations(loadedPlaylists);
      }
    }
  }, []);

  const loadRecommendations = async (
    currentPlaylists: Playlist[],
    force: boolean = false
  ) => {
    setIsLoadingRecommendations(true);
    try {
      const recs = await recommendationService.getRecommendations(
        currentPlaylists,
        8,
        force
      );
      setRecommendations(recs);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao carregar recomendações",
        description:
          "Não foi possível obter sugestões da IA. Verifique seu token ou tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

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

  const handleCreateVibe = async (vibe: string) => {
    try {
      const { name, songIds } = await recommendationService.createVibePlaylist(
        playlists,
        vibe
      );

      if (songIds.length === 0) {
        toast({
          title: "Nenhuma música encontrada",
          description:
            "Não encontramos músicas nas suas playlists que combinem com essa vibe.",
          variant: "destructive",
        });
        return;
      }

      // Create the vibe playlist
      const allSongs = playlists.flatMap((p) => p.songs);
      const selectedSongs = allSongs.filter((s) => songIds.includes(s.id));

      // Remove duplicates by ID
      const uniqueSongs = Array.from(
        new Map(selectedSongs.map((s) => [s.id, s])).values()
      );

      const newPlaylist = playlistService.create(
        name ||
          `Vibe: ${vibe.length > 20 ? vibe.substring(0, 20) + "..." : vibe}`,
        `Playlist gerada por IA baseada na vibe: "${vibe}"`
      );

      // Mark as vibe playlist and set expiration
      playlistService.update(newPlaylist.id, {
        isVibe: true,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });

      // Add songs
      uniqueSongs.forEach((song) => {
        playlistService.addSong(newPlaylist.id, song);
      });

      toast({
        title: "Vibe criada!",
        description: `${uniqueSongs.length} músicas adicionadas à sua vibe.`,
      });

      navigate(`/playlist/${newPlaylist.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao criar vibe",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };

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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Recomendados para você
                  </h3>
                  {hasToken && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsVibeModalOpen(true)}
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4 text-primary" />
                        Minha Vibe
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadRecommendations(playlists, true)}
                        disabled={isLoadingRecommendations}
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-2 ${
                            isLoadingRecommendations ? "animate-spin" : ""
                          }`}
                        />
                        Atualizar
                      </Button>
                    </div>
                  )}
                </div>

                {isLoadingRecommendations ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-64 bg-muted animate-pulse rounded-xl"
                      />
                    ))}
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {recommendations.map((video) => (
                      <RecommendationCard key={video.id} song={video} />
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

      <VibeModal
        isOpen={isVibeModalOpen}
        onClose={() => setIsVibeModalOpen(false)}
        onSubmit={handleCreateVibe}
      />
    </div>
  );
};

export default Index;
