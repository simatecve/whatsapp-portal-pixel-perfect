
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useWhatsAppModals = (
  loadQRCode: (sessionName: string) => Promise<{ success: boolean }>,
  createWhatsAppSession: (name: string) => Promise<{ success: boolean }>,
  refreshSessionStatus: () => Promise<void>
) => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

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

  const handleConnectComplete = async () => {
    setShowQrModal(false);
    
    setTimeout(async () => {
      await refreshSessionStatus();
    }, 2000);
  };

  return {
    modalOpen,
    setModalOpen,
    newSessionName,
    setNewSessionName,
    showQrModal,
    setShowQrModal,
    selectedSessionId,
    createSession,
    handleConnectQR,
    handleConnectComplete
  };
};
