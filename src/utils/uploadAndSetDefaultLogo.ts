
import { supabase } from '@/integrations/supabase/client';

// Helper function to convert a base64 string to a Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

// This function uploads the logo and sets it as the default in the system configuration
export const uploadAndSetDefaultLogo = async (
  logoBase64: string,
  mimeType: string,
  fileName: string
): Promise<boolean> => {
  try {
    // Convert base64 to blob
    const blob = base64ToBlob(logoBase64, mimeType);
    
    // Create a file from the blob
    const file = new File([blob], fileName, { type: mimeType });
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('logos')
      .upload(fileName, file, { upsert: true });
      
    if (error) {
      console.error('Error uploading logo:', error);
      return false;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);
      
    // Update the system configuration
    const { error: updateError } = await supabase
      .from('configuracion_sistema')
      .update({ logo_url: urlData.publicUrl })
      .eq('id', '1'); // Assuming there's a record with id=1
      
    if (updateError) {
      console.error('Error updating system config:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in upload and set process:', error);
    return false;
  }
};
