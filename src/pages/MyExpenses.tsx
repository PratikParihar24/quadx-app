import { useState } from 'react';
import { ExpenseCard } from '@/components/Expenses/ExpenseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, getExpensesByUser } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

export const MyExpenses = () => {
  const navigate = useNavigate();
  const user = getCurrentUser('employee');
  const expenses = getExpensesByUser(user.id);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Expenses</h1>
          <p className="text-muted-foreground mt-1">View and manage all your expenses</p>
        </div>
        <Button onClick={() => navigate('/submit')} className="bg-gradient-primary hover:opacity-90">
          Submit New Expense
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onClick={() => navigate(`/expenses/${expense.id}`)}
          />
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No expenses found</p>
        </div>
      )}
    </div>
  );
};
