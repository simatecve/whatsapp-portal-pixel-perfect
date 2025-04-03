
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import ContactsTable from './ContactsTable';
import SessionSelector from './SessionSelector';
import LoadingState from './LoadingState';
import { toast } from 'sonner';

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
  
  // Use external selected session if provided, otherwise use internal state
  const effectiveSelectedSession = externalSelectedSession !== null ? externalSelectedSession : selectedSession;
  
  useEffect(() => {
    // Auto-select first active session if available and no external session is set
    const activeSessions = sessions.filter(s => 
      s.estado === 'CONECTADO' || s.estado === 'WORKING'
    );
    
    if (activeSessions.length > 0 && !effectiveSelectedSession && externalSelectedSession === null) {
      setSelectedSession(activeSessions[0].nombre_sesion);
    }
  }, [sessions, effectiveSelectedSession, externalSelectedSession]);
  
  useEffect(() => {
    const fetchContacts = async () => {
      if (!effectiveSelectedSession || !whatsappConfig) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching contacts for session: ${effectiveSelectedSession}`);
        console.log(`API URL: ${whatsappConfig.api_url}/api/contacts/all?session=${effectiveSelectedSession}`);
        
        const response = await fetch(
          `${whatsappConfig.api_url}/api/contacts/all?session=${effectiveSelectedSession}`,
          {
            method: 'GET',
            headers: {
              'accept': '*/*',
              'Content-Type': 'application/json',
              'X-Api-Key': whatsappConfig.api_key
            }
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          const errorMessage = errorData.error || response.statusText;
          throw new Error(`Error al obtener contactos: ${errorMessage} (${response.status})`);
        }
        
        const data = await response.json();
        console.log('Contactos obtenidos:', data);
        
        if (!Array.isArray(data)) {
          console.error('La respuesta no es un array:', data);
          throw new Error('El formato de los contactos no es válido');
        }
        
        setContacts(data);
      } catch (error) {
        console.error('Error al obtener contactos:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error al obtener contactos: ${errorMessage}`);
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
          <LoadingState type="sessions" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Contactos de WhatsApp</CardTitle>
          
          <SessionSelector 
            sessions={sessions}
            selectedSession={selectedSession}
            onSessionChange={handleSessionChange}
            showSessionDropdown={showSessionDropdown}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingState type="contacts" />
        ) : error ? (
          <LoadingState type="error" message={error} />
        ) : contacts.length > 0 ? (
          <ContactsTable contacts={contacts} />
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
