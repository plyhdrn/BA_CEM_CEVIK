"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ResultLoadingAnimation = ({ className }: { className?: string }) => {
  const rippleVariants = {
    start: {
      opacity: 1,
      scale: 0,
    },
    end: {
      opacity: 0,
      scale: 3,
    },
  };

  const rippleTransition = {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 1,
  };

  return (
    <div className="flex items-center justify-center">
      <div className={cn("relative w-1 h-1", className)}>
        <motion.div
          className="absolute h-full w-full rounded-full bg-blue-500 opacity-0"
          variants={rippleVariants}
          initial="start"
          animate="end"
          transition={rippleTransition}
        ></motion.div>
        <motion.div
          className="absolute h-full w-full rounded-full bg-blue-500 opacity-0"
          variants={rippleVariants}
          initial="start"
          animate="end"
          transition={{ ...rippleTransition, delay: 0.5 }}
        ></motion.div>
        <motion.div
          className="absolute h-full w-full rounded-full bg-blue-500 opacity-0"
          variants={rippleVariants}
          initial="start"
          animate="end"
          transition={{ ...rippleTransition, delay: 1 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ResultLoadingAnimation;
