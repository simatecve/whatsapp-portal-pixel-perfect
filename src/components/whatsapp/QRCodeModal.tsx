
import React from 'react';
import { Check, RefreshCw } from 'lucide-react';
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
  );
};

export default QRCodeModal;
