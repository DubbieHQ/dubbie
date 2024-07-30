import { useEffect, useState } from "react";

export const useSegmentFocus = (
  contentRef: React.RefObject<HTMLDivElement>,
) => {
  const [isFocused, setIsFocused] = useState(false);

  // unselect the text when the segment becomes unfocused
  useEffect(() => {
    if (!isFocused) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" ||
        (event.key === "Enter" && (event.metaKey || event.ctrlKey)) ||
        event.key === "Enter"
      ) {
        setIsFocused(false);
        contentRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contentRef, isFocused]);

  return [isFocused, setIsFocused] as const;
};
