
import React, { useEffect, useState, useRef } from 'react';
import TopNavbar from './TopNavbar';
import DashboardHeader from './DashboardHeader';
import StatsPanel from './StatsPanel';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import { supabase } from '@/integrations/supabase/client';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import { toast } from '@/hooks/use-toast';

type DashboardContentProps = {
  systemName: string | undefined;
  userId: string | null;
};

const DashboardContent: React.FC<DashboardContentProps> = ({ systemName, userId }) => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    activeUsers: 0,
    responseRate: 0,
    apiUsage: 0
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesChannelRef = useRef<any>(null);
  
  // Fetch WhatsApp session data using the custom hook
  const { sessions } = useWhatsAppSessions(userId ? { id: userId } as any : null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        if (userId) {
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
          }
          
          // Calculate active sessions
          const activeSessionsCount = sessions?.filter(s => s.estado === 'CONECTADO').length || 0;
          
          // Update stats with real data
          setStats(prev => ({
            ...prev,
            activeUsers: activeSessionsCount,
            responseRate: calculateResponseRate(messagesData || []),
            apiUsage: calculateApiUsage(sessions?.length || 0, 5) // Assuming 5 is max allowed sessions
          }));
        }
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
    
    // Set up real-time subscription for messages - only if it doesn't exist yet
    if (!messagesChannelRef.current) {
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
        })
        .subscribe();
    }
      
    // Clean up subscription
    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
      }
    };
  }, [userId, sessions]);

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

  return (
    <>
      <TopNavbar systemName={systemName} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardHeader systemName={systemName} />
        <StatsPanel stats={stats} isLoading={isLoading} />
        <RecentActivity messages={recentMessages} isLoading={isLoading} />
        <QuickActions sessions={sessions || []} />
      </div>
    </>
  );
};

export default DashboardContent;
