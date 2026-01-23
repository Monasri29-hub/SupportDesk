import { useTickets } from '@/contexts/TicketContext';
import { categoryToTeam, TeamType, TicketCategory } from '@/lib/mockData';
import { TicketTable } from '@/components/TicketTable';
import { 
  CreditCard, 
  Wrench, 
  UserCog, 
  DollarSign, 
  HelpCircle,
  ArrowRight,
  GitBranch
} from 'lucide-react';

const teamConfig: Record<TeamType, { icon: React.ElementType; color: string }> = {
  'Billing Team': { icon: CreditCard, color: '#0ea5e9' },
  'Technical Support Team': { icon: Wrench, color: '#f59e0b' },
  'Account Support Team': { icon: UserCog, color: '#8b5cf6' },
  'Finance Team': { icon: DollarSign, color: '#ef4444' },
  'General Support Team': { icon: HelpCircle, color: '#22c55e' },
};

const categoryConfig: Record<TicketCategory, { icon: React.ElementType; color: string }> = {
  'Billing / Payment': { icon: CreditCard, color: '#0ea5e9' },
  'Technical Issue': { icon: Wrench, color: '#f59e0b' },
  'Login / Account': { icon: UserCog, color: '#8b5cf6' },
  'Refund': { icon: DollarSign, color: '#ef4444' },
  'General Query': { icon: HelpCircle, color: '#22c55e' },
};

export default function RoutingView() {
  const { tickets } = useTickets();

  const routingRules = Object.entries(categoryToTeam).map(([category, team]) => ({
    category: category as TicketCategory,
    team,
    categoryConfig: categoryConfig[category as TicketCategory],
    teamConfig: teamConfig[team],
    ticketCount: tickets.filter(t => t.category === category).length,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ticket Routing</h1>
        <p className="text-muted-foreground mt-1">
          View how tickets are automatically routed to teams based on category
        </p>
      </div>

      {/* Routing Rules */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Automatic Routing Rules</h2>
            <p className="text-sm text-muted-foreground">Tickets are assigned to teams based on their category</p>
          </div>
        </div>

        <div className="space-y-4">
          {routingRules.map(rule => {
            const CategoryIcon = rule.categoryConfig.icon;
            const TeamIcon = rule.teamConfig.icon;

            return (
              <div 
                key={rule.category}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {/* Category */}
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${rule.categoryConfig.color}15` }}
                  >
                    <CategoryIcon 
                      className="w-5 h-5" 
                      style={{ color: rule.categoryConfig.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{rule.category}</p>
                    <p className="text-sm text-muted-foreground">{rule.ticketCount} tickets</p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-5 h-5 text-muted-foreground" />

                {/* Team */}
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${rule.teamConfig.color}15` }}
                  >
                    <TeamIcon 
                      className="w-5 h-5" 
                      style={{ color: rule.teamConfig.color }}
                    />
                  </div>
                  <p className="font-medium">{rule.team}</p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Routed Tickets */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recently Routed Tickets</h2>
        <TicketTable 
          tickets={tickets.slice(0, 10)} 
          showCustomer 
          basePath="/support" 
        />
      </div>
    </div>
  );
}
