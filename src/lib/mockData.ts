import { User, Expense, Notification, UserRole } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@quadx.com',
    role: 'admin',
    companyId: 'company-1',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@quadx.com',
    role: 'manager',
    companyId: 'company-1',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@quadx.com',
    role: 'employee',
    managerId: '2',
    companyId: 'company-1',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@quadx.com',
    role: 'employee',
    managerId: '2',
    companyId: 'company-1',
  },
];

export const mockExpenses: Expense[] = [
  {
    id: 'exp-001',
    employeeId: '3',
    employeeName: 'Michael Chen',
    amount: 1250.00,
    currency: 'USD',
    baseCurrencyAmount: 1250.00,
    category: 'Travel',
    description: 'Flight to client meeting in New York',
    date: '2025-09-28',
    status: 'approved',
    receiptUrl: '/receipts/flight-receipt.pdf',
    submittedAt: '2025-09-28T10:30:00Z',
    currentStepIndex: 1,
    approvalSteps: [
      {
        stepNumber: 1,
        approverId: '2',
        approverName: 'Sarah Johnson',
        status: 'approved',
        timestamp: '2025-09-28T14:20:00Z',
        comments: 'Approved for business development',
      },
      {
        stepNumber: 2,
        approverId: '1',
        approverName: 'John Smith',
        status: 'approved',
        timestamp: '2025-09-29T09:15:00Z',
      },
    ],
  },
  {
    id: 'exp-002',
    employeeId: '4',
    employeeName: 'Emily Rodriguez',
    amount: 85.50,
    currency: 'USD',
    baseCurrencyAmount: 85.50,
    category: 'Meals',
    description: 'Team lunch with client',
    date: '2025-10-01',
    status: 'pending',
    receiptUrl: '/receipts/lunch-receipt.pdf',
    submittedAt: '2025-10-01T15:45:00Z',
    currentStepIndex: 0,
    approvalSteps: [
      {
        stepNumber: 1,
        approverId: '2',
        approverName: 'Sarah Johnson',
        status: 'pending',
      },
    ],
  },
  {
    id: 'exp-003',
    employeeId: '3',
    employeeName: 'Michael Chen',
    amount: 450.00,
    currency: 'USD',
    baseCurrencyAmount: 450.00,
    category: 'Office Supplies',
    description: 'New laptop accessories and monitor',
    date: '2025-10-02',
    status: 'pending',
    submittedAt: '2025-10-02T09:00:00Z',
    currentStepIndex: 0,
    approvalSteps: [
      {
        stepNumber: 1,
        approverId: '2',
        approverName: 'Sarah Johnson',
        status: 'pending',
      },
    ],
  },
  {
    id: 'exp-004',
    employeeId: '4',
    employeeName: 'Emily Rodriguez',
    amount: 2100.00,
    currency: 'USD',
    baseCurrencyAmount: 2100.00,
    category: 'Training',
    description: 'Professional certification course',
    date: '2025-09-25',
    status: 'paid',
    receiptUrl: '/receipts/training-receipt.pdf',
    submittedAt: '2025-09-25T11:00:00Z',
    currentStepIndex: 2,
    approvalSteps: [
      {
        stepNumber: 1,
        approverId: '2',
        approverName: 'Sarah Johnson',
        status: 'approved',
        timestamp: '2025-09-25T16:30:00Z',
      },
      {
        stepNumber: 2,
        approverId: '1',
        approverName: 'John Smith',
        status: 'approved',
        timestamp: '2025-09-26T10:00:00Z',
      },
    ],
  },
  {
    id: 'exp-005',
    employeeId: '3',
    employeeName: 'Michael Chen',
    amount: 320.75,
    currency: 'EUR',
    baseCurrencyAmount: 345.21,
    category: 'Travel',
    description: 'Hotel accommodation in Berlin',
    date: '2025-09-20',
    status: 'rejected',
    receiptUrl: '/receipts/hotel-receipt.pdf',
    submittedAt: '2025-09-20T18:20:00Z',
    currentStepIndex: 0,
    approvalSteps: [
      {
        stepNumber: 1,
        approverId: '2',
        approverName: 'Sarah Johnson',
        status: 'rejected',
        timestamp: '2025-09-21T09:00:00Z',
        comments: 'Please submit pre-approval for international travel',
      },
    ],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: '2',
    title: 'New Expense Submitted',
    message: 'Emily Rodriguez submitted an expense for $85.50',
    type: 'submission',
    expenseId: 'exp-002',
    read: false,
    timestamp: '2025-10-01T15:45:00Z',
  },
  {
    id: 'notif-002',
    userId: '2',
    title: 'New Expense Submitted',
    message: 'Michael Chen submitted an expense for $450.00',
    type: 'submission',
    expenseId: 'exp-003',
    read: false,
    timestamp: '2025-10-02T09:00:00Z',
  },
  {
    id: 'notif-003',
    userId: '3',
    title: 'Expense Approved',
    message: 'Your expense for $1,250.00 has been approved',
    type: 'approval',
    expenseId: 'exp-001',
    read: true,
    timestamp: '2025-09-29T09:15:00Z',
  },
  {
    id: 'notif-004',
    userId: '3',
    title: 'Expense Rejected',
    message: 'Your expense for €320.75 has been rejected',
    type: 'rejection',
    expenseId: 'exp-005',
    read: false,
    timestamp: '2025-09-21T09:00:00Z',
  },
  {
    id: 'notif-005',
    userId: '4',
    title: 'Payment Processed',
    message: 'Payment of $2,100.00 has been processed',
    type: 'payment',
    expenseId: 'exp-004',
    read: true,
    timestamp: '2025-09-27T14:30:00Z',
  },
];

export const getCurrentUser = (role?: UserRole): User => {
  const roleMap: Record<UserRole, string> = {
    admin: '1',
    manager: '2',
    employee: '3',
  };
  
  const userId = role ? roleMap[role] : '3';
  return mockUsers.find(u => u.id === userId) || mockUsers[2];
};

export const getExpensesByUser = (userId: string): Expense[] => {
  return mockExpenses.filter(e => e.employeeId === userId);
};

export const getPendingApprovals = (managerId: string): Expense[] => {
  return mockExpenses.filter(e => 
    e.status === 'pending' && 
    e.approvalSteps[e.currentStepIndex]?.approverId === managerId
  );
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(n => n.userId === userId);
};
