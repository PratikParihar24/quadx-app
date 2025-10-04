import { DollarSign, Clock, CheckCircle, Users } from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ExpenseCard } from '@/components/Expenses/ExpenseCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getPendingApprovals, mockExpenses } from '@/lib/mockData';

export const ManagerDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser('manager');
  const pendingApprovals = getPendingApprovals(user.id);
  
  const teamExpenses = mockExpenses.filter(e => {
    const employee = mockExpenses.find(ex => ex.employeeId === e.employeeId);
    return employee;
  });

  const stats = {
    pendingApprovals: pendingApprovals.length,
    approvedThisMonth: teamExpenses.filter(e => e.status === 'approved').length,
    totalTeamSpend: teamExpenses.reduce((sum, e) => sum + e.baseCurrencyAmount, 0),
    teamMembers: 2,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-1">Review and manage team expenses</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Approved This Month"
          value={stats.approvedThisMonth}
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Total Team Spend"
          value={`$${stats.totalTeamSpend.toFixed(2)}`}
          icon={DollarSign}
          variant="primary"
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Pending Approvals</h2>
          <Button variant="outline" onClick={() => navigate('/approvals')}>
            View All
          </Button>
        </div>

        {pendingApprovals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingApprovals.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onClick={() => navigate(`/expenses/${expense.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-card rounded-lg border">
            <CheckCircle className="h-16 w-16 text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending approvals at the moment</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Team Activity</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamExpenses.slice(0, 6).map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onClick={() => navigate(`/expenses/${expense.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
