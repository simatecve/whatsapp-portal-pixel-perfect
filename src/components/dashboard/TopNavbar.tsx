
import React from 'react';
import { BellRing, Mail, Sun, Moon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

type TopNavbarProps = {
  systemName: string | undefined;
};

const TopNavbar: React.FC<TopNavbarProps> = ({ systemName }) => {
  return (
    <nav className="bg-primary text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <SidebarTrigger className="mr-2 text-white" />
            <span className="text-xl font-semibold">
              {systemName ? `${systemName}` : 'Panel de Control'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-foreground/10">
              <BellRing className="h-5 w-5" />
              <span className="sr-only">Notificaciones</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-foreground/10">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Mensajes</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-foreground/10">
              <Sun className="h-5 w-5" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
