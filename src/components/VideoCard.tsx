import { Play, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VideoCardProps {
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  onPlay: () => void;
}

const VideoCard = ({
  title,
  artist,
  thumbnail,
  duration,
  onPlay,
}: VideoCardProps) => {
  return (
    <Card className="group relative bg-card hover:bg-card/80 transition-all duration-300 overflow-hidden border-border cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary-glow shadow-glow"
            onClick={onPlay}
          >
            <Play className="h-6 w-6 fill-current" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
          {duration}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate text-card-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-1">
              {artist}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
