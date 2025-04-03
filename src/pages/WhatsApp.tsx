import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import { useQRCodeManagement } from '@/hooks/whatsapp/useQRCodeManagement';
import WhatsAppPageLayout from '@/components/whatsapp/WhatsAppPageLayout';
import WhatsAppPageHeader from '@/components/whatsapp/WhatsAppPageHeader';
import WhatsAppContentTabs from '@/components/whatsapp/WhatsAppContentTabs';
import CreateSessionModal from '@/components/whatsapp/CreateSessionModal';
import QRCodeModal from '@/components/whatsapp/QRCodeModal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sessions');
  
  const {
    sessions,
    whatsappConfig,
    isLoading,
    refreshing,
    refreshSessionStatus,
    createWhatsAppSession,
    deleteWhatsAppSession,
  } = useWhatsAppSessions(user);
  
  const {
    qrCodeImage,
    isLoadingQR,
    qrErrorMessage,
    selectedSessionName,
    loadQRCode,
    resetQRState
  } = useQRCodeManagement(whatsappConfig);

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
    
    try {
      const result = await createWhatsAppSession(newSessionName);
      
      if (result.success) {
        const qrResult = await loadQRCode(newSessionName);
        
        if (qrResult.success) {
          setModalOpen(false);
          setShowQrModal(true);
          
          toast({
            title: "Sesión creada",
            description: "Escanee el código QR para conectar su WhatsApp",
          });
        }
      }
    } catch (error) {
      console.error('Error en el proceso de creación:', error);
    }
  };

  const handleConnectQR = async (sessionId: string, sessionName: string) => {
    setSelectedSessionId(sessionId);
    setShowQrModal(true);
    await loadQRCode(sessionName);
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteWhatsAppSession(sessionId);
  };

  const handleConnectComplete = async () => {
    setShowQrModal(false);
    resetQRState();
    
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
      await loadQRCode(selectedSessionName);
    }
  };

  return (
    <WhatsAppPageLayout 
      user={user}
      profile={profile}
      systemConfig={systemConfig}
      handleLogout={handleLogout}
    >
      <WhatsAppPageHeader 
        systemName={systemConfig?.nombre_sistema}
        openCreateModal={() => setModalOpen(true)}
        isCreatingSession={isLoadingQR}
      />
      
      <WhatsAppContentTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        whatsappConfig={whatsappConfig}
        handleConnectQR={handleConnectQR}
        handleDeleteSession={handleDeleteSession}
        formatDate={formatDate}
      />

      <CreateSessionModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        newSessionName={newSessionName}
        setNewSessionName={setNewSessionName}
        createSession={createSession}
        isCreatingSession={isLoadingQR}
      />

      <QRCodeModal
        showQrModal={showQrModal}
        setShowQrModal={setShowQrModal}
        qrCodeImage={qrCodeImage}
        isCreatingSession={isLoadingQR}
        qrErrorMessage={qrErrorMessage}
        retryQRCode={retryQRCode}
        handleConnectComplete={handleConnectComplete}
      />
    </WhatsAppPageLayout>
  );
};

export default WhatsApp;
