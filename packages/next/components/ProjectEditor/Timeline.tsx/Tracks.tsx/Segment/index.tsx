import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { segmentAtomFamily } from "@/lib/atoms";
import { PLACEHOLDER_TEXT, UPSCALE_FACTOR, styles } from "@/lib/constants";
import { Spinner } from "@/components/ui/Spinner";
import { useSegmentDragging } from "@/lib/hooks/useSegmentDragging";
import { useSegmentFocus } from "@/lib/hooks/useSegmentFocus";
import { useSegmentRegenerate } from "@/lib/hooks/useSegmentRegenerate";
import { cn } from "@/lib/utils";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import { MemoizedSegmentMoreOptionsButton } from "./SegmentMoreOptionsButton";

interface SegmentContentProps {
  segmentId: string;
  editable: boolean;
  isTrackDisabled: boolean;
  isTranslatedSegment: boolean;
}

const Segment = ({
  segmentId,
  editable,
  isTrackDisabled,
  isTranslatedSegment,
}: SegmentContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const segment = useAtomValue(segmentAtomFamily(segmentId));
  const [currentText, setCurrentText] = useState(segment?.text);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useSegmentFocus(contentRef);
  const { regenerateAudio, isRegeneratingAudio } =
    useSegmentRegenerate(segmentId);

  const { handleMouseDown, transformX, isDragging } = useSegmentDragging(
    segmentId,
    isTrackDisabled,
    isFocused,
    isRegeneratingAudio,
    isTranslatedSegment,
  );

  const isTextChanged = segment?.text !== currentText;
  const handleInput = useCallback(() => {
    if (contentRef.current) {
      const newText = contentRef.current.textContent || "";
      setCurrentText(newText);
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const plainText = text.replace(/\s+/g, " ").trim();
    document.execCommand("insertText", false, plainText);
  }, []);

  // This is for when a new segment is created, we want to auto focus and select the text
  // so the user can start typing right away
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const isNewSegment =
      !isFocused &&
      segment?.text === PLACEHOLDER_TEXT &&
      contentRef.current &&
      (Date.now() - new Date(segment.createdAt).getTime()) / 1000 < 5;

    if (isNewSegment) {
      contentRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      //below is a hack
      //explanation:
      //issue: if we create a new segment using drop down menu, the text selects, but the focus does not retain
      //reason: the focus is lost when the dropdown menu is closed
      //solution: we add a delay of 200ms to focus the text again
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
        }
      }, 200);
    }
  }, []);

  // This handle mouse up is so that the user can focus on the exact position of the click.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) return;
      // The implementation is complex due to the limitations and inconsistencies of browser APIs.
      // Some APIs are deprecated, while others are not universally supported.
      if (!isFocused && contentRef.current) {
        let range: Range | CaretPosition | null = null;

        if (document.caretRangeFromPoint) {
          range = document.caretRangeFromPoint(e.clientX, e.clientY);
        } else {
          range =
            document.caretPositionFromPoint?.(e.clientX, e.clientY) || null;
        }

        const selection = window.getSelection();
        if (range && selection) {
          selection.removeAllRanges();
          if (range instanceof Range) {
            selection.addRange(range);
          } else if (range.offsetNode) {
            const newRange = document.createRange();
            newRange.setStart(range.offsetNode, range.offset);
            newRange.collapse(true);
            selection.addRange(newRange);
          }
          contentRef.current.focus();
        }
      }
    },
    [isFocused, contentRef, isDragging],
  );

  if (!segment || !segment.text) return null;

  return (
    <ContextMenuWrapper
      segmentId={segment.id}
      onVoiceSelected={(voice) => {
        if (currentText) {
          regenerateAudio(currentText, voice);
        }
      }}
      isTranslatedSegment={isTranslatedSegment}
    >
      <motion.div
        className={cn("absolute", {
          "z-0": segment.audioUrl, //default
          "z-10": !segment.audioUrl, // means new empty segment
          "z-30": isHovering, // hovering
          "z-40": isFocused, // focused
          "z-50": isDragging, // dragging
        })}
        style={{
          left: segment.startTime * UPSCALE_FACTOR,
        }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        animate={{
          x: transformX,
        }}
        transition={{
          x: { duration: 0 },
        }}
      >
        <motion.div
          className={cn(
            "justify-between text-ellipsis rounded-xl border bg-btn px-3 py-2 text-sm outline-none",
            {
              "cursor-pointer transition-brightness duration-200 hover:z-30 hover:brightness-[0.97]":
                editable,
              "cursor-text border-neutral-500 brightness-[0.97]": isFocused,
              "cursor-not-allowed": isRegeneratingAudio || !isTranslatedSegment,
            },
          )}
          style={{
            scrollbarColor: "rgba(0,0,0,0.2) transparent",
            opacity: isTrackDisabled ? 0.4 : 1,
            maxHeight: styles.trackHeight - 8 * 2, // Subtract 8 pixels for the top and bottom padding
            overflow: "auto",
          }}
          initial={{
            width: (segment.endTime - segment.startTime) * UPSCALE_FACTOR - 5,
          }}
          animate={{
            width: (segment.endTime - segment.startTime) * UPSCALE_FACTOR - 5,
            boxShadow:
              isDragging || isFocused
                ? "0px 2px 16px rgba(0, 0, 0, 0.07)"
                : "none",
          }}
          transition={{
            scale: { duration: 0.3, ease: "easeInOut" },
            width: { duration: 0.4, ease: "easeOut" },
            boxShadow: { duration: 0.2, ease: "easeOut" },
          }}
          key={segment.id}
          ref={contentRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          suppressContentEditableWarning={true}
          contentEditable={editable && !isRegeneratingAudio}
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            if (isTextChanged) {
              regenerateAudio(currentText || "");
            }
          }}
        >
          {segment.text}

          {isRegeneratingAudio && (
            <div className="absolute left-0 top-0 h-full w-full rounded-xl bg-black bg-opacity-5 backdrop-blur-sm center">
              <Spinner size="small" />
            </div>
          )}
        </motion.div>

        <MemoizedSegmentMoreOptionsButton
          contentRef={contentRef}
          isHovering={isHovering}
          isFocused={isFocused}
          isDisabled={isTrackDisabled}
          isTranslatedSegment={isTranslatedSegment}
        />
      </motion.div>
    </ContextMenuWrapper>
  );
};

export const MemoizedSegment = React.memo(Segment);
