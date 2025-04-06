
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DashboardStats, DashboardMessage } from '@/types/dashboard';
import { calculateResponseRate, calculateApiUsage, groupMessagesByDay } from '@/utils/dashboardUtils';
import { useRealtimeMessages } from './useRealtimeMessages';

/**
 * Hook for fetching and managing dashboard statistics
 */
export const useDashboardStats = (userId: string | null) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    activeUsers: 0,
    responseRate: 0,
    apiUsage: 0
  });
  const [recentMessages, setRecentMessages] = useState<DashboardMessage[]>([]);
  const [messagesPerDay, setMessagesPerDay] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataFetchedRef = useRef<boolean>(false);
  
  // Handle new message from real-time subscription
  const handleNewMessage = (newMessage: DashboardMessage) => {
    // Update recent messages when new message arrives
    setRecentMessages(prevMessages => {
      const newMessages = [newMessage, ...prevMessages];
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
  };
  
  // Set up real-time messages subscription
  useRealtimeMessages({
    onNewMessage: handleNewMessage,
    userId
  });
  
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
        
        // Mark that the data has been loaded
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
