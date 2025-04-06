
import React from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import { useSystemConfig } from '@/hooks/useSystemConfig';
import { useUserProfile } from '@/hooks/useUserProfile';
import DashboardLoadingScreen from '@/components/dashboard/DashboardLoadingScreen';

const Dashboard: React.FC = () => {
  // Authentication and user data
  const { user, isLoading: authLoading, handleLogout } = useAuth();
  
  // System configuration data
  const { systemConfig, isLoading: configLoading } = useSystemConfig();
  
  // User profile data
  const { profile, isLoading: profileLoading } = useUserProfile(user);
  
  // Calculate overall loading state
  const isLoading = authLoading || configLoading || profileLoading;
  
  if (isLoading) {
    return <DashboardLoadingScreen />;
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <SidebarLogo systemName={systemConfig?.nombre_sistema} />
            
            {/* User profile information */}
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
