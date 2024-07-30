// useSegmentDragging.ts
import { useAtom } from "jotai";
import { segmentAtomFamily } from "@/lib/atoms";
import { DRAG_THRESHOLD, UPSCALE_FACTOR } from "@/lib/constants";
import { updateSegment } from "@/lib/actions/updateSegment";
import { useState, useCallback, useEffect } from "react";

export const useSegmentDragging = (
  segmentId: string,
  disabled: boolean,
  isFocused: boolean,
  isRegeneratingAudio: boolean,
  draggable: boolean,
) => {
  const [segment, setSegment] = useAtom(segmentAtomFamily(segmentId));
  const [mouseDown, setMouseDown] = useState(false);
  const [moveStartX, setMoveStartX] = useState(0);
  const [transformX, setTransformX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isFocused || isRegeneratingAudio || !draggable) return;

      setMouseDown(true);
      setMoveStartX(e.clientX);
      e.preventDefault();
    },
    [disabled, draggable, isFocused, isRegeneratingAudio],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isFocused || !mouseDown) return;
      const newX = e.clientX - moveStartX;

      if (Math.abs(newX) > DRAG_THRESHOLD) {
        setTransformX(newX);
        setIsDragging(true);
      }
    },
    [isFocused, mouseDown, moveStartX],
  );

  const handleMouseUp = useCallback(() => {
    if (!segment) return;
    setMouseDown(false);

    if (isDragging) {
      const adjustedStartTime = Math.max(
        0,
        segment.startTime + transformX / UPSCALE_FACTOR,
      );
      const timeShift = adjustedStartTime - segment.startTime;

      console.log("hihihih");
      setSegment((prevSegment) => ({
        ...prevSegment,
        startTime: adjustedStartTime,
        endTime: prevSegment.endTime + timeShift,
      }));

      updateSegment(segment.id, {
        ...segment,
        startTime: adjustedStartTime,
        endTime: segment.endTime + timeShift,
      });
      setTransformX(0);
      setIsDragging(false);
    }
  }, [isDragging, segment, setSegment, transformX]);

  useEffect(() => {
    if (disabled) return;

    if (mouseDown) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (mouseDown) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [disabled, mouseDown, handleMouseMove, handleMouseUp]);

  return {
    mouseDown,
    handleMouseDown,
    transformX,
    isDragging,
  };
};
