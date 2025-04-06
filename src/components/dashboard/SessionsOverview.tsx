
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Session {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
}

interface SessionsOverviewProps {
  sessions: Session[];
  isLoading: boolean;
}

const SessionsOverview: React.FC<SessionsOverviewProps> = ({ sessions, isLoading }) => {
  // Use useMemo to avoid unnecessary re-calculations
  const { connectedSessions, pendingSessions, disconnectedSessions } = useMemo(() => {
    // Group sessions by status
    const connected = sessions.filter(s => s.estado === 'CONECTADO');
    const pending = sessions.filter(s => s.estado === 'PENDIENTE' || s.estado === 'WORKING');
    const disconnected = sessions.filter(s => s.estado === 'DESCONECTADO');
    
    return {
      connectedSessions: connected,
      pendingSessions: pending,
      disconnectedSessions: disconnected
    };
  }, [sessions]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-primary" />
          Estado de Sesiones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Conectadas</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">
                {connectedSessions.length}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <span>Pendientes</span>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800">
                {pendingSessions.length}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span>Desconectadas</span>
              </div>
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800">
                {disconnectedSessions.length}
              </Badge>
            </div>
            
            {sessions.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Sesiones recientes:</h4>
                <ul className="space-y-2">
                  {sessions.slice(0, 3).map((session) => (
                    <li key={session.id} className="text-sm flex items-center justify-between">
                      <span className="truncate">{session.nombre_sesion}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          session.estado === 'CONECTADO' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : session.estado === 'PENDIENTE' || session.estado === 'WORKING'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {session.estado}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-medium">No hay sesiones</h3>
            <p className="mt-1 text-sm">Cree una sesión de WhatsApp para comenzar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionsOverview;
