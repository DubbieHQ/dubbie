"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarButtonProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  icon,
  children,
  onClick,
  className = "",
  style = {},
}) => {
  const variants = {
    hover: {
      filter: "brightness(0.95)",
    },
    pressed: {
      scale: 0.98,
    },
  };

  const buttonClassName = cn(
    "flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 bg-default",
    className,
  );

  return (
    <motion.div
      className={buttonClassName}
      onClick={onClick}
      variants={variants}
      whileHover="hover"
      whileTap="pressed"
      style={style}
    >
      {icon}
      {children}
    </motion.div>
  );
};
