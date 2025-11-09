"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Eye, Trash2, Repeat, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TaskTemplateResponse,
  TaskTemplatePagedRequest,
} from "@/lib/api/services/fetchTaskTemplate";
import {
  useGetTaskTemplates,
  useCreateTaskTemplate,
  useUpdateTaskTemplate,
  useDeleteTaskTemplate,
} from "@/hooks/useTaskTemplate";
import {
  useGetWeeklyScheduleTemplates,
  useDeleteWeeklyScheduleTemplate,
} from "@/hooks/useWeeklyScheduleTemplate";
import { useGetWorkSchedules } from "@/hooks/useWorkSchedule";
import {
  PaginationSection,
  PAGE_SIZE_OPTIONS_DEFAULT,
} from "@/components/common/PaginationSection";
import { useDebounce } from "@/hooks/useDebounce";
import DeleteTaskTemplateConfirmDialog from "./DeleteTaskTemplateConfirmDialog";
import DeleteWeeklyScheduleConfirmDialog from "./DeleteWeeklyScheduleConfirmDialog";
import TaskTemplateDetailModal from "./TaskTemplateDetailModal";
import WeeklyScheduleCalendarView from "./WeeklyScheduleCalendarView";
import WeeklyWorkScheduleView from "./WeeklyWorkScheduleView";
import GenerateWorkScheduleModal from "./GenerateWorkScheduleModal";
import toast from "react-hot-toast";

interface TaskTemplateForm {
  taskName: string;
  description: string;
  defaultDuration: number;
  notesTask: string | null;
}

