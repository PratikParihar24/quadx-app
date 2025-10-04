-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'employee');

-- Create enum for expense status
CREATE TYPE public.expense_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'paid');

-- Companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Profiles table (user information)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  base_currency_amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  status public.expense_status NOT NULL DEFAULT 'draft',
  receipt_url TEXT,
  submitted_at TIMESTAMPTZ,
  current_step_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Approval steps table
CREATE TABLE public.approval_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  approver_id UUID REFERENCES public.profiles(id),
  approver_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  timestamp TIMESTAMPTZ,
  comments TEXT,
  UNIQUE(expense_id, step_number)
);

ALTER TABLE public.approval_steps ENABLE ROW LEVEL SECURITY;

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their company"
  ON public.companies FOR SELECT
  USING (id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their company"
  ON public.profiles FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policies for expenses
CREATE POLICY "Employees can view their own expenses"
  ON public.expenses FOR SELECT
  USING (employee_id = auth.uid());

CREATE POLICY "Managers can view team expenses"
  ON public.expenses FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM public.profiles 
      WHERE manager_id = auth.uid() 
      AND company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all company expenses"
  ON public.expenses FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') 
    AND company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Employees can create their own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Employees can update their draft expenses"
  ON public.expenses FOR UPDATE
  USING (employee_id = auth.uid() AND status = 'draft');

CREATE POLICY "Managers can update team expenses"
  ON public.expenses FOR UPDATE
  USING (
    employee_id IN (
      SELECT id FROM public.profiles 
      WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all company expenses"
  ON public.expenses FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin')
    AND company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
  );

-- RLS Policies for approval_steps
CREATE POLICY "Users can view approval steps for visible expenses"
  ON public.approval_steps FOR SELECT
  USING (
    expense_id IN (SELECT id FROM public.expenses)
  );

CREATE POLICY "Approvers can update their approval steps"
  ON public.approval_steps FOR UPDATE
  USING (approver_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to expenses table
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();