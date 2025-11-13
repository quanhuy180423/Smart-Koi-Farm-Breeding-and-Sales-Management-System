import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Lỗi khi tải dữ liệu",
  message = "Có lỗi xảy ra. Vui lòng thử lại.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Thử lại
        </Button>
      )}
    </div>
  );
}
