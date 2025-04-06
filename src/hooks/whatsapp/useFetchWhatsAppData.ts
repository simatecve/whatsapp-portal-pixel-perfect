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
  id: string;
  api_key: string;
  api_url: string;
  webhook_url: string;
}

export const useFetchWhatsAppData = (user: User | null) => {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<WhatsAppSession | null>(null);
  
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      
      try {
        // Fetch WhatsApp sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('whatsapp_sesiones')
          .select('*')
          .eq('user_id', user.id)
          .order('fecha_creacion', { ascending: false });
        
        if (sessionsError) {
          console.error('Error al obtener sesiones:', sessionsError);
          return;
        }
        
        const typedSessions = sessionsData as WhatsAppSession[] || [];
        setSessions(typedSessions);
        
        // Set active session - prioritize connected sessions
        if (typedSessions.length > 0) {
          // First try to find a connected session
          const connectedSession = typedSessions.find(s => 
            s.estado === 'CONECTADO' || s.estado === 'WORKING' || s.estado === 'connected'
          );
          
          if (connectedSession) {
            setActiveSession(connectedSession);
          } else {
            // Otherwise use the most recent session
            setActiveSession(typedSessions[0]);
          }
        }
        
        // Fetch WhatsApp configuration
        const { data: configData, error: configError } = await supabase
          .from('whatsapp_config')
          .select('*')
          .maybeSingle();
        
        if (configError) {
          console.error('Error al obtener configuración:', configError);
          return;
        }
        
        setWhatsappConfig(configData as WhatsAppConfig | null);
      } catch (error) {
        console.error('Error al obtener datos de WhatsApp:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, [user]);

  return { 
    sessions, 
    setSessions, 
    whatsappConfig, 
    isLoading, 
    activeSession, 
    setActiveSession 
  };
};
