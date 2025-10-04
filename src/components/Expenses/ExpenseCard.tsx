import { format } from 'date-fns';
import { FileText, Calendar, Tag, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  onClick?: () => void;
}

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  paid: 'bg-primary/10 text-primary border-primary/20',
};

export const ExpenseCard = ({ expense, onClick }: ExpenseCardProps) => {
  return (
    <Card 
      className="transition-all hover:shadow-md cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
            {expense.description}
          </CardTitle>
          <Badge className={cn('capitalize border', statusColors[expense.status])}>
            {expense.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span>{expense.amount.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground font-normal">{expense.currency}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>{expense.category}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        {expense.employeeName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <span className="font-medium">Submitted by:</span>
            <span>{expense.employeeName}</span>
          </div>
        )}

        {expense.receiptUrl && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <FileText className="h-4 w-4" />
            <span>Receipt attached</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
