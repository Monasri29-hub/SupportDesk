import { useNavigate } from 'react-router-dom';
import { Ticket } from '@/lib/mockData';
import { StatusBadge, UrgencyBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import { Sparkles } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TicketTableProps {
  tickets: Ticket[];
  showCustomer?: boolean;
  basePath?: string;
  showAutoDetected?: boolean;
}

export function TicketTable({ tickets, showCustomer = false, basePath = '', showAutoDetected = true }: TicketTableProps) {
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
            <TableHead className="font-semibold">
              <div className="flex items-center gap-1.5">
                {showAutoDetected && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                    </TooltipTrigger>
                    <TooltipContent>Auto-detected by system</TooltipContent>
                  </Tooltip>
                )}
                Issue Type
              </div>
            </TableHead>
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
                <TableCell>
                  <span className="text-sm inline-flex items-center gap-1.5">
                    {ticket.category}
                  </span>
                </TableCell>
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
