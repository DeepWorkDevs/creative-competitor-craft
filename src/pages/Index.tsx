
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import LoadingSpinner from "@/components/LoadingSpinner";
import GenerationResult from "@/components/GenerationResult";
import AdPirateLogo from "@/components/AdPirateLogo";
import AdAnalysisCard from "@/components/AdAnalysisCard";
import ProjectInputSection from "@/components/ProjectInputSection";
import { OpenAIService } from "@/services/openai";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Index = () => {
  const [competitorImage, setCompetitorImage] = useState<string | null>(null);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [projectWebsiteUrl, setProjectWebsiteUrl] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentInputMethod, setCurrentInputMethod] = useState<string>("images");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    // Prevent default form submission behavior which can cause page refresh
    e.preventDefault();

    // Reset error state
    setError(null);

    // Validate that we have a competitor image and at least one input for the project
    if (!competitorImage) {
      toast.error("Please upload a competitor image");
      return;
    }
    const hasProjectData = projectImages && projectImages.length > 0 || projectWebsiteUrl || projectDescription;
    if (!hasProjectData) {
      toast.error("Please provide information about your project/offer");
      return;
    }
    try {
      console.log("Starting generation process...");
      setIsGenerating(true);
      const openai = new OpenAIService(); // No need to pass API key

      // First generate the analysis
      setIsAnalyzing(true);

      // Create a project data object with all available inputs
      const projectData = {
        images: projectImages.length > 0 ? projectImages : undefined,
        websiteUrl: projectWebsiteUrl || undefined,
        description: projectDescription || undefined
      };
      console.log("Project data:", projectData);

      // Get analysis (with error handling built into the service)
      const analysisResult = await openai.analyzeImagesAndCreateStrategy(competitorImage, projectData).catch(error => {
        console.error("Analysis failed but continuing:", error);
        return "Analysis could not be completed, but we'll still generate your ad creative.";
      });
      setAnalysis(analysisResult);
      setIsAnalyzing(false);

      // Then generate the image (with error handling built into the service)
      console.log("Starting image generation...");
      const imageUrl = await openai.generateAdCreative(competitorImage, projectData, customPrompt);
      console.log("Image generated successfully:", imageUrl);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating content:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setCompetitorImage(null);
    setProjectImages([]);
    setProjectWebsiteUrl("");
    setProjectDescription("");
    setGeneratedImageUrl(null);
    setAnalysis(null);
    setCustomPrompt("");
    setCurrentInputMethod("images");
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 py-8">
        {!generatedImageUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                Transform Competitors Into Customers
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload a competitor's screenshot and provide details about your project 
                to generate a compelling ad creative that will convert their users into yours.
              </p>
            </div>
            
            <form onSubmit={handleGenerate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card-gradient rounded-xl p-6">
                  <ImageUpload 
                    title="Competitor's App/Product" 
                    description="Upload a screenshot of your competitor's app or product" 
                    onImageUpload={setCompetitorImage}
                  />
                </div>
                
                <div className="card-gradient rounded-xl p-6">
                  <ProjectInputSection 
                    onImagesUpload={setProjectImages} 
                    onWebsiteUrlChange={setProjectWebsiteUrl} 
                    onDescriptionChange={setProjectDescription} 
                  />
                </div>
              </div>
              
              <motion.div 
                className="mb-8 card-gradient rounded-xl p-6" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Label htmlFor="customPrompt">Custom Instructions (Optional)</Label>
                <Textarea 
                  id="customPrompt" 
                  placeholder="Add specific instructions for your ad creative (e.g., highlight unique features, target specific audience, include specific messaging)" 
                  className="mt-2 bg-black/30 border-white/10 resize-none" 
                  value={customPrompt} 
                  onChange={e => setCustomPrompt(e.target.value)} 
                />
              </motion.div>
              
              {error && (
                <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
              
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
                    type="submit" 
                    size="lg" 
                    disabled={!competitorImage || (!projectImages.length && !projectWebsiteUrl && !projectDescription)} 
                    className="font-medium px-8"
                  >
                    Generate Ad Creative
                  </Button>
                </motion.div>
              )}
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GenerationResult imageUrl={generatedImageUrl} onReset={resetForm} />
            </div>
            
            <div className="space-y-6">
              {analysis && <AdAnalysisCard analysis={analysis} />}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.2 }} 
                className="p-4 rounded-lg card-gradient"
              >
                <h3 className="font-medium mb-2 text-gradient">Your Input</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  {projectImages.length > 0 && (
                    <p>{projectImages.length} image{projectImages.length > 1 ? 's' : ''} uploaded</p>
                  )}
                  
                  {projectWebsiteUrl && <p>Website: {projectWebsiteUrl}</p>}
                  
                  {projectDescription && <p>Description provided</p>}
                  
                  {customPrompt && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="font-medium text-white/80">Custom instructions:</p>
                      <p className="italic">{customPrompt}</p>
                    </div>
                  )}
                </div>
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
        <p>MediaGlobe © {new Date().getFullYear()} • Powered by OpenAI</p>
      </footer>
    </div>
  );
};

export default Index;
