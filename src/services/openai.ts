
import { toast } from "sonner";

const API_URL = "https://api.openai.com/v1";
const MODEL = "gpt-4o"; // Using GPT-4o for vision capabilities

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey?: string) {
    // First try using the provided API key
    // Then try localStorage
    // Then try the environment variable
    const storedApiKey = localStorage.getItem("openaiApiKey");
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
    
    this.apiKey = apiKey || storedApiKey || envApiKey;
    
    if (!this.apiKey) {
      console.warn("No API key provided to OpenAIService");
      throw new Error("No API key provided. Please add your OpenAI API key to continue.");
    }
    
    // Validate API key format
    if (!this.validateApiKey(this.apiKey)) {
      console.error("Invalid API key format provided to OpenAIService");
      throw new Error("Invalid API key format. OpenAI API keys start with 'sk-' followed by 48 characters.");
    }
  }
  
  private validateApiKey(key: string): boolean {
    // OpenAI API keys typically start with 'sk-' and are 51 characters long
    return /^sk-[A-Za-z0-9]{48}$/.test(key);
  }

  async generateAdCreative(
    competitorImage: string, 
    projectData: {
      images?: string[];
      websiteUrl?: string;
      description?: string;
    }, 
    prompt: string
  ) {
    try {
      console.log("Starting ad creative generation...");
      
      // Validate the API key before making the request
      if (!this.apiKey) {
        throw new Error("No API key provided. Please add your OpenAI API key to continue.");
      }
      
      if (!this.validateApiKey(this.apiKey)) {
        throw new Error("Invalid API key format. OpenAI API keys start with 'sk-' followed by 48 characters.");
      }
      
      // Build a structured prompt based on the improved template
      let structuredPrompt = "=== Ad Creative Clone Request ===\n\n";
      
      // Reference Assets section
      structuredPrompt += "Reference Assets:\n";
      structuredPrompt += "  • STYLE_REF_IMAGE: attached competitor ad image\n";
      if (projectData.images && projectData.images.length > 0) {
        structuredPrompt += "  • PRODUCT_REF_IMAGE: attached our product image\n";
      }
      structuredPrompt += "\n";
      
      // Instructions section
      structuredPrompt += "Instructions:\n";
      
      // 1. Layout & Composition
      structuredPrompt += "  1. Layout & Composition\n";
      structuredPrompt += "     - Copy the exact layout and proportions from STYLE_REF_IMAGE.\n";
      structuredPrompt += "     - Preserve element positions: maintain the same structure of visual elements and text placement.\n";
      structuredPrompt += "     - Maintain same padding, gutters, and safe-zone margins as STYLE_REF_IMAGE.\n\n";
      
      // 2. Typography & Text
      structuredPrompt += "  2. Typography & Text\n";
      structuredPrompt += "     - Match all font styles from STYLE_REF_IMAGE (weight, size, case, and spacing).\n";
      
      // Add custom text if provided, otherwise extract from description
      if (prompt) {
        structuredPrompt += `     - Use this text: "${prompt}"\n\n`;
      } else if (projectData.description) {
        // Extract key points from description (simplified)
        const shortDescription = projectData.description.substring(0, 100) + (projectData.description.length > 100 ? "..." : "");
        structuredPrompt += `     - Use key messaging derived from our description: "${shortDescription}"\n\n`;
      } else {
        structuredPrompt += "     - Include a compelling headline and call to action.\n\n";
      }
      
      // 3. Colors & Graphics
      structuredPrompt += "  3. Colors & Graphics\n";
      structuredPrompt += "     - Use black and white as the base colors with minimal purple accents (#8954ff) for branding.\n";
      structuredPrompt += "     - Match the same button styles, icon treatments, and graphical elements from STYLE_REF_IMAGE.\n";
      structuredPrompt += "     - Replicate any decorative shapes, shadows, and visual effects exactly.\n\n";
      
      // 4. Subject Swap
      structuredPrompt += "  4. Subject Swap\n";
      if (projectData.images && projectData.images.length > 0) {
        structuredPrompt += "     - Remove the competitor product from STYLE_REF_IMAGE.\n";
        structuredPrompt += "     - Insert PRODUCT_REF_IMAGE at the same scale, angle, and lighting style.\n";
      } else {
        structuredPrompt += "     - Create a compelling visual representation of our offering based on the description.\n";
      }
      structuredPrompt += "     - Ensure the product presentation matches the professional style of the original ad.\n\n";
      
      // 5. Output
      structuredPrompt += "  5. Output\n";
      structuredPrompt += "     - Generate one high-quality ad creative.\n";
      structuredPrompt += "     - Ensure the final image looks like a polished, professional advertisement.\n";
      structuredPrompt += "     - Make sure text is legible and the layout is balanced.\n\n";
      
      structuredPrompt += "==== End of Prompt ====";
      
      console.log("Generating image with prompt:", structuredPrompt);

      const response = await fetch(`${API_URL}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-image-1", // Using gpt-image-1 model
          prompt: structuredPrompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          response_format: "url"
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Image generation API error:", error);
        toast.error(error.error?.message || "Failed to generate image");
        throw new Error(error.error?.message || "Failed to generate image");
      }

      const data = await response.json();
      console.log("Image generation successful, URL received");
      return data.data[0].url;
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
      throw error;
    }
  }

  async analyzeCompetitor(competitorImage: string) {
    try {
      console.log("Analyzing competitor image...");
      
      const response = await fetch(`${API_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are an expert marketing consultant specializing in digital ad creatives. Analyze the competitor's image provided and identify their strengths, weaknesses, and opportunities for differentiation."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "I'm uploading a screenshot of my competitor's app/product. Please analyze it and provide insights on their strengths, weaknesses, and how I might differentiate my offering."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: competitorImage
                  }
                }
              ]
            }
          ],
          max_tokens: 400
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error analyzing competitor:", error);
        toast.error("Failed to analyze competitor: " + (error.error?.message || "Unknown error"));
        // Instead of throwing, return a default message
        return "Unable to analyze competitor image due to API error. Proceeding with ad generation anyway.";
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing competitor:", error);
      toast.error("Failed to analyze competitor - continuing with ad creation");
      // Return a default message rather than throwing
      return "Unable to analyze competitor image. Proceeding with ad generation anyway.";
    }
  }

  async analyzeProject(projectData: {
    images?: string[];
    websiteUrl?: string;
    description?: string;
  }) {
    if (!projectData.images?.length && !projectData.websiteUrl && !projectData.description) {
      return "No project data provided for analysis.";
    }

    try {
      console.log("Analyzing project data...");
      
      const messages = [
        {
          role: "system" as const,
          content: "You are an expert marketing consultant specializing in digital ad creatives. Analyze the provided information about the user's project/offer and suggest a marketing approach."
        },
        {
          role: "user" as const,
          content: [
            {
              type: "text" as const,
              text: "I'm sharing information about my project/offer. Please analyze it and suggest a compelling marketing approach."
            }
          ]
        }
      ];

      // Add project images if available
      if (projectData.images && projectData.images.length > 0) {
        projectData.images.forEach(image => {
          (messages[1].content as any[]).push({
            type: "image_url" as const,
            image_url: {
              url: image
            }
          });
        });
      }

      // Add website URL if available
      if (projectData.websiteUrl) {
        (messages[1].content as any[]).push({
          type: "text" as const,
          text: `My website URL is: ${projectData.websiteUrl}`
        });
      }

      // Add description if available
      if (projectData.description) {
        (messages[1].content as any[]).push({
          type: "text" as const,
          text: `My project description: ${projectData.description}`
        });
      }

      const response = await fetch(`${API_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          max_tokens: 400
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error analyzing project:", error);
        toast.error("Failed to analyze project: " + (error.error?.message || "Unknown error"));
        // Instead of throwing, return a default message
        return "Unable to analyze project data due to API error. Proceeding with ad generation anyway.";
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing project:", error);
      toast.error("Failed to analyze project - continuing with ad creation");
      // Return a default message rather than throwing
      return "Unable to analyze project data. Proceeding with ad generation anyway.";
    }
  }

  async analyzeImagesAndCreateStrategy(competitorImage: string, projectData: {
    images?: string[];
    websiteUrl?: string;
    description?: string;
  }) {
    try {
      console.log("Starting comprehensive analysis...");
      
      // First, analyze competitor
      const competitorAnalysis = await this.analyzeCompetitor(competitorImage)
        .catch(err => {
          console.error("Error in competitor analysis:", err);
          return "Unable to analyze competitor image. Proceeding with ad generation anyway.";
        });
      
      // Then, analyze project
      const projectAnalysis = await this.analyzeProject(projectData)
        .catch(err => {
          console.error("Error in project analysis:", err);
          return "Unable to analyze project data. Proceeding with ad generation anyway.";
        });
      
      // If both analyses failed, return a default message
      if (competitorAnalysis.includes("Unable to analyze") && projectAnalysis.includes("Unable to analyze")) {
        return "Could not perform detailed analysis, but will generate an ad creative based on the provided information.";
      }
      
      // Now, create a comprehensive strategy using both analyses
      try {
        console.log("Creating comprehensive strategy...");
        
        const response = await fetch(`${API_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content: "You are an expert marketing consultant specializing in digital ad creatives. Create a comprehensive ad strategy based on competitor and project analyses."
              },
              {
                role: "user",
                content: `Here is my competitor analysis:\n\n${competitorAnalysis}\n\nHere is my project analysis:\n\n${projectAnalysis}\n\nBased on these analyses, please create a comprehensive ad strategy that highlights my unique advantages and positions my offer effectively against the competition.`
              }
            ],
            max_tokens: 600
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error creating strategy:", error);
          toast.error("Strategy creation failed - continuing with ad generation");
          // Return a combined analysis instead of throwing
          return `Based on our analysis:\n\n${competitorAnalysis}\n\n${projectAnalysis}`;
        }

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error("Error creating strategy:", error);
        // Return a combined analysis instead of throwing
        return `Based on our analysis:\n\n${competitorAnalysis}\n\n${projectAnalysis}`;
      }
    } catch (error) {
      console.error("Error in comprehensive analysis:", error);
      toast.error("Analysis failed - continuing with ad creation");
      return "Unable to perform detailed analysis, but will generate an ad creative based on the provided information.";
    }
  }
}
