import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerSidebar } from '@/components/CustomerSidebar';

export default function CustomerLayout() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role !== 'customer') {
    return <Navigate to="/support" replace />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <CustomerSidebar />
      <main className="flex-1 bg-background p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
