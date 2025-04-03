
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// Componentes de WhatsApp
import SessionCard from '@/components/whatsapp/SessionCard';
import CreateSessionModal from '@/components/whatsapp/CreateSessionModal';
import QRCodeModal from '@/components/whatsapp/QRCodeModal';
import ContactsList from '@/components/whatsapp/ContactsList';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const WhatsApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSessionName, setSelectedSessionName] = useState<string | null>(null);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sessions');
  
  // Usar el hook personalizado para manejar las sesiones de WhatsApp
  const {
    sessions,
    whatsappConfig,
    isLoading,
    refreshing,
    refreshSessionStatus,
    createWhatsAppSession,
    deleteWhatsAppSession,
    getQRCodeForSession
  } = useWhatsAppSessions(user);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setProfile(profileData as UserProfile | null);
        } else {
          navigate('/login');
        }
        
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        setSystemConfig(configData as SystemConfig | null);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  const createSession = async () => {
    if (!newSessionName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un nombre para la sesión",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingSession(true);
    
    try {
      const result = await createWhatsAppSession(newSessionName);
      
      if (result.success) {
        const qrResult = await getQRCodeForSession(newSessionName);
        
        if (qrResult.success && qrResult.qrImageUrl) {
          setQrCodeImage(qrResult.qrImageUrl);
          setModalOpen(false);
          setShowQrModal(true);
          setSelectedSessionName(newSessionName);
          
          toast({
            title: "Sesión creada",
            description: "Escanee el código QR para conectar su WhatsApp",
          });
        } else {
          setQrErrorMessage(qrResult.errorMessage || "Error al obtener el código QR");
        }
      }
    } catch (error) {
      console.error('Error en el proceso de creación:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleConnectQR = async (sessionId: string, sessionName: string) => {
    setSelectedSessionId(sessionId);
    setSelectedSessionName(sessionName);
    setIsCreatingSession(true);
    setShowQrModal(true);
    
    const qrResult = await getQRCodeForSession(sessionName);
    
    if (qrResult.success && qrResult.qrImageUrl) {
      setQrCodeImage(qrResult.qrImageUrl);
      setQrErrorMessage(null);
    } else {
      setQrCodeImage(null);
      setQrErrorMessage(qrResult.errorMessage || "No se pudo obtener el código QR");
      toast({
        title: "Error",
        description: "No se pudo obtener el código QR. Intente nuevamente o reinicie la sesión.",
        variant: "destructive"
      });
    }
    
    setIsCreatingSession(false);
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteWhatsAppSession(sessionId);
  };

  const handleConnectComplete = async () => {
    setShowQrModal(false);
    setQrCodeImage(null);
    
    setTimeout(async () => {
      await refreshSessionStatus();
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const retryQRCode = async () => {
    if (selectedSessionName) {
      setIsCreatingSession(true);
      const qrResult = await getQRCodeForSession(selectedSessionName);
      
      if (qrResult.success && qrResult.qrImageUrl) {
        setQrCodeImage(qrResult.qrImageUrl);
        setQrErrorMessage(null);
      } else {
        setQrErrorMessage(qrResult.errorMessage || "No se pudo obtener el código QR");
      }
      
      setIsCreatingSession(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader>
            <SidebarLogo systemName={systemConfig?.nombre_sistema} />
            
            {profile && <UserProfilePanel profile={profile} user={user} />}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNavigation handleLogout={handleLogout} />
          </SidebarContent>
          
          <SidebarFooter>
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
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
            
            <div className="px-4 sm:px-0 mt-6">
              <Tabs
                defaultValue="sessions"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="sessions">Sesiones</TabsTrigger>
                  <TabsTrigger value="contacts">Contactos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sessions">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sessions.length > 0 ? (
                      sessions.map((session) => (
                        <SessionCard 
                          key={session.id}
                          session={session}
                          handleConnectQR={handleConnectQR}
                          handleDeleteSession={handleDeleteSession}
                          formatDate={formatDate}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No tiene sesiones de WhatsApp conectadas.</p>
                        <p className="text-gray-500 text-sm mt-2">Haga clic en "Conectar WhatsApp" para comenzar.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="contacts">
                  <ContactsList 
                    sessions={sessions}
                    whatsappConfig={whatsappConfig}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SidebarInset>
      </div>

      <CreateSessionModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        newSessionName={newSessionName}
        setNewSessionName={setNewSessionName}
        createSession={createSession}
        isCreatingSession={isCreatingSession}
      />

      <QRCodeModal
        showQrModal={showQrModal}
        setShowQrModal={setShowQrModal}
        qrCodeImage={qrCodeImage}
        isCreatingSession={isCreatingSession}
        qrErrorMessage={qrErrorMessage}
        retryQRCode={retryQRCode}
        handleConnectComplete={handleConnectComplete}
      />
    </SidebarProvider>
  );
};

export default WhatsApp;
