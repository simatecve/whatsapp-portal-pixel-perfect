
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarInset
} from '@/components/ui/sidebar';
import UserProfilePanel from '@/components/dashboard/UserProfilePanel';
import SidebarNavigation from '@/components/dashboard/SidebarNavigation';
import SidebarLogo from '@/components/dashboard/SidebarLogo';
import { toast } from '@/hooks/use-toast';
import MessageAnalytics from '@/components/analytics/MessageAnalytics';
import SessionSelector from '@/components/whatsapp/SessionSelector';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';

const AnalisisIndividual: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  
  // En el futuro, esto estaría conectado a la autenticación de Supabase
  const isAuthenticated = true; // Placeholder para verificación de autenticación
  
  // Obtenemos las sesiones de WhatsApp del usuario
  const { sessions, isLoading: loadingSessions } = useWhatsAppSessions(user);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Obtener datos del usuario actual y configuración del sistema
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener usuario
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
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
      } catch (error) {
        console.error('Error al obtener datos:', error);
        toast({
          title: "Error",
          description: "Ha ocurrido un error al cargar los datos",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate]);

  // Configurar la sesión seleccionada inicialmente
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      // Seleccionar automáticamente la primera sesión conectada
      const connectedSession = sessions.find(s => 
        s.estado === 'CONECTADO' || s.estado === 'WORKING' || s.estado === 'connected'
      );
      
      if (connectedSession) {
        setSelectedSession(connectedSession.nombre_sesion);
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
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <SidebarLogo systemName={systemConfig?.nombre_sistema} />
            
            {/* Información del usuario */}
            {profile && <UserProfilePanel profile={profile} user={user} />}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNavigation handleLogout={handleLogout} />
          </SidebarContent>
          
          <SidebarFooter>
            {/* Footer content goes here if needed */}
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset>
          <div className="bg-gray-800 py-2 px-4 text-white">
            <h1 className="text-xl font-semibold">{systemConfig?.nombre_sistema || "Panel de Análisis Individual"}</h1>
          </div>
          
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Análisis Individual de Mensajes</h1>
              <SessionSelector 
                sessions={sessions}
                selectedSession={selectedSession}
                onSessionChange={handleSessionChange}
              />
            </div>
            
            <MessageAnalytics 
              userId={user?.id} 
              selectedSession={selectedSession}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AnalisisIndividual;
