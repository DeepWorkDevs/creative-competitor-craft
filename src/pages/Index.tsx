
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ApiKeyInput from "@/components/ApiKeyInput";
import ImageUpload from "@/components/ImageUpload";
import LoadingSpinner from "@/components/LoadingSpinner";
import GenerationResult from "@/components/GenerationResult";
import AdPirateLogo from "@/components/AdPirateLogo";
import AdAnalysisCard from "@/components/AdAnalysisCard";
import { OpenAIService } from "@/services/openai";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [competitorImage, setCompetitorImage] = useState<string | null>(null);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedKey = localStorage.getItem("openai_api_key");
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openai_api_key", key);
  };

  const handleGenerate = async () => {
    if (!apiKey || !competitorImage || !projectImage) {
      toast.error("Please upload both competitor and project images");
      return;
    }

    try {
      setIsGenerating(true);
      const openai = new OpenAIService(apiKey);
      
      // First generate the analysis
      setIsAnalyzing(true);
      const analysisResult = await openai.analyzeImages(competitorImage, projectImage);
      setAnalysis(analysisResult);
      setIsAnalyzing(false);
      
      // Then generate the image
      const imageUrl = await openai.generateAdCreative(competitorImage, projectImage, customPrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setCompetitorImage(null);
    setProjectImage(null);
    setGeneratedImageUrl(null);
    setAnalysis(null);
    setCustomPrompt("");
  };

  if (!apiKey) {
    return <ApiKeyInput onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <header className="p-4 sm:p-6 sticky top-0 z-10 backdrop-blur bg-background/80 border-b border-white/10">
        <div className="container max-w-7xl flex justify-between items-center">
          <AdPirateLogo />
          
          {generatedImageUrl && (
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="bg-transparent border border-white/10 hover:bg-white/5"
            >
              New Ad
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 py-8">
        {!generatedImageUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 text-gradient">
                Transform Competitors Into Customers
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload a competitor's screenshot and your project image to generate 
                a compelling ad creative that will convert their users into yours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ImageUpload
                title="Competitor's App/Product"
                description="Upload a screenshot of your competitor's app or product"
                onImageUpload={setCompetitorImage}
              />
              
              <ImageUpload
                title="Your Project/Offer"
                description="Upload an image of your project or offer"
                onImageUpload={setProjectImage}
              />
            </div>
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Label htmlFor="customPrompt">Custom Instructions (Optional)</Label>
              <Textarea
                id="customPrompt"
                placeholder="Add specific instructions for your ad creative (e.g., highlight unique features, target specific audience, include specific messaging)"
                className="mt-2 bg-background/50 resize-none"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </motion.div>
            
            {isGenerating ? (
              <div className="flex justify-center py-10">
                {isAnalyzing ? (
                  <LoadingSpinner message="Analyzing images and creating marketing strategy..." />
                ) : (
                  <LoadingSpinner message="Generating your ad creative..." />
                )}
              </div>
            ) : (
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!competitorImage || !projectImage}
                  className="bg-pirate-500 hover:bg-pirate-600 text-white font-medium px-8"
                >
                  Generate Ad Creative
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GenerationResult 
                imageUrl={generatedImageUrl} 
                onReset={resetForm} 
              />
            </div>
            
            <div className="space-y-6">
              {analysis && <AdAnalysisCard analysis={analysis} />}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-4 rounded-lg glass-morphism"
              >
                <h3 className="font-medium mb-2 text-gradient">Your Prompt</h3>
                <p className="text-sm text-muted-foreground">
                  {customPrompt || "Default prompt was used to generate this ad creative."}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="w-full bg-transparent border border-white/10 hover:bg-white/5"
                >
                  Create Another Ad
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-auto pt-8 pb-4 text-center text-sm text-muted-foreground">
        <p>AdPirate © {new Date().getFullYear()} • Powered by OpenAI</p>
      </footer>
    </div>
  );
};

export default Index;
