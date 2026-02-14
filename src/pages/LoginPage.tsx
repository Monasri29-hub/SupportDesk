import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Headphones, Users, ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();
  const [activeLogin, setActiveLogin] = useState<'customer' | 'support' | null>(null);
  const handleBack = () => setActiveLogin(null);

  useEffect(() => {
    if (isAuthenticated && role) {
      console.log(`Authenticated as ${role}, redirecting...`);
      navigate(`/${role}`);
    }
  }, [isAuthenticated, role, navigate]);



  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
        {/* Left Side - Hero / Marketing */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-16 text-center lg:text-left">
          {/* Header - Moved inside Left Column for desktop, absolute for mobile */}
          <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SupportDesk</span>
            </div>
          </header>

          <div className="animate-fade-in space-y-6 max-w-2xl pt-20 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              System Operational
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Support via <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Experience the next generation of customer support.
              Seamlessly route, track, and resolve queries with AI-powered precision.
            </p>

            {/* Stats specific to the landing */}
            <div className="grid grid-cols-3 gap-8 pt-8 opacity-90">
              <div>
                <div className="text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">Support Avail</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">50k+</div>
                <div className="text-sm text-muted-foreground">Tickets Solved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Portals */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white/30 dark:bg-black/20 backdrop-blur-sm lg:backdrop-blur-none transition-all">
          <div className="absolute top-6 right-6 z-50">
            <ModeToggle />
          </div>

          <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {activeLogin ? (
              <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 animate-fade-in">
                <LoginForm role={activeLogin} onBack={handleBack} />
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Customer Portal Card */}
                <div
                  onClick={() => setActiveLogin('customer')}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/60 dark:bg-black/60 backdrop-blur-2xl p-8 hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col h-full text-left">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Customer Portal</h3>
                    <p className="text-muted-foreground mb-8">
                      Submit tickets, track status, and chat with support agents in real-time.
                    </p>
                    <div className="mt-auto flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                      Access Portal <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>

                {/* Support Portal Card */}
                <div
                  onClick={() => setActiveLogin('support')}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/60 dark:bg-black/60 backdrop-blur-2xl p-8 hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col h-full text-left">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                      <Headphones className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Support Team</h3>
                    <p className="text-muted-foreground mb-8">
                      Admin dashboard for ticket routing, classification, and team management.
                    </p>
                    <div className="mt-auto flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform">
                      Access Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
