
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
    
    // Clean up existing channel if any
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.log('Error removing channel:', error);
      }
      channelRef.current = null;
    }
    
    // Set up real-time subscription for messages
    try {
      console.log('Setting up messages realtime channel for user:', userId);
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
        .subscribe((status) => {
          console.log('Supabase messages channel status:', status);
        });
      
      // Store the channel reference
      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up Supabase channel:', error);
    }
      
    // Clean up subscription
    return () => {
      console.log('Cleaning up Supabase messages channel');
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.log('Error removing channel on cleanup:', error);
        }
        channelRef.current = null;
      }
    };
  }, [userId, onNewMessage]);
};
