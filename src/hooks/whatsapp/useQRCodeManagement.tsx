
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppConfig {
  api_key: string;
  api_url: string;
  webhook_url?: string;
}

interface QRCodeResult {
  success: boolean;
  qrImageUrl?: string;
  errorMessage?: string;
}

export const useQRCodeManagement = (whatsappConfig: WhatsAppConfig | null) => {
  const { toast } = useToast();
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  const [selectedSessionName, setSelectedSessionName] = useState<string | null>(null);

  const getQRCodeForSession = useCallback(async (sessionName: string): Promise<QRCodeResult> => {
    if (!whatsappConfig) {
      return { success: false, errorMessage: "Configuración no disponible" };
    }
    
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
  }, [whatsappConfig]);

  const loadQRCode = useCallback(async (sessionName: string) => {
    setIsLoadingQR(true);
    setQrErrorMessage(null);
    setSelectedSessionName(sessionName);
    
    const qrResult = await getQRCodeForSession(sessionName);
    
    if (qrResult.success && qrResult.qrImageUrl) {
      setQrCodeImage(qrResult.qrImageUrl);
    } else {
      setQrCodeImage(null);
      setQrErrorMessage(qrResult.errorMessage || "No se pudo obtener el código QR");
      toast({
        title: "Error",
        description: "No se pudo obtener el código QR. Intente nuevamente o reinicie la sesión.",
        variant: "destructive"
      });
    }
    
    setIsLoadingQR(false);
    return qrResult;
  }, [getQRCodeForSession, toast]);

  const resetQRState = useCallback(() => {
    setQrCodeImage(null);
    setQrErrorMessage(null);
    setSelectedSessionName(null);
    setIsLoadingQR(false);
  }, []);

  return { 
    qrCodeImage, 
    isLoadingQR, 
    qrErrorMessage, 
    selectedSessionName,
    getQRCodeForSession,
    loadQRCode,
    resetQRState
  };
};
