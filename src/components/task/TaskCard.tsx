import { TaskWithPriority } from '@/types/task';
import { formatTimeRemaining, formatOverdueTime, getProgressColor } from '@/lib/taskUtils';
import { useTaskManager } from '@/contexts/TaskManagerContext';
import { CheckCircle2, Trash2, AlertTriangle, Clock, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TaskCardProps {
  task: TaskWithPriority;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTaskManager();

  const isOverdue = task.priority === 'overdue';
  const isAttention = task.priority === 'attention';
  const isCompleted = task.priority === 'completed';

  const cardClasses = [
    'group relative rounded-2xl border p-5 shadow-sm transition-all duration-300',
    isOverdue && 'animate-gravity-fall border-destructive/40 bg-destructive/5 rotate-[1deg]',
    isAttention && 'animate-warning-pulse border-warning/40 bg-warning/5',
    isCompleted && 'border-success/30 bg-success/5 opacity-80',
    !isOverdue && !isAttention && !isCompleted && 'border-border/50 bg-card hover:shadow-md hover:-translate-y-0.5',
  ]
    .filter(Boolean)
    .join(' ');

  const progressBarColor = getProgressColor(task.priority, task.progressPercent);

  return (
    <div className={cardClasses}>
      {/* Priority indicator */}
      {isAttention && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{task.boundaryMessage}</span>
        </div>
      )}
      {isOverdue && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <Clock className="h-4 w-4 shrink-0" />
          <span className="font-medium">{task.boundaryMessage}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold leading-tight ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!isCompleted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success hover:bg-success/10 hover:text-success"
              onClick={() => completeTask(task.id)}
              title="Mark complete"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{format(new Date(task.deadline), 'MMM d, yyyy · h:mm a')}</span>
        </div>
        <span className={`font-semibold ${
          isOverdue ? 'text-destructive' :
          isAttention ? 'text-warning' :
          isCompleted ? 'text-success' :
          'text-primary'
        }`}>
          {isCompleted
            ? 'Done'
            : isOverdue
            ? formatOverdueTime(task.remainingMs)
            : formatTimeRemaining(task.remainingMs)}
        </span>
      </div>

      {/* Progress bar */}
      {!isCompleted && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${Math.min(100, task.progressPercent)}%` }}
          />
        </div>
      )}

      {/* Overdue ground shadow */}
      {isOverdue && (
        <div className="absolute -bottom-2 left-4 right-4 h-3 rounded-full bg-foreground/5 blur-md" />
      )}
    </div>
  );
}
