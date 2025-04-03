
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppConfig {
  id: string;
  api_key: string;
  api_url: string;
  webhook_url: string;
}

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

export const useCreateWhatsAppSession = (
  user: User | null,
  whatsappConfig: WhatsAppConfig | null,
  setSessions: React.Dispatch<React.SetStateAction<WhatsAppSession[]>>
) => {
  const { toast } = useToast();
  
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
      // Construir el payload según la estructura de API correcta
      const sessionApiPayload = {
        name: sessionName,
        start: true,
        config: {
          metadata: {
            "user.id": user.id || "",
            "user.email": user.email || ""
          },
          debug: false,
          noweb: {
            store: {
              enabled: true,
              fullSync: true
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
        }
      };
      
      console.log("Payload para crear sesión:", sessionApiPayload);
      
      // Actualizar la URL del endpoint para crear la sesión
      const response = await fetch(`${whatsappConfig.api_url}/api/sessions`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Api-Key': whatsappConfig.api_key
        },
        body: JSON.stringify(sessionApiPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        console.error('Error response al crear sesión:', errorData);
        throw new Error(`Error al crear la sesión: ${errorData.error || response.statusText} (${response.status})`);
      }
      
      const result = await response.json();
      console.log('Respuesta de la API al crear sesión:', result);
      
      // Guardar la sesión en la base de datos
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
      
      // Actualizar la lista de sesiones
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
  
  return { createWhatsAppSession };
};
