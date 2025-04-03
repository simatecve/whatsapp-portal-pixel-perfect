
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import WebhookForm from './WebhookForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface WebhookConfig {
  id: string;
  session_name: string;
  webhook_url: string;
  events: string[];
}

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string;
}

const WebhooksList = ({ user }: { user: User | null }) => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_config')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los webhooks",
        variant: "destructive"
      });
    }
  };

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('whatsapp_sesiones')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWebhooks();
      fetchSessions();
    }
  }, [user]);

  const handleEdit = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhook_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Webhook eliminado correctamente"
      });
      
      fetchWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el webhook",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => {
            setSelectedWebhook(null);
            setModalOpen(true);
          }}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Webhook
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sesión</TableHead>
              <TableHead>URL del Webhook</TableHead>
              <TableHead>Eventos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell>{webhook.session_name}</TableCell>
                <TableCell className="max-w-xs truncate">{webhook.webhook_url}</TableCell>
                <TableCell>{webhook.events.join(', ')}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(webhook)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(webhook.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {webhooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  No hay webhooks configurados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] mx-auto">
          <DialogHeader>
            <DialogTitle>{selectedWebhook ? 'Editar Webhook' : 'Nuevo Webhook'}</DialogTitle>
            <DialogDescription>
              Configure los detalles del webhook para su sesión de WhatsApp
            </DialogDescription>
          </DialogHeader>
          <WebhookForm
            webhook={selectedWebhook}
            sessions={sessions}
            onSuccess={() => {
              setModalOpen(false);
              fetchWebhooks();
            }}
            user={user}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebhooksList;
