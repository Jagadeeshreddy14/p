import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { LogoutModal } from './components/LogoutModal';

// Views
import { LoginView } from './views/LoginView';
import { SuperAdminView } from './views/SuperAdminView';
import { OwnerView } from './views/OwnerView';
import { WardenView } from './views/WardenView';
import { ResidentView } from './views/ResidentView';
import { ParentView } from './views/ParentView';
import { AccountantView } from './views/AccountantView';
import { RoomBedGrid } from './components/RoomBedGrid';
import { ComplaintsView } from './views/ComplaintsView';
import { FoodMessView } from './views/FoodMessView';
import { VisitorsView } from './views/VisitorsView';
import { NoticesView } from './views/NoticesView';
import { InventoryView } from './views/InventoryView';
import { AiHubView } from './views/AiHubView';
import { ResidentsRosterView } from './views/ResidentsRosterView';
import { LaundryParcelsView } from './views/LaundryParcelsView';
import { AuditLogsView } from './views/AuditLogsView';
import { UpiSettingsView } from './views/UpiSettingsView';

const MainContent: React.FC = () => {
  const { activeTab, currentUser, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'SUPER_ADMIN':
        return <SuperAdminView />;
      case 'PG_OWNER':
        return <OwnerView />;
      case 'WARDEN':
        return <WardenView initialTab="attendance" />;
      case 'RESIDENT':
        return <ResidentView />;
      case 'PARENT':
        return <ParentView />;
      case 'ACCOUNTANT':
        return <AccountantView />;
      default:
        return <OwnerView />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardByRole();
      case 'rooms':
        return <RoomBedGrid />;
      case 'residents':
        return <ResidentsRosterView />;
      case 'rent-upi':
        return <AccountantView />;
      case 'upi-settings':
        return <UpiSettingsView />;
      case 'complaints':
        return <ComplaintsView />;
      case 'attendance':
        return <WardenView key="attendance" initialTab="attendance" />;
      case 'visitors':
        return <VisitorsView />;
      case 'mess':
        return <FoodMessView />;
      case 'laundry-parcels':
        return <LaundryParcelsView />;
      case 'inventory':
        return <InventoryView />;
      case 'notices':
        return <NoticesView />;
      case 'ai-hub':
        return <AiHubView />;
      case 'audit-logs':
        return <AuditLogsView />;
      default:
        return renderDashboardByRole();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>

      <AiAssistantDrawer />
      <LogoutModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
