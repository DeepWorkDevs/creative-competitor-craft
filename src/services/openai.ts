

import { toast } from "sonner";

const API_URL = "https://api.openai.com/v1";
const MODEL = "gpt-4o"; // Using GPT-4o for vision capabilities
const DEFAULT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "your-api-key-here"; // Replace with your actual API key

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey?: string) {
    // Use the provided API key or fall back to the default
    this.apiKey = apiKey || DEFAULT_API_KEY;
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
      
      // Extract competitor brand name (simplified example)
      const competitorBrand = "Competitor";
      
      // Build a structured prompt based on available data
      let structuredPrompt = "Ad Creative Request:\n";
      
      // Style section based on competitor image
      structuredPrompt += `- **Style**: Use a bold, minimalist style like ${competitorBrand}'s latest ads (see attached image).\n`;
      
      // Product section based on project data
      if (projectData.images && projectData.images.length > 0) {
        structuredPrompt += "- **Product**: Show our product from the attached image as the main focus.\n";
      } else {
        structuredPrompt += "- **Product**: Create a compelling visual representation of our offering.\n";
      }
      
      // Text section including any user provided prompt
      structuredPrompt += "- **Text**: ";
      if (prompt) {
        structuredPrompt += `Include text as specified: ${prompt}\n`;
      } else if (projectData.description) {
        // Extract key points from description (simplified)
        structuredPrompt += `Include key messaging derived from our description: "${projectData.description.substring(0, 100)}..."\n`;
      } else {
        structuredPrompt += "Include a compelling headline and call to action.\n";
      }
      
      // Layout and Colors section
      structuredPrompt += "- **Layout & Colors**: Create a clean, professional layout with balanced text and visuals. ";
      structuredPrompt += "Use a black and white base with minimal purple accents for branding.\n";
      
      // Final instruction
      structuredPrompt += "Generate a high-quality ad banner that will convert viewers into customers.";
      
      console.log("Generating image with prompt:", structuredPrompt);

      const response = await fetch(`${API_URL}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-image-1", // Updated to use gpt-image-1 model
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
