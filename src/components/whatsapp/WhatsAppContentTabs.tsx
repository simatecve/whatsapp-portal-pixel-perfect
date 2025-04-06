
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionsGrid from '@/components/whatsapp/SessionsGrid';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface WhatsAppConfig {
  id: string;
  api_key: string;
  api_url: string;
  webhook_url: string;
}

interface WhatsAppContentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  sessions: WhatsAppSession[];
  handleConnectQR: (sessionId: string, sessionName: string) => void;
  handleDeleteSession: (sessionId: string) => void;
  formatDate: (dateString: string) => string;
  activeSession?: WhatsAppSession | null;
  whatsappConfig?: WhatsAppConfig | null;
}

const WhatsAppContentTabs: React.FC<WhatsAppContentTabsProps> = ({
  activeTab,
  setActiveTab,
  sessions,
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
        </TabsList>
        
        <TabsContent value="sessions">
          <SessionsGrid 
            sessions={sessions}
            handleConnectQR={handleConnectQR}
            handleDeleteSession={handleDeleteSession}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppContentTabs;
