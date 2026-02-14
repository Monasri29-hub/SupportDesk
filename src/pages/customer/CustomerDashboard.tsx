import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { StatCard } from '@/components/ui/stat-card';
import { TicketTable } from '@/components/TicketTable';
import { Button } from '@/components/ui/button';
import { PlusCircle, Ticket, Clock, CheckCircle, ArrowRight, LogOut } from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { tickets } = useTickets();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const customerTickets = tickets.filter(t => t.customerId === user?.id);
  const totalTickets = customerTickets.length;
  const openTickets = customerTickets.filter(t =>
    t.status === 'New' || t.status === 'In Progress' || t.status === 'Pending'
  ).length;
  const resolvedTickets = customerTickets.filter(t =>
    t.status === 'Resolved' || t.status === 'Closed'
  ).length;

  const recentTickets = customerTickets.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your support tickets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <Button
            onClick={() => navigate('/customer/create')}
            className="btn-hero"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tickets"
          value={totalTickets}
          subtitle="All time submissions"
          icon={Ticket}
          variant="primary"
        />
        <StatCard
          title="Open Tickets"
          value={openTickets}
          subtitle="Awaiting resolution"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Resolved Tickets"
          value={resolvedTickets}
          subtitle="Successfully closed"
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/customer/create')}
          className="card-elevated p-6 cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Create New Ticket</h3>
              <p className="text-sm text-muted-foreground">Submit a new support request</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        <div
          onClick={() => navigate('/customer/tickets')}
          className="card-elevated p-6 cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">View All Tickets</h3>
              <p className="text-sm text-muted-foreground">Track and manage your requests</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Tickets</h2>
          {customerTickets.length > 5 && (
            <Button variant="ghost" onClick={() => navigate('/customer/tickets')}>
              View all
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        <TicketTable tickets={recentTickets} basePath="/customer" />
      </div>
    </div>
  );
}
