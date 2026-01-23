import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { TicketTable } from '@/components/TicketTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { TicketStatus } from '@/lib/mockData';

export default function MyTickets() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets } = useTickets();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const customerTickets = tickets.filter(t => t.customerId === user?.id);

  const filteredTickets = customerTickets.filter(ticket => {
    const matchesSearch = search === '' || 
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-muted-foreground mt-1">
            View and track all your support requests
          </p>
        </div>
        <Button onClick={() => navigate('/customer/create')} className="btn-hero">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID or subject..."
            className="pl-10 input-styled"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
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
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTickets.length} of {customerTickets.length} tickets
      </p>

      {/* Tickets Table */}
      <TicketTable tickets={filteredTickets} basePath="/customer" />
    </div>
  );
}
