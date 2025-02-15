import { motion } from "framer-motion";

interface MotionFadeProps {
  children: React.ReactNode;
  delay?: number;
}

export function MotionFade({ children, delay = 0 }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
