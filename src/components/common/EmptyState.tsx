import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  children,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      {Icon && (
        <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
