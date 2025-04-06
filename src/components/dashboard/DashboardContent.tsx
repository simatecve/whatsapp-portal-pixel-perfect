
import React, { useEffect, useState, useRef } from 'react';
import TopNavbar from './TopNavbar';
import DashboardHeader from './DashboardHeader';
import StatsPanel from './StatsPanel';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import UserWelcomeCard from './UserWelcomeCard';
import SessionsOverview from './SessionsOverview';
import MessagesChart from './MessagesChart';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { supabase } from '@/integrations/supabase/client';

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
  const configChannelRef = useRef<any>(null);
  
  // Fetch WhatsApp session data using the custom hook
  const { sessions } = useWhatsAppSessions(userId ? { id: userId } as any : null);
  
  // Fetch dashboard data using our new hook
  const { 
    stats, 
    setStats, 
    recentMessages, 
    messagesPerDay, 
    isLoading, 
    calculateResponseRate, 
    calculateApiUsage 
  } = useDashboardData(userId);
  
  // Actualizar stats cuando cambian las sesiones
  useEffect(() => {
    if (!sessions) return;
    
    // Calculate active sessions
    const activeSessionsCount = sessions.filter(s => 
      s.estado === 'CONECTADO' || 
      s.estado === 'WORKING' || 
      s.estado === 'connected'
    ).length || 0;
    
    console.log('Active sessions count:', activeSessionsCount);
    
    // Update stats with real data
    setStats(prev => ({
      ...prev,
      activeUsers: activeSessionsCount,
      responseRate: calculateResponseRate(recentMessages),
      apiUsage: calculateApiUsage(sessions.length || 0, 5) // Assuming 5 is max allowed sessions
    }));
  }, [sessions, recentMessages, calculateResponseRate, calculateApiUsage, setStats]);

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
          <MessagesChart messagesPerDay={messagesPerDay} isLoading={isLoading} />
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
