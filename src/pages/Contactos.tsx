
import React, { useState, useEffect } from 'react';
import ContactosLayout from '@/components/contactos/ContactosLayout';
import ContactosHeader from '@/components/contactos/ContactosHeader';
import ContactsList from '@/components/whatsapp/ContactsList';
import { useContactosProfileData } from '@/hooks/useContactosProfileData';
import { useContactos } from '@/hooks/useContactos';
import DashboardLoadingScreen from '@/components/dashboard/DashboardLoadingScreen';
import { toast } from 'sonner';

const Contactos: React.FC = () => {
  const { user, profile, systemConfig, isLoading: profileLoading, handleLogout } = useContactosProfileData();
  const { sessions, whatsappConfig, isLoading: sessionsLoading, error } = useContactos(user);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Set first active session as default when sessions are loaded
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      const activeSessions = sessions.filter(s => 
        s.estado === 'CONECTADO' || s.estado === 'WORKING'
      );
      
      if (activeSessions.length > 0) {
        setSelectedSession(activeSessions[0].nombre_sesion);
      } else if (sessions.length > 0) {
        setSelectedSession(sessions[0].nombre_sesion);
      }
    }
  }, [sessions, selectedSession]);

  // Show error messages from the hook
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
  };

  // Show loading screen while profile is loading
  if (profileLoading) {
    return <DashboardLoadingScreen />;
  }

  return (
    <ContactosLayout 
      user={user} 
      profile={profile} 
      systemConfig={systemConfig}
      handleLogout={handleLogout}
    >
      <ContactosHeader
        systemName={systemConfig?.nombre_sistema}
        isLoading={sessionsLoading}
        sessions={sessions}
        selectedSession={selectedSession}
        onSessionChange={handleSessionChange}
      />
      
      <div className="px-4 sm:px-0 mt-6">
        {user && (
          <ContactsList 
            user={user}
            standalone={true}
            selectedSession={selectedSession}
          />
        )}
      </div>
    </ContactosLayout>
  );
};

export default Contactos;
