
import React from 'react';
import WhatsAppPageLayout from '@/components/whatsapp/WhatsAppPageLayout';
import WhatsAppPageHeader from '@/components/whatsapp/WhatsAppPageHeader';
import WhatsAppContentTabs from '@/components/whatsapp/WhatsAppContentTabs';
import CreateSessionModal from '@/components/whatsapp/CreateSessionModal';
import QRCodeModal from '@/components/whatsapp/QRCodeModal';
import { useUserAndSystemData } from '@/hooks/useUserAndSystemData';
import { useWhatsAppSessions } from '@/hooks/useWhatsAppSessions';
import { useWhatsAppModals } from '@/hooks/useWhatsAppModals';
import { useWhatsAppTabs } from '@/hooks/useWhatsAppTabs';

const WhatsApp: React.FC = () => {
  // Load user and system data
  const { 
    user, 
    profile, 
    systemConfig, 
    handleLogout 
  } = useUserAndSystemData();

  // WhatsApp sessions management
  const {
    sessions,
    whatsappConfig,
    isLoading,
    refreshing,
    refreshSessionStatus,
    createWhatsAppSession,
    deleteWhatsAppSession,
    activeSession,
    qrCodeImage,
    isLoadingQR,
    qrErrorMessage,
    selectedSessionName,
    loadQRCode,
    resetQRState,
  } = useWhatsAppSessions(user);

  // Modal state management
  const {
    modalOpen,
    setModalOpen,
    newSessionName,
    setNewSessionName,
    showQrModal,
    setShowQrModal,
    handleConnectQR,
    createSession,
    handleConnectComplete
  } = useWhatsAppModals(loadQRCode, createWhatsAppSession, refreshSessionStatus);

  // Tab management
  const { activeTab, setActiveTab } = useWhatsAppTabs(activeSession);

  // Utility function for formatting dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to retry loading QR code
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
        handleDeleteSession={deleteWhatsAppSession}
        formatDate={formatDate}
        activeSession={activeSession}
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
