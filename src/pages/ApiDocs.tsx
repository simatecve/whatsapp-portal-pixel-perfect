
import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import WhatsAppPageLayout from '@/components/whatsapp/WhatsAppPageLayout';
import { useNavigate } from 'react-router-dom';

const ApiDocs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const [apiInfo, setApiInfo] = useState<{
    apiUrl?: string;
    apiKey?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Get the user's profile
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          setProfile(profileData);
        }
        
        // Get system config
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
        setSystemConfig(configData);
        
        // Get API configuration
        const { data: whatsappConfig } = await supabase
          .from('whatsapp_config')
          .select('api_url, api_key')
          .maybeSingle();
        
        if (whatsappConfig) {
          setApiInfo({
            apiUrl: whatsappConfig.api_url,
            apiKey: whatsappConfig.api_key
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  const openApiDocs = () => {
    window.open('https://swagger.ecnix.ai/', '_blank', 'noopener,noreferrer');
  };

  return (
    <WhatsAppPageLayout
      user={user}
      profile={profile}
      systemConfig={systemConfig}
      handleLogout={handleLogout}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-muted-foreground">
          Acceda a la documentación completa de nuestra API para integrar WhatsApp con sus aplicaciones.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Documentación Swagger</CardTitle>
              <CardDescription>
                Explorador interactivo de la API con ejemplos de uso y endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Nuestra documentación interactiva le permite probar los endpoints directamente desde el navegador
                y ver todos los detalles de las solicitudes y respuestas.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={openApiDocs} className="flex items-center">
                Abrir Swagger <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de API</CardTitle>
              <CardDescription>
                Detalles para conectarse a nuestra API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p>Cargando información de API...</p>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium mb-1">API URL</h3>
                    <p className="text-sm bg-muted p-2 rounded break-all select-all">
                      {apiInfo.apiUrl || 'https://api.ecnix.ai/'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">API Key</h3>
                    <p className="text-sm bg-muted p-2 rounded break-all select-all">
                      {apiInfo.apiKey || '4e2adc62ecbe4769908d52cd28eb0165'}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </WhatsAppPageLayout>
  );
};

export default ApiDocs;
