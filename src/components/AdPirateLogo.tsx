
import { motion } from "framer-motion";

interface AdPirateLogoProps {
  className?: string;
  size?: number;
}

const AdPirateLogo = ({
  className = "",
  size = 40
}: AdPirateLogoProps) => {
  const iconSize = size / 5;
  const textSizeClass = size >= 60 ? "text-3xl" : "text-2xl";
  
  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }}
        className="flex items-center justify-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ width: '100%', height: '100%' }}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </motion.div>
      <div className="flex flex-col">
        <span className={`tracking-tight text-white font-extrabold ${textSizeClass}`}>AdPirate</span>
        <span className="text-xs text-muted-foreground text-left">Smart Marketers Copy &amp; Paste</span>
      </div>
    </motion.div>
  );
};

export default AdPirateLogo;
