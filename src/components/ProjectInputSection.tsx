
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Link, Text, X, Images } from "lucide-react";
import { motion } from "framer-motion";
import ImageUpload from "@/components/ImageUpload";
import WebsitePreview from "@/components/WebsitePreview";

interface ProjectInputSectionProps {
  onImagesUpload: (images: string[]) => void;
  onWebsiteUrlChange: (url: string) => void;
  onDescriptionChange: (description: string) => void;
}

const ProjectInputSection = ({
  onImagesUpload,
  onWebsiteUrlChange,
  onDescriptionChange
}: ProjectInputSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("images");
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [isScrapingWebsite, setIsScrapingWebsite] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [websitePreviewUrl, setWebsitePreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (image: string) => {
    const newImages = [...projectImages, image];
    setProjectImages(newImages);
    onImagesUpload(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...projectImages];
    newImages.splice(index, 1);
    setProjectImages(newImages);
    onImagesUpload(newImages);
  };

  const handleWebsiteUrlSubmit = async () => {
    if (!websiteUrl) return;
    
    setIsScrapingWebsite(true);
    setWebsitePreviewUrl(websiteUrl);
    onWebsiteUrlChange(websiteUrl);
    
    // In a real implementation, the website scraping would happen here
    // For now, we're just simulating the process
    setTimeout(() => {
      setIsScrapingWebsite(false);
    }, 2000);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProjectDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  return (
    <Card className="glass-morphism overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4 text-gradient">Your Project/Offer</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 gap-2 w-full">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              <span>Images</span>
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>Website URL</span>
            </TabsTrigger>
            <TabsTrigger value="description" className="flex items-center gap-2">
              <Text className="h-4 w-4" />
              <span>Description</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            <div className="space-y-4">
              {projectImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {projectImages.map((img, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-md overflow-hidden group"
                    >
                      <img 
                        src={img} 
                        alt={`Project image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className={projectImages.length ? "pt-2" : ""}>
                <ImageUpload
                  title="Add Project Image"
                  description="Upload logo, screenshots or product images"
                  onImageUpload={handleImageUpload}
                  compact={projectImages.length > 0}
                />
              </div>
              
              {projectImages.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Upload multiple images to better showcase your product/offer
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="website">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="bg-background/50 flex-1"
                />
                <Button 
                  onClick={handleWebsiteUrlSubmit} 
                  disabled={!websiteUrl || isScrapingWebsite}
                  className="bg-pirate-500 hover:bg-pirate-600 text-white"
                >
                  {isScrapingWebsite ? "Scraping..." : "Scrape"}
                </Button>
              </div>
              
              {websitePreviewUrl && (
                <WebsitePreview url={websitePreviewUrl} />
              )}
              
              <p className="text-xs text-muted-foreground">
                We'll analyze your website to better understand your offer
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="description">
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectDescription" className="mb-2 block">Describe your project/offer</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Tell us about your product, service, or offer in detail. What are its unique selling points? Who is your target audience?"
                  value={projectDescription}
                  onChange={handleDescriptionChange}
                  className="bg-background/50 min-h-[150px] resize-none"
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                The more detailed your description, the better we can tailor your ad creative
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default ProjectInputSection;
