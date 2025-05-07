
import { toast } from "sonner";

const API_URL = "https://api.openai.com/v1";
const MODEL = "gpt-4o"; // Using GPT-4o for vision capabilities

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateAdCreative(competitorImage: string, projectImage: string, prompt: string) {
    try {
      const response = await fetch(`${API_URL}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Create a professional, high-converting ad creative based on these images. 
            The first image shows a competitor's app/product, and the second shows my project/offer. 
            ${prompt || "Make it stunning, persuasive, and modern. Highlight the unique value proposition."}`,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          response_format: "url"
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate image");
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
      throw error;
    }
  }

  async analyzeImages(competitorImage: string, projectImage: string) {
    try {
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
              content: "You are an expert marketing consultant specializing in digital ad creatives. Analyze the images provided and give strategic advice on creating a compelling ad that outperforms the competitor."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "I'm uploading two images. The first is a screenshot of my competitor's app/product, and the second is my project/offer. Please analyze both and suggest a strategy for creating a compelling ad creative that highlights my unique advantages."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: competitorImage
                  }
                },
                {
                  type: "image_url",
                  image_url: {
                    url: projectImage
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to analyze images");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to analyze images");
      throw error;
    }
  }
}
