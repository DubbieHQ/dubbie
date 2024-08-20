import { useAtomValue } from "jotai";
import { useEffect, useCallback } from "react";
import { audioPlayerStateAtom } from "../atoms";

export function useKeyboardShortcuts() {
  const { isPlaying, play, pause, seek, currentTime } =
    useAtomValue(audioPlayerStateAtom);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the target is a writable element
      const target = event.target as HTMLElement;
      const isWritable =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (!isWritable) {
        switch (event.code) {
          case "Space":
            event.preventDefault(); // Prevent the default action of the spacebar
            isPlaying ? pause() : play();
            break;
          case "ArrowLeft":
            event.preventDefault();
            seek(Math.max(0, currentTime - 3)); // Skip backwards 3 seconds
            break;
          case "ArrowRight":
            event.preventDefault();
            seek(currentTime + 3); // Skip forward 3 seconds
            break;
        }
      }
    },
    [isPlaying, play, pause, seek, currentTime],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
