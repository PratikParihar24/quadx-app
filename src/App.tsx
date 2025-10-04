import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Header } from '@/components/Layout/Header';
import { Navigation } from '@/components/Layout/Navigation';
import { EmployeeDashboard } from '@/pages/employee/Dashboard';
import { ManagerDashboard } from '@/pages/manager/Dashboard';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { SubmitExpense } from '@/pages/SubmitExpense';
import { ExpenseDetails } from '@/pages/ExpenseDetails';
import { MyExpenses } from '@/pages/MyExpenses';
import { UserRole } from '@/lib/types';
import NotFound from './pages/NotFound';
import { Auth } from '@/pages/Auth';

const queryClient = new QueryClient();

const App = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('employee');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getDashboardComponent = () => {
    switch (currentRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
              <Route
                path="/*"
                element={
                  user ? (
                    <div className="min-h-screen bg-background">
                      <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
                      <div className="flex">
                        <Navigation role={currentRole} />
                        <main className="flex-1 p-4 md:p-6">
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={getDashboardComponent()} />
                            <Route path="/submit" element={<SubmitExpense />} />
                            <Route path="/my-expenses" element={<MyExpenses />} />
                            <Route path="/expenses/:id" element={<ExpenseDetails />} />
                            <Route path="/approvals" element={<MyExpenses />} />
                            <Route path="/team" element={<MyExpenses />} />
                            <Route path="/all-expenses" element={<MyExpenses />} />
                            <Route path="/users" element={<div className="text-center py-16 text-muted-foreground">Users management coming soon</div>} />
                            <Route path="/analytics" element={<AdminDashboard />} />
                            <Route path="/settings" element={<div className="text-center py-16 text-muted-foreground">Settings coming soon</div>} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
