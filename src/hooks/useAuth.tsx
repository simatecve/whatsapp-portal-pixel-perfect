
import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataFetchedRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user logs out, redirect to login
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );
    
    // Fetch data only once
    const fetchAuthData = async () => {
      if (dataFetchedRef.current) return;
      
      try {
        setIsLoading(true);
        
        // THEN check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          console.log("No session found, redirecting to login");
          navigate('/login');
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession.user);
        
        dataFetchedRef.current = true;
      } catch (error) {
        console.error('Error al obtener datos de autenticación:', error);
        toast({
          title: "Error",
          description: "Ha ocurrido un error al verificar la sesión",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuthData();
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive"
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error("Exception during logout:", error);
    }
  };
  
  return {
    user,
    session,
    isLoading,
    handleLogout
  };
};
