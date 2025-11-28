import { useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { settingsService } from "@/services";

export const useKeyboardShortcuts = () => {
  const {
    isPlaying,
    pause,
    resume,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const shortcuts = settingsService.getShortcuts();

      switch (event.key) {
        case shortcuts.playPause:
          event.preventDefault();
          if (isPlaying) {
            pause();
          } else {
            resume();
          }
          break;
        case shortcuts.next:
          event.preventDefault();
          playNext();
          break;
        case shortcuts.previous:
          event.preventDefault();
          playPrevious();
          break;
        case shortcuts.shuffle:
          event.preventDefault();
          toggleShuffle();
          break;
        case shortcuts.repeat:
          event.preventDefault();
          toggleRepeat();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isPlaying,
    pause,
    resume,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
  ]);
};
