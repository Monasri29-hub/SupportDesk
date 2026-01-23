export type TicketCategory = 'Billing / Payment' | 'Login / Account' | 'Technical Issue' | 'Refund' | 'General Query';
export type TicketStatus = 'New' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
export type TicketUrgency = 'High' | 'Medium' | 'Low';
export type TeamType = 'Billing Team' | 'Technical Support Team' | 'Account Support Team' | 'Finance Team' | 'General Support Team';

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  urgency: TicketUrgency;
  assignedTeam: TeamType;
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
  timeline: TimelineEvent[];
}

export interface TicketResponse {
  id: string;
  author: string;
  authorRole: 'customer' | 'support';
  message: string;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  event: string;
  timestamp: Date;
  actor: string;
}

export const categoryToTeam: Record<TicketCategory, TeamType> = {
  'Billing / Payment': 'Billing Team',
  'Login / Account': 'Account Support Team',
  'Technical Issue': 'Technical Support Team',
  'Refund': 'Finance Team',
  'General Query': 'General Support Team',
};

const customerNames = [
  'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 
  'Jessica Thompson', 'James Wilson', 'Amanda Foster', 'Robert Martinez',
  'Lisa Anderson', 'Christopher Lee', 'Jennifer Brown', 'Matthew Davis',
  'Nicole Taylor', 'Daniel Garcia', 'Ashley Moore'
];

const subjects = {
  'Billing / Payment': [
    'Invoice discrepancy for last month',
    'Unable to update payment method',
    'Unexpected charge on my account',
    'Need billing statement for tax purposes',
    'Payment failed but amount deducted'
  ],
  'Login / Account': [
    'Cannot reset my password',
    'Two-factor authentication not working',
    'Account locked after multiple attempts',
    'Unable to update email address',
    'Profile settings not saving'
  ],
  'Technical Issue': [
    'Application crashes on startup',
    'Data sync issues between devices',
    'Slow performance on dashboard',
    'Export feature not working',
    'Integration with third-party app failing'
  ],
  'Refund': [
    'Request refund for unused subscription',
    'Double charged for single purchase',
    'Service not as described, requesting refund',
    'Cancellation within trial period',
    'Refund for accidental purchase'
  ],
  'General Query': [
    'How to upgrade my plan?',
    'Questions about enterprise features',
    'Need help understanding pricing',
    'Feature request for mobile app',
    'General feedback about service'
  ]
};

const descriptions = {
  'Billing / Payment': 'I noticed an issue with my billing and need assistance resolving this matter. The amount charged does not match what I expected based on my subscription plan.',
  'Login / Account': 'I am experiencing difficulties accessing my account. I have tried the standard troubleshooting steps but the issue persists.',
  'Technical Issue': 'There seems to be a technical problem with the application. This is affecting my workflow and I need urgent assistance.',
  'Refund': 'I would like to request a refund for my recent purchase. Please review my account and process this request.',
  'General Query': 'I have some questions about the service and would appreciate if someone could provide clarification on a few points.'
};

function generateTicketId(): string {
  const prefix = 'TKT';
  const number = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${number}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateMockTickets(count: number = 50): Ticket[] {
  const tickets: Ticket[] = [];
  const categories: TicketCategory[] = ['Billing / Payment', 'Login / Account', 'Technical Issue', 'Refund', 'General Query'];
  const statuses: TicketStatus[] = ['New', 'In Progress', 'Pending', 'Resolved', 'Closed'];
  const urgencies: TicketUrgency[] = ['High', 'Medium', 'Low'];

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const category = getRandomItem(categories);
    const status = getRandomItem(statuses);
    const urgency = getRandomItem(urgencies);
    const customerName = getRandomItem(customerNames);
    const createdAt = randomDate(thirtyDaysAgo, now);
    const updatedAt = randomDate(createdAt, now);

    const ticket: Ticket = {
      id: generateTicketId(),
      customerId: `CUST-${1000 + i}`,
      customerName,
      customerEmail: `${customerName.toLowerCase().replace(' ', '.')}@email.com`,
      subject: getRandomItem(subjects[category]),
      description: descriptions[category],
      category,
      status,
      urgency,
      assignedTeam: categoryToTeam[category],
      createdAt,
      updatedAt,
      responses: status !== 'New' ? [
        {
          id: `resp-${i}-1`,
          author: 'Support Agent',
          authorRole: 'support',
          message: 'Thank you for contacting us. We are looking into your issue and will get back to you shortly.',
          createdAt: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000)
        }
      ] : [],
      timeline: [
        {
          id: `tl-${i}-1`,
          event: 'Ticket Created',
          timestamp: createdAt,
          actor: customerName
        },
        ...(status !== 'New' ? [{
          id: `tl-${i}-2`,
          event: 'Assigned to ' + categoryToTeam[category],
          timestamp: new Date(createdAt.getTime() + 30 * 60 * 1000),
          actor: 'System'
        }] : []),
        ...(status === 'Resolved' || status === 'Closed' ? [{
          id: `tl-${i}-3`,
          event: `Status changed to ${status}`,
          timestamp: updatedAt,
          actor: 'Support Agent'
        }] : [])
      ]
    };

    if (status === 'Resolved' || status === 'Closed') {
      ticket.responses.push({
        id: `resp-${i}-2`,
        author: 'Support Agent',
        authorRole: 'support',
        message: 'Your issue has been resolved. Please let us know if you need any further assistance.',
        createdAt: updatedAt
      });
    }

    tickets.push(ticket);
  }

  return tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const mockTickets = generateMockTickets(50);

export function getTicketStats(tickets: Ticket[]) {
  const total = tickets.length;
  const byStatus = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<TicketStatus, number>);

  const byCategory = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as Record<TicketCategory, number>);

  const byUrgency = tickets.reduce((acc, ticket) => {
    acc[ticket.urgency] = (acc[ticket.urgency] || 0) + 1;
    return acc;
  }, {} as Record<TicketUrgency, number>);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newToday = tickets.filter(t => t.createdAt >= today).length;

  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
  const overdue = tickets.filter(t => 
    (t.status === 'New' || t.status === 'In Progress' || t.status === 'Pending') && 
    t.createdAt < twoDaysAgo
  ).length;

  return {
    total,
    byStatus,
    byCategory,
    byUrgency,
    newToday,
    overdue,
    open: (byStatus['New'] || 0) + (byStatus['In Progress'] || 0) + (byStatus['Pending'] || 0),
    resolved: (byStatus['Resolved'] || 0) + (byStatus['Closed'] || 0),
    highUrgency: byUrgency['High'] || 0
  };
}

export function getCustomerTickets(customerId: string, tickets: Ticket[]): Ticket[] {
  return tickets.filter(t => t.customerId === customerId);
}

export function getTeamTickets(team: TeamType, tickets: Ticket[]): Ticket[] {
  return tickets.filter(t => t.assignedTeam === team);
}
