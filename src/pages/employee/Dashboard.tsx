import { DollarSign, Receipt, Clock, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ExpenseCard } from '@/components/Expenses/ExpenseCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getExpensesByUser } from '@/lib/mockData';

export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser('employee');
  const expenses = getExpensesByUser(user.id);

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.baseCurrencyAmount, 0),
    pending: expenses.filter(e => e.status === 'pending').length,
    approved: expenses.filter(e => e.status === 'approved').length,
    rejected: expenses.filter(e => e.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here's your expense overview</p>
        </div>
        <Button 
          size="lg" 
          className="bg-gradient-primary hover:opacity-90 shadow-glow"
          onClick={() => navigate('/submit')}
        >
          <Receipt className="mr-2 h-5 w-5" />
          Submit Expense
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Submitted"
          value={`$${stats.total.toFixed(2)}`}
          icon={DollarSign}
          variant="primary"
          trend={{ value: '12% from last month', isPositive: true }}
        />
        <StatsCard
          title="Pending Approval"
          value={stats.pending}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={Receipt}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Expenses</h2>
          <Button variant="outline" onClick={() => navigate('/my-expenses')}>
            View All
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenses.slice(0, 6).map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onClick={() => navigate(`/expenses/${expense.id}`)}
            />
          ))}
        </div>

        {expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
            <p className="text-muted-foreground mb-4">Get started by submitting your first expense</p>
            <Button onClick={() => navigate('/submit')}>
              Submit First Expense
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
