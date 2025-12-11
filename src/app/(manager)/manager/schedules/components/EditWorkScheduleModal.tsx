"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Users,
  Droplets,
  Loader2,
  Edit2,
  Plus,
  Trash2,
  Repeat2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import {
  WorkSchedule,
  WorkScheduleStatusEnum,
} from "@/lib/api/services/fetchWorkSchedule";
import {
  useUpdateWorkSchedule,
  useDeleteWorkSchedule,
} from "@/hooks/useWorkSchedule";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";
import { Textarea } from "@/components/ui/textarea";
import TaskSelectionPopup from "./TaskSelectionPopup";
import StaffSelectionModal from "./StaffSelectionModal";
import PondSelectionModal from "./PondSelectionModal";
import { TaskTemplateResponse } from "@/lib/api/services/fetchTaskTemplate";
import { getWorkScheduleStatusText, getRoleLabel } from "@/lib/utils/enum";
import { User } from "@/lib/api/services/fetchUsers";
import { useGetUserByRole } from "@/hooks/useUsers";
import { Roles } from "@/lib/api/services/fetchAuth";
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse } from "@/lib/api/services/fetchPond";
import { KoiImageViewer } from "@/components/dialogs/KoiImageViewer";

interface EditWorkScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workSchedule: WorkSchedule | null;
}

