import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertTriangle,
  GitBranch,
  Users,
  CreditCard,
  Wrench,
  UserCog,
  DollarSign,
  HelpCircle,
  LogOut,
  Headphones,
  User
} from 'lucide-react';

const mainNavItems = [
  { path: '/support', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/support/classification', label: 'Classification', icon: FolderKanban },
  { path: '/support/urgency', label: 'Urgency Dashboard', icon: AlertTriangle },
  { path: '/support/routing', label: 'Ticket Routing', icon: GitBranch },
];

const teamNavItems = [
  { path: '/support/team/billing', label: 'Billing Team', icon: CreditCard },
  { path: '/support/team/technical', label: 'Technical Team', icon: Wrench },
  { path: '/support/team/account', label: 'Account Team', icon: UserCog },
  { path: '/support/team/finance', label: 'Finance Team', icon: DollarSign },
  { path: '/support/team/general', label: 'General Support', icon: HelpCircle },
];

export function SupportSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-accent flex items-center justify-center">
            <Headphones className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">SupportDesk</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="w-5 h-5 text-sidebar-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Support Agent</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 mb-6">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-link',
                  isActive && 'nav-link-active'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Team Views */}
        <div className="mb-2 px-4">
          <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            Team Views
          </p>
        </div>
        <div className="space-y-1">
          {teamNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-link',
                  isActive && 'nav-link-active'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="nav-link w-full text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
