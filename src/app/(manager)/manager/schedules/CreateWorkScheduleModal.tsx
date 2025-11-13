"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Droplets, Loader2, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import TaskSelectionPopup from "./TaskSelectionPopup";
import { TaskTemplateResponse } from "@/lib/api/services/fetchTaskTemplate";
import { useCreateWorkSchedule } from "@/hooks/useWorkSchedule";
import StaffSelectionModal from "./StaffSelectionModal";
import PondSelectionModal from "./PondSelectionModal";
import { useGetPonds } from "@/hooks/usePond";
import { useGetUserByRole } from "@/hooks/useUsers";
import { Roles } from "@/lib/api/services/fetchAuth";
import { User } from "@/lib/api/services/fetchUsers";
import { getRoleLabel } from "@/lib/utils/enum";
import { PondResponse } from "@/lib/api/services/fetchPond";

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

  const { mutate: createWorkSchedule, isPending } = useCreateWorkSchedule();

  // Fetch staff from both roles for displaying selected staff
  const { data: farmStaffData } = useGetUserByRole({
    role: Roles.FarmStaff,
    pageIndex: 1,
    pageSize: 100,
    isBlocked: false,
  });

  const { data: saleStaffData } = useGetUserByRole({
    role: Roles.SaleStaff,
    pageIndex: 1,
    pageSize: 100,
    isBlocked: false,
  });

  // Keep all staff data from both roles for displaying selected staff
  const allStaffForDisplay = [
    ...(farmStaffData?.datas || []),
    ...(saleStaffData?.datas || []),
  ];

  // Fetch all ponds for displaying selected ponds
  const { data: pondsData } = useGetPonds({
    pageIndex: 1,
    pageSize: 100,
  });

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
      toast.error("Vui lòng chọn công việc, giờ bắt đầu và giờ kết thúc");
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
            <DialogDescription>
              Ngày: {new Date(scheduledDate).toLocaleDateString("vi-VN")}
            </DialogDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Array.from(selectedStaffIds).length > 0 ? (
                  allStaffForDisplay
                    ?.filter((staff: User) => selectedStaffIds.has(staff.id))
                    .map((staff: User) => (
                      <Card
                        key={staff.id}
                        className="bg-blue-50 border-blue-200"
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <p className="font-medium text-gray-900">
                                {staff.fullName}
                              </p>
                              {staff.role && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getRoleLabel(staff.role as Roles).colorClass}`}
                                >
                                  {getRoleLabel(staff.role as Roles).label}
                                </Badge>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleStaffSelection(staff.id)}
                              className="text-red-600 hover:text-red-700 font-bold"
                              title="Xóa nhân viên"
                            >
                              ✕
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    Chưa chọn nhân viên nào
                  </div>
                )}
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Array.from(selectedPondIds).length > 0 ? (
                  pondsData?.data
                    ?.filter((pond: PondResponse) =>
                      selectedPondIds.has(pond.id),
                    )
                    .map((pond: PondResponse) => (
                      <Card
                        key={pond.id}
                        className="bg-green-50 border-green-200"
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Droplets className="h-5 w-5 text-green-600 mb-2" />
                              <p className="font-medium text-gray-900">
                                {pond.pondName}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => togglePondSelection(pond.id)}
                              className="text-red-600 hover:text-red-700 font-bold"
                              title="Xóa hồ"
                            >
                              ✕
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    Chưa chọn hồ nào
                  </div>
                )}
              </div>
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
      <StaffSelectionModal
        isOpen={isStaffModalOpen}
        onOpenChange={setIsStaffModalOpen}
        selectedStaffIds={selectedStaffIds}
        onToggleStaff={toggleStaffSelection}
      />

      {/* Pond Selection Modal */}
      <PondSelectionModal
        isOpen={isPondModalOpen}
        onOpenChange={setIsPondModalOpen}
        selectedPondIds={selectedPondIds}
        onTogglePond={togglePondSelection}
      />

      {/* Task Selection Modal */}
      <TaskSelectionPopup
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        onSelect={handleTaskSelect}
      />
    </>
  );
}
