
import React from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface QRCodeModalProps {
  showQrModal: boolean;
  setShowQrModal: (show: boolean) => void;
  qrCodeImage: string | null;
  isCreatingSession: boolean;
  qrErrorMessage: string | null;
  retryQRCode: () => Promise<void>;
  handleConnectComplete: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  showQrModal,
  setShowQrModal,
  qrCodeImage,
  isCreatingSession,
  qrErrorMessage,
  retryQRCode,
  handleConnectComplete,
}) => {
  return (
    <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
      <DialogContent className="w-[90vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">Escanee el código QR</DialogTitle>
          <DialogDescription className="text-center sm:text-left">
            Con su teléfono, escanee este código QR usando WhatsApp para conectar su cuenta.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          {isCreatingSession && (
            <div className="flex flex-col items-center justify-center h-48 w-48 sm:h-64 sm:w-64 bg-gray-100 rounded-lg">
              <p className="text-gray-500">Cargando código QR...</p>
            </div>
          )}
          
          {!isCreatingSession && qrCodeImage && (
            <div className="flex justify-center w-full">
              <img 
                src={qrCodeImage} 
                alt="Código QR de WhatsApp" 
                className="w-48 h-48 sm:w-64 sm:h-64 object-contain mb-4 border rounded-lg"
              />
            </div>
          )}
          
          {!isCreatingSession && qrErrorMessage && (
            <div className="flex flex-col items-center mb-4 px-2 text-center w-full">
              <p className="text-red-500 mb-4 text-sm sm:text-base">{qrErrorMessage}</p>
              <Button onClick={retryQRCode} variant="outline">
                Reintentar
              </Button>
            </div>
          )}
          
          <Button onClick={handleConnectComplete} className="mt-4 w-full sm:w-auto">
            <Check className="mr-2 h-4 w-4" />
            Listo - Conectado
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
