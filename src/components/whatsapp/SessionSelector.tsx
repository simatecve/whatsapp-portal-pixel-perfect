
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface SessionSelectorProps {
  sessions: WhatsAppSession[];
  selectedSession: string | null;
  onSessionChange: (value: string) => void;
  showSessionDropdown?: boolean;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({ 
  sessions, 
  selectedSession, 
  onSessionChange, 
  showSessionDropdown = true 
}) => {
  // Filter only active sessions
  const activeSessions = sessions.filter(s => 
    s.estado === 'CONECTADO' || s.estado === 'WORKING'
  );

  if (!showSessionDropdown) {
    return null;
  }

  return (
    activeSessions.length > 0 ? (
      <Select
        value={selectedSession || ''}
        onValueChange={onSessionChange}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Seleccione una sesión" />
        </SelectTrigger>
        <SelectContent>
          {activeSessions.map((session) => (
            <SelectItem key={session.id} value={session.nombre_sesion}>
              {session.nombre_sesion}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <div className="text-sm text-gray-500">No hay sesiones activas</div>
    )
  );
};

export default SessionSelector;
