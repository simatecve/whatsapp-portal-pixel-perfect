
import { useState, useEffect } from 'react';

interface WhatsAppSession {
  estado: string | null;
}

export const useWhatsAppTabs = (activeSession: WhatsAppSession | null) => {
  const [activeTab, setActiveTab] = useState('sessions');

  // Switch to contacts tab if we have an active session
  useEffect(() => {
    if (activeSession && 
        (activeSession.estado === 'CONECTADO' || 
         activeSession.estado === 'WORKING' || 
         activeSession.estado === 'connected') && 
        activeTab === 'sessions') {
      setActiveTab('contacts');
    }
  }, [activeSession, activeTab]);

  return {
    activeTab,
    setActiveTab
  };
};
