import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TicketProvider } from "@/contexts/TicketContext";

// Pages
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

// Layouts
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
import UrgencyDashboard from "@/pages/support/UrgencyDashboard";
import RoutingView from "@/pages/support/RoutingView";
import TeamView from "@/pages/support/TeamView";
import SupportTicketDetail from "@/pages/support/SupportTicketDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TicketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Login */}
              <Route path="/" element={<LoginPage />} />

              {/* Customer Portal */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerDashboard />} />
                <Route path="create" element={<CreateTicket />} />
                <Route path="tickets" element={<MyTickets />} />
                <Route path="ticket/:ticketId" element={<TicketDetail />} />
              </Route>

              {/* Support Portal */}
              <Route path="/support" element={<SupportLayout />}>
                <Route index element={<SupportDashboard />} />
                <Route path="classification" element={<ClassificationView />} />
                <Route path="urgency" element={<UrgencyDashboard />} />
                <Route path="routing" element={<RoutingView />} />
                <Route path="team/:teamId" element={<TeamView />} />
                <Route path="ticket/:ticketId" element={<SupportTicketDetail />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TicketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
