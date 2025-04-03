
import React, { useState } from 'react';
import { WhatsAppGroup, useWhatsAppGroups } from '@/hooks/useWhatsAppGroups';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw, UserCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type GroupsListProps = {
  sessions: Array<{
    id: string;
    nombre_sesion: string;
    estado: string;
  }>;
  whatsappConfig: {
    api_url: string;
    api_key: string;
  } | null;
};

const GroupCard: React.FC<{ group: WhatsAppGroup }> = ({ group }) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium truncate flex items-center">
          {group.is_community && <Info className="h-4 w-4 mr-2 text-blue-500" />}
          {group.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <UserCheck className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700">{group.participants_count || 0} participantes</span>
          </div>
          {group.description && (
            <div className="col-span-2 text-gray-600 text-xs mt-2">
              {group.description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const GroupsLoading = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="bg-white">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const GroupsList: React.FC<GroupsListProps> = ({ sessions, whatsappConfig }) => {
  const [selectedSession, setSelectedSession] = useState<string | null>(
    sessions.length > 0 ? sessions[0].nombre_sesion : null
  );
  
  const { groups, isLoading, refetch } = useWhatsAppGroups(selectedSession);
  
  const handleSessionChange = (sessionName: string) => {
    setSelectedSession(sessionName);
  };
  
  if (!whatsappConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No hay configuración de WhatsApp disponible.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select
            value={selectedSession || ""}
            onValueChange={handleSessionChange}
            disabled={sessions.length === 0}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Seleccionar sesión" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.nombre_sesion}>
                  {session.nombre_sesion} ({session.estado === 'connected' ? 'Conectado' : 'Desconectado'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()} 
            disabled={isLoading || !selectedSession}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <GroupsLoading />
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">No se encontraron grupos para esta sesión.</p>
          {selectedSession && (
            <p className="text-gray-400 text-sm">Intenta refrescar o seleccionar otra sesión.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupsList;
