
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        console.log("Index: Auth state changed", _event);
        setSession(currentSession);
        setLoading(false);
      }
    );
    
    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log("Index: Initial session check", data.session?.user?.id);
        setSession(data.session);
      } catch (err: any) {
        console.error("Session check error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  // Show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-white">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // Show error message if there was an error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-red-500 text-white p-4 rounded-md max-w-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <p className="mt-2">Por favor, intenta recargar la página.</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if authenticated, otherwise to login
  return session ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}
