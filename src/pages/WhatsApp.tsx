
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle } from 'lucide-react';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface WhatsAppSession {
  id: string;
  nombre_sesion: string;
  estado: string;
  fecha_creacion: string;
}

interface WhatsAppConfig {
  id: string;
  api_key: string;
  api_url: string;
  webhook_url: string;
}

const WhatsApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  
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
          
          setProfile(profileData);
          
          // Obtener sesiones de WhatsApp del usuario
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('whatsapp_sesiones')
            .select('*')
            .eq('user_id', user.id)
            .order('fecha_creacion', { ascending: false });
          
          if (sessionsError) {
            console.error('Error al obtener sesiones:', sessionsError);
          } else {
            setSessions(sessionsData || []);
          }
          
          // Obtener configuración de WhatsApp
          const { data: configData, error: configError } = await supabase
            .from('whatsapp_config')
            .select('*')
            .maybeSingle();
          
          if (configError) {
            console.error('Error al obtener configuración:', configError);
          } else {
            setWhatsappConfig(configData);
          }
        } else {
          navigate('/login');
        }
        
        // Obtener configuración del sistema
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        setSystemConfig(configData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

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
      // Crear registro en la base de datos
      const { data: sessionData, error: sessionError } = await supabase
        .from('whatsapp_sesiones')
        .insert([
          { 
            nombre_sesion: newSessionName, 
            user_id: user?.id,
            estado: 'INICIANDO'
          }
        ])
        .select('*')
        .maybeSingle();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      // Llamar a la API para iniciar la sesión
      const response = await fetch(`${whatsappConfig.api_url}/api/sessions/default/start`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-Api-Key': whatsappConfig.api_key
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al iniciar sesión: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Sesión iniciada:', result);
      
      // Obtener el código QR
      const qrResponse = await fetch(`${whatsappConfig.api_url}/api/default/auth/qr?format=image`, {
        method: 'GET',
        headers: {
          'accept': 'image/png',
          'X-Api-Key': whatsappConfig.api_key
        }
      });
      
      if (!qrResponse.ok) {
        throw new Error(`Error al obtener el código QR: ${qrResponse.statusText}`);
      }
      
      const blob = await qrResponse.blob();
      const qrImageUrl = URL.createObjectURL(blob);
      setQrCodeImage(qrImageUrl);
      
      // Cerrar el modal de creación y mostrar el modal de QR
      setModalOpen(false);
      setShowQrModal(true);
      
      // Actualizar la lista de sesiones
      const { data: updatedSessions } = await supabase
        .from('whatsapp_sesiones')
        .select('*')
        .eq('user_id', user?.id)
        .order('fecha_creacion', { ascending: false });
      
      if (updatedSessions) {
        setSessions(updatedSessions);
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
              <h1 className="text-2xl font-semibold text-gray-900">WhatsApp</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestione sus conexiones de WhatsApp para {systemConfig?.nombre_sistema || 'el sistema'}.
              </p>
            </div>
            
            {/* Botón para crear nueva sesión */}
            <div className="px-4 sm:px-0 mb-6">
              <Button 
                onClick={() => setModalOpen(true)}
                className="flex items-center"
                disabled={isCreatingSession}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Conectar WhatsApp
              </Button>
            </div>
            
            {/* Cuadrícula de sesiones */}
            <div className="px-4 sm:px-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <Card key={session.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{session.nombre_sesion}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500">
                          <div className="flex justify-between items-center">
                            <span>Estado:</span>
                            <span className={
                              session.estado === 'CONECTADO' ? 'text-green-600 font-medium' : 
                              session.estado === 'PENDIENTE' ? 'text-yellow-600 font-medium' : 
                              session.estado === 'ERROR' ? 'text-red-600 font-medium' :
                              'text-blue-600 font-medium'
                            }>
                              {session.estado || 'PENDIENTE'}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs">Creado: {new Date(session.fecha_creacion).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
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
          <div className="flex justify-center py-6">
            {qrCodeImage && (
              <img 
                src={qrCodeImage} 
                alt="Código QR de WhatsApp" 
                className="w-64 h-64 object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQrModal(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default WhatsApp;
