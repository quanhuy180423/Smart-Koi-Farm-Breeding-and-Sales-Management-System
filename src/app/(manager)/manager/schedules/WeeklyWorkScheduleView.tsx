"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Users,
  Droplets,
  AlertCircle,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkSchedule } from "@/lib/api/services/fetchWorkSchedule";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";
import {
  getWorkScheduleStatusText,
  getWorkScheduleStatusColor,
} from "@/lib/utils/enum";
import EditWorkScheduleModal from "./EditWorkScheduleModal";
import CreateWorkScheduleModal from "./CreateWorkScheduleModal";
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse, PondSearchParams } from "@/lib/api/services/fetchPond";
import { useDebounce } from "@/hooks/useDebounce";
import { Plus } from "lucide-react";

interface WeeklyWorkScheduleViewProps {
  workSchedules: WorkSchedule[];
  isLoading: boolean;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedPondId?: number | null;
  onPondChange?: (pondId: number | null) => void;
}

const DAYS_OF_WEEK = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export default function WeeklyWorkScheduleView({
  workSchedules,
  isLoading,
  currentDate,
  onDateChange,
  selectedPondId = null,
  onPondChange,
}: WeeklyWorkScheduleViewProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCreateDate, setSelectedCreateDate] = useState<string>("");
  const [isPondModalOpen, setIsPondModalOpen] = useState(false);
  const [selectedPond, setSelectedPond] = useState<PondResponse | null>(null);
  const [pondSearchTerm, setPondSearchTerm] = useState<string>("");
  const debouncedPondSearch = useDebounce(pondSearchTerm, 500);
  const [pondPageIndex, setPondPageIndex] = useState(1);
  const [pondPageSize] = useState(5);

  const { data: pondsResponse, isLoading: isLoadingPonds } = useGetPonds({
    pageIndex: pondPageIndex,
    pageSize: pondPageSize,
    search: debouncedPondSearch,
  } as PondSearchParams);

  const handleViewDetails = (schedule: WorkSchedule) => {
    setSelectedSchedule(schedule);
    setIsDetailOpen(true);
  };

  const handlePondSelect = (pond: PondResponse) => {
    setSelectedPond(pond);
    onPondChange?.(pond.id);
    setIsPondModalOpen(false);
  };

  const handleClearPond = () => {
    setSelectedPond(null);
    onPondChange?.(null);
  };

  // Calculate week start (Monday) and week end (Sunday)
  const weekStart = new Date(currentDate);
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
  weekStart.setDate(diff);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const getTasksForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return workSchedules.filter((ws) => ws.scheduledDate === dateStr);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Tuần trước
        </Button>
        <div className="flex-1 flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-gray-800">
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
          </p>
          {selectedPond && (
            <Badge variant="secondary" className="text-xs">
              Hồ: {selectedPond.pondName}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPondModalOpen(true)}
            className="whitespace-nowrap"
          >
            <Droplets className="h-4 w-4 mr-2" />
            {selectedPond ? "Đổi hồ" : "Chọn hồ"}
          </Button>
          {selectedPond && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearPond}
              className="text-red-600 hover:text-red-700"
            >
              ✕
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleNextWeek}>
          Tuần sau
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, index) => {
          const currentDayDate = new Date(weekStart);
          currentDayDate.setDate(currentDayDate.getDate() + index);
          const tasksForDay = getTasksForDay(currentDayDate);
          const isToday =
            currentDayDate.toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0];

          return (
            <Card
              key={index}
              className={`${isToday ? "border-2 border-blue-500" : "border border-gray-200"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm">
                    <div className="font-semibold text-gray-800">
                      {DAYS_OF_WEEK[currentDayDate.getDay()]}
                    </div>
                    <div
                      className={`text-xs ${isToday ? "text-blue-600 font-bold" : "text-gray-500"}`}
                    >
                      {currentDayDate.toLocaleDateString("vi-VN")}
                    </div>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:bg-blue-100 text-blue-600"
                    onClick={() => {
                      setSelectedCreateDate(
                        currentDayDate.toISOString().split("T")[0],
                      );
                      setIsCreateModalOpen(true);
                    }}
                    title="Thêm công việc"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {tasksForDay.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-gray-400">
                    <p className="text-xs">Không có công việc</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasksForDay.map((schedule) => (
                      <div
                        key={schedule.id}
                        onClick={() => handleViewDetails(schedule)}
                        className="border border-gray-200 rounded-lg p-2 bg-gray-50 text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {/* Status Badge */}
                        <div className="mb-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getWorkScheduleStatusColor(schedule.status)}`}
                          >
                            {getWorkScheduleStatusText(schedule.status)}
                          </Badge>
                        </div>

                        {/* Task Name */}
                        <p className="font-medium text-gray-900 truncate mb-1">
                          {schedule.taskTemplateName}
                        </p>

                        {/* Time */}
                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTimeToHHMM(schedule.startTime)} -{" "}
                            {formatTimeToHHMM(schedule.endTime)}
                          </span>
                        </div>

                        {/* Staff Assignments */}
                        {schedule.staffAssignments.length > 0 && (
                          <div className="flex items-start gap-1 mb-2">
                            <Users className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {schedule.staffAssignments.map((staff) => (
                                <span
                                  key={staff.staffId}
                                  className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs"
                                >
                                  {staff.staffName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pond Assignments */}
                        {schedule.pondAssignments.length > 0 && (
                          <div className="flex items-start gap-1">
                            <Droplets className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {schedule.pondAssignments.map((pond) => (
                                <span
                                  key={pond.pondId}
                                  className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs"
                                >
                                  {pond.pondName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {schedule.notes && (
                          <p className="text-gray-600 text-xs mt-2 italic border-t pt-1">
                            {schedule.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {workSchedules.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Không có công việc nào trong tuần này</p>
        </div>
      )}

      {/* Edit Modal */}
      <EditWorkScheduleModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        workSchedule={selectedSchedule}
      />

      {/* Create Modal */}
      <CreateWorkScheduleModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        scheduledDate={selectedCreateDate}
      />

      {/* Pond Selection Dialog */}
      <Dialog open={isPondModalOpen} onOpenChange={setIsPondModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn hồ để lọc</DialogTitle>
            <DialogDescription>
              Chọn hồ để lọc danh sách công việc
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 px-1">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <Input
                placeholder="Tìm kiếm hồ..."
                value={pondSearchTerm}
                onChange={(e) => {
                  setPondSearchTerm(e.target.value);
                  setPondPageIndex(1);
                }}
                className="flex-1"
              />
            </div>

            {/* Pond List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {isLoadingPonds ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : pondsResponse &&
                pondsResponse.data &&
                pondsResponse.data.length > 0 ? (
                pondsResponse.data.map((pond) => (
                  <Card
                    key={pond.id}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedPondId === pond.id
                        ? "border-2 border-blue-500 bg-blue-50"
                        : "border border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePondSelect(pond)}
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {pond.pondName}
                        </p>
                        <p className="text-xs text-gray-500">{pond.location}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">Không có hồ nào</p>
                </div>
              )}
            </div>

            {/* Pagination Info */}
            {pondsResponse && pondsResponse.totalPages > 0 && (
              <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
                Trang {pondPageIndex} / {pondsResponse.totalPages}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pondsResponse && pondsResponse.totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPondPageIndex(Math.max(1, pondPageIndex - 1))}
                disabled={pondPageIndex === 1 || isLoadingPonds}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPondPageIndex(
                    Math.min(pondsResponse.totalPages, pondPageIndex + 1),
                  )
                }
                disabled={
                  pondPageIndex === pondsResponse.totalPages || isLoadingPonds
                }
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsPondModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
