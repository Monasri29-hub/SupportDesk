import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border/50',
  primary: 'bg-primary/5 border-primary/20',
  success: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
  destructive: 'bg-destructive/5 border-destructive/20',
  info: 'bg-info/5 border-info/20',
};

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className
}: StatCardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg group',
      variant === 'default' ? 'bg-card border-border/50 hover:border-border' : '',
      variant === 'primary' && 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/40',
      variant === 'success' && 'bg-gradient-to-br from-success/10 to-transparent border-success/20 hover:border-success/40',
      variant === 'warning' && 'bg-gradient-to-br from-warning/10 to-transparent border-warning/20 hover:border-warning/40',
      variant === 'destructive' && 'bg-gradient-to-br from-destructive/10 to-transparent border-destructive/20 hover:border-destructive/40',
      variant === 'info' && 'bg-gradient-to-br from-info/10 to-transparent border-info/20 hover:border-info/40',
      className
    )}>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          </div>

          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
          )}

          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-3 text-xs font-medium px-2 py-1 rounded-full w-fit',
              trend.isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="opacity-70 font-normal ml-1">vs last week</span>
            </div>
          )}
        </div>

        <div className={cn(
          'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
          variant === 'default' && 'bg-muted text-muted-foreground',
          variant === 'primary' && 'bg-primary/20 text-primary',
          variant === 'success' && 'bg-success/20 text-success',
          variant === 'warning' && 'bg-warning/20 text-warning',
          variant === 'destructive' && 'bg-destructive/20 text-destructive',
          variant === 'info' && 'bg-info/20 text-info',
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Decorative gradient blob */}
      <div className={cn(
        "absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        variant === 'default' && 'bg-muted',
        variant === 'primary' && 'bg-primary/20',
        variant === 'success' && 'bg-success/20',
        variant === 'warning' && 'bg-warning/20',
        variant === 'destructive' && 'bg-destructive/20',
        variant === 'info' && 'bg-info/20',
      )} />
    </div>
  );
}
