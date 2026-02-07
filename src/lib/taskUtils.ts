import { Task, TaskPriority, TaskWithPriority } from '@/types/task';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function computeTaskPriority(task: Task): TaskWithPriority {
  if (task.status === 'completed') {
    return {
      ...task,
      priority: 'completed',
      remainingMs: 0,
      progressPercent: 100,
    };
  }

  const now = Date.now();
  const deadline = new Date(task.deadline).getTime();
  const created = new Date(task.createdAt).getTime();
  const remainingMs = deadline - now;
  const totalDuration = deadline - created;
  const elapsed = now - created;
  const progressPercent = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : 100;

  let priority: TaskPriority = 'active';
  let boundaryMessage: string | undefined;

  if (remainingMs <= 0) {
    priority = 'overdue';
    boundaryMessage = 'This task is overdue. Please complete it as soon as possible.';
  } else if (remainingMs <= task.warningBoundaryHours * HOUR_MS) {
    priority = 'attention';
    boundaryMessage = `Only ${formatTimeRemaining(remainingMs)} left. Please complete this task soon.`;
  }

  return {
    ...task,
    priority,
    remainingMs,
    progressPercent,
    boundaryMessage,
  };
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Overdue';

  const days = Math.floor(ms / DAY_MS);
  const hours = Math.floor((ms % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((ms % HOUR_MS) / (60 * 1000));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatOverdueTime(ms: number): string {
  const abs = Math.abs(ms);
  const days = Math.floor(abs / DAY_MS);
  const hours = Math.floor((abs % DAY_MS) / HOUR_MS);

  if (days > 0) return `${days}d ${hours}h overdue`;
  if (hours > 0) return `${hours}h overdue`;
  const minutes = Math.floor(abs / (60 * 1000));
  return `${minutes}m overdue`;
}

export function getProgressColor(priority: TaskPriority, progressPercent: number): string {
  if (priority === 'completed') return 'bg-success';
  if (priority === 'overdue') return 'bg-destructive';
  if (priority === 'attention') return 'bg-warning';
  if (progressPercent > 70) return 'bg-warning';
  return 'bg-primary';
}

export function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createMockTasks(): Task[] {
  const now = Date.now();
  return [
    {
      id: generateId(),
      title: 'Prepare quarterly report',
      description: 'Compile data from all departments and create the Q4 financial report for stakeholders.',
      deadline: new Date(now + 5 * DAY_MS).toISOString(),
      warningBoundaryHours: 48,
      status: 'active',
      createdAt: new Date(now - 10 * DAY_MS).toISOString(),
    },
    {
      id: generateId(),
      title: 'Review client proposal',
      description: 'Review and provide feedback on the new client project proposal before the meeting.',
      deadline: new Date(now + 16 * HOUR_MS).toISOString(),
      warningBoundaryHours: 24,
      status: 'active',
      createdAt: new Date(now - 3 * DAY_MS).toISOString(),
    },
    {
      id: generateId(),
      title: 'Fix authentication bug',
      description: 'The login page throws a 500 error on mobile devices. Needs immediate attention.',
      deadline: new Date(now - 3 * HOUR_MS).toISOString(),
      warningBoundaryHours: 12,
      status: 'active',
      createdAt: new Date(now - 2 * DAY_MS).toISOString(),
    },
    {
      id: generateId(),
      title: 'Update design system',
      description: 'Migrate all components to the new brand color palette and typography.',
      deadline: new Date(now + 7 * DAY_MS).toISOString(),
      warningBoundaryHours: 72,
      status: 'active',
      createdAt: new Date(now - 5 * DAY_MS).toISOString(),
    },
    {
      id: generateId(),
      title: 'Deploy staging environment',
      description: 'Set up the CI/CD pipeline for the staging branch and verify deployment.',
      deadline: new Date(now - 1 * DAY_MS).toISOString(),
      warningBoundaryHours: 24,
      status: 'active',
      createdAt: new Date(now - 4 * DAY_MS).toISOString(),
    },
    {
      id: generateId(),
      title: 'Write API documentation',
      description: 'Document all REST endpoints with request/response examples for the developer portal.',
      deadline: new Date(now + 3 * DAY_MS).toISOString(),
      warningBoundaryHours: 48,
      status: 'active',
      createdAt: new Date(now - 7 * DAY_MS).toISOString(),
    },
    {
      id: generateId(),
      title: 'Set up monitoring alerts',
      description: 'Configure alerts for server health, error rates, and response times.',
      deadline: new Date(now + 14 * DAY_MS).toISOString(),
      warningBoundaryHours: 72,
      status: 'active',
      createdAt: new Date(now - 1 * DAY_MS).toISOString(),
    },
    {
      id: generateId(),
      title: 'Onboard new team member',
      description: 'Prepare environment access, schedule intro meetings, and share documentation.',
      deadline: new Date(now - 5 * HOUR_MS).toISOString(),
      warningBoundaryHours: 48,
      status: 'completed',
      createdAt: new Date(now - 6 * DAY_MS).toISOString(),
      completedAt: new Date(now - 1 * DAY_MS).toISOString(),
    },
  ];
}
