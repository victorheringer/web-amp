import { Home, ListMusic, Plus, Settings } from "lucide-react";
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
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "Minhas Favoritas" },
    { id: 2, name: "Rock Clássico" },
    { id: 3, name: "Workout Mix" },
    { id: 4, name: "Chill Vibes" },
  ]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: playlists.length + 1,
        name: newPlaylistName.trim(),
      };
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          MusicStream
        </h1>
      </div>

      <nav className="space-y-1 px-3">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Link to="/">
            <Home className="mr-3 h-5 w-5" />
            Início
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Link to="/settings">
            <Settings className="mr-3 h-5 w-5" />
            Configurações
          </Link>
        </Button>
      </nav>

      <div className="mt-6 px-3 flex-1">
        <div className="flex items-center justify-between mb-3 px-2">
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
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                asChild
                variant="ghost"
                className="w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default Sidebar;