const isEditable = (workSchedule: WorkSchedule | null): boolean => {
  if (!workSchedule) return false;

  if (workSchedule.status !== WorkScheduleStatusEnum.Pending) return false;

  const scheduledDate = new Date(workSchedule.scheduledDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return scheduledDate >= today;
};

export default function EditWorkScheduleModal({
  isOpen,
  onOpenChange,
  workSchedule,
}: EditWorkScheduleModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(workSchedule?.notes || "");
  const [startTime, setStartTime] = useState(workSchedule?.startTime || "");
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<number>>(
    new Set(workSchedule?.staffAssignments?.map((s) => s.staffId) || []),
  );
  const [selectedPondIds, setSelectedPondIds] = useState<Set<number>>(
    new Set(workSchedule?.pondAssignments.map((p) => p.pondId) || []),
  );
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isPondModalOpen, setIsPondModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [selectedTaskForEditing, setSelectedTaskForEditing] =
    useState<TaskTemplateResponse | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { mutate: updateWorkSchedule, isPending } = useUpdateWorkSchedule();
  const { mutate: deleteWorkSchedule, isPending: isDeleting } =
    useDeleteWorkSchedule();

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
    ...(farmStaffData?.data || []),
    ...(saleStaffData?.data || []),
  ];

  // Fetch all ponds for displaying selected ponds
  const { data: pondsData } = useGetPonds({
    pageIndex: 1,
    pageSize: 100,
  });

  // Sync state with workSchedule prop when it changes
  useEffect(() => {
    if (workSchedule) {
      setNotes(workSchedule.notes || "");
      setStartTime(workSchedule.startTime || "");
      setSelectedStaffIds(
        new Set(workSchedule.staffAssignments?.map((s) => s.staffId) || []),
      );
      setSelectedPondIds(
        new Set(workSchedule.pondAssignments.map((p) => p.pondId) || []),
      );
    }
  }, [workSchedule?.id, workSchedule]);

  // Handle dialog close and auto-exit edit mode, reset unsaved changes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isEditing) {
      handleCancelEdit();
    }
    onOpenChange(open);
  };

  if (!workSchedule) return null;

  const canEdit = isEditable(workSchedule);

  const handleSave = () => {
    if (!workSchedule || selectedStaffIds.size === 0) return;

    if (!startTime) {
      setTimeError("Vui lòng nhập giờ bắt đầu");
      return;
    }

    setTimeError(null);

    updateWorkSchedule(
      {
        id: workSchedule.id,
        request: {
          taskTemplateId:
            selectedTaskForEditing?.id || workSchedule.taskTemplateId,
          scheduledDate: workSchedule.scheduledDate,
          startTime,
          notes,
          staffIds: Array.from(selectedStaffIds),
          pondIds: Array.from(selectedPondIds),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSelectedTaskForEditing(null);
          onOpenChange(false);
        },
      },
    );
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!workSchedule) return;

    deleteWorkSchedule(workSchedule.id, {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        onOpenChange(false);
      },
    });
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
    setSelectedTaskForEditing(task);
    setIsTaskModalOpen(false);
  };

  const handleCancelEdit = () => {
    // Reset all unsaved changes when canceling edit mode
    if (workSchedule) {
      setSelectedStaffIds(
        new Set(workSchedule.staffAssignments?.map((s) => s.staffId) || []),
      );
      setSelectedPondIds(
        new Set(workSchedule.pondAssignments.map((p) => p.pondId) || []),
      );
      setNotes(workSchedule.notes || "");
      setStartTime(workSchedule.startTime || "");
      setSelectedTaskForEditing(null);
    }
    setIsEditing(false);
  };

  const handleOpenImageViewer = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {selectedTaskForEditing
                    ? selectedTaskForEditing.taskName
                    : workSchedule.taskTemplateName}
                </DialogTitle>
                <DialogDescription>
                  Chi tiết và quản lý công việc đã lên lịch
                </DialogDescription>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {getWorkScheduleStatusText(workSchedule.status)}
                  </Badge>
                  {isEditing && canEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsTaskModalOpen(true)}
                      disabled={isPending}
                    >
                      <Repeat2 className="h-4 w-4 mr-1" />
                      Đổi công việc
                    </Button>
                  )}
                  {canEdit && (
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          isEditing ? handleCancelEdit() : setIsEditing(true)
                        }
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        {isEditing ? "Hủy" : "Chỉnh sửa"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Time Section */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Thời gian bắt đầu
                  </p>
                  {isEditing && canEdit ? (
                    <div className="space-y-3">
                      <div>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            if (timeError) setTimeError(null);
                          }}
                          className={`w-full ${timeError ? "border-red-500" : ""}`}
                        />
                      </div>
                      {timeError && (
                        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                          {timeError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <p className="text-base font-semibold text-gray-900">
                        {formatTimeToHHMM(startTime)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Mô tả công việc
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedTaskForEditing
                        ? selectedTaskForEditing.description
                        : workSchedule.taskTemplate.description}
                    </p>
                  </div>
                  {(selectedTaskForEditing?.notesTask ||
                    workSchedule.taskTemplate.notesTask) && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Ghi chú công việc
                      </p>
                      <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">
                        {selectedTaskForEditing
                          ? selectedTaskForEditing.notesTask
                          : workSchedule.taskTemplate.notesTask}
                      </p>
                    </div>
                  )}
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
                {canEdit && isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsStaffModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Chọn nhân viên
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {isEditing && canEdit ? (
                  // Show multiple selected staff in edit mode
                  Array.from(selectedStaffIds).length > 0 ? (
                    allStaffForDisplay
                      ?.filter((staff: User) => selectedStaffIds.has(staff.id))
                      .map((staff: User) => (
                        <Card
                          key={staff.id}
                          className="bg-blue-50 border-blue-200"
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <Users className="h-5 w-5 text-blue-600 mb-2" />
                                <p className="font-medium text-gray-900">
                                  {staff.fullName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {getRoleLabel(staff.role as Roles).label}
                                </p>
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
                      Chưa chọn nhân viên
                    </div>
                  )
                ) : // Show saved staff assignments in view mode
                workSchedule.staffAssignments.length > 0 ? (
                  workSchedule.staffAssignments.map((assignment) => (
                    <Card
                      key={assignment.staffId}
                      className="bg-blue-50 border-blue-200"
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <Users className="h-5 w-5 text-blue-600 mb-2" />
                              <p className="font-medium text-gray-900">
                                {assignment.staffName}
                              </p>
                              <Badge
                                variant="outline"
                                className={`text-xs mt-2 ${getRoleLabel(assignment.role as Roles).colorClass}`}
                              >
                                {getRoleLabel(assignment.role as Roles).label}
                              </Badge>
                            </div>
                          </div>
                          {assignment.completedAt ? (
                            <div className="pt-2 border-t border-blue-200 space-y-2 text-xs">
                              <span className="text-green-600 font-medium">
                                ✓ Đã hoàn thành
                              </span>
                              <p className="text-gray-600">
                                {new Date(
                                  assignment.completedAt,
                                ).toLocaleString("vi-VN")}
                              </p>
                              {assignment.completionNotes && (
                                <p className="italic text-gray-700">
                                  {assignment.completionNotes}
                                </p>
                              )}
                              {assignment.images &&
                                assignment.images.length > 0 && (
                                  <div className="pt-2">
                                    <div className="flex items-center gap-1 mb-2">
                                      <ImageIcon className="h-3 w-3 text-blue-600" />
                                      <p className="text-blue-600 font-medium">
                                        Hình ảnh chứng minh (
                                        {assignment.images.length})
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {assignment.images.map(
                                        (imageUrl, index) => (
                                          <div
                                            key={index}
                                            className="relative aspect-square rounded-md overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer group"
                                            onClick={() =>
                                              handleOpenImageViewer(
                                                assignment.images,
                                                index,
                                              )
                                            }
                                          >
                                            <Image
                                              src={imageUrl}
                                              alt={`Hình ảnh chứng minh ${index + 1}`}
                                              fill
                                              className="object-cover group-hover:scale-105 transition-transform"
                                              sizes="(max-width: 768px) 50vw, 150px"
                                            />
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-blue-200">
                              <span className="text-xs text-yellow-600 font-medium">
                                Chưa hoàn thành
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    Không có nhân viên được gán
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
                {canEdit && isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPondModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Chọn hồ
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {isEditing && canEdit ? (
                  // Show selected pond IDs from the current selection state
                  Array.from(selectedPondIds).length > 0 ? (
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
                              {canEdit && isEditing && (
                                <button
                                  type="button"
                                  onClick={() => togglePondSelection(pond.id)}
                                  className="text-red-600 hover:text-red-700 font-bold"
                                  title="Xóa hồ"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <div className="col-span-2 text-center py-4 text-gray-500">
                      Chưa chọn hồ nào
                    </div>
                  )
                ) : (
                  // Show saved pond assignments in view mode
                  workSchedule.pondAssignments.map((pond) => (
                    <Card
                      key={pond.pondId}
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
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Ghi chú</h3>
              {isEditing && canEdit ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú..."
                  className="min-h-[100px] border border-gray-300"
                />
              ) : (
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-amber-800">
                      {workSchedule.notes || "Không có ghi chú"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {isEditing && canEdit && (
            <div className="shrink-0 flex justify-end gap-2 pt-4 border-t bg-white">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          )}
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

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center">
              Xóa công việc
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-red-800">
                    ⚠️ <strong>Cảnh báo:</strong> Việc xóa công việc sẽ xóa vĩnh
                    viễn tất cả thông tin liên quan.
                  </p>
                  <p className="text-sm text-red-800 mt-2">
                    📅 <strong>Bị ảnh hưởng:</strong> Lịch làm việc của nhân
                    viên được phân công.
                  </p>
                  <p className="text-sm text-red-800 mt-2">
                    🚫 <strong>Không thể hoàn tác:</strong> Hành động này là
                    vĩnh viễn và không thể được khôi phục.
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Công việc:</span>{" "}
                    {workSchedule?.taskTemplateName}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Ngày:</span>{" "}
                    {workSchedule?.scheduledDate}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Giờ:</span>{" "}
                    {formatTimeToHHMM(workSchedule?.startTime || "")}{" "}
                    {workSchedule?.endTime
                      ? `- ${formatTimeToHHMM(workSchedule.endTime)}`
                      : ""}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn tiếp tục?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa công việc
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Viewer */}
      <KoiImageViewer
        isOpen={isImageViewerOpen}
        onOpenChange={setIsImageViewerOpen}
        images={selectedImages}
        selectedImageIdx={selectedImageIndex}
        onImageIdxChange={setSelectedImageIndex}
        rfid={workSchedule?.taskTemplateName || "Hình ảnh công việc"}
      />
    </>
  );
}
