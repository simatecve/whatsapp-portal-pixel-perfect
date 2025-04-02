
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, QrCode, Code, Trash2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNavigation from '@/components/dashboard/SidebarNavigation';
import SidebarLogo from '@/components/dashboard/SidebarLogo';
import UserProfilePanel from '@/components/dashboard/UserProfilePanel';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string | null;
  fecha_creacion: string;
  user_id: string;
  fecha_actualizacion: string;
}

interface WhatsAppConfig {
  id: string;
  api_key: string;
  api_url: string;
  webhook_url: string;
}

interface SystemConfig {
  id: string;
  nombre_sistema: string;
  [key: string]: any;
}

interface UserProfile {
  id: string;
  nombre_completo: string | null;
  [key: string]: any;
}

interface SessionStatus {
  status: string;
  message: string;
  user?: {
    name: string;
    number: string;
    [key: string]: any;
  };
}

const WhatsApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSessionName, setSelectedSessionName] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  
  // Verificación de autenticación y carga de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Obtener perfil del usuario
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setProfile(profileData as UserProfile | null);
          
          // Obtener sesiones de WhatsApp del usuario
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('whatsapp_sesiones')
            .select('*')
            .eq('user_id', user.id)
            .order('fecha_creacion', { ascending: false });
          
          if (sessionsError) {
            console.error('Error al obtener sesiones:', sessionsError);
          } else {
            setSessions(sessionsData as WhatsAppSession[] || []);
            
            // Verificar estado de cada sesión con la API
            if (sessionsData && sessionsData.length > 0) {
              await checkSessionsStatus(sessionsData as WhatsAppSession[]);
            }
          }
          
          // Obtener configuración de WhatsApp
          const { data: configData, error: configError } = await supabase
            .from('whatsapp_config')
            .select('*')
            .maybeSingle();
          
          if (configError) {
            console.error('Error al obtener configuración:', configError);
          } else {
            setWhatsappConfig(configData as WhatsAppConfig | null);
          }
        } else {
          navigate('/login');
        }
        
        // Obtener configuración del sistema
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        setSystemConfig(configData as SystemConfig | null);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Verificar el estado de las sesiones
  const checkSessionsStatus = async (sessionsToCheck: WhatsAppSession[]) => {
    if (!whatsappConfig) return;

    try {
      setRefreshing(true);
      
      // Para cada sesión, consultar su estado
      for (const session of sessionsToCheck) {
        try {
          console.log(`Verificando estado de sesión: ${session.nombre_sesion}`);
          const response = await fetch(`${whatsappConfig.api_url}/api/sessions/${session.nombre_sesion}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'X-Api-Key': whatsappConfig.api_key
            }
          });
          
          if (!response.ok) {
            console.error(`Error al verificar estado de sesión ${session.nombre_sesion}:`, response.statusText);
            continue;
          }
          
          const result = await response.json() as SessionStatus;
          console.log(`Estado de sesión ${session.nombre_sesion}:`, result);
          
          // Actualizar el estado en la base de datos
          const apiStatus = result.status === 'CONNECTED' ? 'CONECTADO' : 'DESCONECTADO';
          
          if (session.estado !== apiStatus) {
            await supabase
              .from('whatsapp_sesiones')
              .update({ estado: apiStatus })
              .eq('id', session.id);
              
            session.estado = apiStatus;
          }
        } catch (error) {
          console.error(`Error al verificar sesión ${session.nombre_sesion}:`, error);
        }
      }
      
      // Actualizar el estado de las sesiones en el componente
      setSessions([...sessionsToCheck]);
    } catch (error) {
      console.error('Error al verificar el estado de las sesiones:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  const createSession = async () => {
    if (!newSessionName.trim() || !whatsappConfig) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un nombre para la sesión",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingSession(true);
    
    try {
      // PRIMERO: Llamar a la API para iniciar la sesión
      console.log("Llamando a la API para iniciar sesión...");
      const response = await fetch(`${whatsappConfig.api_url}/api/sessions/${newSessionName}/start`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-Api-Key': whatsappConfig.api_key
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al iniciar sesión en la API: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Respuesta de la API al iniciar sesión:', result);
      
      // SEGUNDO: Crear el registro en la base de datos
      const { data: sessionData, error: sessionError } = await supabase
        .from('whatsapp_sesiones')
        .insert([
          { 
            nombre_sesion: newSessionName, 
            user_id: user?.id,
            estado: result.status || 'INICIANDO'
          }
        ])
        .select('*')
        .maybeSingle();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      // Obtener el código QR para la sesión recién creada
      await getQRCodeForSession(newSessionName);
      
      // Cerrar el modal de creación y mostrar el modal de QR
      setModalOpen(false);
      setShowQrModal(true);
      setSelectedSessionName(newSessionName);
      
      // Actualizar la lista de sesiones
      const { data: updatedSessions } = await supabase
        .from('whatsapp_sesiones')
        .select('*')
        .eq('user_id', user?.id)
        .order('fecha_creacion', { ascending: false });
      
      if (updatedSessions) {
        setSessions(updatedSessions as WhatsAppSession[]);
      }
      
      toast({
        title: "Sesión creada",
        description: "Escanee el código QR para conectar su WhatsApp",
      });
    } catch (error) {
      console.error('Error al crear la sesión:', error);
      toast({
        title: "Error",
        description: `Error al crear la sesión: ${error instanceof Error ? error.message : 'Desconocido'}`,
        variant: "destructive"
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const getQRCodeForSession = async (sessionName: string) => {
    if (!whatsappConfig) return;
    
    setQrErrorMessage(null);
    
    try {
      console.log(`Obteniendo código QR para la sesión: ${sessionName}`);
      // Obtener el código QR
      const qrResponse = await fetch(`${whatsappConfig.api_url}/api/${sessionName}/auth/qr?format=image`, {
        method: 'GET',
        headers: {
          'accept': 'image/png',
          'X-Api-Key': whatsappConfig.api_key
        }
      });
      
      if (!qrResponse.ok) {
        const errorData = await qrResponse.json();
        setQrErrorMessage(errorData.error || `Error al obtener QR: ${qrResponse.statusText}`);
        console.error(`Error al obtener código QR para ${sessionName}:`, errorData);
        return false;
      }
      
      const blob = await qrResponse.blob();
      const qrImageUrl = URL.createObjectURL(blob);
      setQrCodeImage(qrImageUrl);
      return true;
    } catch (error) {
      console.error(`Error al obtener el código QR para ${sessionName}:`, error);
      setQrErrorMessage(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
      return false;
    }
  };

  const handleConnectQR = async (sessionId: string, sessionName: string) => {
    setSelectedSessionId(sessionId);
    setSelectedSessionName(sessionName);
    setIsCreatingSession(true);
    setShowQrModal(true);
    
    const success = await getQRCodeForSession(sessionName);
    
    if (!success) {
      toast({
        title: "Error",
        description: "No se pudo obtener el código QR. Intente nuevamente o reinicie la sesión.",
        variant: "destructive"
      });
    }
    
    setIsCreatingSession(false);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_sesiones')
        .delete()
        .eq('id', sessionId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Actualizar la lista de sesiones
      setSessions(sessions.filter(session => session.id !== sessionId));
      
      toast({
        title: "Sesión eliminada",
        description: "La sesión ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error('Error al eliminar la sesión:', error);
      toast({
        title: "Error",
        description: `Error al eliminar la sesión: ${error instanceof Error ? error.message : 'Desconocido'}`,
        variant: "destructive"
      });
    }
  };

  const handleConnectComplete = async () => {
    setShowQrModal(false);
    setQrCodeImage(null);
    
    // Verificar el estado de la sesión después de un breve retraso
    setTimeout(async () => {
      await checkSessionsStatus(sessions);
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const retryQRCode = async () => {
    if (selectedSessionName) {
      setIsCreatingSession(true);
      await getQRCodeForSession(selectedSessionName);
      setIsCreatingSession(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <SidebarLogo systemName={systemConfig?.nombre_sistema} />
            
            {/* Información del usuario */}
            {profile && <UserProfilePanel profile={profile} user={user} />}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNavigation handleLogout={handleLogout} />
          </SidebarContent>
          
          <SidebarFooter>
            {/* Footer content if needed */}
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset>
          <TopNavbar systemName={systemConfig?.nombre_sistema} />
          
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">WhatsApp</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Gestione sus conexiones de WhatsApp para {systemConfig?.nombre_sistema || 'el sistema'}.
                  </p>
                </div>
                <Button 
                  onClick={() => setModalOpen(true)}
                  className="flex items-center"
                  disabled={isCreatingSession}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Conectar WhatsApp
                </Button>
              </div>
            </div>
            
            {/* Cuadrícula de sesiones */}
            <div className="px-4 sm:px-0 mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <Card key={session.id} className="hover:shadow-md transition-shadow duration-200 border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{session.nombre_sesion}</CardTitle>
                          <Badge 
                            variant={session.estado === 'CONECTADO' ? 'success' : 'destructive'}
                            className={
                              session.estado === 'CONECTADO' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : 'bg-red-100 text-red-800 hover:bg-red-100'
                            }
                          >
                            {session.estado === 'CONECTADO' ? 'Conectado' : 'Desconectado'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Creado el: {formatDate(session.fecha_creacion)}
                        </p>
                      </CardHeader>
                      <CardFooter className="pt-2 pb-4 flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          onClick={() => handleConnectQR(session.id, session.nombre_sesion)}
                        >
                          <QrCode className="mr-1 h-4 w-4" />
                          Conectar con QR
                        </Button>
                        {session.estado !== 'CONECTADO' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          >
                            <Code className="mr-1 h-4 w-4" />
                            Conectar con código
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Eliminar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No tiene sesiones de WhatsApp conectadas.</p>
                    <p className="text-gray-500 text-sm mt-2">Haga clic en "Conectar WhatsApp" para comenzar.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>

      {/* Modal para crear nueva sesión */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            <DialogDescription>
              Ingrese un nombre para identificar esta conexión de WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="session-name">Nombre de la sesión</Label>
            <Input
              id="session-name"
              placeholder="Mi WhatsApp"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              disabled={isCreatingSession}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isCreatingSession}>
              Cancelar
            </Button>
            <Button onClick={createSession} disabled={!newSessionName.trim() || isCreatingSession}>
              {isCreatingSession ? 'Creando...' : 'Crear sesión'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para mostrar el código QR */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanee el código QR</DialogTitle>
            <DialogDescription>
              Con su teléfono, escanee este código QR usando WhatsApp para conectar su cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            {isCreatingSession && (
              <div className="flex flex-col items-center justify-center h-64 w-64 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Cargando código QR...</p>
              </div>
            )}
            
            {!isCreatingSession && qrCodeImage && (
              <img 
                src={qrCodeImage} 
                alt="Código QR de WhatsApp" 
                className="w-64 h-64 object-contain mb-6 border rounded-lg"
              />
            )}
            
            {!isCreatingSession && qrErrorMessage && (
              <div className="flex flex-col items-center mb-6">
                <p className="text-red-500 text-center mb-4">{qrErrorMessage}</p>
                <Button onClick={retryQRCode} variant="outline" className="mt-2">
                  Reintentar
                </Button>
              </div>
            )}
            
            <Button onClick={handleConnectComplete} className="mt-4">
              <Check className="mr-2 h-4 w-4" />
              Listo - Conectado
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default WhatsApp;
