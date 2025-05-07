import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  login: (apiKey: string) => Promise<void>; 
  apiKey: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for stored API key on mount
    const storedApiKey = localStorage.getItem("openaiApiKey");
    if (storedApiKey) {
      console.log("Found stored API key");
      setApiKey(storedApiKey);
      // If we have an API key but no user, set a fake user to enable access
      if (!user) {
        console.log("Setting OpenAI user");
        setUser({ id: "openai-user", email: "openai@user.com", app_metadata: {}, user_metadata: {}, aud: "", created_at: "" });
      }
    } else {
      console.log("No stored API key found");
    }
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        navigate('/');
      }
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    // Then check for existing session
    const initSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during sign up');
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during sign in');
      }
      throw error;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      // Clear the API key when signing out
      localStorage.removeItem("openaiApiKey");
      setApiKey(null);
      setUser(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during sign out');
      }
      throw error;
    }
  };

  // Update the login method for OpenAI API key with simpler validation
  const login = async (apiKey: string) => {
    console.log("Logging in with API key");
    // Basic validation - just check for sk- prefix
    if (!apiKey.startsWith("sk-")) {
      throw new Error("Invalid API key format - must start with sk-");
    }
    
    // Store the key in localStorage and state
    localStorage.setItem("openaiApiKey", apiKey);
    setApiKey(apiKey);
    
    // Update the user state to simulate a logged-in user
    setUser({ 
      id: "openai-user", 
      email: "openai@user.com", 
      app_metadata: {}, 
      user_metadata: {}, 
      aud: "", 
      created_at: "" 
    });
    
    console.log("Login successful, user set");
  };

  const value = {
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    login,
    apiKey,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
