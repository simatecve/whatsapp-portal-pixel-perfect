
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import WhatsAppPageLayout from '@/components/whatsapp/WhatsAppPageLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';

const Configuracion: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  
  // Verificar autenticación
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Obtener perfil del usuario
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setProfile(profileData);
        } else {
          // No hay usuario autenticado, redirigir a login
          navigate('/login');
        }
        
        // Obtener configuración del sistema
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        setSystemConfig(configData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  
  return (
    <WhatsAppPageLayout
      user={user}
      profile={profile}
      systemConfig={systemConfig}
      handleLogout={handleLogout}
    >
      <ProfileSettings user={user} />
    </WhatsAppPageLayout>
  );
};

export default Configuracion;
