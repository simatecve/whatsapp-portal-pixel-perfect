
import { useState } from 'react';
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

interface SessionStatus {
  status: string;
  message: string;
  user?: {
    name: string;
    number: string;
    [key: string]: any;
  };
}

export const useSessionStatusCheck = (
  sessions: WhatsAppSession[],
  whatsappConfig: WhatsAppConfig | null,
  setSessions: React.Dispatch<React.SetStateAction<WhatsAppSession[]>>
) => {
  const [refreshing, setRefreshing] = useState(false);
  
  const checkSessionsStatus = async (sessionsToCheck: WhatsAppSession[], config: WhatsAppConfig) => {
    if (!config) return;

    try {
      setRefreshing(true);
      
      for (const session of sessionsToCheck) {
        try {
          console.log(`Verificando estado de sesión: ${session.nombre_sesion}`);
          const response = await fetch(`${config.api_url}/api/sessions/${session.nombre_sesion}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'X-Api-Key': config.api_key
            }
          });
          
          if (!response.ok) {
            console.error(`Error al verificar estado de sesión ${session.nombre_sesion}:`, response.statusText);
            continue;
          }
          
          const result = await response.json();
          console.log(`Estado de sesión ${session.nombre_sesion}:`, result);
          
          // Map API status to internal application status
          let apiStatus;
          if (result.status === 'CONNECTED') {
            apiStatus = 'CONECTADO';
          } else if (result.status === 'WORKING') {
            apiStatus = 'WORKING';
          } else {
            apiStatus = 'DESCONECTADO';
          }
          
          if (session.estado !== apiStatus) {
            await supabase
              .from('whatsapp_sesiones')
              .update({ estado: apiStatus })
              .eq('id', session.id);
              
            session.estado = apiStatus;
          }
        } catch (error) {
          console.error(`Error al verificar sesión ${session.nombre_sesion}:`, error);
        }
      }
      
      setSessions([...sessionsToCheck]);
    } catch (error) {
      console.error('Error al verificar el estado de las sesiones:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const refreshSessionStatus = async () => {
    if (!whatsappConfig || sessions.length === 0) return;
    await checkSessionsStatus(sessions, whatsappConfig);
  };
  
  return { refreshing, refreshSessionStatus };
};
