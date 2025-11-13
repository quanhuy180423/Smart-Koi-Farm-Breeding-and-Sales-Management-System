import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Đang tải dữ liệu...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center py-8 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}
