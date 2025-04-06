
import React, { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, User, Calendar, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Message {
  id: number;
  mensaje: string | null;
  nombre_sesion: string | null;
  numero_whatsapp: string | null;
  pushName: string | null;
  created_at: string;
  quien_envia: string | null;
}

interface RecentActivityProps {
  messages: Message[];
  isLoading: boolean;
}

// Using memo to prevent unnecessary re-renders
const RecentActivity: React.FC<RecentActivityProps> = memo(({ messages, isLoading }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha desconocida';
    }
  };

  const truncateMessage = (message: string | null, maxLength = 60) => {
    if (!message) return 'Sin contenido';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <Card className="mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-primary" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeleton
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : messages.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {messages.map((message) => (
              <li key={message.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary truncate flex items-center">
                      {message.quien_envia === 'user' ? (
                        <ArrowDownLeft className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                      )}
                      {truncateMessage(message.mensaje)}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        message.quien_envia === 'user' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {message.quien_envia === 'user' ? 'Recibido' : 'Enviado'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {message.pushName || message.numero_whatsapp || 'Usuario desconocido'}
                        {message.nombre_sesion && (
                          <span className="ml-2 text-xs text-gray-400">
                            ({message.nombre_sesion})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <p>
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium">No hay mensajes recientes</h3>
            <p className="mt-1 text-sm">Cuando reciba mensajes, aparecerán aquí.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RecentActivity.displayName = 'RecentActivity';

export default RecentActivity;
