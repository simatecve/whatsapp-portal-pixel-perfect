
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import { User } from '@supabase/supabase-js';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface WhatsAppContact {
  id: string;
  name: string;
  pushname?: string;
  isMe?: boolean;
  isGroup?: boolean;
  isBusinessAccount?: boolean;
}

interface ContactsListProps {
  sessions?: WhatsAppSession[];
  whatsappConfig?: {
    api_key: string;
    api_url: string;
  } | null;
  user?: User | null;
  standalone?: boolean;
  selectedSession?: string | null;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  sessions: propSessions, 
  whatsappConfig: propWhatsappConfig,
  user,
  standalone = false,
  selectedSession: externalSelectedSession = null
}) => {
  const { sessions: hookSessions, whatsappConfig: hookWhatsappConfig, isLoading: hookIsLoading } = 
    standalone && user ? useWhatsAppSessions(user) : { sessions: [], whatsappConfig: null, isLoading: false };
  
  // Use the provided sessions or the ones from the hook
  const sessions = standalone ? hookSessions : (propSessions || []);
  const whatsappConfig = standalone ? hookWhatsappConfig : propWhatsappConfig;
  const isLoadingSessions = standalone && hookIsLoading;
  
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const activeSessions = sessions.filter(s => 
    s.estado === 'CONECTADO' || s.estado === 'WORKING'
  );

  // Use external selected session if provided, otherwise use internal state
  const effectiveSelectedSession = externalSelectedSession !== null ? externalSelectedSession : selectedSession;
  
  useEffect(() => {
    // Auto-select first active session if available and no external session is set
    if (activeSessions.length > 0 && !effectiveSelectedSession && externalSelectedSession === null) {
      setSelectedSession(activeSessions[0].nombre_sesion);
    }
  }, [activeSessions, effectiveSelectedSession, externalSelectedSession]);
  
  useEffect(() => {
    const fetchContacts = async () => {
      if (!effectiveSelectedSession || !whatsappConfig) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${whatsappConfig.api_url}/api/contacts/all?session=${effectiveSelectedSession}`,
          {
            method: 'GET',
            headers: {
              'accept': '*/*',
              'X-Api-Key': whatsappConfig.api_key
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Error al obtener contactos: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Contactos obtenidos:', data);
        
        setContacts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener contactos:', error);
        setError(`Error al obtener contactos: ${error instanceof Error ? error.message : 'Desconocido'}`);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, [effectiveSelectedSession, whatsappConfig]);
  
  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
  };

  // Don't show the session dropdown if we're getting the session from external props
  const showSessionDropdown = externalSelectedSession === null;

  if (isLoadingSessions) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle>Cargando sesiones...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Contactos de WhatsApp</CardTitle>
          
          {showSessionDropdown && (
            activeSessions.length > 0 ? (
              <Select
                value={selectedSession || ''}
                onValueChange={handleSessionChange}
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
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
            <p className="text-gray-500">Cargando contactos...</p>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-600">{error}</div>
        ) : contacts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <User2 className="h-4 w-4" />
                      <span>{contact.name || contact.pushname || 'Sin nombre'}</span>
                      {contact.isMe && <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2">(Tú)</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{contact.id}</TableCell>
                  <TableCell>
                    {contact.isGroup && <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2">Grupo</span>}
                    {contact.isBusinessAccount && <span className="text-xs bg-green-100 text-green-800 rounded-full px-2">Negocio</span>}
                    {!contact.isGroup && !contact.isBusinessAccount && !contact.isMe && 
                      <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2">Personal</span>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : effectiveSelectedSession ? (
          <div className="py-10 text-center text-gray-500">No se encontraron contactos</div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            Seleccione una sesión para ver los contactos
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactsList;
