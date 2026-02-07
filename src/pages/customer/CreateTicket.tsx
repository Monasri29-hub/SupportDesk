import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { TicketCategory, TicketUrgency, detectCategory, detectUrgency } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, CheckCircle, Ticket, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTicket } = useTickets();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<{ id: string; createdAt: Date; category: TicketCategory; urgency: TicketUrgency } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.subject || !formData.description) return;

    // Auto-detect category and urgency from description and subject
    const combinedText = `${formData.subject} ${formData.description}`;
    const detectedCategory = detectCategory(combinedText);
    const detectedUrgency = detectUrgency(combinedText);

    const ticket = addTicket({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      subject: formData.subject,
      description: formData.description,
      category: detectedCategory,
      status: 'New',
      urgency: detectedUrgency,
    });

    setCreatedTicket({ id: ticket.id, createdAt: ticket.createdAt, category: detectedCategory, urgency: detectedUrgency });
    setSubmitted(true);
  };

  const getUrgencyIcon = (urgency: TicketUrgency) => {
    switch (urgency) {
      case 'High': return <AlertTriangle className="w-4 h-4" />;
      case 'Medium': return <AlertCircle className="w-4 h-4" />;
      case 'Low': return <Info className="w-4 h-4" />;
    }
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
                <p className="text-sm text-muted-foreground">Detected Category</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    Auto-detected
                  </span>
                  <p className="font-semibold">{createdTicket.category}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Detected Urgency</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    Auto-detected
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getUrgencyIcon(createdTicket.urgency)}
                    <p className="font-semibold">{createdTicket.urgency}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span> Our system has automatically classified your issue as "{createdTicket.category}" with "{createdTicket.urgency}" urgency based on your description. It has been routed to the appropriate team for faster resolution.
            </p>
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
          Describe your issue and we'll route it to the right team automatically
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-6">
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
            placeholder="Please describe your issue in detail. Include any relevant information such as error messages, steps to reproduce, or what you were trying to accomplish..."
            className="input-styled min-h-[200px] resize-none"
            required
          />
          <p className="text-xs text-muted-foreground">
            Our system will automatically detect the issue type based on your description.
          </p>
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