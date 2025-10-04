import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, Settings, FileText, TrendingUp } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NavigationProps {
  role: UserRole;
}

const navItems = {
  employee: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit', icon: Receipt, label: 'Submit Expense' },
    { to: '/my-expenses', icon: FileText, label: 'My Expenses' },
  ],
  manager: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/approvals', icon: Receipt, label: 'Pending Approvals' },
    { to: '/team', icon: Users, label: 'Team Overview' },
    { to: '/my-expenses', icon: FileText, label: 'My Expenses' },
  ],
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/all-expenses', icon: FileText, label: 'All Expenses' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ],
};

export const Navigation = ({ role }: NavigationProps) => {
  const items = navItems[role];

  return (
    <nav className="hidden md:block w-64 border-r bg-card">
      <div className="flex flex-col gap-2 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent text-accent-foreground shadow-sm'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
