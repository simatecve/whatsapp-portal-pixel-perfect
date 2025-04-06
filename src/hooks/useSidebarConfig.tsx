import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSidebarConfig = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [supportUrl, setSupportUrl] = useState<string>('https://help.ecnix.ai');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        // Fetch API key
        const { data: apiData, error: apiError } = await supabase
          .from('whatsapp_config')
          .select('api_key')
          .single();
        
        if (apiError) {
          console.error('Error fetching API key:', apiError);
        } else if (apiData) {
          setApiKey(apiData.api_key);
        }
        
        // Fetch support URL - handle as potentially non-existent column
        try {
          const { data: configData } = await supabase
            .from('configuracion_sistema')
            .select('support_url')
            .maybeSingle();
            
          if (configData?.support_url) {
            setSupportUrl(configData.support_url);
          }
        } catch (error) {
          console.error('Error fetching support URL:', error);
          // Keep default URL in state
        }
      } catch (error) {
        console.error('Error in config fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, []);
  
  return { apiKey, supportUrl, isLoading };
};
