import { useTickets } from '@/contexts/TicketContext';
import { TicketUrgency, getTicketStats } from '@/lib/mockData';
import { TicketTable } from '@/components/TicketTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const URGENCY_CONFIG = {
  High: { color: '#ef4444', icon: AlertTriangle, bgClass: 'bg-destructive/10' },
  Medium: { color: '#f59e0b', icon: AlertCircle, bgClass: 'bg-warning/10' },
  Low: { color: '#22c55e', icon: CheckCircle2, bgClass: 'bg-success/10' },
};

export default function UrgencyDashboard() {
  const { tickets } = useTickets();
  const stats = getTicketStats(tickets);

  const urgencyData = Object.entries(stats.byUrgency).map(([name, value]) => ({
    name,
    value,
  }));

  const getUrgencyTickets = (urgency: TicketUrgency) => 
    tickets.filter(t => t.urgency === urgency && t.status !== 'Closed' && t.status !== 'Resolved');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Urgency Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Prioritize tickets based on urgency level
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {(['High', 'Medium', 'Low'] as TicketUrgency[]).map(urgency => {
          const config = URGENCY_CONFIG[urgency];
          const Icon = config.icon;
          const count = stats.byUrgency[urgency] || 0;
          const openCount = getUrgencyTickets(urgency).length;

          return (
            <div 
              key={urgency}
              className={`card-elevated p-6 border-l-4`}
              style={{ borderLeftColor: config.color }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${config.bgClass} flex items-center justify-center`}>
                  <Icon className="w-7 h-7" style={{ color: config.color }} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-muted-foreground">{urgency} Priority</p>
                  <p className="text-sm text-muted-foreground">{openCount} open</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="chart-container">
          <h2 className="section-title">Urgency Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={urgencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {urgencyData.map((entry) => (
                    <Cell 
                      key={entry.name} 
                      fill={URGENCY_CONFIG[entry.name as TicketUrgency].color} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <h2 className="section-title">Ticket Count by Urgency</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={urgencyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {urgencyData.map((entry) => (
                    <Cell 
                      key={entry.name} 
                      fill={URGENCY_CONFIG[entry.name as TicketUrgency].color} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Urgency Tabs */}
      <Tabs defaultValue="High">
        <TabsList className="bg-muted/50 p-1">
          {(['High', 'Medium', 'Low'] as TicketUrgency[]).map(urgency => {
            const config = URGENCY_CONFIG[urgency];
            const Icon = config.icon;
            return (
              <TabsTrigger 
                key={urgency} 
                value={urgency}
                className="data-[state=active]:bg-card flex items-center gap-2"
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
                {urgency} ({getUrgencyTickets(urgency).length})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(['High', 'Medium', 'Low'] as TicketUrgency[]).map(urgency => (
          <TabsContent key={urgency} value={urgency} className="mt-6">
            <TicketTable 
              tickets={getUrgencyTickets(urgency)} 
              showCustomer 
              basePath="/support" 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
