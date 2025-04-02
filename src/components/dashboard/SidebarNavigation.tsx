
import React from 'react';
import { 
  Home, MessageSquare, Settings, Users, BarChart2, 
  LogOut, HelpCircle
} from 'lucide-react';
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from '@/components/ui/sidebar';

type SidebarNavigationProps = {
  handleLogout: () => void;
};

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ handleLogout }) => {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Inicio">
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Mensajes">
            <MessageSquare className="h-5 w-5" />
            <span>Mensajes</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Contactos">
            <Users className="h-5 w-5" />
            <span>Contactos</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Analítica">
            <BarChart2 className="h-5 w-5" />
            <span>Analítica</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Configuración">
            <Settings className="h-5 w-5" />
            <span>Configuración</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Ayuda">
            <HelpCircle className="h-5 w-5" />
            <span>Ayuda</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión">
            <LogOut className="h-5 w-5" />
            <span>Cerrar sesión</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
};

export default SidebarNavigation;