export default function ScheduleManagement() {
  const router = useRouter();
  const searchParamsObj = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(() => {
    return searchParamsObj.get("tab") || "tasks";
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const [searchParams, setSearchParams] = useState<TaskTemplatePagedRequest>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    isDeleted: false,
  });

  // Calculate week boundaries for work schedule
  const getWeekBoundaries = (date: Date) => {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return {
      from: weekStart.toISOString().split("T")[0],
      to: weekEnd.toISOString().split("T")[0],
    };
  };

  const weekBoundaries = getWeekBoundaries(currentDate);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteWeeklyConfirmOpen, setIsDeleteWeeklyConfirmOpen] =
    useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskTemplateResponse | null>(
    null,
  );
  const [selectedTask, setSelectedTask] = useState<TaskTemplateResponse | null>(
    null,
  );
  const [taskToDelete, setTaskToDelete] = useState<TaskTemplateResponse | null>(
    null,
  );
  const [weeklyScheduleToDelete, setWeeklyScheduleToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [newTask, setNewTask] = useState<TaskTemplateForm>({
    taskName: "",
    description: "",
    defaultDuration: 30,
    notesTask: null,
  });
  const [selectedPondId, setSelectedPondId] = useState<number | null>(null);

  // Update search params when debounced search term changes
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  // API Queries and Mutations
  const { data: pagedResponse, isLoading } = useGetTaskTemplates(searchParams);
  const { data: weeklyTemplates = [], isLoading: isWeeklyLoading } =
    useGetWeeklyScheduleTemplates();
  const { data: workSchedules = [], isLoading: isWorkSchedulesLoading } =
    useGetWorkSchedules({
      scheduledDateFrom: weekBoundaries.from,
      scheduledDateTo: weekBoundaries.to,
      pondId: selectedPondId || undefined,
    });

  const createMutation = useCreateTaskTemplate();
  const updateMutation = useUpdateTaskTemplate();
  const deleteMutation = useDeleteTaskTemplate();
  const deleteWeeklyMutation = useDeleteWeeklyScheduleTemplate();

  const taskTemplates = pagedResponse?.data || [];
  const totalPages = pagedResponse?.totalPages || 0;
  const totalItems = pagedResponse?.totalItems || 0;
  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSetCurrentPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleSetPageSize = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleDeleteWeeklySchedule = (id: number, name: string) => {
    setWeeklyScheduleToDelete({ id, name });
    setIsDeleteWeeklyConfirmOpen(true);
  };

  const handleConfirmDeleteWeeklySchedule = () => {
    if (weeklyScheduleToDelete) {
      deleteWeeklyMutation.mutate(weeklyScheduleToDelete.id, {
        onSuccess: () => {
          setIsDeleteWeeklyConfirmOpen(false);
          setWeeklyScheduleToDelete(null);
        },
        onError: () => {
          setIsDeleteWeeklyConfirmOpen(false);
        },
      });
    }
  };

  const handleAddTask = () => {
    if (!newTask.taskName.trim() || !newTask.description.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    createMutation.mutate(newTask, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewTask({
          taskName: "",
          description: "",
          defaultDuration: 30,
          notesTask: null,
        });
      },
    });
  };

  const handleViewDetails = (task: TaskTemplateResponse) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleEditTask = (task: TaskTemplateResponse) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;

    if (!editingTask.taskName.trim() || !editingTask.description.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    updateMutation.mutate(
      {
        id: editingTask.id,
        data: {
          taskName: editingTask.taskName,
          description: editingTask.description,
          defaultDuration: editingTask.defaultDuration,
          notesTask: editingTask.notesTask,
        },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        },
      },
    );
  };

  const handleDeleteTask = (task: TaskTemplateResponse) => {
    setTaskToDelete(task);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete.id, {
        onSuccess: () => {
          setIsDeleteConfirmOpen(false);
          setTaskToDelete(null);
        },
        onError: () => {
          setIsDeleteConfirmOpen(false);
        },
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý lịch làm việc
          </h1>
          <p className="text-muted-foreground">
            Quản lý công việc, mẫu lịch và phân công nhân viên
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch làm việc</CardTitle>
          <CardDescription>
            Quản lý các khía cạnh khác nhau của lịch làm việc trang trại
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              setActiveTab(tab);
              router.push(`/manager/schedules?tab=${tab}`);
            }}
          >
            <TabsList className="grid grid-cols-3 gap-3 bg-transparent p-0 h-auto w-full">
              <TabsTrigger value="tasks">Công việc</TabsTrigger>
              <TabsTrigger value="template">Mẫu lịch trong tuần</TabsTrigger>
              <TabsTrigger value="assignment">Phân công</TabsTrigger>
            </TabsList>

            {/* Tab: Công việc */}
            <TabsContent value="tasks" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="relative w-full pr-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm công việc..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-2 border-gray-400 pl-10"
                    />
                  </div>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo công việc
                </Button>
              </div>

              {/* Tasks Table */}
              <div className="border rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center px-2">
                            STT
                          </TableHead>
                          <TableHead className="px-3 py-3 min-w-[200px]">
                            Tên công việc
                          </TableHead>
                          <TableHead className="px-3 py-3 hidden sm:table-cell min-w-[250px]">
                            Mô tả
                          </TableHead>
                          <TableHead className="w-24 text-center px-2">
                            Thời lượng
                          </TableHead>
                          <TableHead className="w-32 text-center px-2">
                            Thao tác
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {taskTemplates.length > 0 ? (
                          taskTemplates.map((task, index) => (
                            <TableRow
                              key={task.id}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="w-12 text-center font-medium text-xs px-2 py-3">
                                {index +
                                  1 +
                                  (searchParams.pageIndex - 1) *
                                    searchParams.pageSize}
                              </TableCell>
                              <TableCell className="px-3 py-3 min-w-[200px]">
                                <div className="flex flex-col gap-1">
                                  <p className="font-medium text-sm">
                                    {task.taskName}
                                  </p>
                                  <p
                                    className="text-xs text-muted-foreground sm:hidden truncate"
                                    title={task.description}
                                  >
                                    {task.description}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="px-3 py-3 hidden sm:table-cell min-w-[250px]">
                                <div
                                  className="text-sm truncate"
                                  title={task.description}
                                >
                                  {task.description}
                                </div>
                              </TableCell>
                              <TableCell className="w-24 text-center text-sm px-2 py-3 whitespace-nowrap">
                                {task.defaultDuration} phút
                              </TableCell>
                              <TableCell className="w-32 px-2 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewDetails(task)}
                                    className="h-8 w-8 p-0"
                                    title="Chi tiết"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditTask(task)}
                                    disabled={isSaving}
                                    className="h-8 w-8 p-0"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTask(task)}
                                    disabled={isSaving}
                                    className="text-red-600 h-8 w-8 p-0 hover:bg-red-50"
                                    title="Xóa"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center text-muted-foreground py-8"
                            >
                              Không có công việc nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <PaginationSection
                  totalItems={totalItems}
                  postsPerPage={searchParams.pageSize}
                  currentPage={searchParams.pageIndex}
                  setCurrentPage={handleSetCurrentPage}
                  totalPages={totalPages}
                  setPageSize={handleSetPageSize}
                  hasNextPage={pagedResponse?.hasNextPage}
                  hasPreviousPage={pagedResponse?.hasPreviousPage}
                />
              )}
            </TabsContent>

            {/* Tab: Mẫu lịch trong tuần */}
            <TabsContent value="template" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Danh sách mẫu lịch
                </h2>
                <Button onClick={() => router.push("/manager/schedules/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo mẫu lịch
                </Button>
              </div>
              <WeeklyScheduleCalendarView
                templates={weeklyTemplates}
                isLoading={isWeeklyLoading}
                onDelete={handleDeleteWeeklySchedule}
              />
            </TabsContent>

            {/* Tab: Phân công */}
            <TabsContent value="assignment" className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsGenerateModalOpen(true)}
                  className="bg-indigo-500 hover:bg-indigo-600"
                >
                  <Repeat className="h-4 w-4 mr-2" />
                  Tạo lịch từ mẫu
                </Button>
              </div>
              <WeeklyWorkScheduleView
                workSchedules={workSchedules}
                isLoading={isWorkSchedulesLoading}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                selectedPondId={selectedPondId}
                onPondChange={setSelectedPondId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Task Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Tạo công việc mới
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskName" className="text-sm font-medium">
                Tên công việc *
              </Label>
              <Input
                id="taskName"
                placeholder="VD: Cho cá ăn buổi sáng"
                value={newTask.taskName}
                onChange={(e) =>
                  setNewTask({ ...newTask, taskName: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Mô tả *
              </Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết công việc..."
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-blue-500 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">
                  Thời lượng mặc định (phút) *
                </Label>
                <InputNumber
                  value={newTask.defaultDuration}
                  onChange={(value) =>
                    setNewTask({
                      ...newTask,
                      defaultDuration: value || 30,
                    })
                  }
                  min={1}
                  placeholder="30"
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notesTask" className="text-sm font-medium">
                Ghi chú
              </Label>
              <Textarea
                id="notesTask"
                placeholder="Ghi chú thêm về công việc..."
                value={newTask.notesTask || ""}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    notesTask: e.target.value || null,
                  })
                }
                className="border-2 border-gray-300 focus:border-blue-500 min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSaving}
                className="px-6"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddTask}
                disabled={isSaving}
                className="px-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo công việc"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Chỉnh sửa công việc
            </DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-taskName" className="text-sm font-medium">
                  Tên công việc *
                </Label>
                <Input
                  id="edit-taskName"
                  placeholder="VD: Cho cá ăn buổi sáng"
                  value={editingTask.taskName}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      taskName: e.target.value,
                    })
                  }
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  Mô tả *
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Mô tả chi tiết công việc..."
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="border-2 border-gray-300 focus:border-blue-500 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-duration"
                    className="text-sm font-medium"
                  >
                    Thời lượng mặc định (phút) *
                  </Label>
                  <InputNumber
                    value={editingTask.defaultDuration}
                    onChange={(value) =>
                      setEditingTask({
                        ...editingTask,
                        defaultDuration: value || 30,
                      })
                    }
                    min={1}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notesTask" className="text-sm font-medium">
                  Ghi chú
                </Label>
                <Textarea
                  id="edit-notesTask"
                  placeholder="Ghi chú thêm về công việc..."
                  value={editingTask.notesTask || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      notesTask: e.target.value || null,
                    })
                  }
                  className="border-2 border-gray-300 focus:border-blue-500 min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-6"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdateTask}
                  disabled={isSaving}
                  className="px-6"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal - View Task Information */}
      <TaskTemplateDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        selectedTask={selectedTask}
      />

      {/* Delete Task Confirmation Dialog */}
      <DeleteTaskTemplateConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        taskTemplateToDelete={taskToDelete}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />

      {/* Delete Weekly Schedule Confirmation Dialog */}
      <DeleteWeeklyScheduleConfirmDialog
        isOpen={isDeleteWeeklyConfirmOpen}
        onOpenChange={setIsDeleteWeeklyConfirmOpen}
        templateName={weeklyScheduleToDelete?.name || null}
        onConfirm={handleConfirmDeleteWeeklySchedule}
        isPending={deleteWeeklyMutation.isPending}
      />

      {/* Generate Work Schedule Modal */}
      <GenerateWorkScheduleModal
        isOpen={isGenerateModalOpen}
        onOpenChange={setIsGenerateModalOpen}
        templates={weeklyTemplates}
        isLoadingTemplates={isWeeklyLoading}
      />
    </div>
  );
}
