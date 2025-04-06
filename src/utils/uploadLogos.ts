
import { supabase } from '@/integrations/supabase/client';

export const uploadLogoToSupabase = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in logo upload process:', error);
    return null;
  }
};

export const updateSystemLogo = async (logoUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('configuracion_sistema')
      .update({ logo_url: logoUrl })
      .eq('id', '1'); // Assuming there's only one system configuration

    if (error) {
      console.error('Error updating system logo:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in system logo update process:', error);
    return false;
  }
};
