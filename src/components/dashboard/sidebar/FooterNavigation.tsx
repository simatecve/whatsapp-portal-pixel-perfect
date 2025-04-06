
import React from 'react';
import { Settings, HelpCircle, LogOut } from 'lucide-react';
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from '@/components/ui/sidebar';
import { useLocation, Link } from 'react-router-dom';

interface FooterNavigationProps {
  handleLogout: () => void;
  supportUrl: string;
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({ handleLogout, supportUrl }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const openSupportPage = () => {
    window.open(supportUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Configuración" isActive={isActive('/configuracion')}>
          <Link to="/configuracion">
            <Settings className="h-5 w-5" />
            <span>Configuración</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton onClick={openSupportPage} tooltip="Ayuda">
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
  );
};

export default FooterNavigation;
