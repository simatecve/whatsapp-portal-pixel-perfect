
import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, PercentCircle, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsProps {
  stats: {
    totalMessages: number;
    activeUsers: number;
    responseRate: number;
    apiUsage: number;
  };
  isLoading: boolean;
}

// Using memo to prevent unnecessary re-renders
const StatsPanel: React.FC<StatsProps> = memo(({ stats, isLoading }) => {
  return (
    <div className="mt-4 px-4 sm:px-0">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 - Total Messages */}
        <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Mensajes</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-primary">{stats.totalMessages.toLocaleString()}</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  +12,5% desde el mes pasado
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Stat 2 - Active Users */}
        <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Sesiones Activas</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-primary">{stats.activeUsers}</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  +8,2% desde el mes pasado
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Stat 3 - Response Rate */}
        <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Tasa de Respuesta</CardTitle>
            <PercentCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-primary">{stats.responseRate}%</div>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1 transform rotate-180" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  -2,3% desde el mes pasado
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Stat 4 - API Usage */}
        <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Uso de API</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-primary">{stats.apiUsage}%</div>
                <p className="text-xs text-gray-500 mt-1">
                  del cupo mensual
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className={`h-full rounded-full ${
                      stats.apiUsage < 50 
                        ? 'bg-green-500' 
                        : stats.apiUsage < 75 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${stats.apiUsage}%` }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

StatsPanel.displayName = 'StatsPanel';

export default StatsPanel;
