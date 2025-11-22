"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Zap,
  AlertCircle,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BreedingStageCardProps {
  title: string;
  date: string;
  status: "Hoàn thành" | "Đang diễn ra" | "Sắp tới" | "Thất bại";
  defaultOpen?: boolean;
  children: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

export const BreedingStageCard = ({
  title,
  date,
  status,
  defaultOpen = false,
  children,
  isLast = false,
  className,
}: BreedingStageCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  let statusIcon: React.ReactNode;
  let statusTextColor: string;
  let statusBgColor: string;
  let timelineLineColor: string;
  let borderColor: string;
  let headerBgGradient: string;

  switch (status) {
    case "Hoàn thành":
      statusIcon = (
        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
      );
      statusTextColor = "text-green-700";
      statusBgColor = "bg-green-100";
      timelineLineColor = "bg-gradient-to-b from-green-300 to-green-100";
      borderColor = "border-green-300";
      headerBgGradient = "bg-gradient-to-r from-green-50 to-emerald-50";
      break;
    case "Đang diễn ra":
      statusIcon = (
        <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 animate-pulse" />
      );
      statusTextColor = "text-blue-700";
      statusBgColor = "bg-blue-100";
      timelineLineColor = "bg-gradient-to-b from-blue-300 to-blue-100";
      borderColor = "border-blue-300";
      headerBgGradient = "bg-gradient-to-r from-blue-50 to-cyan-50";
      break;
    case "Thất bại":
      statusIcon = (
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
      );
      statusTextColor = "text-red-700";
      statusBgColor = "bg-red-100";
      timelineLineColor = "bg-gradient-to-b from-red-300 to-red-100";
      borderColor = "border-red-300";
      headerBgGradient = "bg-gradient-to-r from-red-50 to-pink-50";
      break;
    case "Sắp tới":
    default:
      statusIcon = <Circle className="h-5 w-5 text-gray-500 flex-shrink-0" />;
      statusTextColor = "text-gray-600";
      statusBgColor = "bg-gray-100";
      timelineLineColor = "bg-gradient-to-b from-gray-300 to-gray-100";
      borderColor = "border-gray-300";
      headerBgGradient = "bg-gradient-to-r from-gray-50 to-slate-50";
      break;
  }

  const statusBadgeColor = {
    "Hoàn thành": "bg-green-500",
    "Đang diễn ra": "bg-blue-500",
    "Thất bại": "bg-red-500",
    "Sắp tới": "bg-gray-400",
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Timeline line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-6 top-12 bottom-0 w-1",
            timelineLineColor,
            "transition-all duration-300",
          )}
        />
      )}

      {/* Main card */}
      <div
        className={cn(
          "relative bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-300",
          borderColor,
          "hover:shadow-md hover:border-opacity-100",
        )}
      >
        {/* Header with gradient */}
        <div
          className={cn(
            "px-4 py-3",
            headerBgGradient,
            "cursor-pointer transition-colors duration-200",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status icon in circle */}
              <div
                className={cn(
                  "p-2 rounded-full",
                  statusBgColor,
                  "relative z-10 flex items-center justify-center",
                )}
              >
                {statusIcon}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base">
                  {title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className={cn("text-xs font-medium", statusTextColor)}>
                    {date}
                  </p>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium text-white inline-block",
                      statusBadgeColor[status],
                    )}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* Expand icon */}
            <button
              className="p-1 hover:bg-white/50 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {isOpen && (
          <div className="px-4 py-4 bg-white border-t border-gray-100 text-sm text-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};
