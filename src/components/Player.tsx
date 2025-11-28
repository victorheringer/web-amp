import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";

interface PlayerProps {
  onExpand: () => void;
}

const Player = ({ onExpand }: PlayerProps) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    pause,
    resume,
    seekTo,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const handleExpand = () => {
    if (isPlaying) {
      pause();
    }
    onExpand();
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-player border-t border-border backdrop-blur-lg">
      <div className="px-4 py-3">
        {/* Progress bar */}
        <div className="mb-2">
          <div
            className={`h-1 bg-secondary rounded-full relative ${
              currentSong ? "cursor-pointer group" : "cursor-default"
            }`}
            onClick={currentSong ? handleProgressClick : undefined}
          >
            <div
              className="h-full bg-primary rounded-full transition-all group-hover:bg-primary/80"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Current track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-14 h-14 bg-gradient-card rounded overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted">
              {currentSong ? (
                <img
                  src={
                    currentSong.thumbnail ||
                    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
                  }
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">WebAmp</span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm truncate">
                {currentSong ? currentSong.title : "Nenhuma música selecionada"}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong
                  ? currentSong.artist
                  : "Escolha uma música para tocar"}
              </p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className={`text-muted-foreground hover:text-foreground ${
                isShuffle ? "text-primary" : ""
              }`}
              onClick={toggleShuffle}
              disabled={!currentSong}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-foreground hover:text-white"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 bg-primary hover:bg-primary-glow rounded-full shadow-glow"
              onClick={handlePlayPause}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-foreground hover:text-white"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`text-muted-foreground hover:text-foreground ${
                isRepeat ? "text-primary" : ""
              }`}
              onClick={toggleRepeat}
              disabled={!currentSong}
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
              onClick={toggleMute}
              disabled={!currentSong}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={(value) => setVolume(value[0])}
              disabled={!currentSong}
            />
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={handleExpand}
              disabled={!currentSong}
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
