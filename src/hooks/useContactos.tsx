
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface WhatsAppConfig {
  api_key: string;
  api_url: string;
}

export const useContactos = (user: User | null) => {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch WhatsApp sessions and configuration
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get WhatsApp sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('whatsapp_sesiones')
          .select('*')
          .eq('user_id', user.id)
          .order('fecha_creacion', { ascending: false });
          
        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);
        
        // Get WhatsApp configuration
        const { data: configData, error: configError } = await supabase
          .from('configuracion_whatsapp')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (configError) throw configError;
        
        if (configData) {
          setWhatsappConfig({
            api_key: configData.api_key,
            api_url: configData.api_url
          });
        }
        
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  return {
    sessions,
    whatsappConfig,
    isLoading,
  };
};
