
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ContactosHeaderProps {
  systemName?: string;
  isLoading: boolean;
  sessions: Array<{
    id: string;
    nombre_sesion: string;
    estado: string | null;
  }>;
  selectedSession: string | null;
  onSessionChange: (value: string) => void;
}

const ContactosHeader: React.FC<ContactosHeaderProps> = ({
  systemName,
  isLoading,
  sessions,
  selectedSession,
  onSessionChange
}) => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contactos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestione sus contactos de WhatsApp para {systemName || 'el sistema'}.
          </p>
        </div>

        <div className="flex items-center">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500">Cargando sesiones...</span>
            </div>
          ) : sessions.length > 0 ? (
            <Select
              value={selectedSession || ''}
              onValueChange={onSessionChange}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Seleccione una sesión" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.nombre_sesion}>
                    {session.nombre_sesion} 
                    {session.estado && ` (${session.estado})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500">No hay sesiones disponibles</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactosHeader;
