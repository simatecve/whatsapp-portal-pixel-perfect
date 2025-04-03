
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
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
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
              </div>
            </div>
            
            <div className="px-4 sm:px-0 mt-6">
              {user && (
                <ContactsList 
                  sessions={[]} // Will be populated by useWhatsAppSessions hook
                  whatsappConfig={null} // Will be populated by useWhatsAppSessions hook
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
