import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) => {
  const variantStyles = {
    default: 'bg-gradient-card',
    primary: 'bg-gradient-primary text-primary-foreground',
    success: 'bg-gradient-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
  };

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn(
              'text-sm font-medium',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
            )}>
              {title}
            </p>
            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
            {trend && (
              <p className={cn(
                'mt-2 text-xs',
                variant === 'default' 
                  ? trend.isPositive ? 'text-success' : 'text-destructive'
                  : 'opacity-75'
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div className={cn(
            'flex h-14 w-14 items-center justify-center rounded-lg',
            variant === 'default' ? 'bg-primary/10' : 'bg-white/20'
          )}>
            <Icon className={cn(
              'h-7 w-7',
              variant === 'default' ? 'text-primary' : 'text-current'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
