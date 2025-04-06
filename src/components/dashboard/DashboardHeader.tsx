
import React from 'react';

type DashboardHeaderProps = {
  systemName: string | undefined;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ systemName }) => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        Bienvenido a su panel de administración de {systemName || 'WhatsAPI'}.
      </p>
    </div>
  );
};

export default DashboardHeader;
