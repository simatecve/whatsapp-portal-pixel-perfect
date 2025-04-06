
import React from 'react';
import { FileText, ExternalLink, Key } from 'lucide-react';
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ApiDocMenuProps {
  apiKey: string;
}

const ApiDocMenu: React.FC<ApiDocMenuProps> = ({ apiKey }) => {
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
    <SidebarMenu>
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
    </SidebarMenu>
  );
};

export default ApiDocMenu;
