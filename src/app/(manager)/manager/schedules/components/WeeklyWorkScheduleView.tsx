"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Users,
  Droplets,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkSchedule } from "@/lib/api/services/fetchWorkSchedule";
import { Roles } from "@/lib/api/services/fetchAuth";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";
import { getRoleText } from "@/lib/utils/enum";
import EditWorkScheduleModal from "./EditWorkScheduleModal";
import CreateWorkScheduleModal from "./CreateWorkScheduleModal";
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse } from "@/lib/api/services/fetchPond";
import { Plus } from "lucide-react";
import { PaginationWithLinks } from "@/components/pagination";
import { toLocalDateString } from "@/lib/utils/dates";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

interface WeeklyWorkScheduleViewProps {
  workSchedules: WorkSchedule[];
  isLoading: boolean;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedPondId?: number | null;
  onPondChange?: (pondId: number | null) => void;
  selectedStaffRole?: Roles | null;
  onStaffRoleChange?: (staffRole: Roles | null) => void;
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
  selectedStaffRole = null,
  onStaffRoleChange,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const { data: pondsResponse, isLoading: isLoadingPonds } = useGetPonds({
    pageIndex: currentPage,
    pageSize: pageSize,
    search: pondSearchTerm || undefined,
  });

  const handleViewDetails = (schedule: WorkSchedule) => {
    setSelectedSchedule(schedule);
    setIsDetailOpen(true);
  };

  const handlePondSelect = (pond: PondResponse) => {
    setSelectedPond(pond);
    onPondChange?.(pond.id);
    setIsPondModalOpen(false);
  };

  const getStatusBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "hoàn thành":
        return "border-l-green-500";
      case "in_progress":
      case "in progress":
      case "đang thực hiện":
        return "border-l-blue-500";
      case "pending":
      case "chờ thực hiện":
        return "border-l-yellow-500";
      case "cancelled":
      case "hủy bỏ":
        return "border-l-red-500";
      default:
        return "border-l-gray-400";
    }
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
    // Use local timezone instead of UTC to avoid timezone issues
    const dateStr = toLocalDateString(date);
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
          {selectedPond ? (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-100"
                onClick={() => setIsPondModalOpen(true)}
              >
                <Droplets className="h-3 w-3 mr-1" />
                Hồ #{selectedPond.id}: {selectedPond.pondName}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearPond}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                ✕
              </Button>
            </div>
          ) : (
            <Badge
              variant="outline"
              className="px-3 py-1 text-gray-600 border-gray-300 cursor-pointer hover:bg-gray-50"
              onClick={() => setIsPondModalOpen(true)}
            >
              <Droplets className="h-3 w-3 mr-1" />
              Tất cả hồ
            </Badge>
          )}
        </div>

        <Select
          value={selectedStaffRole || "all"}
          onValueChange={(value) =>
            onStaffRoleChange?.(value === "all" ? null : (value as Roles))
          }
        >
          <SelectTrigger className="w-auto border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 h-9 px-3 rounded-md">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhân viên</SelectItem>
            <SelectItem value={Roles.FarmStaff}>
              Nhân viên trang trại
            </SelectItem>
            <SelectItem value={Roles.SaleStaff}>Nhân viên bán hàng</SelectItem>
          </SelectContent>
        </Select>

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
            toLocalDateString(currentDayDate) ===
            toLocalDateString(new Date());

          // Check if the date is in the past
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const currentDayDateNoTime = new Date(currentDayDate);
          currentDayDateNoTime.setHours(0, 0, 0, 0);
          const isPastDate = currentDayDateNoTime < today;

          return (
            <Card
              key={index}
              className={`transition-all duration-200 ${isToday ? "ring-2 ring-blue-500 border-blue-300 shadow-lg" : "border border-gray-200 hover:shadow-md"}`}
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
                  {!isPastDate && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-blue-100 text-blue-600"
                      onClick={() => {
                        setSelectedCreateDate(
                          toLocalDateString(currentDayDate),
                        );
                        setIsCreateModalOpen(true);
                      }}
                      title="Thêm công việc"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
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
                        className={`
                          border-l-[3px] bg-white rounded-lg p-3 text-xs 
                          cursor-pointer transition-all duration-200 
                          hover:shadow-md hover:-translate-y-0.5
                          ${getStatusBorderColor(schedule.status)}
                        `}
                      >
                        {/* Task Name & Time */}
                        <div className="mb-2">
                          <p className="font-semibold text-gray-900 truncate text-sm mb-1">
                            {schedule.taskTemplateName}
                          </p>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {formatTimeToHHMM(schedule.startTime)} -{" "}
                              {formatTimeToHHMM(schedule.endTime)}
                            </span>
                          </div>
                        </div>

                        {/* Staff Avatars */}
                        {schedule.staffAssignments.length > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <Users className="h-3 w-3 text-gray-600" />
                            <div className="flex -space-x-1">
                              {schedule.staffAssignments
                                .slice(0, 3)
                                .map((staff) => (
                                  <div
                                    key={staff.staffId}
                                    className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                                    title={`${staff.staffName} - ${getRoleText(staff.role)}`}
                                  >
                                    {staff.staffName.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                              {schedule.staffAssignments.length > 3 && (
                                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                                  +{schedule.staffAssignments.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Pond Chips */}
                        {schedule.pondAssignments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-gray-600" />
                            <div className="flex flex-wrap gap-1">
                              {schedule.pondAssignments
                                .slice(0, 2)
                                .map((pond) => (
                                  <span
                                    key={pond.pondId}
                                    className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium"
                                  >
                                    {pond.pondName}
                                  </span>
                                ))}
                              {schedule.pondAssignments.length > 2 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                  +{schedule.pondAssignments.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Notes - Shortened */}
                        {schedule.notes && (
                          <p
                            className="text-gray-500 text-xs mt-2 italic truncate"
                            title={schedule.notes}
                          >
                            💡 {schedule.notes}
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
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Chọn Hồ để lọc</DialogTitle>
            <DialogDescription>
              Chọn hồ để lọc danh sách công việc theo hồ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Tìm kiếm hồ theo tên..."
              value={pondSearchTerm}
              onChange={(e) => {
                setPondSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full"
            />

            {isLoadingPonds ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang tải danh sách hồ...
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {!pondsResponse?.data || pondsResponse.data.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Không tìm thấy hồ nào.
                    </div>
                  ) : (
                    pondsResponse.data.map((pond) => (
                      <div
                        key={pond.id}
                        onClick={() => handlePondSelect(pond)}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${
                            selectedPondId === pond.id
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          checked={selectedPondId === pond.id}
                          onChange={() => handlePondSelect(pond)}
                          className="text-blue-600 focus:ring-blue-500"
                        />

                        {/* Icon/Avatar */}
                        <div className="shrink-0">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {pond.pondName.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {pond.pondName}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            📍 {pond.location}
                          </p>
                          {pond.pondTypeName && (
                            <p className="text-xs text-gray-500">
                              🏷️ {pond.pondTypeName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {pondsResponse && pondsResponse.totalItems > 0 && (
                  <PaginationWithLinks
                    totalCount={pondsResponse.totalItems}
                    pageSize={pageSize}
                    page={currentPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newSize) => {
                      setPageSize(newSize);
                      setCurrentPage(1);
                    }}
                  />
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPondModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                setIsPondModalOpen(false);
              }}
              disabled={!selectedPondId || isLoadingPonds}
            >
              Chọn Hồ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
