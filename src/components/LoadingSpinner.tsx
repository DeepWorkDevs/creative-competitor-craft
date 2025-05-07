
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = ({ message = "Generating your ad creative...", className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-t-2 border-white"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1 left-1 right-1 bottom-1 rounded-full border-t-2 border-mediaglobal-purple opacity-75"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-3 rounded-full bg-black opacity-30" />
      </div>
      
      <motion.p 
        className="mt-6 text-muted-foreground text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>
      
      <motion.div
        className="mt-4 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              repeatDelay: 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
