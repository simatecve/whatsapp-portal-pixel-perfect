
import React, { useEffect, useState, useRef } from 'react';
import TopNavbar from './TopNavbar';
import DashboardHeader from './DashboardHeader';
import StatsPanel from './StatsPanel';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import { supabase } from '@/integrations/supabase/client';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import { toast } from '@/hooks/use-toast';
import UserWelcomeCard from './UserWelcomeCard';
import SessionsOverview from './SessionsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart, Clock } from 'lucide-react';

type DashboardContentProps = {
  systemName: string | undefined;
  userId: string | null;
  profile: any;
  isLoading: boolean;
};

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  systemName, 
  userId,
  profile,
  isLoading: pageLoading
}) => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    activeUsers: 0,
    responseRate: 0,
    apiUsage: 0
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [messagesPerDay, setMessagesPerDay] = useState<any[]>([]);
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

  return (
    <>
      <TopNavbar systemName={systemName} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardHeader systemName={systemName} />
        
        {/* Welcome Card with User Info */}
        <UserWelcomeCard 
          profile={profile} 
          isLoading={pageLoading} 
          systemName={systemName}
        />
        
        {/* Stats Panel */}
        <StatsPanel stats={stats} isLoading={isLoading} />
        
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sessions Overview */}
          <SessionsOverview 
            sessions={sessions || []} 
            isLoading={isLoading} 
          />
          
          {/* Messages Timeline Card */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Mensajes por Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 w-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                </div>
              ) : messagesPerDay.length > 0 ? (
                <div className="h-64">
                  {/* Simple bar chart representation */}
                  <div className="flex h-full items-end">
                    {messagesPerDay.map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group">
                        <div 
                          className="w-full max-w-[40px] bg-primary rounded-t hover:bg-primary/80 transition-all"
                          style={{ 
                            height: `${Math.max((day.count / Math.max(...messagesPerDay.map(d => d.count))) * 100, 5)}%`,
                            opacity: day.count === 0 ? 0.3 : 1
                          }}
                        ></div>
                        <div className="text-xs mt-2 text-gray-500 whitespace-nowrap overflow-hidden">
                          {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                        </div>
                        <div className="invisible group-hover:visible absolute -mt-16 bg-black text-white text-xs p-1 rounded">
                          {day.count} mensajes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No hay datos de mensajes disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <RecentActivity messages={recentMessages} isLoading={isLoading} />
        
        {/* Quick Actions */}
        <QuickActions sessions={sessions || []} />
      </div>
    </>
  );
};

export default DashboardContent;
