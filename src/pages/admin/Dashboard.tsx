import { DollarSign, Receipt, TrendingUp, Users } from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockExpenses } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const AdminDashboard = () => {
  const stats = {
    total: mockExpenses.length,
    pending: mockExpenses.filter(e => e.status === 'pending').length,
    approved: mockExpenses.filter(e => e.status === 'approved').length,
    paid: mockExpenses.filter(e => e.status === 'paid').length,
    totalAmount: mockExpenses.reduce((sum, e) => sum + e.baseCurrencyAmount, 0),
    pendingAmount: mockExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.baseCurrencyAmount, 0),
  };

  const categoryData = [
    { name: 'Travel', value: 1595.21, count: 2 },
    { name: 'Meals', value: 85.50, count: 1 },
    { name: 'Office', value: 450.00, count: 1 },
    { name: 'Training', value: 2100.00, count: 1 },
  ];

  const trendData = [
    { month: 'Jun', amount: 3200 },
    { month: 'Jul', amount: 2800 },
    { month: 'Aug', amount: 3900 },
    { month: 'Sep', amount: 4230 },
  ];

  const COLORS = ['hsl(262 83% 58%)', 'hsl(142 71% 45%)', 'hsl(38 92% 50%)', 'hsl(220 90% 56%)'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Complete overview of all expenses</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Expenses"
          value={stats.total}
          icon={Receipt}
          variant="primary"
        />
        <StatsCard
          title="Pending Approval"
          value={stats.pending}
          icon={TrendingUp}
          variant="warning"
        />
        <StatsCard
          title="Total Amount"
          value={`$${stats.totalAmount.toFixed(2)}`}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title="Paid Out"
          value={stats.paid}
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(262 83% 58%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(262 83% 58%)', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="hsl(262 83% 58%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
