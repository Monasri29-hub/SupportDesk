import { useTickets } from '@/contexts/TicketContext';
import { getTicketStats } from '@/lib/mockData';
import { StatCard } from '@/components/ui/stat-card';
import { TicketTable } from '@/components/TicketTable';
import { 
  Ticket, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = {
  'New': '#0ea5e9',
  'In Progress': '#3b5998',
  'Pending': '#f59e0b',
  'Resolved': '#22c55e',
  'Closed': '#6b7280',
};

const CATEGORY_COLORS = {
  'Billing / Payment': '#0ea5e9',
  'Login / Account': '#8b5cf6',
  'Technical Issue': '#f59e0b',
  'Refund': '#ef4444',
  'General Query': '#22c55e',
};

export default function SupportDashboard() {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const stats = getTicketStats(tickets);

  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({
    name,
    value,
  }));

  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({
    name: name.split(' / ')[0],
    fullName: name,
    value,
  }));

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Support Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of all support tickets and team performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={stats.total}
          subtitle="All time"
          icon={Ticket}
          variant="primary"
        />
        <StatCard
          title="New Today"
          value={stats.newToday}
          subtitle="Tickets created today"
          icon={TrendingUp}
          variant="info"
        />
        <StatCard
          title="High Urgency"
          value={stats.highUrgency}
          subtitle="Needs immediate attention"
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Older than 48 hours"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="chart-container">
          <h2 className="section-title">Ticket Status Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {statusData.map((entry) => (
                    <Cell 
                      key={entry.name} 
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="chart-container">
          <h2 className="section-title">Tickets by Category</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  formatter={(value, name, props) => [value, props.payload.fullName]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry) => (
                    <Cell 
                      key={entry.fullName} 
                      fill={CATEGORY_COLORS[entry.fullName as keyof typeof CATEGORY_COLORS]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-stat text-center">
          <p className="text-3xl font-bold text-status-new">{stats.byStatus['New'] || 0}</p>
          <p className="text-sm text-muted-foreground">New</p>
        </div>
        <div className="card-stat text-center">
          <p className="text-3xl font-bold text-status-open">{stats.byStatus['In Progress'] || 0}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="card-stat text-center">
          <p className="text-3xl font-bold text-status-pending">{stats.byStatus['Pending'] || 0}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="card-stat text-center">
          <p className="text-3xl font-bold text-status-resolved">{stats.byStatus['Resolved'] || 0}</p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Tickets</h2>
          <Button variant="ghost" onClick={() => navigate('/support/classification')}>
            View all
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <TicketTable tickets={recentTickets} showCustomer basePath="/support" />
      </div>
    </div>
  );
}
