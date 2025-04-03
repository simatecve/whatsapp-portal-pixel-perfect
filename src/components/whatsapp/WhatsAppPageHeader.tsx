
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppPageHeaderProps {
  systemName: string | undefined;
  openCreateModal: () => void;
  isCreatingSession: boolean;
}

const WhatsAppPageHeader: React.FC<WhatsAppPageHeaderProps> = ({ 
  systemName, 
  openCreateModal, 
  isCreatingSession 
}) => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">WhatsApp</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestione sus conexiones de WhatsApp para {systemName || 'el sistema'}.
          </p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="flex items-center"
          disabled={isCreatingSession}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Conectar WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppPageHeader;
