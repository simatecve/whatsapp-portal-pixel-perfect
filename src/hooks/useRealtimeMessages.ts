
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMessage } from '@/types/dashboard';

interface UseRealtimeMessagesProps {
  onNewMessage: (message: DashboardMessage) => void;
  userId: string | null;
}

/**
 * Hook for subscribing to real-time message updates
 */
export const useRealtimeMessages = ({ onNewMessage, userId }: UseRealtimeMessagesProps) => {
  const messagesChannelRef = useRef<any>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    // Set up real-time subscription for messages
    messagesChannelRef.current = supabase
      .channel('messages-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensajes' 
      }, (payload) => {
        // Cast the payload.new to the DashboardMessage type
        const newMessage = payload.new as DashboardMessage;
        
        // Call the callback with the new message
        onNewMessage(newMessage);
      })
      .subscribe();
      
    // Clean up subscription
    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
        messagesChannelRef.current = null;
      }
    };
  }, [userId, onNewMessage]);
};
