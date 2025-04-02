
import React from 'react';
import { BellRing, Mail } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

type TopNavbarProps = {
  systemName: string | undefined;
};

const TopNavbar: React.FC<TopNavbarProps> = ({ systemName }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <SidebarTrigger className="mr-2" />
            <span className="text-xl font-semibold">
              {systemName ? `Panel de Control - ${systemName}` : 'Panel de Control'}
            </span>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
              <BellRing className="h-6 w-6" />
              <span className="sr-only">Notificaciones</span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none ml-2">
              <Mail className="h-6 w-6" />
              <span className="sr-only">Mensajes</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
