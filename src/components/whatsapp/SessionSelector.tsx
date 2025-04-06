
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Circle } from 'lucide-react';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion?: string;
  user_id?: string;
  fecha_actualizacion?: string;
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
  // Filter only active sessions (now including WORKING as active)
  const activeSessions = sessions.filter(s => 
    s.estado === 'CONECTADO' || s.estado === 'WORKING' || s.estado === 'connected'
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
            <SelectItem key={session.id} value={session.nombre_sesion} className="flex items-center">
              <div className="flex items-center w-full">
                <Circle 
                  className={`h-3 w-3 mr-2 ${session.estado === 'CONECTADO' || session.estado === 'connected' || session.estado === 'WORKING' ? 'text-green-500 fill-green-500' : 'text-yellow-500 fill-yellow-500'}`} 
                />
                {session.nombre_sesion}
              </div>
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
