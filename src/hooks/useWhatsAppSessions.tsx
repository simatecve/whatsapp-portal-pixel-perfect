
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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

interface SessionStatus {
  status: string;
  message: string;
  user?: {
    name: string;
    number: string;
    [key: string]: any;
  };
}

export const useWhatsAppSessions = (user: User | null) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      
      try {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('whatsapp_sesiones')
          .select('*')
          .eq('user_id', user.id)
          .order('fecha_creacion', { ascending: false });
        
        if (sessionsError) {
          console.error('Error al obtener sesiones:', sessionsError);
          return;
        }
        
        setSessions(sessionsData as WhatsAppSession[] || []);
        
        const { data: configData, error: configError } = await supabase
          .from('whatsapp_config')
          .select('*')
          .maybeSingle();
        
        if (configError) {
          console.error('Error al obtener configuración:', configError);
          return;
        }
        
        setWhatsappConfig(configData as WhatsAppConfig | null);
        
        if (configData && sessionsData && sessionsData.length > 0) {
          await checkSessionsStatus(sessionsData as WhatsAppSession[], configData);
        }
      } catch (error) {
        console.error('Error al obtener sesiones de WhatsApp:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, [user]);
  
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
          
          const apiStatus = result.status === 'CONNECTED' ? 'CONECTADO' : 'DESCONECTADO';
          
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
  
  const createWhatsAppSession = async (sessionName: string) => {
    if (!user || !whatsappConfig) {
      toast({
        title: "Error",
        description: "No se puede crear la sesión. Configuración no disponible.",
        variant: "destructive"
      });
      return { success: false };
    }
    
    try {
      const sessionApiPayload = {
        name: sessionName,
        status: "STARTING",
        config: {
          metadata: {
            "user.id": user.id || "",
            "user.email": user.email || ""
          },
          debug: false,
          noweb: {
            markOnline: true,
            store: {
              enabled: true,
              fullSync: false
            }
          },
          webhooks: [
            {
              url: whatsappConfig.webhook_url,
              events: [
                "message",
                "session.status"
              ],
              retries: {
                delaySeconds: 2,
                attempts: 15,
                policy: "linear"
              }
            }
          ]
        },
        me: null,
        engine: {
          engine: "NOWEB"
        }
      };
      
      console.log("Payload para iniciar sesión:", sessionApiPayload);
      
      const response = await fetch(`${whatsappConfig.api_url}/api/${sessionName}/start`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Api-Key': whatsappConfig.api_key
        },
        body: JSON.stringify(sessionApiPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al iniciar sesión en la API: ${errorData.message || errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Respuesta de la API al iniciar sesión:', result);
      
      const { data: sessionData, error: sessionError } = await supabase
        .from('whatsapp_sesiones')
        .insert([
          { 
            nombre_sesion: sessionName, 
            user_id: user.id,
            estado: result.status || 'INICIANDO'
          }
        ])
        .select('*')
        .maybeSingle();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      const { data: updatedSessions } = await supabase
        .from('whatsapp_sesiones')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_creacion', { ascending: false });
      
      if (updatedSessions) {
        setSessions(updatedSessions as WhatsAppSession[]);
      }
      
      toast({
        title: "Sesión creada",
        description: "La sesión ha sido creada correctamente",
      });
      
      return { success: true, sessionName };
    } catch (error) {
      console.error('Error al crear la sesión:', error);
      toast({
        title: "Error",
        description: `Error al crear la sesión: ${error instanceof Error ? error.message : 'Desconocido'}`,
        variant: "destructive"
      });
      return { success: false };
    }
  };
  
  const deleteWhatsAppSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_sesiones')
        .delete()
        .eq('id', sessionId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSessions(sessions.filter(session => session.id !== sessionId));
      
      toast({
        title: "Sesión eliminada",
        description: "La sesión ha sido eliminada correctamente",
      });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar la sesión:', error);
      toast({
        title: "Error",
        description: `Error al eliminar la sesión: ${error instanceof Error ? error.message : 'Desconocido'}`,
        variant: "destructive"
      });
      return false;
    }
  };
  
  const getQRCodeForSession = async (sessionName: string) => {
    if (!whatsappConfig) return { success: false, errorMessage: "Configuración no disponible" };
    
    try {
      console.log(`Obteniendo código QR para la sesión: ${sessionName}`);
      const qrResponse = await fetch(`${whatsappConfig.api_url}/api/${sessionName}/auth/qr?format=image`, {
        method: 'GET',
        headers: {
          'accept': 'image/png',
          'X-Api-Key': whatsappConfig.api_key
        }
      });
      
      if (!qrResponse.ok) {
        const errorData = await qrResponse.json();
        const errorMessage = errorData.error || `Error al obtener QR: ${qrResponse.statusText}`;
        console.error(`Error al obtener código QR para ${sessionName}:`, errorData);
        return { success: false, errorMessage };
      }
      
      const blob = await qrResponse.blob();
      const qrImageUrl = URL.createObjectURL(blob);
      return { success: true, qrImageUrl };
    } catch (error) {
      console.error(`Error al obtener el código QR para ${sessionName}:`, error);
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Desconocido'}`;
      return { success: false, errorMessage };
    }
  };
  
  return {
    sessions,
    whatsappConfig,
    isLoading,
    refreshing,
    refreshSessionStatus,
    createWhatsAppSession,
    deleteWhatsAppSession,
    getQRCodeForSession
  };
};
