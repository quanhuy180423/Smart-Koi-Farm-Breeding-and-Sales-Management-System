"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetMyWorkSchedules,
  useCompleteMyAssignment,
} from "@/hooks/useWorkSchedule";
import {
  WorkSchedule,
  WorkScheduleStatusEnum,
} from "@/lib/api/services/fetchWorkSchedule";
import { getWorkScheduleStatusLabel } from "@/lib/utils/enum";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";

export default function MySchedulesPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [selectedScheduleForCompletion, setSelectedScheduleForCompletion] =
    useState<WorkSchedule | null>(null);
  const [completionNotes, setCompletionNotes] = useState<string>("");

  // Calculate week start and end dates (Monday to Sunday)
  const weekStart = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    // If Sunday (0), go back 6 days; otherwise go back (day - 1) days
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(date.setDate(diff));
  }, [currentDate]);

  const weekEnd = useMemo(() => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + 6);
    return date;
  }, [weekStart]);

  // Format dates for API
  const formattedDateFrom = weekStart.toISOString().split("T")[0];
  const formattedDateTo = weekEnd.toISOString().split("T")[0];

  const {
    data: schedules = [],
    isLoading,
    error,
  } = useGetMyWorkSchedules({
    scheduledDateFrom: formattedDateFrom,
    scheduledDateTo: formattedDateTo,
  });

  const { mutate: completeAssignment, isPending: isCompleting } =
    useCompleteMyAssignment();

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, WorkSchedule[]> = {};
    schedules.forEach((schedule) => {
      if (!grouped[schedule.scheduledDate]) {
        grouped[schedule.scheduledDate] = [];
      }
      grouped[schedule.scheduledDate].push(schedule);
    });
    return grouped;
  }, [schedules]);

  // Generate array of days in the week
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [weekStart]);

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Check if schedule is for today
  const isToday = (scheduledDate: string): boolean => {
    return new Date().toISOString().split("T")[0] === scheduledDate;
  };

  // Check if schedule can be completed
  const canCompleteSchedule = (schedule: WorkSchedule): boolean => {
    return (
      isToday(schedule.scheduledDate) &&
      (schedule.status === WorkScheduleStatusEnum.Pending ||
        schedule.status === WorkScheduleStatusEnum.InProgress)
    );
  };

  // Open completion dialog
  const handleOpenCompleteDialog = (schedule: WorkSchedule) => {
    setSelectedScheduleForCompletion(schedule);
    setCompletionNotes("");
    setIsCompleteDialogOpen(true);
  };

  // Handle completing assignment
  const handleCompleteAssignment = () => {
    if (selectedScheduleForCompletion) {
      completeAssignment(
        {
          id: selectedScheduleForCompletion.id,
          request: { completionNotes },
        },
        {
          onSuccess: () => {
            setIsCompleteDialogOpen(false);
            setSelectedScheduleForCompletion(null);
            setCompletionNotes("");
          },
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Đang tải lịch làm việc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
        <p className="text-red-600">Có lỗi xảy ra khi tải lịch làm việc</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Lịch Làm Việc Của Tôi
        </h1>
        <p className="text-muted-foreground">
          Xem lịch làm việc hàng tuần của bạn
        </p>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {weekStart.toLocaleDateString("vi-VN", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {weekEnd.toLocaleDateString("vi-VN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                Tuần từ {weekStart.toLocaleDateString("vi-VN")} đến{" "}
                {weekEnd.toLocaleDateString("vi-VN")}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Hôm Nay
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly View */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((date) => {
          const dateStr = date.toISOString().split("T")[0];
          const daySchedules = schedulesByDate[dateStr] || [];
          const dayName = date.toLocaleDateString("vi-VN", {
            weekday: "short",
          });
          const isToday = new Date().toISOString().split("T")[0] === dateStr;
          const isWeekend = date.getDay() === 0; // Sunday is the only weekend day

          return (
            <Card
              key={dateStr}
              className={`flex flex-col ${isToday ? "border-blue-500 border-2" : ""} ${
                isWeekend ? "bg-muted/50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {dayName}
                  </p>
                  <p className="text-lg font-bold">
                    {date.toLocaleDateString("vi-VN", {
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {daySchedules.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Không có công việc
                  </p>
                ) : (
                  daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs space-y-1"
                    >
                      <div className="font-medium text-blue-900 line-clamp-2">
                        {schedule.taskTemplateName}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatTimeToHHMM(schedule.startTime)} -{" "}
                          {formatTimeToHHMM(schedule.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs flex-1">
                          {getWorkScheduleStatusLabel(schedule.status).label}
                        </Badge>
                        {canCompleteSchedule(schedule) && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleOpenCompleteDialog(schedule)}
                            className="h-5 w-5 text-green-600 hover:bg-green-200 hover:text-green-700"
                            title="Hoàn thành công việc"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Schedule Details */}
      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chi Tiết Công Việc</CardTitle>
            <CardDescription>
              Danh sách chi tiết tất cả công việc trong tuần
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-semibold text-base">
                      {schedule.taskTemplateName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {schedule.taskTemplate.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        getWorkScheduleStatusLabel(schedule.status).colorClass
                      }
                    >
                      {getWorkScheduleStatusLabel(schedule.status).label}
                    </Badge>
                    {canCompleteSchedule(schedule) && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenCompleteDialog(schedule)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Hoàn Thành
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ngày:</p>
                    <p className="font-medium">
                      {new Date(schedule.scheduledDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Giờ:</p>
                    <p className="font-medium">
                      {formatTimeToHHMM(schedule.startTime)} -{" "}
                      {formatTimeToHHMM(schedule.endTime)}
                    </p>
                  </div>
                </div>

                {/* Staff Assignments */}
                {schedule.staffAssignments.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">
                      Nhân viên được gán:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {schedule.staffAssignments.map((staff, idx) => (
                        <Badge key={idx} variant="secondary">
                          {staff.staffName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pond Assignments */}
                {schedule.pondAssignments.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      Hồ được gán:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {schedule.pondAssignments.map((pond, idx) => (
                        <Badge key={idx} variant="outline">
                          {pond.pondName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {schedule.notes && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Ghi chú:</p>
                    <p className="text-sm text-muted-foreground">
                      {schedule.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Complete Assignment Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đánh Dấu Công Việc Hoàn Thành</DialogTitle>
            <DialogDescription>
              Nhập ghi chú hoàn thành cho công việc này
            </DialogDescription>
          </DialogHeader>

          {selectedScheduleForCompletion && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Công Việc</p>
                  <p className="font-semibold">
                    {selectedScheduleForCompletion.taskTemplateName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ngày</p>
                  <p className="font-semibold">
                    {new Date(
                      selectedScheduleForCompletion.scheduledDate,
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Giờ</p>
                  <p className="font-semibold">
                    {formatTimeToHHMM(selectedScheduleForCompletion.startTime)}{" "}
                    - {formatTimeToHHMM(selectedScheduleForCompletion.endTime)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion-notes">Ghi Chú Hoàn Thành</Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Nhập ghi chú về công việc đã hoàn thành (tùy chọn)"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCompleteDialogOpen(false);
                setSelectedScheduleForCompletion(null);
                setCompletionNotes("");
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCompleteAssignment}
              disabled={isCompleting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang Xử Lý...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Hoàn Thành
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
