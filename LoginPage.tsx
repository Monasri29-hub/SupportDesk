import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Headphones, Users, ArrowRight, Shield, Zap, Clock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleCustomerLogin = () => {
    login('customer');
    navigate('/customer');
  };

  const handleSupportLogin = () => {
    login('support');
    navigate('/support');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Headphones className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SupportDesk</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-8 pb-12">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Welcome to <span className="text-primary">SupportDesk</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your intelligent customer support management system. Choose your portal to get started.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Customer Portal */}
              <div 
                onClick={handleCustomerLogin}
                className="portal-card group"
              >
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-accent-foreground" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3">Customer Portal</h2>
                  <p className="text-muted-foreground mb-6 flex-1">
                    Submit support tickets and track the progress of your requests in real-time.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Zap className="w-4 h-4 text-accent" />
                      <span>Quick ticket submission</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>Real-time status updates</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-accent" />
                      <span>Secure communication</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-accent font-semibold group-hover:gap-4 transition-all">
                    <span>Enter Customer Portal</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Support Team Portal */}
              <div 
                onClick={handleSupportLogin}
                className="portal-card group"
              >
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Headphones className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3">Support Team Portal</h2>
                  <p className="text-muted-foreground mb-6 flex-1">
                    Manage, classify, and resolve customer tickets with powerful admin tools.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Zap className="w-4 h-4 text-primary" />
                      <span>Smart ticket classification</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Priority-based routing</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Team collaboration</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                    <span>Enter Support Portal</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  99.9% Uptime
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  24/7 Support
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Enterprise Ready
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 SupportDesk. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
