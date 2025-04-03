
import { useState } from 'react';

interface WhatsAppConfig {
  api_key: string;
  api_url: string;
  webhook_url?: string;
}

export const useQRCodeManagement = (whatsappConfig: WhatsAppConfig | null) => {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState<boolean>(false);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  const [selectedSessionName, setSelectedSessionName] = useState<string | null>(null);

  const loadQRCode = async (sessionName: string) => {
    if (!whatsappConfig) return { success: false, errorMessage: "Configuración no disponible" };
    
    try {
      setIsLoadingQR(true);
      setQrErrorMessage(null);
      setSelectedSessionName(sessionName);
      
      console.log(`Obteniendo código QR para la sesión: ${sessionName}`);
      const qrResponse = await fetch(`${whatsappConfig.api_url}/api/${sessionName}/auth/qr?format=image`, {
        method: 'GET',
        headers: {
          'accept': 'image/png',
          'X-Api-Key': whatsappConfig.api_key
        }
      });
      
      if (!qrResponse.ok) {
        const errorData = await qrResponse.json();
        const errorMessage = errorData.error || `Error al obtener QR: ${qrResponse.statusText}`;
        console.error(`Error al obtener código QR para ${sessionName}:`, errorData);
        setQrErrorMessage(errorMessage);
        return { success: false, errorMessage };
      }
      
      const blob = await qrResponse.blob();
      const qrImageUrl = URL.createObjectURL(blob);
      setQrCodeImage(qrImageUrl);
      return { success: true, qrImageUrl };
    } catch (error) {
      console.error(`Error al obtener el código QR para ${sessionName}:`, error);
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Desconocido'}`;
      setQrErrorMessage(errorMessage);
      return { success: false, errorMessage };
    } finally {
      setIsLoadingQR(false);
    }
  };
  
  const resetQRState = () => {
    setQrCodeImage(null);
    setQrErrorMessage(null);
    setSelectedSessionName(null);
  };
  
  const getQRCodeForSession = async (sessionName: string) => {
    if (!whatsappConfig) return { success: false, errorMessage: "Configuración no disponible" };
    
    try {
      console.log(`Obteniendo código QR para la sesión: ${sessionName}`);
      const qrResponse = await fetch(`${whatsappConfig.api_url}/api/${sessionName}/auth/qr?format=image`, {
        method: 'GET',
        headers: {
          'accept': 'image/png',
          'X-Api-Key': whatsappConfig.api_key
        }
      });
      
      if (!qrResponse.ok) {
        const errorData = await qrResponse.json();
        const errorMessage = errorData.error || `Error al obtener QR: ${qrResponse.statusText}`;
        console.error(`Error al obtener código QR para ${sessionName}:`, errorData);
        return { success: false, errorMessage };
      }
      
      const blob = await qrResponse.blob();
      const qrImageUrl = URL.createObjectURL(blob);
      return { success: true, qrImageUrl };
    } catch (error) {
      console.error(`Error al obtener el código QR para ${sessionName}:`, error);
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Desconocido'}`;
      return { success: false, errorMessage };
    }
  };
  
  return { 
    qrCodeImage, 
    isLoadingQR, 
    qrErrorMessage, 
    selectedSessionName,
    loadQRCode,
    resetQRState,
    getQRCodeForSession 
  };
};
