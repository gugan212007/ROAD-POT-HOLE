import { useApp } from '@/context/AppContext';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import MyReports from './MyReports';
import AdminDashboard from './AdminDashboard';
import AnalyticsPage from './AnalyticsPage';
import ProjectView from './ProjectView';
import AppSidebar from '@/components/AppSidebar';
import HamburgerMenu from '@/components/HamburgerMenu';
import SubmitModal from '@/components/SubmitModal';
import FAB from '@/components/FAB';

const Index = () => {
  const { user, page, selectedProject } = useApp();

  if (!user) return <AuthPage />;

  let content;
  if (selectedProject) {
    content = <ProjectView />;
  } else if (user.is_admin) {
    content = page === 'analytics' ? <AnalyticsPage /> : <AdminDashboard />;
  } else if (page === 'myreports') {
    content = <MyReports />;
  } else {
    content = <Dashboard />;
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'hsl(var(--body-bg))' }}>
      <HamburgerMenu />
      <AppSidebar />
      <div className="md:ml-[260px] flex-1 min-h-screen bg-card flex flex-col" style={{ boxShadow: '-4px 0 40px hsl(271 45% 44% / 0.08)' }}>
        {content}
      </div>
      <FAB />
      <SubmitModal />
    </div>
  );
};

export default Index;
