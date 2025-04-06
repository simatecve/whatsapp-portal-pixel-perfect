
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import MessageAnalytics from '@/components/analytics/MessageAnalytics';
import SessionSelector from '@/components/whatsapp/SessionSelector';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import WhatsAppPageLayout from '@/components/whatsapp/WhatsAppPageLayout';
import { Loader2 } from 'lucide-react';

const AnalisisIndividual: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const configChannelRef = useRef<any>(null);
  
  // Obtenemos las sesiones de WhatsApp del usuario
  const { sessions, isLoading: loadingSessions } = useWhatsAppSessions(user);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  
  useEffect(() => {
    // Obtener datos del usuario actual y configuración del sistema
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener usuario
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUser(user);
        
        // Obtener perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error al obtener perfil:', profileError);
          toast({
            title: "Error",
            description: "No se pudo cargar el perfil del usuario",
            variant: "destructive"
          });
        } else {
          setProfile(profileData);
        }
        
        // Obtener configuración del sistema
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
          setSystemConfig(configData);
        }
      } catch (error: any) {
        console.error('Error al obtener datos:', error);
        toast({
          title: "Error",
          description: error.message || "Ha ocurrido un error al cargar los datos",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up realtime subscription for system configuration changes - only if it doesn't exist yet
    if (!configChannelRef.current) {
      configChannelRef.current = supabase
        .channel('config-analytics-channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'configuracion_sistema' 
        }, (payload) => {
          setSystemConfig(payload.new);
        })
        .subscribe();
    }
      
    // Clean up subscription
    return () => {
      if (configChannelRef.current) {
        supabase.removeChannel(configChannelRef.current);
      }
    };
  }, [navigate]);

  // Configurar la sesión seleccionada inicialmente
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      // Seleccionar automáticamente la primera sesión conectada
      const connectedSession = sessions.find(s => 
        s.estado === 'CONECTADO' || s.estado === 'WORKING' || s.estado === 'connected'
      );
      
      if (connectedSession) {
        setSelectedSession(connectedSession.nombre_sesion);
      } else if (sessions.length > 0) {
        // Si no hay sesiones conectadas, seleccionar la primera
        setSelectedSession(sessions[0].nombre_sesion);
      }
    }
  }, [sessions, selectedSession]);

  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  // Show loading indicator while fetching data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-white">Cargando análisis...</p>
        </div>
      </div>
    );
  }

  return (
    <WhatsAppPageLayout
      user={user}
      profile={profile}
      systemConfig={systemConfig}
      handleLogout={handleLogout}
    >
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Análisis Individual de Mensajes</h1>
          <SessionSelector 
            sessions={sessions}
            selectedSession={selectedSession}
            onSessionChange={handleSessionChange}
          />
        </div>
        
        {sessionsError ? (
          <div className="bg-red-500 text-white p-4 rounded-md">
            Error: {sessionsError}
          </div>
        ) : loadingSessions ? (
          <div className="flex justify-center p-6">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <MessageAnalytics 
            userId={user?.id} 
            selectedSession={selectedSession}
          />
        )}
      </div>
    </WhatsAppPageLayout>
  );
};

export default AnalisisIndividual;
