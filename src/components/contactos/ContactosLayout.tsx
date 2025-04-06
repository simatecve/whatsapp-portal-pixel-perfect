
import React from 'react';
import { User } from '@supabase/supabase-js';
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

interface ContactosLayoutProps {
  user: User | null;
  profile: any;
  systemConfig: any;
  handleLogout: () => void;
  children: React.ReactNode;
}

const ContactosLayout: React.FC<ContactosLayoutProps> = ({ 
  user, 
  profile, 
  systemConfig, 
  handleLogout,
  children 
}) => {
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
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ContactosLayout;
