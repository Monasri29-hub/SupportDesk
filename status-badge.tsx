import { cn } from '@/lib/utils';
import { TicketStatus, TicketUrgency } from '@/lib/mockData';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusStyles: Record<TicketStatus, string> = {
  'New': 'bg-info/10 text-info border-info/30',
  'In Progress': 'bg-primary/10 text-primary border-primary/30',
  'Pending': 'bg-warning/10 text-warning border-warning/30',
  'Resolved': 'bg-success/10 text-success border-success/30',
  'Closed': 'bg-muted text-muted-foreground border-muted-foreground/30',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
      statusStyles[status],
      className
    )}>
      {status}
    </span>
  );
}

interface UrgencyBadgeProps {
  urgency: TicketUrgency;
  className?: string;
}

const urgencyStyles: Record<TicketUrgency, string> = {
  'High': 'bg-destructive/10 text-destructive border-destructive/30',
  'Medium': 'bg-warning/10 text-warning border-warning/30',
  'Low': 'bg-success/10 text-success border-success/30',
};

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
      urgencyStyles[urgency],
      className
    )}>
      {urgency}
    </span>
  );
}

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-accent/10 text-accent border-accent/30',
      className
    )}>
      {category}
    </span>
  );
}
