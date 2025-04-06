
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

type UserProfilePanelProps = {
  profile: any;
  user: User | null;
};

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ profile, user }) => {
  if (!profile) return null;
  
  return (
    <div className="px-3 py-2">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
          {profile.nombre_completo ? profile.nombre_completo.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{profile.nombre_completo || 'Usuario'}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          {profile.nombre_empresa && (
            <p className="text-xs text-muted-foreground">{profile.nombre_empresa}</p>
          )}
        </div>
        <Link to="/configuracion" className="ml-auto" title="Editar perfil">
          <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Link>
      </div>
    </div>
  );
};

export default UserProfilePanel;
