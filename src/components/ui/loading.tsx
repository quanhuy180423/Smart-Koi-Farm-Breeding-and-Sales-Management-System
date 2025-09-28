import React from "react";
import { cn } from "@/lib/utils";
import FishSvg from "./fish-svg";

interface LoadingProps {
  size?: number;
  color?: string;
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 80, 
  color = "#0A3D62", 
  className,
  text = "Đang tải..."
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] space-y-4",
      className
    )}>
      <div className="animate-spin-slow">
        <FishSvg size={size} color={color} />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Full screen loading overlay
const LoadingOverlay: React.FC<LoadingProps> = (props) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading {...props} />
    </div>
  );
};

// Loading for specific sections
const LoadingSection: React.FC<LoadingProps> = (props) => {
  return (
    <div className="w-full py-12">
      <Loading {...props} />
    </div>
  );
};

// Loading spinner only (no text)
const LoadingSpinner: React.FC<Omit<LoadingProps, 'text'>> = ({ 
  size = 24, 
  color = "#0A3D62", 
  className 
}) => {
  return (
    <div className={cn("animate-spin-slow", className)}>
      <FishSvg size={size} color={color} />
    </div>
  );
};

export { Loading, LoadingOverlay, LoadingSection, LoadingSpinner };
export default Loading;
