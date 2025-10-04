export type UserRole = 'admin' | 'manager' | 'employee';

export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'paid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
  companyId: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  currency: string;
  baseCurrencyAmount: number;
  category: string;
  description: string;
  date: string;
  status: ExpenseStatus;
  receiptUrl?: string;
  submittedAt: string;
  approvalSteps: ApprovalStep[];
  currentStepIndex: number;
}

export interface ApprovalStep {
  stepNumber: number;
  approverId?: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comments?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'submission' | 'approval' | 'rejection' | 'payment' | 'override';
  expenseId: string;
  read: boolean;
  timestamp: string;
}

export interface DashboardStats {
  totalExpenses: number;
  pendingApprovals: number;
  approvedExpenses: number;
  paidExpenses: number;
  totalAmount: number;
  pendingAmount: number;
}
