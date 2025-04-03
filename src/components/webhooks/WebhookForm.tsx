
import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface WebhookFormProps {
  webhook: WebhookConfig | null;
  sessions: WhatsAppSession[];
  onSuccess: () => void;
  user: User | null;
}

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
}

interface WebhookConfig {
  id: string;
  session_name: string;
  webhook_url: string;
  events: string[];
}

interface FormInputs {
  session_name: string;
  webhook_url: string;
  events: string[];
}

// Lista de eventos basada en la imagen de referencia
const AVAILABLE_EVENTS = [
  { id: 'session.status', label: 'session.status' },
  { id: 'message', label: 'message' },
  { id: 'message.reaction', label: 'message.reaction' },
  { id: 'message.any', label: 'message.any' },
  { id: 'group.join', label: 'group.join' },
  { id: 'group.leave', label: 'group.leave' }
];

const WebhookForm = ({ webhook, sessions, onSuccess, user }: WebhookFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<FormInputs>({
    defaultValues: webhook || {
      session_name: '',
      webhook_url: '',
      events: [],
    }
  });

  const onSubmit = async (data: FormInputs) => {
    if (!user) return;

    try {
      const webhookData = {
        ...data,
        user_id: user.id
      };

      let result;
      if (webhook) {
        result = await supabase
          .from('webhook_config')
          .update(webhookData)
          .eq('id', webhook.id);
      } else {
        result = await supabase
          .from('webhook_config')
          .insert([webhookData]);
      }

      if (result.error) throw result.error;

      // Update WhatsApp session with webhook configuration
      const apiUrl = `https://api.ecnix.ai/api/sessions/${data.session_name}`;
      
      // Create the webhook configuration exactly according to the API format
      const webhookConfig = {
        url: data.webhook_url,
        events: data.events
      };
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'X-Api-Key': '4e2adc62ecbe4769908d52cd28eb0165',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: {
            webhooks: [webhookConfig]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error updating WhatsApp session: ${response.statusText}`);
      }

      toast({
        title: "Éxito",
        description: webhook ? "Webhook actualizado correctamente" : "Webhook creado correctamente"
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el webhook",
        variant: "destructive"
      });
    }
  };

  const selectedEvents = watch('events') || [];

  const toggleEvent = (event: string) => {
    const currentEvents = selectedEvents;
    const newEvents = currentEvents.includes(event)
      ? currentEvents.filter(e => e !== event)
      : [...currentEvents, event];
    setValue('events', newEvents);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label>Sesión de WhatsApp</Label>
          <Select
            {...register('session_name')}
            onValueChange={(value) => setValue('session_name', value)}
            defaultValue={webhook?.session_name}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una sesión" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.nombre_sesion}>
                  {session.nombre_sesion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>URL del Webhook</Label>
          <Input {...register('webhook_url')} placeholder="https://api.example.com/webhook" />
        </div>

        <div>
          <Label className="mb-2 block">Eventos</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-48 overflow-y-auto">
            {AVAILABLE_EVENTS.map((event) => (
              <div key={event.id} className="flex items-center space-x-2">
                <Checkbox
                  id={event.id}
                  checked={selectedEvents.includes(event.id)}
                  onCheckedChange={() => toggleEvent(event.id)}
                />
                <label
                  htmlFor={event.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {event.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {webhook ? 'Actualizar' : 'Crear'} Webhook
        </Button>
      </div>
    </form>
  );
};

export default WebhookForm;
