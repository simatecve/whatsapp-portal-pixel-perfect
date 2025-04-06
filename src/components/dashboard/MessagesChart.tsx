
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

interface MessagesChartProps {
  messagesPerDay: Array<{ date: string; count: number }>;
  isLoading: boolean;
}

const MessagesChart: React.FC<MessagesChartProps> = ({ messagesPerDay, isLoading }) => {
  return (
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
                      height: `${Math.max((day.count / Math.max(...messagesPerDay.map(d => d.count) || [1])) * 100, 5)}%`,
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
  );
};

export default MessagesChart;
