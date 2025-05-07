
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

interface GenerationResultProps {
  imageUrl: string;
  onReset: () => void;
}

const GenerationResult = ({ imageUrl, onReset }: GenerationResultProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadImage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "adpirate-creative.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <Card className="p-4 glass-morphism h-full flex flex-col">
        <h3 className="text-xl font-semibold mb-4 text-gradient">Your Ad Creative</h3>
        
        <div className="relative flex-1 overflow-hidden rounded-md">
          <img
            src={imageUrl}
            alt="Generated Ad Creative"
            className="w-full h-full object-contain"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="backdrop-blur-md bg-black/50 border border-white/10 hover:bg-black/70"
            >
              Create Another
            </Button>
            
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                variant="default"
                onClick={downloadImage} 
                disabled={isLoading}
                className="bg-pirate-500 hover:bg-pirate-600"
              >
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "Downloading..." : "Download"}
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GenerationResult;
