
import React from 'react';
import { 
  Home, Phone, Contact, UsersRound, BarChart2, Webhook
} from 'lucide-react';
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from '@/components/ui/sidebar';
import { useLocation, Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
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
        <SidebarMenuButton asChild tooltip="Contactos" isActive={isActive('/contactos')}>
          <Link to="/contactos">
            <Contact className="h-5 w-5" />
            <span>Contactos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Grupos" isActive={isActive('/grupos')}>
          <Link to="/grupos">
            <UsersRound className="h-5 w-5" />
            <span>Grupos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip="Analítica" isActive={isActive('/analitica') || isActive('/analitica/individual')}>
              <BarChart2 className="h-5 w-5" />
              <span className="flex items-center justify-between w-full">
                Analítica
                <ChevronDown className="h-4 w-4 ml-1" />
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/analitica" className="w-full">
                <BarChart2 className="h-4 w-4 mr-2" />
                General
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/analitica/individual" className="w-full">
                <UsersRound className="h-4 w-4 mr-2" />
                Análisis Individual
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Integraciones" isActive={isActive('/integraciones')}>
          <Link to="/integraciones">
            <Webhook className="h-5 w-5" />
            <span>Integraciones</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default MainNavigation;
