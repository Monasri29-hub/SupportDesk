import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskManagerProvider } from "@/contexts/TaskManagerContext";
import TaskDashboard from "@/pages/TaskDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TaskManagerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TaskDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskManagerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
