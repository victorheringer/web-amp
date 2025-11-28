import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Song, VideoProvider } from "@/services";
import { extractYouTubeVideoId } from "@/lib/videoUtils";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  play: (song: Song, playlist?: Song[]) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
};

interface PlayerProviderProps {
  children: React.ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Update progress bar every 100ms when playing
  useEffect(() => {
    if (isPlaying && playerRef.current) {
      progressIntervalRef.current = window.setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time);
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const createYouTubePlayer = (videoId: string) => {
    return new Promise((resolve, reject) => {
      if (!window.YT || !window.YT.Player) {
        reject(new Error("YouTube API not loaded"));
        return;
      }

      // Create hidden container if it doesn't exist
      if (!playerContainerRef.current) {
        const container = document.createElement("div");
        container.id = "hidden-audio-player";
        container.style.position = "fixed";
        container.style.top = "-9999px";
        container.style.left = "-9999px";
        container.style.width = "0";
        container.style.height = "0";
        container.style.visibility = "hidden";
        document.body.appendChild(container);
        playerContainerRef.current = container;
      }

      // Destroy existing player
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      // Create new player
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: "0",
        width: "0",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            setIsPlaying(true);
            // Get duration when ready
            const videoDuration = event.target.getDuration();
            setDuration(videoDuration);
            setCurrentTime(0);

            // Set initial volume
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.setVolume(volume);
            }

            resolve(event.target);
          },
          onStateChange: (event: any) => {
            // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            if (event.data === 0) {
              // Video ended
              setIsPlaying(false);
              setCurrentTime(0);
              playNext();
            } else if (event.data === 1) {
              // Playing
              setIsPlaying(true);
            } else if (event.data === 2) {
              // Paused
              setIsPlaying(false);
            }
          },
          onError: (event: any) => {
            console.error("Player error:", event);
            setIsPlaying(false);
            reject(new Error("Player error"));
          },
        },
      });
    });
  };

  const play = async (song: Song, playlist?: Song[]) => {
    try {
      if (playlist) {
        setQueue(playlist);
      }

      setCurrentSong(song);
      setCurrentTime(0);
      setDuration(0);

      if (song.provider === "youtube") {
        const videoId = extractYouTubeVideoId(song.url);
        if (!videoId) {
          console.error("Invalid YouTube URL");
          return;
        }

        await createYouTubePlayer(videoId);
      } else if (song.provider === "soundcloud") {
        // TODO: Implement SoundCloud player
        console.log("SoundCloud playback not implemented yet");
      }
    } catch (error) {
      console.error("Error playing song:", error);
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (playerRef.current && playerRef.current.stopVideo) {
      playerRef.current.stopVideo();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVolume);
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (playerRef.current && playerRef.current.unMute) {
        playerRef.current.unMute();
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (playerRef.current) {
      if (newMutedState) {
        if (playerRef.current.mute) playerRef.current.mute();
      } else {
        if (playerRef.current.unMute) playerRef.current.unMute();
        // Ensure volume is restored
        if (playerRef.current.setVolume) playerRef.current.setVolume(volume);
      }
    }
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;

    let nextSong: Song;

    if (isShuffle) {
      const remainingSongs = queue.filter((s) => s.id !== currentSong.id);
      if (remainingSongs.length === 0) {
        nextSong = currentSong;
      } else {
        const randomIndex = Math.floor(Math.random() * remainingSongs.length);
        nextSong = remainingSongs[randomIndex];
      }
    } else {
      const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % queue.length;
      nextSong = queue[nextIndex];
    }

    play(nextSong);
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;

    let prevSong: Song;

    if (isShuffle) {
      const remainingSongs = queue.filter((s) => s.id !== currentSong.id);
      if (remainingSongs.length === 0) {
        prevSong = currentSong;
      } else {
        const randomIndex = Math.floor(Math.random() * remainingSongs.length);
        prevSong = remainingSongs[randomIndex];
      }
    } else {
      const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      prevSong = queue[prevIndex];
    }

    play(prevSong);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        play,
        pause,
        resume,
        stop,
        seekTo,
        setVolume,
        toggleMute,
        playNext,
        playPrevious,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
