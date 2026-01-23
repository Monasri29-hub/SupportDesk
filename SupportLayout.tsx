import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SupportSidebar } from '@/components/SupportSidebar';

export default function SupportLayout() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role !== 'support') {
    return <Navigate to="/customer" replace />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <SupportSidebar />
      <main className="flex-1 bg-background p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
