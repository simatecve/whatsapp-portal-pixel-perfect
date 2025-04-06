
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadLogoToSupabase, updateSystemLogo } from '@/utils/uploadLogos';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

interface LogoUploaderProps {
  currentLogoUrl: string | null;
  onLogoUpdated: (newLogoUrl: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ currentLogoUrl, onLogoUpdated }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "El archivo debe ser una imagen",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 2MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    try {
      const logoUrl = await uploadLogoToSupabase(file);
      if (logoUrl) {
        const updated = await updateSystemLogo(logoUrl);
        if (updated) {
          onLogoUpdated(logoUrl);
          toast({
            title: "Éxito",
            description: "El logo ha sido actualizado",
          });
        } else {
          toast({
            title: "Error",
            description: "No se pudo actualizar la configuración del sistema",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "No se pudo subir el logo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al subir el logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {currentLogoUrl && (
          <div className="h-16 w-16 overflow-hidden">
            <img 
              src={currentLogoUrl} 
              alt="Logo actual" 
              className="h-full w-full object-contain"
            />
          </div>
        )}
        
        <div>
          <Button 
            variant="outline" 
            className="relative"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Cambiar logo
              </>
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isUploading}
            />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        El logo debe ser una imagen de máximo 2MB.
      </p>
    </div>
  );
};

export default LogoUploader;
