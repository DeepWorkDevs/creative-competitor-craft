
import { motion } from "framer-motion";

interface AdPirateLogoProps {
  className?: string;
}

const AdPirateLogo = ({ className = "" }: AdPirateLogoProps) => {
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div 
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pirate-500 to-pirate-700"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-5 w-5 text-white"
        >
          <path d="m22 9-10 13L2 9l10-5 10 5Z" />
          <path d="M6 12v5c0 1 1 2 2 2h8c1 0 2-1 2-2v-5" />
        </svg>
      </motion.div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight text-gradient">AdPirate</span>
        <span className="text-xs text-muted-foreground">Convert Your Competitors</span>
      </div>
    </motion.div>
  );
};

export default AdPirateLogo;
