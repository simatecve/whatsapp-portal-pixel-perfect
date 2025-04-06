
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const configChannelRef = useRef<any>(null);
  const dataFetchedRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user logs out, redirect to login
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );
    
    // Fetch data only once
    const fetchData = async () => {
      if (dataFetchedRef.current) return;
      
      try {
        setIsLoading(true);
        
        // THEN check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          console.log("No session found, redirecting to login");
          navigate('/login');
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession.user);
        
        // With setTimeout to avoid Supabase deadlock
        setTimeout(async () => {
          // Obtain profile information
          if (currentSession.user) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', currentSession.user.id)
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
            } catch (error) {
              console.error("Error fetching profile:", error);
            }
          }
          
          // Fetch system configuration
          try {
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
            console.error("Error fetching system config:", error);
          }
          
          dataFetchedRef.current = true;
          setIsLoading(false);
        }, 0);
        
      } catch (error) {
        console.error('Error al obtener datos:', error);
        toast({
          title: "Error",
          description: "Ha ocurrido un error al cargar los datos",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up realtime subscription for system configuration changes - solo una vez
    if (!configChannelRef.current) {
      configChannelRef.current = supabase
        .channel('config-channel')
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
      subscription.unsubscribe();
      if (configChannelRef.current) {
        supabase.removeChannel(configChannelRef.current);
      }
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive"
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error("Exception during logout:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return null; // Will be redirected by the useEffect hook
  }
  
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
            <div className="p-3 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} {systemConfig?.nombre_sistema || 'Ecnix API'}</p>
              <p className="mt-1">Versión 1.0.0</p>
            </div>
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset>
          <DashboardContent 
            systemName={systemConfig?.nombre_sistema}
            userId={user?.id}
            profile={profile}
            isLoading={isLoading}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
