
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionsGrid from '@/components/whatsapp/SessionsGrid';
import ContactsList from '@/components/whatsapp/ContactsList';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface WhatsAppConfig {
  api_key: string;
  api_url: string;
}

interface WhatsAppContentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  sessions: WhatsAppSession[];
  whatsappConfig: WhatsAppConfig | null;
  handleConnectQR: (sessionId: string, sessionName: string) => void;
  handleDeleteSession: (sessionId: string) => void;
  formatDate: (dateString: string) => string;
}

const WhatsAppContentTabs: React.FC<WhatsAppContentTabsProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  whatsappConfig,
  handleConnectQR,
  handleDeleteSession,
  formatDate
}) => {
  return (
    <div className="px-4 sm:px-0 mt-6">
      <Tabs
        defaultValue="sessions"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="sessions">Sesiones</TabsTrigger>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions">
          <SessionsGrid 
            sessions={sessions}
            handleConnectQR={handleConnectQR}
            handleDeleteSession={handleDeleteSession}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="contacts">
          <ContactsList 
            sessions={sessions}
            whatsappConfig={whatsappConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppContentTabs;
