import { useState } from 'react';
import { useTickets } from '@/contexts/TicketContext';
import { TicketCategory } from '@/lib/mockData';
import { TicketTable } from '@/components/TicketTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  UserCog, 
  Wrench, 
  DollarSign, 
  HelpCircle,
  Search 
} from 'lucide-react';

const categories: { id: TicketCategory; label: string; icon: React.ElementType }[] = [
  { id: 'Billing / Payment', label: 'Billing', icon: CreditCard },
  { id: 'Login / Account', label: 'Account', icon: UserCog },
  { id: 'Technical Issue', label: 'Technical', icon: Wrench },
  { id: 'Refund', label: 'Refund', icon: DollarSign },
  { id: 'General Query', label: 'General', icon: HelpCircle },
];

export default function ClassificationView() {
  const { tickets } = useTickets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<TicketCategory | 'all'>('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = search === '' || 
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || ticket.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category: TicketCategory) => 
    tickets.filter(t => t.category === category).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ticket Classification</h1>
        <p className="text-muted-foreground mt-1">
          View tickets organized by category
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets..."
          className="pl-10 input-styled"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as TicketCategory | 'all')}>
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="all" className="data-[state=active]:bg-card">
            All ({tickets.length})
          </TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="data-[state=active]:bg-card flex items-center gap-2"
            >
              <cat.icon className="w-4 h-4" />
              {cat.label} ({getCategoryCount(cat.id)})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredTickets.length} tickets
          </p>
          <TicketTable tickets={filteredTickets} showCustomer basePath="/support" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
