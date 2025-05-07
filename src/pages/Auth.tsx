
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyInput from "@/components/ApiKeyInput";
import { useAuth } from "@/contexts/AuthContext";
import AdPirateLogo from "@/components/AdPirateLogo";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApiKeySubmit = async (apiKey: string) => {
    setIsSubmitting(true);
    try {
      // Store API key
      localStorage.setItem("openaiApiKey", apiKey);
      
      // Login user
      await login(apiKey);
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-black to-pirate-950">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-10">
          <AdPirateLogo size={80} />
        </div>

        <div className="w-full max-w-md">
          {isSubmitting ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pirate-500 mx-auto mb-4"></div>
              <p className="text-white">Authenticating...</p>
            </div>
          ) : (
            <ApiKeyInput onSubmit={handleApiKeySubmit} />
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">
              Need an OpenAI API key? Visit{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-pirate-400 hover:text-pirate-300 underline underline-offset-2"
              >
                platform.openai.com/api-keys
              </a>
              {" "}to create one.
            </p>
            <p className="text-xs text-white/60 mt-2">
              Be sure to use a key that begins with "sk-" followed by 48 characters, not a project ID.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-white/40">
        <p>MediaGlobe © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Auth;
