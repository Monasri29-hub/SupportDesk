import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket, TicketStatus, mockTickets, generateMockTickets, categoryToTeam, TicketCategory, TicketUrgency } from '@/lib/mockData';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'responses' | 'timeline' | 'assignedTeam'>) => Ticket;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  addResponse: (ticketId: string, message: string, authorRole: 'customer' | 'support') => void;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  // Load initial tickets from localStorage or fall back to mock data
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : mockTickets;
  });

  // Save tickets to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'responses' | 'timeline' | 'assignedTeam'>): Ticket => {
    const now = new Date();
    const id = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: Ticket = {
      ...ticketData,
      id,
      assignedTeam: categoryToTeam[ticketData.category],
      createdAt: now,
      updatedAt: now,
      responses: [],
      timeline: [
        {
          id: `tl-${id}-1`,
          event: 'Ticket Created',
          timestamp: now,
          actor: ticketData.customerName
        },
        {
          id: `tl-${id}-2`,
          event: `Assigned to ${categoryToTeam[ticketData.category]}`,
          timestamp: now,
          actor: 'System'
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const now = new Date();
        return {
          ...ticket,
          status,
          updatedAt: now,
          timeline: [
            ...ticket.timeline,
            {
              id: `tl-${ticketId}-${ticket.timeline.length + 1}`,
              event: `Status changed to ${status}`,
              timestamp: now,
              actor: 'Support Agent'
            }
          ]
        };
      }
      return ticket;
    }));
  };

  const addResponse = (ticketId: string, message: string, authorRole: 'customer' | 'support') => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const now = new Date();
        return {
          ...ticket,
          updatedAt: now,
          responses: [
            ...ticket.responses,
            {
              id: `resp-${ticketId}-${ticket.responses.length + 1}`,
              author: authorRole === 'support' ? 'Support Agent' : ticket.customerName,
              authorRole,
              message,
              createdAt: now
            }
          ],
          timeline: [
            ...ticket.timeline,
            {
              id: `tl-${ticketId}-${ticket.timeline.length + 1}`,
              event: `${authorRole === 'support' ? 'Support Agent' : 'Customer'} added a response`,
              timestamp: now,
              actor: authorRole === 'support' ? 'Support Agent' : ticket.customerName
            }
          ]
        };
      }
      return ticket;
    }));
  };

  const getTicketById = (id: string) => tickets.find(t => t.id === id);

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicketStatus, addResponse, getTicketById }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
