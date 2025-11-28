import { Play, Pause, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Song } from "@/services";
import { usePlayer } from "@/contexts/PlayerContext";

interface VideoCardProps {
  song: Song;
  playlist?: Song[];
  onRemove?: (songId: string) => void;
}

const VideoCard = ({ song, playlist, onRemove }: VideoCardProps) => {
  const { play, pause, resume, currentSong, isPlaying } = usePlayer();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentSong) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      play(song, playlist);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(song.id);
    }
  };

  return (
    <Card className="group relative bg-card hover:bg-card/80 transition-all duration-300 overflow-hidden border-border cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={
            song.thumbnail ||
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop"
          }
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${
            isCurrentSong && isPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary-glow shadow-glow"
            onClick={handlePlay}
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="h-6 w-6 fill-current" />
            )}
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
          {song.duration || "0:00"}
        </div>
        {isCurrentSong && isPlaying && (
          <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded text-xs font-semibold">
            Tocando
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-sm truncate transition-colors ${
                isCurrentSong
                  ? "text-primary"
                  : "text-card-foreground group-hover:text-primary"
              }`}
            >
              {song.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-1">
              {song.artist}
            </p>
          </div>
          {onRemove && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover da playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
