
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

type SidebarLogoProps = {
  systemName: string | undefined;
};

const SidebarLogo: React.FC<SidebarLogoProps> = ({ systemName }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch system configuration to get the logo URL
    const fetchLogoUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracion_sistema')
          .select('logo_url')
          .single();
        
        if (error) {
          console.error('Error fetching logo URL:', error);
        } else if (data?.logo_url) {
          setLogoUrl(data.logo_url);
        }
      } catch (error) {
        console.error('Error in logo fetch process:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogoUrl();
  }, []);

  return (
    <div className="flex items-center p-2">
      {loading ? (
        <div className="w-8 h-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : logoUrl ? (
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="w-8 h-8 object-contain"
        />
      ) : (
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
          <path d="M12 6L11.06 11.06L6 12L11.06 12.94L12 18L12.94 12.94L18 12L12.94 11.06L12 6Z" />
        </svg>
      )}
      <span className="ml-2 text-xl font-bold text-foreground">
        {systemName || 'WhatsAPI'}
      </span>
    </div>
  );
};

export default SidebarLogo;
