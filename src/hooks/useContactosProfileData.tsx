
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  nombre_completo: string | null;
  [key: string]: any;
}

interface SystemConfig {
  id: string;
  nombre_sistema: string;
  [key: string]: any;
}

export const useContactosProfileData = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Get user profile
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setProfile(profileData as UserProfile | null);
        } else {
          navigate('/login');
        }
        
        // Get system configuration
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        setSystemConfig(configData as SystemConfig | null);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        toast.error('Error al cargar datos del perfil');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return {
    user,
    profile,
    systemConfig,
    isLoading,
    handleLogout
  };
};
