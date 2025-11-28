import {
  Home,
  ListMusic,
  Plus,
  Settings,
  Upload,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { playlistService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { usePlayer } from "@/contexts/PlayerContext";

const Sidebar = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { currentPlaylistId, isPlaying } = usePlayer();

  // Carregar playlists do localStorage
  useEffect(() => {
    const loadPlaylists = () => {
      const loadedPlaylists = playlistService.getAll();
      setPlaylists(loadedPlaylists);
    };

    loadPlaylists();

    window.addEventListener("playlists-changed", loadPlaylists);
    return () => window.removeEventListener("playlists-changed", loadPlaylists);
  }, []);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = playlistService.create(newPlaylistName.trim());
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName("");
      setIsDialogOpen(false);
      toast({
        title: "Playlist criada",
        description: `"${newPlaylistName}" foi criada com sucesso.`,
      });
    }
  };

  const vibePlaylists = playlists.filter((p) => p.isVibe);
  const normalPlaylists = playlists.filter((p) => !p.isVibe);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          WebAmp
        </h1>
      </div>

      <nav className="space-y-1 px-3">
        <Button
          asChild
          variant="ghost"
          className={`w-full justify-start ${
            location.pathname === "/"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Link to="/">
            <Home className="mr-3 h-5 w-5" />
            Início
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className={`w-full justify-start ${
            location.pathname === "/import"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Link to="/import">
            <Upload className="mr-3 h-5 w-5" />
            Importar Playlist
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className={`w-full justify-start ${
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Link to="/settings">
            <Settings className="mr-3 h-5 w-5" />
            Configurações
          </Link>
        </Button>
      </nav>

      <div className="mt-6 px-3 flex-1 flex flex-col gap-2">
        {vibePlaylists.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Minha Vibe
              </h3>
            </div>
            <ScrollArea className="max-h-[120px]">
              <div className="space-y-1">
                {vibePlaylists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    asChild
                    variant="ghost"
                    className={`w-full justify-start truncate ${
                      location.pathname === `/playlist/${playlist.id}`
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link to={`/playlist/${playlist.id}`}>
                      {currentPlaylistId === playlist.id && isPlaying ? (
                        <Volume2 className="mr-3 h-4 w-4 flex-shrink-0 text-primary animate-pulse" />
                      ) : (
                        <ListMusic className="mr-3 h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{playlist.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Playlists
            </h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="playlist-name">Nome da Playlist</Label>
                    <Input
                      id="playlist-name"
                      placeholder="Digite o nome da playlist"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreatePlaylist();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleCreatePlaylist} className="w-full">
                    Criar Playlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {normalPlaylists.map((playlist) => (
                <Button
                  key={playlist.id}
                  asChild
                  variant="ghost"
                  className={`w-full justify-start truncate ${
                    location.pathname === `/playlist/${playlist.id}`
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Link to={`/playlist/${playlist.id}`}>
                    {currentPlaylistId === playlist.id && isPlaying ? (
                      <Volume2 className="mr-3 h-4 w-4 flex-shrink-0 text-primary animate-pulse" />
                    ) : (
                      <ListMusic className="mr-3 h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{playlist.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
