
import React from 'react';
import SessionCard from '@/components/whatsapp/SessionCard';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface SessionsGridProps {
  sessions: WhatsAppSession[];
  handleConnectQR: (sessionId: string, sessionName: string) => void;
  handleDeleteSession: (sessionId: string) => void;
  formatDate: (dateString: string) => string;
}

const SessionsGrid: React.FC<SessionsGridProps> = ({
  sessions,
  handleConnectQR,
  handleDeleteSession,
  formatDate
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sessions && sessions.length > 0 ? (
        sessions.map((session) => (
          <SessionCard 
            key={session.id}
            session={session}
            handleConnectQR={handleConnectQR}
            handleDeleteSession={handleDeleteSession}
            formatDate={formatDate}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No tiene sesiones de WhatsApp conectadas.</p>
          <p className="text-gray-500 text-sm mt-2">Haga clic en "Conectar WhatsApp" para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default SessionsGrid;
