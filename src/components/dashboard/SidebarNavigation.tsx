
import React, { useState, useEffect } from 'react';
import { 
  Home, MessageSquare, Settings, Users, BarChart2, 
  LogOut, HelpCircle, Phone, Contact, UsersRound, Webhook, FileText, ExternalLink, Key
} from 'lucide-react';
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from '@/components/ui/sidebar';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type SidebarNavigationProps = {
  handleLogout: () => void;
};

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ handleLogout }) => {
  const location = useLocation();
  const [apiKey, setApiKey] = useState<string>('');
  
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('whatsapp_config')
          .select('api_key')
          .single();
        
        if (error) {
          console.error('Error fetching API key:', error);
          return;
        }
        
        if (data) {
          setApiKey(data.api_key);
        }
      } catch (error) {
        console.error('Error in API key fetch:', error);
      }
    };
    
    fetchApiKey();
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const openApiDocs = () => {
    window.open('https://swagger.ecnix.ai/', '_blank', 'noopener,noreferrer');
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
        .then(() => {
          alert('API key copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy API key:', err);
        });
    }
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
          <SidebarMenuButton asChild tooltip="Grupos" isActive={isActive('/grupos')}>
            <Link to="/grupos">
              <UsersRound className="h-5 w-5" />
              <span>Grupos</span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton tooltip="API Doc">
                <FileText className="h-5 w-5" />
                <span className="flex items-center">API Doc <ExternalLink className="h-3 w-3 ml-1" /></span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem onClick={openApiDocs}>
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>Open API Documentation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyApiKey} className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                <div className="flex flex-col">
                  <span className="font-medium">API Key</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {apiKey || "Loading..."}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Configuración" isActive={isActive('/configuracion')}>
            <Link to="/configuracion">
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
          </SidebarMenuButton>
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
