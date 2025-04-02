
import React from 'react';

type DashboardHeaderProps = {
  systemName: string | undefined;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ systemName }) => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-semibold text-gray-900">Panel de Control</h1>
      <p className="mt-1 text-sm text-gray-500">
        Bienvenido a su panel de administración de {systemName || 'WhatsAPI'}.
      </p>
    </div>
  );
};

export default DashboardHeader;
