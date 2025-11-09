"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Droplets, Loader2, Plus, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse, PondSearchParams } from "@/lib/api/services/fetchPond";
import { useDebounce } from "@/hooks/useDebounce";
import TaskSelectionPopup from "./TaskSelectionPopup";
import { TaskTemplateResponse } from "@/lib/api/services/fetchTaskTemplate";
import { useGetStaffByRole } from "@/hooks/useUsers";
import { Roles } from "@/lib/api/services/fetchAuth";
import { StaffUser } from "@/lib/api/services/fetchUsers";
import { useCreateWorkSchedule } from "@/hooks/useWorkSchedule";

interface CreateWorkScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scheduledDate: string;
}

export default function CreateWorkScheduleModal({
  isOpen,
  onOpenChange,
  scheduledDate,
}: CreateWorkScheduleModalProps) {
  const [selectedTask, setSelectedTask] = useState<TaskTemplateResponse | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedPondIds, setSelectedPondIds] = useState<Set<number>>(
    new Set(),
  );
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isPondModalOpen, setIsPondModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [pondPageIndex, setPondPageIndex] = useState(1);
  const [pondSearchTerm, setPondSearchTerm] = useState("");
  const [staffPageIndex, setStaffPageIndex] = useState(1);
  const [staffSearchTerm, setStaffSearchTerm] = useState("");

  const PONDS_PER_PAGE = 5;
  const STAFF_PER_PAGE = 5;
  const debouncedPondSearch = useDebounce(pondSearchTerm, 500);
  const debouncedStaffSearch = useDebounce(staffSearchTerm, 500);

  const { mutate: createWorkSchedule, isPending } = useCreateWorkSchedule();

  // Fetch ponds from API
  const { data: pondsData, isLoading: isLoadingPonds } = useGetPonds({
    pageIndex: pondPageIndex,
    pageSize: PONDS_PER_PAGE,
    search: debouncedPondSearch || undefined,
  } as PondSearchParams);

  // Fetch staff from API
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaffByRole({
    role: Roles.FarmStaff,
    pageIndex: staffPageIndex,
    pageSize: STAFF_PER_PAGE,
    search: debouncedStaffSearch || undefined,
  });

  // Reset page when search changes
  useEffect(() => {
    setPondPageIndex(1);
  }, [debouncedPondSearch]);

  useEffect(() => {
    setStaffPageIndex(1);
  }, [debouncedStaffSearch]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTask(null);
      setNotes("");
      setStartTime("");
      setEndTime("");
      setSelectedStaffIds(new Set());
      setSelectedPondIds(new Set());
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!selectedTask || !startTime || !endTime) {
      alert("Vui lòng chọn công việc, giờ bắt đầu và giờ kết thúc");
      return;
    }

    createWorkSchedule(
      {
        taskTemplateId: selectedTask.id,
        scheduledDate: scheduledDate,
        startTime,
        endTime,
        notes,
        staffIds: Array.from(selectedStaffIds),
        pondIds: Array.from(selectedPondIds),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const toggleStaffSelection = (staffId: number) => {
    const newSelection = new Set(selectedStaffIds);
    if (newSelection.has(staffId)) {
      newSelection.delete(staffId);
    } else {
      newSelection.add(staffId);
    }
    setSelectedStaffIds(newSelection);
  };

  const togglePondSelection = (pondId: number) => {
    const newSelection = new Set(selectedPondIds);
    if (newSelection.has(pondId)) {
      newSelection.delete(pondId);
    } else {
      newSelection.add(pondId);
    }
    setSelectedPondIds(newSelection);
  };

  const handleTaskSelect = (task: TaskTemplateResponse) => {
    setSelectedTask(task);
    setIsTaskModalOpen(false);
    // Auto-fill start and end time from default duration
    if (!startTime) {
      setStartTime("06:00:00");
      const duration = task.defaultDuration || 30;
      const endDate = new Date(`2025-01-01T06:00:00`);
      endDate.setMinutes(endDate.getMinutes() + duration);
      const endTimeStr = endDate.toTimeString().slice(0, 8);
      setEndTime(endTimeStr);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Tạo công việc mới
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-2">
              Ngày: {new Date(scheduledDate).toLocaleDateString("vi-VN")}
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Task Selection */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Công việc *
                    </p>
                    {selectedTask ? (
                      <div className="space-y-2">
                        <Badge variant="secondary">
                          {selectedTask.taskName}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          {selectedTask.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Chưa chọn công việc
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsTaskModalOpen(true)}
                    disabled={isPending}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Chọn công việc
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Time Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm font-medium text-gray-600">
                  Giờ thực hiện *
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">
                      Giờ bắt đầu
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <span className="text-gray-400 mt-6">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">
                      Giờ kết thúc
                    </label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Assignments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">
                    Nhân viên phân công
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsStaffModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm nhân viên
                </Button>
              </div>
              {selectedStaffIds.size > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Array.from(selectedStaffIds).map((staffId) => {
                    const staff = staffData?.datas?.find(
                      (s) => s.id === staffId,
                    );
                    return staff ? (
                      <Card
                        key={staffId}
                        className="bg-blue-50 border-blue-200 p-3"
                      >
                        <p className="font-medium text-gray-900">
                          {staff.fullName}
                        </p>
                      </Card>
                    ) : null;
                  })}
                </div>
              )}
              {selectedStaffIds.size === 0 && (
                <p className="text-sm text-gray-400">Chưa chọn nhân viên</p>
              )}
            </div>

            {/* Pond Assignments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Hồ phân công</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPondModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm hồ
                </Button>
              </div>
              {selectedPondIds.size > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Array.from(selectedPondIds).map((pondId) => {
                    const pond = pondsData?.data?.find((p) => p.id === pondId);
                    return pond ? (
                      <Card
                        key={pondId}
                        className="bg-green-50 border-green-200 p-3"
                      >
                        <p className="font-medium text-gray-900">
                          {pond.pondName}
                        </p>
                      </Card>
                    ) : null;
                  })}
                </div>
              )}
              {selectedPondIds.size === 0 && (
                <p className="text-sm text-gray-400">Chưa chọn hồ</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Ghi chú</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú..."
                className="min-h-[80px] border border-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo công việc"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Selection Modal */}
      <Dialog open={isStaffModalOpen} onOpenChange={setIsStaffModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chọn nhân viên</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên..."
                value={staffSearchTerm}
                onChange={(e) => setStaffSearchTerm(e.target.value)}
                className="border-2 border-gray-300 pl-10"
              />
            </div>

            {/* Staff List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {isLoadingStaff ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : !staffData?.datas || staffData.datas.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <p className="text-sm">Không có nhân viên nào</p>
                </div>
              ) : (
                staffData.datas.map((staff: StaffUser) => (
                  <Card
                    key={staff.id}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedStaffIds.has(staff.id)
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleStaffSelection(staff.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 block">
                          {staff.fullName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {staff.email}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                          selectedStaffIds.has(staff.id)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedStaffIds.has(staff.id) && (
                          <span className="text-white text-sm font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination Info */}
            {staffData && staffData.totalPages > 0 && (
              <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
                Trang {staffData.pageIndex} / {staffData.totalPages}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {staffData && staffData.totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setStaffPageIndex(Math.max(1, staffPageIndex - 1))
                }
                disabled={!staffData.hasPreviousPage || isLoadingStaff}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setStaffPageIndex(
                    Math.min(staffData.totalPages, staffPageIndex + 1),
                  )
                }
                disabled={!staffData.hasNextPage || isLoadingStaff}
              >
                Sau
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsStaffModalOpen(false);
                setStaffPageIndex(1);
                setStaffSearchTerm("");
              }}
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pond Selection Modal */}
      <Dialog open={isPondModalOpen} onOpenChange={setIsPondModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chọn hồ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hồ..."
                value={pondSearchTerm}
                onChange={(e) => setPondSearchTerm(e.target.value)}
                className="border-2 border-gray-300 pl-10"
              />
            </div>

            {/* Pond List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {isLoadingPonds ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                </div>
              ) : !pondsData?.data || pondsData.data.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <p className="text-sm">Không có hồ nào</p>
                </div>
              ) : (
                pondsData.data.map((pond: PondResponse) => (
                  <Card
                    key={pond.id}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedPondIds.has(pond.id)
                        ? "border-green-500 bg-green-50 ring-2 ring-green-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => togglePondSelection(pond.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 block">
                          {pond.pondName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {pond.location}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                          selectedPondIds.has(pond.id)
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPondIds.has(pond.id) && (
                          <span className="text-white text-sm font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination Info */}
            {pondsData && pondsData.totalPages > 0 && (
              <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
                Trang {pondsData.pageIndex} / {pondsData.totalPages}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pondsData && pondsData.totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPondPageIndex(Math.max(1, pondPageIndex - 1))}
                disabled={!pondsData.hasPreviousPage || isLoadingPonds}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPondPageIndex(
                    Math.min(pondsData.totalPages, pondPageIndex + 1),
                  )
                }
                disabled={!pondsData.hasNextPage || isLoadingPonds}
              >
                Sau
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsPondModalOpen(false);
                setPondPageIndex(1);
                setPondSearchTerm("");
              }}
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Selection Modal */}
      <TaskSelectionPopup
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        onSelect={handleTaskSelect}
      />
    </>
  );
}
