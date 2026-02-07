import { TaskWithPriority } from '@/types/task';
import TaskCard from './TaskCard';
import { Inbox } from 'lucide-react';

interface TaskSectionProps {
  tasks: TaskWithPriority[];
  emptyMessage?: string;
}

export default function TaskSection({ tasks, emptyMessage = 'No tasks here' }: TaskSectionProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-muted-foreground">
        <Inbox className="mb-3 h-10 w-10 opacity-40" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
