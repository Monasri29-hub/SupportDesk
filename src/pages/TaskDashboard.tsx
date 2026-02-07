import { useMemo, useState, useEffect } from 'react';
import { useTaskManager } from '@/contexts/TaskManagerContext';
import OverviewCards from '@/components/task/OverviewCards';
import CreateTaskDialog from '@/components/task/CreateTaskDialog';
import TaskSection from '@/components/task/TaskSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { computeTaskPriority } from '@/lib/taskUtils';
import { Zap } from 'lucide-react';

export default function TaskDashboard() {
  const { tasks } = useTaskManager();
  const [, setTick] = useState(0);

  // Re-render every 30s to update time remaining
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const tasksWithPriority = useMemo(() => tasks.map(computeTaskPriority), [tasks]);

  const activeTasks = tasksWithPriority.filter((t) => t.priority === 'active');
  const attentionTasks = tasksWithPriority.filter((t) => t.priority === 'attention');
  const overdueTasks = tasksWithPriority.filter((t) => t.priority === 'overdue');
  const completedTasks = tasksWithPriority.filter((t) => t.priority === 'completed');
  const allActive = tasksWithPriority.filter((t) => t.priority !== 'completed');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">TaskFlow</h1>
              <p className="text-xs text-muted-foreground">Stay ahead of your deadlines</p>
            </div>
          </div>
          <CreateTaskDialog />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Overview */}
        <section className="mb-8 animate-fade-in">
          <OverviewCards tasks={tasksWithPriority} />
        </section>

        {/* Task sections */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 h-11 w-full justify-start gap-1 rounded-xl bg-muted/60 p-1 sm:w-auto">
              <TabsTrigger value="all" className="rounded-lg px-4 data-[state=active]:shadow-sm">
                All Tasks
                <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {allActive.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="attention" className="rounded-lg px-4 data-[state=active]:shadow-sm">
                Needs Attention
                {attentionTasks.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">
                    {attentionTasks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="overdue" className="rounded-lg px-4 data-[state=active]:shadow-sm">
                Overdue
                {overdueTasks.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive">
                    {overdueTasks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg px-4 data-[state=active]:shadow-sm">
                Completed
                {completedTasks.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                    {completedTasks.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TaskSection
                tasks={[...attentionTasks, ...overdueTasks, ...activeTasks]}
                emptyMessage="No active tasks. Create one to get started!"
              />
            </TabsContent>

            <TabsContent value="attention">
              <TaskSection
                tasks={attentionTasks}
                emptyMessage="No tasks need attention right now. You're on track! 🎯"
              />
            </TabsContent>

            <TabsContent value="overdue">
              <TaskSection
                tasks={overdueTasks}
                emptyMessage="No overdue tasks. Great job staying on schedule! ✨"
              />
            </TabsContent>

            <TabsContent value="completed">
              <TaskSection
                tasks={completedTasks}
                emptyMessage="No completed tasks yet. Start checking things off!"
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
