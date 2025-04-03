
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNavigation from '@/components/dashboard/SidebarNavigation';
import SidebarLogo from '@/components/dashboard/SidebarLogo';
import UserProfilePanel from '@/components/dashboard/UserProfilePanel';
import TopNavbar from '@/components/dashboard/TopNavbar';
import ContactsList from '@/components/whatsapp/ContactsList';
import { useContactos } from '@/hooks/useContactos';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SystemConfig {
  id: string;
  nombre_sistema: string;
  [key: string]: any;
}

interface UserProfile {
  id: string;
  nombre_completo: string | null;
  [key: string]: any;
}

const Contactos: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const { sessions, whatsappConfig, isLoading, error } = useContactos(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setProfile(profileData as UserProfile | null);
        } else {
          navigate('/login');
        }
        
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        setSystemConfig(configData as SystemConfig | null);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        toast.error('Error al cargar datos del perfil');
      }
    };
    
    fetchData();
  }, [navigate]);

  // Set first active session as default when sessions are loaded
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      const activeSessions = sessions.filter(s => 
        s.estado === 'CONECTADO' || s.estado === 'WORKING'
      );
      
      if (activeSessions.length > 0) {
        setSelectedSession(activeSessions[0].nombre_sesion);
      } else if (sessions.length > 0) {
        setSelectedSession(sessions[0].nombre_sesion);
      }
    }
  }, [sessions, selectedSession]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader>
            <SidebarLogo systemName={systemConfig?.nombre_sistema} />
            
            {profile && <UserProfilePanel profile={profile} user={user} />}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNavigation handleLogout={handleLogout} />
          </SidebarContent>
          
          <SidebarFooter>
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset>
          <TopNavbar systemName={systemConfig?.nombre_sistema} />
          
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Contactos</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Gestione sus contactos de WhatsApp para {systemConfig?.nombre_sistema || 'el sistema'}.
                  </p>
                </div>

                <div className="flex items-center">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-500">Cargando sesiones...</span>
                    </div>
                  ) : sessions.length > 0 ? (
                    <Select
                      value={selectedSession || ''}
                      onValueChange={handleSessionChange}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Seleccione una sesión" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session) => (
                          <SelectItem key={session.id} value={session.nombre_sesion}>
                            {session.nombre_sesion} 
                            {session.estado && ` (${session.estado})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm text-gray-500">No hay sesiones disponibles</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-4 sm:px-0 mt-6">
              {user && (
                <ContactsList 
                  user={user}
                  standalone={true}
                  selectedSession={selectedSession}
                />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Contactos;
