
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type MessageAnalyticsProps = {
  userId: string | undefined;
};

type PushNameStats = {
  pushName: string;
  count: number;
  lastMessage: string;
  lastMessageDate: string;
};

const MessageAnalytics: React.FC<MessageAnalyticsProps> = ({ userId }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageStats, setMessageStats] = useState<PushNameStats[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Fetch all active sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('whatsapp_sesiones')
          .select('*')
          .eq('user_id', userId)
          .eq('estado', 'CONECTADO');

        if (error) {
          console.error('Error fetching sessions:', error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las sesiones activas",
            variant: "destructive"
          });
          return;
        }

        setSessions(data || []);
        if (data && data.length > 0 && !selectedSession) {
          setSelectedSession(data[0].nombre_sesion);
        }
      } catch (error) {
        console.error('Error in session fetch:', error);
      }
    };

    fetchSessions();
  }, [userId, selectedSession]);

  // Fetch messages and analyze by pushName when session changes
  useEffect(() => {
    const fetchMessagesByPushName = async () => {
      if (!selectedSession) return;

      setIsLoading(true);
      try {
        // Get all messages for the selected session
        const { data, error } = await supabase
          .from('mensajes')
          .select('*')
          .eq('nombre_sesion', selectedSession)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching messages:', error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los mensajes",
            variant: "destructive"
          });
          return;
        }

        // Process the data to group by pushName
        const pushNameMap = new Map<string, PushNameStats>();
        
        data?.forEach(message => {
          const pushName = message.pushName || 'Desconocido';
          
          if (!pushNameMap.has(pushName)) {
            pushNameMap.set(pushName, {
              pushName,
              count: 0,
              lastMessage: '',
              lastMessageDate: ''
            });
          }
          
          const stats = pushNameMap.get(pushName)!;
          stats.count += 1;
          
          // Only update last message if this is newer
          if (!stats.lastMessageDate || new Date(message.created_at) > new Date(stats.lastMessageDate)) {
            stats.lastMessage = message.mensaje || '';
            stats.lastMessageDate = message.created_at;
          }
        });
        
        // Convert map to array for display
        const statsArray = Array.from(pushNameMap.values())
          .sort((a, b) => b.count - a.count);
        
        setMessageStats(statsArray);
        
        // Create chart data
        const chartData = statsArray.map(stat => ({
          name: stat.pushName,
          Mensajes: stat.count
        }));
        
        setChartData(chartData);
      } catch (error) {
        console.error('Error processing message data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagesByPushName();
  }, [selectedSession]);

  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Análisis de Mensajes por Usuario</CardTitle>
            <div className="w-[250px]">
              <Select value={selectedSession || ''} onValueChange={handleSessionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sesión" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session.id} value={session.nombre_sesion}>
                      {session.nombre_sesion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : chartData.length > 0 ? (
            <>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Mensajes" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <Table>
                  <TableCaption>Mensajes agrupados por usuarios (PushName)</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre de Usuario</TableHead>
                      <TableHead className="text-right">Cantidad de Mensajes</TableHead>
                      <TableHead>Último Mensaje</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messageStats.map((stat) => (
                      <TableRow key={stat.pushName}>
                        <TableCell className="font-medium">{stat.pushName}</TableCell>
                        <TableCell className="text-right">{stat.count}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{stat.lastMessage}</TableCell>
                        <TableCell>
                          {new Date(stat.lastMessageDate).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {selectedSession 
                ? "No hay mensajes disponibles para esta sesión" 
                : "Seleccione una sesión para ver el análisis de mensajes"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageAnalytics;
