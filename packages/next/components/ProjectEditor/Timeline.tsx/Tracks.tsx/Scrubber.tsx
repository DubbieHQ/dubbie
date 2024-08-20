import { UPSCALE_FACTOR } from "@/lib/constants";
import { SmallDownTriangleIcon } from "../../../icons/SmallDownTriangleIcon";
import { motion } from "framer-motion";

export const Scrubber = ({ currentTime }: { currentTime: number }) => {
  const leftPosition = currentTime * UPSCALE_FACTOR;
  const opacity = leftPosition <= 0 ? 0.4 : 0.8;

  return (
    <motion.div
      className="absolute bottom-0 top-control-height z-0 w-[1px] "
      style={{
        left: `${leftPosition}px`,
      }}
      animate={{
        backgroundColor: leftPosition <= 0 ? "#00000000" : "#00000050",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "-10px",
        }}
        animate={{ opacity }}
      >
        <SmallDownTriangleIcon size={12} />
      </motion.div>
    </motion.div>
  );
};
