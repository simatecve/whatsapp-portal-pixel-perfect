
import React, { useEffect, useState } from 'react';
import TopNavbar from './TopNavbar';
import DashboardHeader from './DashboardHeader';
import StatsPanel from './StatsPanel';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import { supabase } from '@/integrations/supabase/client';

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
  const [sessions, setSessions] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        if (userId) {
          // Fetch WhatsApp sessions
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('whatsapp_sesiones')
            .select('*')
            .eq('user_id', userId)
            .order('fecha_creacion', { ascending: false });
            
          if (sessionsError) {
            console.error('Error fetching sessions:', sessionsError);
          } else {
            setSessions(sessionsData || []);
            
            // Calculate stats based on sessions
            setStats(prev => ({
              ...prev,
              activeUsers: sessionsData?.filter(s => s.estado === 'CONECTADO').length || 0
            }));
          }
          
          // Fetch recent messages
          const { data: messagesData, error: messagesError } = await supabase
            .from('mensajes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
          } else {
            setRecentMessages(messagesData || []);
            
            // Update message count stat
            setStats(prev => ({
              ...prev,
              totalMessages: messagesData ? messagesData.length : 0
            }));
          }
          
          // Set demo stats for the remaining metrics
          setStats(prev => ({
            ...prev,
            responseRate: 92,
            apiUsage: 64
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up real-time subscription for messages
    const messagesChannel = supabase
      .channel('public:mensajes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensajes' 
      }, (payload) => {
        // Update recent messages when new message arrives
        setRecentMessages(prevMessages => {
          const newMessages = [payload.new, ...prevMessages];
          return newMessages.slice(0, 5); // Keep only the 5 most recent
        });
        
        // Update total message count
        setStats(prev => ({
          ...prev,
          totalMessages: prev.totalMessages + 1
        }));
      })
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [userId]);

  return (
    <>
      <TopNavbar systemName={systemName} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardHeader systemName={systemName} />
        <StatsPanel stats={stats} isLoading={isLoading} />
        <RecentActivity messages={recentMessages} isLoading={isLoading} />
        <QuickActions sessions={sessions} />
      </div>
    </>
  );
};

export default DashboardContent;
