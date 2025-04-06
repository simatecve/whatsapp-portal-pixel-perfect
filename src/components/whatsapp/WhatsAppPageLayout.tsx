
import React, { ReactNode, useEffect } from 'react';
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
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("WhatsAppPageLayout: No session found, redirecting to login");
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // If no user is available, don't render content
  if (!user) {
    return null;
  }
  
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
          
          <SidebarFooter />
          
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset>
          <TopNavbar systemName={systemConfig?.nombre_sistema} />
          
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default WhatsAppPageLayout;
