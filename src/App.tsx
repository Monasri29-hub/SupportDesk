import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskManagerProvider } from "@/contexts/TaskManagerContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TicketProvider } from "@/contexts/TicketContext";

// Pages & Layouts
import LoginPage from "@/pages/LoginPage";
import CustomerLayout from "@/layouts/CustomerLayout";
import SupportLayout from "@/layouts/SupportLayout";

// Customer Pages
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import CreateTicket from "@/pages/customer/CreateTicket";
import MyTickets from "@/pages/customer/MyTickets";
import TicketDetail from "@/pages/customer/TicketDetail";

// Support Pages
import SupportDashboard from "@/pages/support/SupportDashboard";
import ClassificationView from "@/pages/support/ClassificationView";
import RoutingView from "@/pages/support/RoutingView";
import TeamView from "@/pages/support/TeamView";
import UrgencyDashboard from "@/pages/support/UrgencyDashboard";
import SupportTicketDetail from "@/pages/support/SupportTicketDetail";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Sonner />
        <AuthProvider>
          <TaskManagerProvider>
            <TicketProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />

                  {/* Customer Routes */}
                  <Route path="/customer" element={<CustomerLayout />}>
                    <Route index element={<CustomerDashboard />} />
                    <Route path="create" element={<CreateTicket />} />
                    <Route path="tickets" element={<MyTickets />} />
                    <Route path="ticket/:id" element={<TicketDetail />} />
                  </Route>

                  {/* Support Routes */}
                  <Route path="/support" element={<SupportLayout />}>
                    <Route index element={<SupportDashboard />} />
                    <Route path="classification" element={<ClassificationView />} />
                    <Route path="routing" element={<RoutingView />} />
                    <Route path="team/:teamId" element={<TeamView />} />
                    <Route path="urgency" element={<UrgencyDashboard />} />
                    <Route path="ticket/:id" element={<SupportTicketDetail />} />
                  </Route>

                  {/* Default Redirect */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </BrowserRouter>
            </TicketProvider>
          </TaskManagerProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
