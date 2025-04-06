
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, UserRound, Users, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
}

interface QuickActionsProps {
  sessions?: WhatsAppSession[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ sessions = [] }) => {
  const activeSessions = sessions.filter(s => s.estado === 'CONECTADO' || s.estado === 'WORKING');
  
  return (
    <div className="mt-8 px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
        <Link to="/whatsapp">
          <Button variant="link" className="text-sm">
            Ver todos
          </Button>
        </Link>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/whatsapp" className="block">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-5">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Conectar WhatsApp</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeSessions.length > 0 
                    ? `${activeSessions.length} sesiones activas` 
                    : 'Sin sesiones activas'}
                </p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/contactos" className="block">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                <UserRound className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Contactos</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Gestionar contactos
                </p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/grupos" className="block">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Grupos</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Gestionar grupos
                </p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/integraciones" className="block">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                <Webhook className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Webhooks</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configurar integraciones
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
