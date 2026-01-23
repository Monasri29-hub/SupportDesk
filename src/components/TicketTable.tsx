import { useNavigate } from 'react-router-dom';
import { Ticket } from '@/lib/mockData';
import { StatusBadge, UrgencyBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TicketTableProps {
  tickets: Ticket[];
  showCustomer?: boolean;
  basePath?: string;
}

export function TicketTable({ tickets, showCustomer = false, basePath = '' }: TicketTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (ticketId: string) => {
    navigate(`${basePath}/ticket/${ticketId}`);
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Ticket ID</TableHead>
            {showCustomer && <TableHead className="font-semibold">Customer</TableHead>}
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Urgency</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showCustomer ? 7 : 6} className="text-center py-12 text-muted-foreground">
                No tickets found
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow 
                key={ticket.id}
                onClick={() => handleRowClick(ticket.id)}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-mono font-medium text-primary">
                  {ticket.id}
                </TableCell>
                {showCustomer && (
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.customerName}</p>
                      <p className="text-sm text-muted-foreground">{ticket.customerEmail}</p>
                    </div>
                  </TableCell>
                )}
                <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                <TableCell className="text-sm">{ticket.category}</TableCell>
                <TableCell><StatusBadge status={ticket.status} /></TableCell>
                <TableCell><UrgencyBadge urgency={ticket.urgency} /></TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(ticket.updatedAt, 'MMM d, yyyy h:mm a')}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
