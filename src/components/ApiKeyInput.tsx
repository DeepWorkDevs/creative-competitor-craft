
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyInput = ({ onSubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateApiKey = (key: string): boolean => {
    // Simple validation - just check for sk- prefix
    return key.startsWith('sk-');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      setError("API key is required");
      return;
    }
    
    // Reject keys that start with sk-proj- (likely a project ID not an API key)
    if (trimmedKey.startsWith("sk-proj-")) {
      setError("Invalid API key format. Please provide an OpenAI API key that starts with 'sk-'. This appears to be a project ID, not an API key.");
      toast.error("Please enter a valid OpenAI API key, not a project ID");
      return;
    }
    
    if (!validateApiKey(trimmedKey)) {
      setError("Invalid API key format. OpenAI API keys start with 'sk-'.");
      toast.error("Please enter a valid OpenAI API key");
      return;
    }
    
    setError(null);
    onSubmit(trimmedKey);
    toast.success("API key successfully added");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-12"
    >
      <Card className="p-6 glass-morphism">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center text-gradient">Enter Your OpenAI API Key</h2>
            <p className="text-muted-foreground text-sm mb-6 text-center">
              Your API key is only used in your browser session and never stored on our servers.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (error) setError(null);
                }}
                className={`pr-10 bg-background/50 ${error ? "border-red-500" : ""}`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {error && (
              <div className="flex items-start gap-2 mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              Your API key should start with <code className="bg-black/30 px-1 rounded">sk-</code>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-pirate-500 hover:bg-pirate-600"
            disabled={!apiKey.trim()}
          >
            Continue
          </Button>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Don't have an API key?{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-pirate-400 hover:text-pirate-300 underline underline-offset-2"
              >
                Get one from OpenAI
              </a>
            </p>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ApiKeyInput;
