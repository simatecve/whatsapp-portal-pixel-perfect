
import React from 'react';
import MainNavigation from './sidebar/MainNavigation';
import ApiDocMenu from './sidebar/ApiDocMenu';
import FooterNavigation from './sidebar/FooterNavigation';
import { useSidebarConfig } from '@/hooks/useSidebarConfig';

type SidebarNavigationProps = {
  handleLogout: () => void;
};

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ handleLogout }) => {
  const { apiKey, supportUrl } = useSidebarConfig();
  
  return (
    <>
      <MainNavigation />
      <ApiDocMenu apiKey={apiKey} />
      <FooterNavigation 
        handleLogout={handleLogout}
        supportUrl={supportUrl}
      />
    </>
  );
};

export default SidebarNavigation;
