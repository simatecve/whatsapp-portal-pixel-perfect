
import React from 'react';
import TopNavbar from './TopNavbar';
import DashboardHeader from './DashboardHeader';
import StatsPanel from './StatsPanel';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';

type DashboardContentProps = {
  systemName: string | undefined;
};

const DashboardContent: React.FC<DashboardContentProps> = ({ systemName }) => {
  return (
    <>
      <TopNavbar systemName={systemName} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardHeader systemName={systemName} />
        <StatsPanel />
        <RecentActivity />
        <QuickActions />
      </div>
    </>
  );
};

export default DashboardContent;
