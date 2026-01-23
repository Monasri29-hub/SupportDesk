import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '@/contexts/TicketContext';
import { TicketStatus } from '@/lib/mockData';
import { StatusBadge, UrgencyBadge, CategoryBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ArrowLeft, Clock, User, MessageSquare, Send, GitBranch } from 'lucide-react';

const statuses: TicketStatus[] = ['New', 'In Progress', 'Pending', 'Resolved', 'Closed'];

export default function SupportTicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { getTicketById, updateTicketStatus, addResponse } = useTickets();
  const [responseMessage, setResponseMessage] = useState('');

  const ticket = ticketId ? getTicketById(ticketId) : undefined;

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
        <p className="text-muted-foreground mb-6">The ticket you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/support')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicketStatus(ticket.id, newStatus);
  };

  const handleSendResponse = () => {
    if (!responseMessage.trim()) return;
    addResponse(ticket.id, responseMessage, 'support');
    setResponseMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-sm text-primary font-semibold">{ticket.id}</span>
              <StatusBadge status={ticket.status} />
              <UrgencyBadge urgency={ticket.urgency} />
            </div>
            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          </div>
          
          {/* Status Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={ticket.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4">Customer Information</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-medium">{ticket.customerName}</p>
                <p className="text-sm text-muted-foreground">{ticket.customerEmail}</p>
                <p className="text-xs text-muted-foreground">Customer ID: {ticket.customerId}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4">Issue Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Responses */}
          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4">
              <MessageSquare className="w-5 h-5 inline-block mr-2" />
              Conversation ({ticket.responses.length})
            </h2>
            
            <div className="space-y-4 mb-6">
              {ticket.responses.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No responses yet.
                </p>
              ) : (
                ticket.responses.map((response) => (
                  <div 
                    key={response.id}
                    className={`p-4 rounded-xl ${
                      response.authorRole === 'support' 
                        ? 'bg-primary/5 border border-primary/10 ml-4' 
                        : 'bg-muted/50 mr-4'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        response.authorRole === 'support' ? 'bg-primary/10' : 'bg-accent/10'
                      }`}>
                        <User className={`w-4 h-4 ${
                          response.authorRole === 'support' ? 'text-primary' : 'text-accent'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{response.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(response.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm ml-10">{response.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply Box */}
            <div className="border-t pt-4">
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Write a response..."
                className="input-styled min-h-[100px] mb-3"
              />
              <div className="flex justify-end">
                <Button onClick={handleSendResponse} disabled={!responseMessage.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4">Ticket Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <CategoryBadge category={ticket.category} className="mt-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Team</p>
                <div className="flex items-center gap-2 mt-1">
                  <GitBranch className="w-4 h-4 text-primary" />
                  <p className="font-medium">{ticket.assignedTeam}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{format(ticket.createdAt, 'MMM d, yyyy h:mm a')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(ticket.updatedAt, 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleStatusChange('In Progress')}
                disabled={ticket.status === 'In Progress'}
              >
                Mark as In Progress
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleStatusChange('Resolved')}
                disabled={ticket.status === 'Resolved'}
              >
                Mark as Resolved
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleStatusChange('Closed')}
                disabled={ticket.status === 'Closed'}
              >
                Close Ticket
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4">
              <Clock className="w-5 h-5 inline-block mr-2" />
              Timeline
            </h2>
            <div className="space-y-4">
              {ticket.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {index < ticket.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">{event.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.timestamp, 'MMM d, h:mm a')} • {event.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
