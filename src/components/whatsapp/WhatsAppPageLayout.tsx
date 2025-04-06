
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarNavigation from '@/components/dashboard/SidebarNavigation';
import SidebarLogo from '@/components/dashboard/SidebarLogo';
import UserProfilePanel from '@/components/dashboard/UserProfilePanel';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { User } from '@supabase/supabase-js';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarRail 
} from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

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

interface WhatsAppPageLayoutProps {
  children: ReactNode;
  user: User | null;
  profile: UserProfile | null;
  systemConfig: SystemConfig | null;
  handleLogout: () => Promise<void>;
}

const WhatsAppPageLayout: React.FC<WhatsAppPageLayoutProps> = ({
  children,
  user,
  profile,
  systemConfig,
  handleLogout
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<User | null>(user);
  const [localSystemConfig, setLocalSystemConfig] = useState<SystemConfig | null>(systemConfig);
  
  // Check if user is authenticated and fetch system config if needed
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!data.session) {
          console.log("WhatsAppPageLayout: No session found, redirecting to login");
          navigate('/login');
          return;
        }
        
        // If we have a user from props, use it
        if (!localUser && data.session.user) {
          setLocalUser(data.session.user);
        }
        
        // If we don't have system config from props, fetch it
        if (!localSystemConfig) {
          const { data: configData, error: configError } = await supabase
            .from('configuracion_sistema')
            .select('*')
            .single();
          
          if (configError) {
            console.error("Error fetching system config:", configError);
            throw new Error("No se pudo cargar la configuración del sistema");
          }
          
          setLocalSystemConfig(configData);
        }
      } catch (error: any) {
        console.error("WhatsAppPageLayout error:", error);
        setError(error.message || "Ocurrió un error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, localUser, localSystemConfig, user]);
  
  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-white">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // If error occurred, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // If no user is available, don't render content (should be redirected by useEffect)
  if (!localUser && !user) {
    return null;
  }
  
  const effectiveUser = localUser || user;
  const effectiveSystemConfig = localSystemConfig || systemConfig;
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-900 text-white">
        <Sidebar>
          <SidebarHeader>
            <SidebarLogo systemName={effectiveSystemConfig?.nombre_sistema} />
            {profile && <UserProfilePanel profile={profile} user={effectiveUser} />}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNavigation handleLogout={handleLogout} />
          </SidebarContent>
          
          <SidebarFooter />
          
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset>
          <TopNavbar systemName={effectiveSystemConfig?.nombre_sistema} />
          
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default WhatsAppPageLayout;
