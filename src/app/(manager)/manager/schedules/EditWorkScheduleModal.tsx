"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "lucide-react";
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
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse, PondSearchParams } from "@/lib/api/services/fetchPond";
import TaskSelectionPopup from "./TaskSelectionPopup";
import { TaskTemplateResponse } from "@/lib/api/services/fetchTaskTemplate";
import { getWorkScheduleStatusText } from "@/lib/utils/enum";
import { useGetUserByRole } from "@/hooks/useUsers";
import { Roles } from "@/lib/api/services/fetchAuth";
import { User } from "@/lib/api/services/fetchUsers";

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
  const [endTime, setEndTime] = useState(workSchedule?.endTime || "");
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<number>>(
    new Set(workSchedule?.staffAssignments.map((s) => s.staffId) || []),
  );
  const [selectedPondIds, setSelectedPondIds] = useState<Set<number>>(
    new Set(workSchedule?.pondAssignments.map((p) => p.pondId) || []),
  );
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isPondModalOpen, setIsPondModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTaskForEditing, setSelectedTaskForEditing] =
    useState<TaskTemplateResponse | null>(null);
  const [staffSearchTerm, setStaffSearchTerm] = useState("");
  const [pondSearchTerm, setPondSearchTerm] = useState("");
  const [staffSearchParams, setStaffSearchParams] = useState({
    role: Roles.FarmStaff,
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
  });
  const [pondSearchParams, setPondSearchParams] = useState({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
  });

  const { mutate: updateWorkSchedule, isPending } = useUpdateWorkSchedule();
  const { mutate: deleteWorkSchedule, isPending: isDeleting } =
    useDeleteWorkSchedule();

  // Fetch ponds from API for selection modal with search
  const { data: pondsData, isLoading: isLoadingPonds } = useGetPonds(
    pondSearchParams as PondSearchParams,
  );

  // Fetch staff from API for selection modal with search
  const { data: staffData, isLoading: isLoadingStaff } =
    useGetUserByRole(staffSearchParams);

  // Sync state with workSchedule prop when it changes
  useEffect(() => {
    if (workSchedule) {
      setNotes(workSchedule.notes || "");
      setStartTime(workSchedule.startTime || "");
      setEndTime(workSchedule.endTime || "");
      setSelectedStaffIds(
        new Set(workSchedule.staffAssignments.map((s) => s.staffId) || []),
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
    if (!workSchedule) return;

    updateWorkSchedule(
      {
        id: workSchedule.id,
        request: {
          taskTemplateId:
            selectedTaskForEditing?.id || workSchedule.taskTemplateId,
          scheduledDate: workSchedule.scheduledDate,
          startTime,
          endTime,
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
        new Set(workSchedule.staffAssignments.map((s) => s.staffId) || []),
      );
      setSelectedPondIds(
        new Set(workSchedule.pondAssignments.map((p) => p.pondId) || []),
      );
      setNotes(workSchedule.notes || "");
      setStartTime(workSchedule.startTime || "");
      setEndTime(workSchedule.endTime || "");
      setSelectedTaskForEditing(null);
    }
    setIsEditing(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
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

          <div className="space-y-6 py-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Time Section */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Giờ thực hiện
                  </p>
                  {isEditing && canEdit ? (
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
                  ) : (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <p className="text-base font-semibold text-gray-900">
                        {formatTimeToHHMM(startTime)} -{" "}
                        {formatTimeToHHMM(endTime)}
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
                    Thêm nhân viên
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {isEditing && canEdit ? (
                  // Show selected staff IDs from the current selection state
                  Array.from(selectedStaffIds).length > 0 ? (
                    staffData?.datas
                      ?.filter((staff: User) => selectedStaffIds.has(staff.id))
                      .map((staff: User) => (
                        <Card
                          key={staff.id}
                          className="bg-blue-50 border-blue-200"
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {staff.fullName}
                                </p>
                              </div>
                              {canEdit && isEditing && (
                                <button
                                  type="button"
                                  onClick={() => toggleStaffSelection(staff.id)}
                                  className="text-red-600 hover:text-red-700 font-bold"
                                  title="Xóa nhân viên"
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
                      Chưa chọn nhân viên nào
                    </div>
                  )
                ) : (
                  // Show saved staff assignments in view mode
                  workSchedule.staffAssignments.map((staff) => (
                    <Card
                      key={staff.staffId}
                      className="bg-blue-50 border-blue-200"
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {staff.staffName}
                            </p>
                            {staff.completedAt && (
                              <p className="text-xs text-green-600 font-medium mt-1">
                                [Hoàn] Đã hoàn thành
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
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
                    Thêm hồ
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
            <div className="flex justify-end gap-2 pt-4 border-t">
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
      <Dialog open={isStaffModalOpen} onOpenChange={setIsStaffModalOpen}>
        <DialogContent className="!max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chọn Nhân viên</DialogTitle>
            <DialogDescription>
              Chọn nhân viên để gán cho công việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Tìm kiếm nhân viên theo tên..."
              value={staffSearchTerm}
              onChange={(e) => {
                setStaffSearchTerm(e.target.value);
                setStaffSearchParams((prev) => ({
                  ...prev,
                  search: e.target.value,
                  pageIndex: 1,
                }));
              }}
              className="w-full"
            />

            {isLoadingStaff ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang tải danh sách nhân viên...
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[5%]">#</TableHead>
                      <TableHead className="w-[30%]">Tên Nhân viên</TableHead>
                      <TableHead className="w-[40%]">Email</TableHead>
                      <TableHead className="w-[25%]">Số điện thoại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!staffData?.datas || staffData.datas.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500 py-4"
                        >
                          Không tìm thấy nhân viên nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      staffData.datas.map((staff: User) => (
                        <TableRow
                          key={staff.id}
                          onClick={() => toggleStaffSelection(staff.id)}
                          className={
                            selectedStaffIds.has(staff.id)
                              ? "bg-blue-50/50 cursor-pointer"
                              : "hover:bg-gray-50 cursor-pointer"
                          }
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedStaffIds.has(staff.id)}
                              onChange={() => toggleStaffSelection(staff.id)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {staff.fullName}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {staff.email}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {staff.email.substring(0, 3)}...
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {staffData && staffData.totalItems > 0 && (
                  <PaginationSection
                    totalItems={staffData.totalItems}
                    postsPerPage={staffSearchParams.pageSize}
                    currentPage={staffSearchParams.pageIndex}
                    setCurrentPage={(page) =>
                      setStaffSearchParams((prev) => ({
                        ...prev,
                        pageIndex: page,
                      }))
                    }
                    totalPages={staffData.totalPages}
                    setPageSize={(size) =>
                      setStaffSearchParams((prev) => ({
                        ...prev,
                        pageSize: size,
                        pageIndex: 1,
                      }))
                    }
                    hasNextPage={staffData.hasNextPage}
                    hasPreviousPage={staffData.hasPreviousPage}
                    pageSizeOptions={[5, 10, 20]}
                  />
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStaffModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => setIsStaffModalOpen(false)}
              disabled={selectedStaffIds.size === 0 || isLoadingStaff}
            >
              Chọn Nhân viên ({selectedStaffIds.size} người)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pond Selection Modal */}
      <Dialog open={isPondModalOpen} onOpenChange={setIsPondModalOpen}>
        <DialogContent className="!max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chọn Hồ</DialogTitle>
            <DialogDescription>Chọn hồ để gán cho công việc</DialogDescription>
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
                    {!pondsData?.data || pondsData.data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500 py-4"
                        >
                          Không tìm thấy hồ nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pondsData.data.map((pond: PondResponse) => (
                        <TableRow
                          key={pond.id}
                          onClick={() => togglePondSelection(pond.id)}
                          className={
                            selectedPondIds.has(pond.id)
                              ? "bg-green-50/50 cursor-pointer"
                              : "hover:bg-gray-50 cursor-pointer"
                          }
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedPondIds.has(pond.id)}
                              onChange={() => togglePondSelection(pond.id)}
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

                {pondsData && pondsData.totalItems > 0 && (
                  <PaginationSection
                    totalItems={pondsData.totalItems}
                    postsPerPage={pondSearchParams.pageSize}
                    currentPage={pondSearchParams.pageIndex}
                    setCurrentPage={(page) =>
                      setPondSearchParams((prev) => ({
                        ...prev,
                        pageIndex: page,
                      }))
                    }
                    totalPages={pondsData.totalPages}
                    setPageSize={(size) =>
                      setPondSearchParams((prev) => ({
                        ...prev,
                        pageSize: size,
                        pageIndex: 1,
                      }))
                    }
                    hasNextPage={pondsData.hasNextPage}
                    hasPreviousPage={pondsData.hasPreviousPage}
                    pageSizeOptions={[5, 10, 20]}
                  />
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPondModalOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                setIsPondModalOpen(false);
              }}
              disabled={selectedPondIds.size === 0 || isLoadingPonds}
            >
              Chọn Hồ ({selectedPondIds.size} hồ)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Selection Modal */}
      <TaskSelectionPopup
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        onSelect={handleTaskSelect}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Xóa công việc
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Công việc:</span>{" "}
                {workSchedule?.taskTemplateName}
              </p>
              <p className="text-sm text-red-800 mt-2">
                <span className="font-semibold">Ngày:</span>{" "}
                {workSchedule?.scheduledDate}
              </p>
              <p className="text-sm text-red-800 mt-2">
                <span className="font-semibold">Giờ:</span>{" "}
                {formatTimeToHHMM(workSchedule?.startTime || "")}{" "}
                {workSchedule?.endTime
                  ? `- ${formatTimeToHHMM(workSchedule.endTime)}`
                  : ""}
              </p>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể
              hoàn tác.
            </p>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa công việc
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
