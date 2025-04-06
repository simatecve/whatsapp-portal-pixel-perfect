
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';

interface UserWelcomeCardProps {
  profile: any;
  isLoading: boolean;
  systemName: string | undefined;
}

const UserWelcomeCard: React.FC<UserWelcomeCardProps> = ({ profile, isLoading, systemName }) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  let greeting = '';
  if (currentHour < 12) {
    greeting = 'Buenos días';
  } else if (currentHour < 18) {
    greeting = 'Buenas tardes';
  } else {
    greeting = 'Buenas noches';
  }
  
  const date = currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Capitalize first letter of date
  const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);
  
  return (
    <Card className="mt-4 bg-primary text-white">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-64 bg-primary-foreground/20" />
            ) : (
              <h2 className="text-2xl font-semibold">
                {greeting}, {profile?.nombre_completo || 'Usuario'}
              </h2>
            )}
            
            <div className="flex items-center mt-2 text-white/80">
              <Clock className="h-4 w-4 mr-2" />
              <p>{formattedDate}</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-sm font-medium">
              {isLoading ? (
                <Skeleton className="h-4 w-40 bg-primary-foreground/20" />
              ) : (
                <p>
                  Bienvenido a {systemName || 'Ecnix API'}
                </p>
              )}
            </div>
            
            {profile?.nombre_empresa && (
              <div className="mt-1 text-sm font-medium text-white/80">
                {profile.nombre_empresa}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserWelcomeCard;
