import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTickets } from '@/contexts/TicketContext';
import { TeamType, TicketStatus, getTeamTickets } from '@/lib/mockData';
import { TicketTable } from '@/components/TicketTable';
import { StatCard } from '@/components/ui/stat-card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CreditCard, 
  Wrench, 
  UserCog, 
  DollarSign, 
  HelpCircle,
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const teamMapping: Record<string, TeamType> = {
  billing: 'Billing Team',
  technical: 'Technical Support Team',
  account: 'Account Support Team',
  finance: 'Finance Team',
  general: 'General Support Team',
};

const teamIcons: Record<TeamType, React.ElementType> = {
  'Billing Team': CreditCard,
  'Technical Support Team': Wrench,
  'Account Support Team': UserCog,
  'Finance Team': DollarSign,
  'General Support Team': HelpCircle,
};

export default function TeamView() {
  const { teamId } = useParams<{ teamId: string }>();
  const { tickets } = useTickets();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const teamName = teamId ? teamMapping[teamId] : undefined;
  const TeamIcon = teamName ? teamIcons[teamName] : Ticket;

  if (!teamName) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
        <p className="text-muted-foreground">The team you're looking for doesn't exist.</p>
      </div>
    );
  }

  const teamTickets = getTeamTickets(teamName, tickets);
  
  const filteredTickets = teamTickets.filter(ticket => 
    statusFilter === 'all' || ticket.status === statusFilter
  ).sort((a, b) => {
    // Sort by urgency: High > Medium > Low
    const urgencyOrder = { High: 0, Medium: 1, Low: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  const stats = {
    total: teamTickets.length,
    open: teamTickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length,
    highUrgency: teamTickets.filter(t => t.urgency === 'High').length,
    resolved: teamTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <TeamIcon className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{teamName}</h1>
          <p className="text-muted-foreground">Manage tickets assigned to your team</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={stats.total}
          icon={Ticket}
          variant="primary"
        />
        <StatCard
          title="Open Tickets"
          value={stats.open}
          icon={Clock}
          variant="info"
        />
        <StatCard
          title="High Urgency"
          value={stats.highUrgency}
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}
        >
          <SelectTrigger className="w-[180px] input-styled">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Showing {filteredTickets.length} tickets (sorted by priority)
        </p>
      </div>

      {/* Tickets Table */}
      <TicketTable tickets={filteredTickets} showCustomer basePath="/support" />
    </div>
  );
}
