
import React from 'react';
import { QrCode, Code, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface SessionCardProps {
  session: WhatsAppSession;
  handleConnectQR: (sessionId: string, sessionName: string) => void;
  handleDeleteSession: (sessionId: string) => void;
  formatDate: (dateString: string) => string;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  handleConnectQR,
  handleDeleteSession,
  formatDate,
}) => {
  // Determinar si la sesión está activa (conectada o en proceso de trabajo)
  const isSessionActive = session.estado === 'CONECTADO' || session.estado === 'WORKING';
  
  // Determinar el color y texto del badge según el estado
  const getBadgeVariant = () => {
    if (session.estado === 'CONECTADO' || session.estado === 'WORKING') {
      return {
        variant: 'success',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
        text: session.estado === 'WORKING' ? 'Activo' : 'Conectado'
      };
    } else {
      return {
        variant: 'destructive',
        className: 'bg-red-100 text-red-800 hover:bg-red-100',
        text: 'Desconectado'
      };
    }
  };
  
  const badgeProps = getBadgeVariant();

  return (
    <Card key={session.id} className="hover:shadow-md transition-shadow duration-200 border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.nombre_sesion}</CardTitle>
          <Badge 
            variant={badgeProps.variant as any}
            className={badgeProps.className}
          >
            {badgeProps.text}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Creado el: {formatDate(session.fecha_creacion)}
        </p>
      </CardHeader>
      <CardFooter className="pt-2 pb-4 flex flex-wrap gap-2">
        {!isSessionActive && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              onClick={() => handleConnectQR(session.id, session.nombre_sesion)}
            >
              <QrCode className="mr-1 h-4 w-4" />
              Conectar con QR
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <Code className="mr-1 h-4 w-4" />
              Conectar con código
            </Button>
          </>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          onClick={() => handleDeleteSession(session.id)}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
