export type TaskPriority = 'active' | 'attention' | 'overdue' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  warningBoundaryHours: number;
  status: 'active' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface TaskWithPriority extends Task {
  priority: TaskPriority;
  remainingMs: number;
  progressPercent: number;
  boundaryMessage?: string;
}
