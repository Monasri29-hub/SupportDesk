import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskWithPriority } from '@/types/task';
import { computeTaskPriority, createMockTasks, generateId } from '@/lib/taskUtils';
import { toast } from 'sonner';

interface TaskManagerContextValue {
  tasks: Task[];
  tasksWithPriority: TaskWithPriority[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskManagerContext = createContext<TaskManagerContextValue | null>(null);

const STORAGE_KEY = 'taskflow-tasks';

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return createMockTasks();
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskManagerProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const tasksWithPriority = useMemo(() => tasks.map(computeTaskPriority), [tasks]);

  // Check for boundary notifications every 30 seconds
  useEffect(() => {
    function checkBoundaries() {
      const updated = tasks.map(computeTaskPriority);
      updated.forEach((t) => {
        if (t.priority === 'attention' && !notifiedIds.has(`attention-${t.id}`)) {
          toast.warning(`⏰ "${t.title}" needs attention`, {
            description: t.boundaryMessage,
            duration: 6000,
          });
          setNotifiedIds((prev) => new Set(prev).add(`attention-${t.id}`));
        }
        if (t.priority === 'overdue' && !notifiedIds.has(`overdue-${t.id}`)) {
          toast.error(`🚨 "${t.title}" is overdue!`, {
            description: 'This task has passed its deadline.',
            duration: 6000,
          });
          setNotifiedIds((prev) => new Set(prev).add(`overdue-${t.id}`));
        }
      });
    }

    checkBoundaries();
    const interval = setInterval(checkBoundaries, 30000);
    return () => clearInterval(interval);
  }, [tasks, notifiedIds]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    toast.success('Task created successfully!');
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() } : t
      )
    );
    toast.success('Task completed! 🎉');
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.info('Task deleted');
  }, []);

  return (
    <TaskManagerContext.Provider value={{ tasks, tasksWithPriority, addTask, completeTask, deleteTask }}>
      {children}
    </TaskManagerContext.Provider>
  );
}

export function useTaskManager() {
  const ctx = useContext(TaskManagerContext);
  if (!ctx) throw new Error('useTaskManager must be used within TaskManagerProvider');
  return ctx;
}
