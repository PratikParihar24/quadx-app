import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ApprovalFlow } from '@/components/Expenses/ApprovalFlow';
import { mockExpenses } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  paid: 'bg-primary/10 text-primary border-primary/20',
};

export const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const expense = mockExpenses.find(e => e.id === id);

  if (!expense) {
    return <div>Expense not found</div>;
  }

  const handleApprove = () => {
    toast.success('Expense approved successfully!');
  };

  const handleReject = () => {
    toast.error('Expense rejected');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Details</h1>
          <p className="text-muted-foreground mt-1">ID: {expense.id}</p>
        </div>
        <Badge className={cn('capitalize border text-base px-4 py-2', statusColors[expense.status])}>
          {expense.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">${expense.amount.toFixed(2)} {expense.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Currency Amount</p>
                  <p className="text-2xl font-bold">${expense.baseCurrencyAmount.toFixed(2)} USD</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg font-semibold">{expense.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-lg font-semibold">{format(new Date(expense.date), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted By</p>
                  <p className="text-lg font-semibold">{expense.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted On</p>
                  <p className="text-lg font-semibold">{format(new Date(expense.submittedAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base">{expense.description}</p>
              </div>

              {expense.receiptUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Receipt</p>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {expense.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comments (Optional)</label>
                  <Textarea placeholder="Add comments..." rows={3} />
                </div>
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-success hover:opacity-90 flex-1"
                    onClick={handleApprove}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Approve
                  </Button>
                  <Button 
                    size="lg" 
                    variant="destructive"
                    className="flex-1"
                    onClick={handleReject}
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <ApprovalFlow 
            steps={expense.approvalSteps} 
            currentStepIndex={expense.currentStepIndex}
          />
        </div>
      </div>
    </div>
  );
};
