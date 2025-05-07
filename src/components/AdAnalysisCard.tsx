
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AdAnalysisCardProps {
  analysis: string;
}

const AdAnalysisCard = ({ analysis }: AdAnalysisCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="glass-morphism overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gradient">AI Marketing Analysis</h3>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-muted-foreground"
            >
              {isExpanded ? (
                <div>{analysis}</div>
              ) : (
                <div>{analysis.slice(0, 150)}...</div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpand}
            className="mt-2 text-pirate-400 hover:text-pirate-300 p-0"
          >
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default AdAnalysisCard;
