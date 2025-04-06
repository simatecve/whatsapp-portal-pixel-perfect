
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SystemConfig {
  id: string;
  nombre_sistema: string;
  [key: string]: any;
}

export const useSystemConfig = () => {
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const configChannelRef = useRef<any>(null);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        
        // Fetch system configuration
        const { data: configData, error: configError } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        if (configError) {
          console.error('Error al obtener configuración:', configError);
          toast({
            title: "Error",
            description: "No se pudo cargar la configuración del sistema",
            variant: "destructive"
          });
        } else {
          setSystemConfig(configData as SystemConfig | null);
        }
      } catch (error) {
        console.error('Error al obtener datos de configuración:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
    
    // Set up realtime subscription for system configuration changes
    if (!configChannelRef.current) {
      configChannelRef.current = supabase
        .channel('config-channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'configuracion_sistema' 
        }, (payload) => {
          setSystemConfig(payload.new as SystemConfig);
        })
        .subscribe();
    }
      
    // Clean up subscription
    return () => {
      if (configChannelRef.current) {
        supabase.removeChannel(configChannelRef.current);
      }
    };
  }, []);

  return {
    systemConfig,
    isLoading
  };
};
