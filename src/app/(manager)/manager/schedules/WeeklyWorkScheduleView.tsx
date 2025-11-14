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
import {
  getWorkScheduleStatusText,
  getWorkScheduleStatusColor,
  getRoleText,
} from "@/lib/utils/enum";
import EditWorkScheduleModal from "./EditWorkScheduleModal";
import CreateWorkScheduleModal from "./CreateWorkScheduleModal";
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse, PondSearchParams } from "@/lib/api/services/fetchPond";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PaginationSection,
  PAGE_SIZE_OPTIONS_DEFAULT,
} from "@/components/common/PaginationSection";

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
  const [pondSearchParams, setPondSearchParams] = useState<PondSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
  });

  const { data: pondsResponse, isLoading: isLoadingPonds } =
    useGetPonds(pondSearchParams);

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
                                  title={`${staff.staffName} - ${getRoleText(staff.role)}`}
                                >
                                  {staff.staffName} ({getRoleText(staff.role)})
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
        <DialogContent className="!max-w-4xl">
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
                setPondSearchParams((prev) => ({
                  ...prev,
                  search: e.target.value,
                  pageIndex: 1,
                }));
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[5%]">#</TableHead>
                      <TableHead className="w-[30%]">Tên Hồ</TableHead>
                      <TableHead className="w-[35%]">Vị trí</TableHead>
                      <TableHead className="w-[30%]">Loại Hồ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!pondsResponse?.data || pondsResponse.data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500 py-4"
                        >
                          Không tìm thấy hồ nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pondsResponse.data.map((pond) => (
                        <TableRow
                          key={pond.id}
                          onClick={() => handlePondSelect(pond)}
                          className={
                            selectedPondId === pond.id
                              ? "bg-green-50/50 cursor-pointer"
                              : "hover:bg-gray-50 cursor-pointer"
                          }
                        >
                          <TableCell>
                            <input
                              type="radio"
                              checked={selectedPondId === pond.id}
                              onChange={() => handlePondSelect(pond)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {pond.pondName}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {pond.location}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {pond.pondTypeName || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {pondsResponse && pondsResponse.totalItems > 0 && (
                  <PaginationSection
                    totalItems={pondsResponse.totalItems}
                    postsPerPage={pondSearchParams.pageSize}
                    currentPage={pondSearchParams.pageIndex}
                    setCurrentPage={(page) =>
                      setPondSearchParams((prev) => ({
                        ...prev,
                        pageIndex: page,
                      }))
                    }
                    totalPages={pondsResponse.totalPages}
                    setPageSize={(size) =>
                      setPondSearchParams((prev) => ({
                        ...prev,
                        pageSize: size,
                        pageIndex: 1,
                      }))
                    }
                    hasNextPage={pondsResponse.hasNextPage}
                    hasPreviousPage={pondsResponse.hasPreviousPage}
                    pageSizeOptions={[5, 10, 20]}
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
