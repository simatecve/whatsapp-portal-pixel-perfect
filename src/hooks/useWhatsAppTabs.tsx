
import { useState } from 'react';

export const useWhatsAppTabs = () => {
  const [activeTab, setActiveTab] = useState('sessions');

  return {
    activeTab,
    setActiveTab
  };
};
