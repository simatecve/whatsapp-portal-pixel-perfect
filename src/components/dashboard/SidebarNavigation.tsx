
import React from 'react';
import { 
  Home, MessageSquare, Settings, Users, BarChart2, 
  LogOut, HelpCircle, Phone, Contact
} from 'lucide-react';
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from '@/components/ui/sidebar';
import { useLocation, Link } from 'react-router-dom';

type SidebarNavigationProps = {
  handleLogout: () => void;
};

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ handleLogout }) => {
  const location = useLocation();
  
  // Comprueba si la ruta actual coincide con el enlace
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Inicio" isActive={isActive('/dashboard')}>
            <Link to="/dashboard">
              <Home className="h-5 w-5" />
              <span>Inicio</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="WhatsApp" isActive={isActive('/whatsapp')}>
            <Link to="/whatsapp">
              <Phone className="h-5 w-5" />
              <span>WhatsApp</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Mensajes" isActive={isActive('/mensajes')}>
            <Link to="/mensajes">
              <MessageSquare className="h-5 w-5" />
              <span>Mensajes</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Contactos" isActive={isActive('/contactos')}>
            <Link to="/contactos">
              <Contact className="h-5 w-5" />
              <span>Contactos</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Analítica" isActive={isActive('/analitica')}>
            <Link to="/analitica">
              <BarChart2 className="h-5 w-5" />
              <span>Analítica</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Configuración" isActive={isActive('/configuracion')}>
            <Link to="/configuracion">
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
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
