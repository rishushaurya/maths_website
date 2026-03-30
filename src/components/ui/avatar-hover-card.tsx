"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useState } from "react";

export interface NativeHoverCardProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  username?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonContent?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "glass" | "bordered";
}

const imageSizeVariants = {
  sm: "w-20 h-20 md:w-24 md:h-24",
  md: "w-28 h-28 md:w-32 md:h-32",
  lg: "w-40 h-40 md:w-48 md:h-48",
  xl: "w-56 h-56 md:w-64 md:h-64",
};

const cardWidthVariants = {
  sm: "w-56",
  md: "w-72",
  lg: "w-80",
  xl: "w-96",
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function AvatarHoverCard({
  imageSrc,
  imageAlt,
  name,
  username,
  description,
  buttonText = "View Profile",
  onButtonClick,
  buttonContent,
  size = "md",
  className,
  variant = "default",
}: NativeHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case "glass":
        return "backdrop-blur-md";
      case "bordered":
        return "border-2";
      default:
        return "border";
    }
  };

  const avatarElement = (
    <Avatar className="w-full h-full">
      <AvatarImage
        src={imageSrc || "/placeholder.svg"}
        alt={imageAlt || name}
      />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        width: isHovered ? "auto" : "fit-content",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div
        className={cn(
          "relative rounded-full cursor-pointer transition-transform hover:scale-105 duration-300",
          imageSizeVariants[size]
        )}
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {avatarElement}
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-0 left-0 rounded-none shadow-lg overflow-hidden z-[50]",
              cardWidthVariants[size],
              getVariantStyles()
            )}
            style={{ 
              pointerEvents: "auto", 
              background: 'var(--card-bg)', 
              borderColor: 'var(--border)' 
            }}
          >
            <div className="relative">
              <motion.div
                className={cn("relative p-2", imageSizeVariants[size])}
              >
                {avatarElement}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                transition={{
                  delay: 0.1,
                  duration: 0.2,
                }}
                className="p-4 space-y-3"
              >
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-lg font-bold leading-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {name}
                  </motion.h3>

                  {username && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 }}
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      @{username}
                    </motion.p>
                  )}
                </div>

                {description && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{ color: 'var(--text-primary)', opacity: 0.8 }}
                  >
                    {description}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {buttonContent ? (
                    buttonContent
                  ) : (
                    <Button
                      onClick={onButtonClick}
                      size="sm"
                      className="w-full relative z-[60]"
                    >
                      {buttonText}
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
