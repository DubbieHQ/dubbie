import { MoreVerticalIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface SegmentMoreOptionsButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  isHovering: boolean;
  isFocused: boolean;
  isDisabled: boolean;
  isTranslatedSegment: boolean;
}

const SegmentMoreOptionsButton = ({
  contentRef,
  isHovering,
  isFocused,
  isDisabled,
  isTranslatedSegment,
}: SegmentMoreOptionsButtonProps) => {
  return (
    <AnimatePresence>
      {(isHovering || isFocused) && !isDisabled && isTranslatedSegment && (
        <motion.div
          className="duration-400 absolute -right-3.5 -top-3.5 h-7 w-7
          cursor-pointer rounded-full border border-btn
          bg-btn shadow-b transition-all center
          hover:scale-[0.98] hover:brightness-[0.97]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            e.preventDefault();
            const trigger = contentRef.current;
            if (trigger) {
              trigger.dispatchEvent(
                new MouseEvent("contextmenu", {
                  bubbles: true,
                  clientX: e.currentTarget.getBoundingClientRect().x,
                  clientY: e.currentTarget.getBoundingClientRect().y,
                }),
              );
            }
          }}
        >
          <MoreVerticalIcon size={16} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MemoizedSegmentMoreOptionsButton = React.memo(
  SegmentMoreOptionsButton,
);
