"use client";

import {
  activeTracksAtom,
  translatedTrackSegmentsAtom,
  originalTrackSegmentsAtom,
  audioPlayerCurrentTimeAtom,
  containerScrollLeftAtom,
} from "@/lib/atoms";
import { useAtom, useAtomValue } from "jotai";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { Line } from "../../../elements/Line";
import { Scrubber } from "./Scrubber";
import { Ruler } from "./Ruler";
import { Segment } from "@dubbie/db";
import { UPSCALE_FACTOR } from "@/lib/constants";
import { MemoizedSegment } from "./Segment";

export function Tracks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerScrollLeft, setContainerScrollLeft] = useAtom(
    containerScrollLeftAtom,
  );
  const activeTracks = useAtomValue(activeTracksAtom);
  const translatedSegments = useAtomValue(translatedTrackSegmentsAtom);
  const originalSegments = useAtomValue(originalTrackSegmentsAtom);
  const audioCurrentTime = useAtomValue(audioPlayerCurrentTimeAtom);

  // Replace useEffect with useLayoutEffect for faster execution
  useLayoutEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.scrollWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  const finalSegmentEndTime = Math.max(
    ...originalSegments.map((segment) => segment.endTime),
    ...translatedSegments.map((segment) => segment.endTime),
  );

  const numberOfLines = Math.ceil(finalSegmentEndTime / 5);

  const isSegmentInView = useCallback(
    (segment: Segment) => {
      if (!containerWidth) return false;
      const segmentStart = segment.startTime * UPSCALE_FACTOR;
      const segmentEnd = segment.endTime * UPSCALE_FACTOR;
      const viewStart = containerScrollLeft - 100;
      const viewEnd = containerScrollLeft + window.innerWidth + 100;
      return segmentEnd >= viewStart && segmentStart <= viewEnd;
    },
    [containerScrollLeft, containerWidth],
  );

  return (
    <div
      className="tracks relative flex h-full w-full grow-0 flex-col overflow-y-hidden overflow-x-scroll outline-none"
      style={{
        overscrollBehaviorX: "contain",
        userSelect: "none", // Prevent text selection during drag
      }}
      ref={containerRef}
      onScroll={(e) =>
        setContainerScrollLeft((e.target as HTMLDivElement).scrollLeft)
      }
    >
      <Scrubber currentTime={audioCurrentTime} />
      <Ruler numberOfLines={numberOfLines} />
      <Line style={{ width: containerWidth }} />
      <div className="relative h-track-height grow-0 py-2">
        {originalSegments.filter(isSegmentInView).map((segment) => (
          <MemoizedSegment
            segmentId={segment.id}
            key={segment.id}
            editable={false}
            isTranslatedSegment={false}
            isTrackDisabled={!activeTracks.original}
          />
        ))}
      </div>
      <Line style={{ width: containerWidth }} />
      <div className="relative h-track-height grow-0 py-2">
        {translatedSegments.filter(isSegmentInView).map((segment) => (
          <MemoizedSegment
            segmentId={segment.id}
            editable={true}
            key={segment.id}
            isTranslatedSegment={true}
            isTrackDisabled={!activeTracks.target}
          />
        ))}
      </div>
    </div>
  );
}
