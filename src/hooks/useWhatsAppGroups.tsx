
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
      // Usando el formato correcto de URL API con el nombre de la sesión en la ruta
      const apiUrl = `https://api.ecnix.ai/api/${sessionId}/groups`;
      console.log('Fetching groups from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'X-Api-Key': '4e2adc62ecbe4769908d52cd28eb0165'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        console.error('Error response al obtener grupos:', errorData);
        throw new Error(`Error al obtener grupos: ${errorData.error || response.statusText} (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Groups data received:', data);
      
      // Transformar el objeto de grupos en un array de grupos
      const formattedGroups = Object.values(data).map((group: any) => {
        return {
          id: group.id,
          name: group.subject || 'Sin nombre',
          owner: group.owner,
          description: group.desc,
          creation: group.creation ? new Date(group.creation * 1000).toISOString() : undefined,
          participants_count: group.participants?.length,
          participants: group.participants?.map((p: any) => ({
            id: p.id,
            name: p.id.split('@')[0],
            admin: p.admin
          })),
          is_community: group.isCommunity
        };
      });
      
      console.log('Formatted groups:', formattedGroups);
      setGroups(formattedGroups);
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
