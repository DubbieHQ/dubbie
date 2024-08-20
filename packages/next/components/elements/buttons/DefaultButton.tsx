"use client";

import { motion } from "framer-motion";
import React, { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  size?: "small" | "medium";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "secondaryStronger";
}

const variants = {
  hover: {
    scale: 1.02,
  },
  pressed: {
    scale: 1,
    opacity: 0.8,
  },
};
const MotionLink = motion(Link);

export const Button = forwardRef<HTMLDivElement, ButtonProps>(
  (
    {
      href,
      className,
      children,
      onClick,
      size = "medium",
      disabled = false,
      variant = "primary",
    },
    ref,
  ) => {
    const router = useRouter();
    const button = cva(["center select-none rounded-xl font-medium"], {
      variants: {
        size: {
          small: "px-4 h-9",
          medium: "px-5 h-10",
        },
        disabled: {
          true: "cursor-not-allowed opacity-30",
          false: "cursor-pointer",
        },
        variant: {
          primary: "bg-black text-white shadow-c",
          secondary:
            "bg-transparent border border-black border-opacity-20 text-black shadow-none text-opacity-50",
          secondaryStronger:
            "bg-transparent border border-black border-opacity-70 text-black shadow-none text-opacity-90",
        },
      },
      defaultVariants: {
        size: "medium",
        disabled: false,
        variant: "primary",
      },
    });

    const handleClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
      if (!disabled) {
        if (onClick) {
          onClick(event);
        }
        if (href) {
          router.push(href);
        }
      }
    };

    const buttonClasses = cn(button({ size, disabled, variant, className }));

    if (href && !disabled) {
      return (
        <MotionLink
          className={buttonClasses}
          variants={variants}
          whileHover={!disabled ? "hover" : undefined}
          whileTap={!disabled ? "pressed" : undefined}
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </MotionLink>
      );
    }

    return (
      <motion.div
        className={buttonClasses}
        variants={variants}
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "pressed" : undefined}
        onClick={handleClick}
        ref={ref}
      >
        {children}
      </motion.div>
    );
  },
);

Button.displayName = "Button";
