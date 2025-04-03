
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
  webhook_url: string;
}

export const useContactos = (user: User | null) => {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch WhatsApp sessions and configuration
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setError(null);
        console.log('Fetching WhatsApp sessions and config...');
        
        // Get WhatsApp sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('whatsapp_sesiones')
          .select('*')
          .eq('user_id', user.id)
          .order('fecha_creacion', { ascending: false });
          
        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError);
          throw sessionsError;
        }
        
        console.log('Sessions fetched:', sessionsData);
        setSessions(sessionsData || []);
        
        // Get WhatsApp configuration
        const { data: configData, error: configError } = await supabase
          .from('whatsapp_config')
          .select('*')
          .single();
          
        if (configError) {
          console.error('Error fetching config:', configError);
          throw configError;
        }
        
        console.log('Config fetched:', configData);
        
        if (configData) {
          setWhatsappConfig({
            api_key: configData.api_key,
            api_url: configData.api_url,
            webhook_url: configData.webhook_url
          });
        }
        
      } catch (error: any) {
        console.error('Error al obtener datos:', error);
        setError('Error al obtener datos de WhatsApp: ' + (error.message || 'Desconocido'));
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
    error
  };
};
