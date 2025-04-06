
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalMessages: number;
  activeUsers: number;
  responseRate: number;
  apiUsage: number;
}

export interface DashboardMessage {
  id: number;
  mensaje: string | null;
  nombre_sesion: string | null;
  numero_whatsapp: string | null;
  pushName: string | null;
  created_at: string;
  quien_envia: string | null;
}

export const useDashboardData = (userId: string | null) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    activeUsers: 0,
    responseRate: 0,
    apiUsage: 0
  });
  const [recentMessages, setRecentMessages] = useState<DashboardMessage[]>([]);
  const [messagesPerDay, setMessagesPerDay] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesChannelRef = useRef<any>(null);
  const dataFetchedRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (!userId || dataFetchedRef.current) return;
    
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch recent messages with more details
        const { data: messagesData, error: messagesError } = await supabase
          .from('mensajes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          toast({
            title: "Error",
            description: "No se pudieron cargar los mensajes recientes",
            variant: "destructive"
          });
        } else {
          setRecentMessages(messagesData || []);
          
          // Update total messages count stat
          const { count, error: countError } = await supabase
            .from('mensajes')
            .select('*', { count: 'exact', head: true });
            
          if (!countError) {
            setStats(prev => ({
              ...prev,
              totalMessages: count || 0
            }));
          }
          
          // Fetch messages per day for the last 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const { data: messagesPerDayData, error: messagesPerDayError } = await supabase
            .from('mensajes')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString());
            
          if (!messagesPerDayError && messagesPerDayData) {
            // Process data for chart
            const messagesByDay = groupMessagesByDay(messagesPerDayData);
            setMessagesPerDay(messagesByDay);
          }
        }
        
        // Marcar que los datos ya se han cargado
        dataFetchedRef.current = true;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar los datos del dashboard",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [userId]);
  
  // Set up real-time subscription for messages - only if it doesn't exist yet
  useEffect(() => {
    if (!messagesChannelRef.current && userId) {
      messagesChannelRef.current = supabase
        .channel('messages-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'mensajes' 
        }, (payload) => {
          // Update recent messages when new message arrives
          setRecentMessages(prevMessages => {
            const newMessages = [payload.new, ...prevMessages];
            return newMessages.slice(0, 10); // Keep only the 10 most recent
          });
          
          // Update total message count
          setStats(prev => ({
            ...prev,
            totalMessages: prev.totalMessages + 1
          }));
          
          // Update messages per day
          setMessagesPerDay(prev => {
            const today = new Date().toISOString().split('T')[0];
            const updatedData = [...prev];
            const todayIndex = updatedData.findIndex(d => d.date === today);
            
            if (todayIndex >= 0) {
              updatedData[todayIndex].count += 1;
            } else {
              updatedData.push({ date: today, count: 1 });
            }
            
            return updatedData;
          });
        })
        .subscribe();
    }
      
    // Clean up subscription
    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
        messagesChannelRef.current = null;
      }
    };
  }, [userId]);
  
  // Helper function to calculate response rate based on messages
  const calculateResponseRate = (messages: any[]): number => {
    if (messages.length === 0) return 0;
    
    const outgoingMessages = messages.filter(m => m.quien_envia === 'bot').length;
    return Math.round((outgoingMessages / messages.length) * 100);
  };
  
  // Helper function to calculate API usage percentage
  const calculateApiUsage = (current: number, max: number): number => {
    if (max === 0) return 0;
    return Math.round((current / max) * 100);
  };
  
  // Helper function to group messages by day
  const groupMessagesByDay = (messages: any[]): any[] => {
    const groupedMessages: Record<string, number> = {};
    
    // Initialize last 7 days with 0 messages
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      groupedMessages[dateStr] = 0;
    }
    
    // Count messages per day
    messages.forEach(msg => {
      const dateStr = new Date(msg.created_at).toISOString().split('T')[0];
      groupedMessages[dateStr] = (groupedMessages[dateStr] || 0) + 1;
    });
    
    // Convert to array for chart
    return Object.entries(groupedMessages)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return { 
    stats, 
    setStats, 
    recentMessages, 
    messagesPerDay, 
    isLoading, 
    calculateResponseRate, 
    calculateApiUsage 
  };
};
