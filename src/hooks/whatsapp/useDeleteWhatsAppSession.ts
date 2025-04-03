
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

export const useDeleteWhatsAppSession = (
  sessions: WhatsAppSession[],
  setSessions: React.Dispatch<React.SetStateAction<WhatsAppSession[]>>
) => {
  const { toast } = useToast();
  
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
  
  return { deleteWhatsAppSession };
};
