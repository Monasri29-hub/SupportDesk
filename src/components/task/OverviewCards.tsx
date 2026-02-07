import { ListChecks, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { TaskWithPriority } from '@/types/task';

interface OverviewCardsProps {
  tasks: TaskWithPriority[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  accentClass: string;
  bgClass: string;
}

function StatCard({ title, value, icon, accentClass, bgClass }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${bgClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${accentClass}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClass} bg-current/10`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${accentClass.replace('text-', 'bg-')}`} />
    </div>
  );
}

export default function OverviewCards({ tasks }: OverviewCardsProps) {
  const total = tasks.filter((t) => t.status !== 'completed').length;
  const attention = tasks.filter((t) => t.priority === 'attention').length;
  const overdue = tasks.filter((t) => t.priority === 'overdue').length;
  const completed = tasks.filter((t) => t.priority === 'completed').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Active"
        value={total}
        icon={<ListChecks className="h-6 w-6 text-primary" />}
        accentClass="text-primary"
        bgClass="bg-card"
      />
      <StatCard
        title="Needs Attention"
        value={attention}
        icon={<AlertTriangle className="h-6 w-6 text-warning" />}
        accentClass="text-warning"
        bgClass="bg-card"
      />
      <StatCard
        title="Overdue"
        value={overdue}
        icon={<Clock className="h-6 w-6 text-destructive" />}
        accentClass="text-destructive"
        bgClass="bg-card"
      />
      <StatCard
        title="Completed"
        value={completed}
        icon={<CheckCircle2 className="h-6 w-6 text-success" />}
        accentClass="text-success"
        bgClass="bg-card"
      />
    </div>
  );
}
