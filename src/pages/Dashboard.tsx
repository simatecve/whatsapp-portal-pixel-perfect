
import React, { useEffect, useState } from 'react';
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
import DashboardContent from '@/components/dashboard/DashboardContent';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  
  // En el futuro, esto estaría conectado a la autenticación de Supabase
  const isAuthenticated = true; // Placeholder para verificación de autenticación
  
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
    
    // Set up realtime subscription for system configuration changes
    const configChannel = supabase
      .channel('public:configuracion_sistema')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'configuracion_sistema' 
      }, (payload) => {
        setSystemConfig(payload.new);
      })
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(configChannel);
    };
  }, [isAuthenticated, navigate]);

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
          <DashboardContent 
            systemName={systemConfig?.nombre_sistema}
            userId={user?.id}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
