import { X, Maximize2, Minimize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { extractYouTubeVideoId } from "@/lib/videoUtils";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { currentSong, currentTime, seekTo, resume } = usePlayer();
  const playerRef = useRef<any>(null);
  const [containerDiv, setContainerDiv] = useState<HTMLDivElement | null>(null);

  const videoId = currentSong ? extractYouTubeVideoId(currentSong.url) : null;

  useEffect(() => {
    if (isOpen && videoId && containerDiv) {
      // Initialize player
      const initPlayer = () => {
        if (!(window as any).YT) return;

        // If player already exists, destroy it first
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new (window as any).YT.Player(containerDiv, {
          height: "100%",
          width: "100%",
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            start: Math.floor(currentTime),
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onStateChange: (event: any) => {
              // 0 = ended
              if (event.data === 0) {
                handleClose();
              }
            },
          },
        });
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initPlayer();
      } else {
        const interval = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            initPlayer();
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player", e);
        }
        playerRef.current = null;
      }
    };
  }, [isOpen, videoId, containerDiv]);

  const handleClose = () => {
    if (
      playerRef.current &&
      typeof playerRef.current.getCurrentTime === "function"
    ) {
      try {
        const time = playerRef.current.getCurrentTime();
        seekTo(time);
        resume();
      } catch (e) {
        console.error("Error getting time from player", e);
        resume();
      }
    } else {
      resume();
    }
    onClose();
  };

  if (!currentSong) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={`${
          isFullscreen ? "max-w-full h-screen" : "max-w-4xl"
        } bg-background border-border p-0 [&>button]:hidden`}
      >
        <div className="relative w-full h-full flex flex-col">
          {/* Video container */}
          <div
            className={`bg-black ${isFullscreen ? "flex-1" : "aspect-video"}`}
          >
            <div ref={setContainerDiv} className="w-full h-full" />
          </div>

          {/* Controls overlay */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 flex items-center justify-between pointer-events-none">
            <h2 className="text-lg font-semibold text-white truncate pr-4">
              {currentSong.title} - {currentSong.artist}
            </h2>
            <div className="flex gap-2 pointer-events-auto">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Video info */}
          {!isFullscreen && (
            <div className="p-6 bg-card">
              <h3 className="font-semibold text-lg mb-2">Sobre este vídeo</h3>
              <p className="text-sm text-muted-foreground">
                {currentSong.provider === "youtube"
                  ? "Reproduzindo via YouTube"
                  : "Provedor desconhecido"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
