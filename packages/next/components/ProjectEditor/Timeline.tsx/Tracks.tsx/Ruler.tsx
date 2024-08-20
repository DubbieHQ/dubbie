import { audioPlayerStateAtom } from "@/lib/atoms";
import { UPSCALE_FACTOR } from "@/lib/constants";
import { formatSeconds } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

export function Ruler({ numberOfLines }: { numberOfLines: number }) {
  const [mouseDown, setMouseDown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resumeAfterDrag, setResumeAfterDrag] = useState(false);
  const audioTrackState = useAtomValue(audioPlayerStateAtom);
  const { play, pause, isPlaying, seek } = audioTrackState;

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const timelineRect = containerRef.current?.getBoundingClientRect();
      if (!timelineRect) return;
      if (
        event.clientX < timelineRect.left ||
        event.clientX > timelineRect.right ||
        event.clientY < timelineRect.top ||
        event.clientY > timelineRect.bottom
      ) {
        return;
      }
      setMouseDown(true);

      if (isPlaying) {
        setResumeAfterDrag(true);
        pause();
      }
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const clickPositionX = event.clientX - containerRect.left;
        const newTime = clickPositionX / UPSCALE_FACTOR;
        seek(newTime);
      }
    },
    [isPlaying, pause, seek],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (resumeAfterDrag) {
        setResumeAfterDrag(false);
        play();
      }
      setMouseDown(false);
    },
    [resumeAfterDrag, play],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (mouseDown && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const clickPositionX = event.clientX - containerRect.left;
        const newTime = clickPositionX / UPSCALE_FACTOR;
        seek(newTime);
      }
    },
    [mouseDown, seek],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative h-control-height shrink-0 center"
      style={{
        width: `${numberOfLines * 5 * UPSCALE_FACTOR}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {Array.from({ length: numberOfLines }, (_, lineIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={lineIndex}
          className="absolute flex w-0 flex-col items-center gap-0.5"
          style={{
            left: `${lineIndex * 5 * UPSCALE_FACTOR}px`,
            bottom: 0,
            width: 0,
            opacity: lineIndex === 0 ? 0 : 1,
          }}
        >
          <div className="text-sm font-light opacity-40">
            {formatSeconds(lineIndex * 5)}
          </div>

          <div className="h-2 w-px shrink-0 bg-black opacity-10" />
        </div>
      ))}
    </div>
  );
}
