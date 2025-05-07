
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for either a Supabase user or an OpenAI API key
    const hasApiKey = localStorage.getItem("openaiApiKey");
    
    if (!isLoading && !user && !hasApiKey) {
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
  const hasApiKey = localStorage.getItem("openaiApiKey");
  return (user || hasApiKey) ? <>{children}</> : null;
};

export default ProtectedRoute;
