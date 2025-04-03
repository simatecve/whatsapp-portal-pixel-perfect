
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface WhatsAppGroup {
  id: string;
  name: string;
  owner?: string;
  description?: string;
  creation?: string;
  participants_count?: number;
  participants?: Array<{
    id: string;
    name: string;
  }>;
  is_community?: boolean;
}

export function useWhatsAppGroups(selectedSession: string | null) {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchGroups = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.ecnix.ai/api/${sessionId}/groups`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'X-Api-Key': '4e2adc62ecbe4769908d52cd28eb0165'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener grupos: ${response.status}`);
      }
      
      const data = await response.json();
      setGroups(Object.values(data));
    } catch (err) {
      console.error('Error fetching WhatsApp groups:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener grupos');
      toast({
        title: "Error",
        description: "No se pudieron cargar los grupos de WhatsApp",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedSession) {
      fetchGroups(selectedSession);
    } else {
      setGroups([]);
    }
  }, [selectedSession]);
  
  return { groups, isLoading, error, refetch: () => selectedSession && fetchGroups(selectedSession) };
}
