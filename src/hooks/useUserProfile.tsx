
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  nombre_completo: string | null;
  [key: string]: any;
}

export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // With setTimeout to avoid Supabase deadlock
        setTimeout(async () => {
          // Obtain profile information
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('perfiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error al obtener perfil:', profileError);
              toast({
                title: "Error",
                description: "No se pudo cargar el perfil del usuario",
                variant: "destructive"
              });
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } catch (error) {
        console.error('Error in profile fetch:', error);
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  return {
    profile,
    isLoading
  };
};
