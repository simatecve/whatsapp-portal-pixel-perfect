
import { User } from '@supabase/supabase-js';
import { useFetchWhatsAppData } from './whatsapp/useFetchWhatsAppData';
import { useSessionStatusCheck } from './whatsapp/useSessionStatusCheck';
import { useCreateWhatsAppSession } from './whatsapp/useCreateWhatsAppSession';
import { useDeleteWhatsAppSession } from './whatsapp/useDeleteWhatsAppSession';
import { useQRCodeManagement } from './whatsapp/useQRCodeManagement';

export const useWhatsAppSessions = (user: User | null) => {
  // Fetch WhatsApp sessions and configuration
  const { 
    sessions, 
    setSessions, 
    whatsappConfig, 
    isLoading,
    activeSession,
    setActiveSession
  } = useFetchWhatsAppData(user);
  
  // Session status management
  const { refreshing, refreshSessionStatus } = useSessionStatusCheck(
    sessions, 
    whatsappConfig, 
    setSessions
  );
  
  // Session creation functionality
  const { createWhatsAppSession } = useCreateWhatsAppSession(
    user, 
    whatsappConfig, 
    setSessions
  );
  
  // Session deletion functionality
  const { deleteWhatsAppSession } = useDeleteWhatsAppSession(
    sessions, 
    setSessions
  );
  
  // QR code management functionality
  const { 
    qrCodeImage,
    isLoadingQR,
    qrErrorMessage,
    selectedSessionName,
    loadQRCode,
    resetQRState,
    getQRCodeForSession
  } = useQRCodeManagement(whatsappConfig);
  
  return {
    sessions,
    whatsappConfig,
    isLoading,
    refreshing,
    refreshSessionStatus,
    createWhatsAppSession,
    deleteWhatsAppSession,
    qrCodeImage,
    isLoadingQR,
    qrErrorMessage,
    selectedSessionName,
    loadQRCode,
    resetQRState,
    getQRCodeForSession,
    activeSession,
    setActiveSession
  };
};
