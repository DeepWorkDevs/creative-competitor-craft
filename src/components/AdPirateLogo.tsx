import { motion } from "framer-motion";
interface AdPirateLogoProps {
  className?: string;
  size?: number; // Add size prop
}
const AdPirateLogo = ({
  className = "",
  size = 40 // Default size
}: AdPirateLogoProps) => {
  return <motion.div className={`flex items-center gap-2 ${className}`} initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5,
    delay: 0.2
  }}>
      <motion.div whileHover={{
      rotate: [0, -10, 10, -10, 0]
    }} transition={{
      duration: 0.5
    }} style={{
      width: `${size / 5}rem`,
      height: `${size / 5}rem`
    }} className="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-${size / 8} w-${size / 8}`}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </motion.div>
      <div className="flex flex-col">
        <span className="tracking-tight text-white font-extrabold text-2xl">AdPirate</span>
        <span className="text-xs text-muted-foreground text-left">Smart Marketers Copy &amp; Paste</span>
      </div>
    </motion.div>;
};
export default AdPirateLogo;