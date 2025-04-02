
import React from 'react';

type SidebarLogoProps = {
  systemName: string | undefined;
};

const SidebarLogo: React.FC<SidebarLogoProps> = ({ systemName }) => {
  return (
    <div className="flex items-center p-2">
      <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
        <path d="M12 6L11.06 11.06L6 12L11.06 12.94L12 18L12.94 12.94L18 12L12.94 11.06L12 6Z" />
      </svg>
      <span className="ml-2 text-xl font-bold">
        {systemName || 'WhatsAPI'}
      </span>
    </div>
  );
};

export default SidebarLogo;
