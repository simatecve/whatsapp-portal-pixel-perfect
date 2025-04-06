
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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    // Set up real-time subscription for messages
    const channel = supabase
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
    
    // Store the channel reference
    channelRef.current = channel;
      
    // Clean up subscription
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, onNewMessage]);
};
