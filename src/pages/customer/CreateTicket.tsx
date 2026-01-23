import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { TicketCategory, TicketUrgency } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload, CheckCircle, Ticket } from 'lucide-react';
import { format } from 'date-fns';

const categories: TicketCategory[] = [
  'Billing / Payment',
  'Login / Account',
  'Technical Issue',
  'Refund',
  'General Query'
];

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTicket } = useTickets();

  const [formData, setFormData] = useState({
    category: '' as TicketCategory | '',
    subject: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<{ id: string; createdAt: Date } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.category || !formData.subject || !formData.description) return;

    // Auto-detect urgency based on keywords
    let urgency: TicketUrgency = 'Medium';
    const lowerDesc = formData.description.toLowerCase();
    const lowerSubject = formData.subject.toLowerCase();
    
    if (lowerDesc.includes('urgent') || lowerDesc.includes('critical') || 
        lowerDesc.includes('emergency') || lowerSubject.includes('urgent')) {
      urgency = 'High';
    } else if (lowerDesc.includes('when you can') || lowerDesc.includes('no rush') || 
               lowerDesc.includes('minor')) {
      urgency = 'Low';
    }

    const ticket = addTicket({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      subject: formData.subject,
      description: formData.description,
      category: formData.category as TicketCategory,
      status: 'New',
      urgency,
    });

    setCreatedTicket({ id: ticket.id, createdAt: ticket.createdAt });
    setSubmitted(true);
  };

  if (submitted && createdTicket) {
    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        <div className="card-elevated p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Ticket Submitted Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Your support request has been received and will be reviewed shortly.
          </p>

          <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ticket ID</p>
                <p className="font-mono font-semibold text-primary">{createdTicket.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">New</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted At</p>
                <p className="font-semibold">{format(createdTicket.createdAt, 'MMM d, yyyy h:mm a')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold">{formData.category}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/customer')}>
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate(`/customer/ticket/${createdTicket.id}`)}>
              <Ticket className="w-4 h-4 mr-2" />
              View Ticket
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate('/customer')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Create New Ticket</h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to submit a support request
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Issue Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as TicketCategory })}
          >
            <SelectTrigger className="input-styled">
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Brief summary of your issue"
            className="input-styled"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Problem Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Please describe your issue in detail..."
            className="input-styled min-h-[200px] resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Attachments (Optional)</Label>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports: PNG, JPG, PDF (Max 10MB)
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/customer')} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 btn-hero">
            Submit Ticket
          </Button>
        </div>
      </form>
    </div>
  );
}
