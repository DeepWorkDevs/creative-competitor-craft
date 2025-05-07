
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for either a Supabase user or an OpenAI API key
    const apiKey = localStorage.getItem("openaiApiKey");
    setHasApiKey(!!apiKey && apiKey.startsWith("sk-"));
    
    if (!isLoading && !user && !apiKey) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner message="Authenticating..." />
      </div>
    );
  }

  // Allow access if we have a user OR an API key
  return (user || hasApiKey) ? <>{children}</> : null;
};

export default ProtectedRoute;
