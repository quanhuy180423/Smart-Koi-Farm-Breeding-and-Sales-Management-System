"use client";
import { useState } from "react";
// Thêm icon XCircle cho trạng thái thất bại
import { ChevronDown, ChevronRight, CheckCircle, Clock, Dot, XCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Giả định bạn có util `cn` từ shadcn/ui để merge classNames

interface BreedingStageCardProps {
    title: string;
    date: string;
    status: 'Hoàn thành' | 'Đang diễn ra' | 'Sắp tới' | 'Thất bại';
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
    let timelineLineColor: string;

    switch (status) {
        case 'Hoàn thành':
            statusIcon = <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
            statusTextColor = 'text-green-600';
            timelineLineColor = 'bg-green-200';
            break;
        case 'Đang diễn ra':
            statusIcon = <Clock className="h-4 w-4 text-blue-500 animate-pulse flex-shrink-0" />;
            statusTextColor = 'text-blue-600';
            timelineLineColor = 'bg-blue-200';
            break;
        case 'Thất bại':
            statusIcon = <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
            statusTextColor = 'text-red-600';
            timelineLineColor = 'bg-red-200';
            break;
        case 'Sắp tới':
        default:
            statusIcon = <Dot className="h-5 w-5 text-gray-400 flex-shrink-0" />;
            statusTextColor = 'text-gray-500';
            timelineLineColor = 'bg-gray-200';
            break;
    }

    return (
        <div className={cn("relative group", className)}>
            {!isLast && (
                <div
                    className={cn(
                        "absolute left-[11px] top-6 bottom-0 w-0.5",
                        timelineLineColor,
                        "group-hover:bg-gray-300 transition-colors duration-200"
                    )}
                />
            )}

            <div
                className="flex items-start cursor-pointer p-2 -ml-2 rounded-md transition-all duration-200 hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-shrink-0 pt-1 relative z-10">
                    {statusIcon}
                </div>

                <div className="flex-1 ml-4 pr-2">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-base font-medium text-gray-800">
                                {title}
                            </h3>
                            <p className={cn("text-xs", statusTextColor)}>
                                {date} - {status}
                            </p>
                        </div>

                        {/* Icon mở rộng */}
                        <div className="p-1">
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="pl-9 pb-4 pt-1 text-sm text-gray-600 animate-in fade-in slide-in-from-top-2 duration-300">
                    {children}
                </div>
            )}
        </div>
    );
};