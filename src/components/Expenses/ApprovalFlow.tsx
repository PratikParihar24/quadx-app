import { Check, X, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApprovalStep } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ApprovalFlowProps {
  steps: ApprovalStep[];
  currentStepIndex: number;
}

export const ApprovalFlow = ({ steps, currentStepIndex }: ApprovalFlowProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'approved' || step.status === 'rejected';
            const isCurrent = index === currentStepIndex;
            const isPending = step.status === 'pending';

            return (
              <div key={step.stepNumber} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      step.status === 'approved' && 'bg-success border-success text-success-foreground',
                      step.status === 'rejected' && 'bg-destructive border-destructive text-destructive-foreground',
                      isPending && isCurrent && 'border-primary bg-primary/10 text-primary animate-pulse-glow',
                      isPending && !isCurrent && 'border-muted bg-muted text-muted-foreground'
                    )}
                  >
                    {step.status === 'approved' && <Check className="h-5 w-5" />}
                    {step.status === 'rejected' && <X className="h-5 w-5" />}
                    {step.status === 'pending' && <Clock className="h-5 w-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'h-12 w-0.5 my-1',
                      isCompleted ? 'bg-success' : 'bg-border'
                    )} />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Step {step.stepNumber}</h4>
                      <p className="text-sm text-muted-foreground">
                        {step.approverName || 'Pending assignment'}
                      </p>
                    </div>
                    <div className="text-right">
                      {step.timestamp && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(step.timestamp), 'MMM dd, yyyy HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                  {step.comments && (
                    <div className="mt-2 rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground">{step.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
