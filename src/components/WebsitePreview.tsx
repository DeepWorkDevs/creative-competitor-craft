
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface WebsitePreviewProps {
  url: string;
}

const WebsitePreview = ({ url }: WebsitePreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const sanitizedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [url]);
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className="rounded-md overflow-hidden"
    >
      <Card className="bg-black/30 border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/5" />
            <div className="flex space-x-2">
              <Skeleton className="h-3 w-1/4 bg-white/10" />
              <Skeleton className="h-3 w-1/3 bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="aspect-video max-h-[300px] overflow-hidden">
            <div className="p-2 bg-black/40 border-b border-white/10 flex items-center">
              <div className="flex gap-1.5 mr-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
              </div>
              <div className="text-xs text-center w-full pr-12 truncate text-white/70">{sanitizedUrl}</div>
            </div>
            <iframe 
              src={sanitizedUrl}
              title="Website Preview" 
              className="w-full h-[250px] border-none"
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default WebsitePreview;
