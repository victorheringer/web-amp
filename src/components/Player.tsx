import {
  Play,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PlayerProps {
  onExpand: () => void;
}

const Player = ({ onExpand }: PlayerProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-player border-t border-border backdrop-blur-lg">
      <div className="px-4 py-3">
        {/* Progress bar */}
        <div className="mb-2">
          <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>2:34</span>
            <span>4:12</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Current track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-14 h-14 bg-gradient-card rounded overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
                alt="Album cover"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm truncate">Nome da Música</h4>
              <p className="text-xs text-muted-foreground truncate">Artista</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-foreground hover:text-primary"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 bg-primary hover:bg-primary-glow rounded-full shadow-glow"
            >
              <Play className="h-5 w-5 fill-current" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-foreground hover:text-primary"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume and expand */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Volume2 className="h-5 w-5" />
            </Button>
            <Slider defaultValue={[70]} max={100} step={1} className="w-24" />
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={onExpand}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
