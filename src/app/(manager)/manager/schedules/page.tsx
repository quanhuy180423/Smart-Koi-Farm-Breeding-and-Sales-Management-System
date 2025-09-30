"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  CheckCircle
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils/dates";

interface Schedule {
  id: string;
  employeeName: string;
  employeeId: string;
  role: string;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  priority: SchedulePriority;
  notes: string;
}

interface NewScheduleForm {
  employeeName: string;
  employeeId: string;
  role: string;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: string;
  notes: string;
}

type ScheduleStatus = "completed" | "in-progress" | "not-started" | "overdue";
type SchedulePriority = "high" | "medium" | "low";

const scheduleData: Schedule[] = [
  {
    id: "SCH001",
    employeeName: "Nguyễn Văn An",
    employeeId: "EMP001",
    role: "Nhân viên chăm sóc",
    task: "Cho cá ăn hồ A1-A3",
    date: "2024-03-20",
    startTime: "06:00",
    endTime: "08:00",
    status: "completed",
    priority: "high",
    notes: "Đã cho ăn đủ liều và kiểm tra sức khỏe cá",
  },
  {
    id: "SCH002", 
    employeeName: "Trần Thị Bình",
    employeeId: "EMP002",
    role: "Nhân viên kỹ thuật",
    task: "Vệ sinh hồ B1",
    date: "2024-03-20",
    startTime: "08:30",
    endTime: "11:30",
    status: "in-progress",
    priority: "medium",
    notes: "Thay nước và vệ sinh thiết bị lọc",
  },
  {
    id: "SCH003",
    employeeName: "Lê Văn Cường",
    employeeId: "EMP003", 
    role: "Nhân viên chăm sóc",
    task: "Kiểm tra chất lượng nước tất cả hồ",
    date: "2024-03-20",
    startTime: "14:00", 
    endTime: "16:00",
    status: "not-started",
    priority: "high",
    notes: "Đo pH, oxy, nhiệt độ và ghi chép báo cáo",
  },
  {
    id: "SCH004",
    employeeName: "Phạm Thị Dung",
    employeeId: "EMP004",
    role: "Nhân viên y tế", 
    task: "Kiểm tra sức khỏe cá hồ C1",
    date: "2024-03-21",
    startTime: "07:00",
    endTime: "09:00", 
    status: "not-started",
    priority: "high",
    notes: "Phát hiện dấu hiệu bệnh và điều trị kịp thời",
  },
  {
    id: "SCH005",
    employeeName: "Hoàng Văn Em",
    employeeId: "EMP005",
    role: "Nhân viên bảo trì",
    task: "Bảo trì máy lọc hồ A2",
    date: "2024-03-21", 
    startTime: "13:00",
    endTime: "15:30",
    status: "not-started",
    priority: "medium",
    notes: "Vệ sinh và thay thế phụ tung máy lọc",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-100 text-green-800 text-sm">Hoàn thành</Badge>;
    case "in-progress":
      return <Badge variant="default" className="bg-blue-100 text-blue-800 text-sm">Đang làm</Badge>;
    case "not-started":
      return <Badge variant="secondary" className="text-sm">Chưa bắt đầu</Badge>;
    case "overdue":
      return <Badge variant="destructive" className="text-sm">Trễ</Badge>;
    default:
      return <Badge variant="outline" className="text-sm">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive" className="text-sm">Cao</Badge>;
    case "medium":
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-sm">Trung bình</Badge>;
    case "low":
      return <Badge variant="secondary" className="text-sm">Thấp</Badge>;
    default:
      return <Badge variant="outline" className="text-sm">{priority}</Badge>;
  }
};

export default function ScheduleManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [newSchedule, setNewSchedule] = useState<NewScheduleForm>({
    employeeName: "",
    employeeId: "",
    role: "",
    task: "",
    date: "",
    startTime: "",
    endTime: "",
    priority: "",
    notes: "",
  });

  const filteredSchedules = scheduleData.filter((schedule) => {
    const matchesSearch = schedule.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || schedule.status === statusFilter;
    const matchesDate = dateFilter === "all" || schedule.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalOpen(true);
  };

  const handleAddSchedule = () => {
    console.log("Adding new schedule:", newSchedule);
    setIsAddModalOpen(false);
    setNewSchedule({
      employeeName: "",
      employeeId: "",
      role: "",
      task: "",
      date: "",
      startTime: "",
      endTime: "",
      priority: "",
      notes: "",
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleUpdateSchedule = () => {
    console.log("Updating schedule:", editingSchedule);
    setIsEditModalOpen(false);
    setEditingSchedule(null);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lịch làm việc</h1>
          <p className="text-muted-foreground">
            Phân công và theo dõi lịch làm việc của nhân viên
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo lịch làm việc
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công việc</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduleData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduleData.filter(s => s.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang thực hiện</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduleData.filter(s => s.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(scheduleData.map(s => s.employeeId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch làm việc nhân viên</CardTitle>
          <CardDescription>
            Theo dõi và quản lý công việc được phân công cho nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="border rounded-lg p-3 mb-4 bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên NV hoặc công việc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-400 pl-9 h-8 text-sm"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400 h-8 text-sm">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                  <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
                  <SelectItem value="overdue">Trễ</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400 h-8 text-sm">
                  <SelectValue placeholder="Lọc theo ngày" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngày</SelectItem>
                  <SelectItem value={today}>Hôm nay</SelectItem>
                  <SelectItem value={tomorrowStr}>Ngày mai</SelectItem>
                  <SelectItem value="2024-03-20">20/03/2024</SelectItem>
                  <SelectItem value="2024-03-21">21/03/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">STT</TableHead>
                  <TableHead className="w-28">Nhân viên</TableHead>
                  <TableHead className="w-40">Công việc</TableHead>
                  <TableHead className="w-20">Ngày</TableHead>
                  <TableHead className="w-24">Thời gian</TableHead>
                  <TableHead className="w-16">Ưu tiên</TableHead>
                  <TableHead className="w-20">Trạng thái</TableHead>
                  <TableHead className="w-20">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule, index) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium text-sm p-2 text-center">{index + 1}</TableCell>
                  <TableCell className="p-2">
                      <div className="font-medium text-sm truncate">{schedule.employeeName}</div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="truncate text-sm" title={schedule.task}>
                      {schedule.task}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm p-2">{formatDate(schedule.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell className="text-sm p-2 whitespace-nowrap">
                    {schedule.startTime} - {schedule.endTime}
                  </TableCell>
                  <TableCell className="p-2">{getPriorityBadge(schedule.priority)}</TableCell>
                  <TableCell className="p-2">{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(schedule)} className="h-7 w-7 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditSchedule(schedule)} className="h-7 w-7 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 h-7 w-7 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chi tiết lịch làm việc
            </DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nhân viên</Label>
                    <p className="text-base font-semibold text-gray-800">{selectedSchedule.employeeName}</p>
                    <p className="text-sm text-gray-500">{selectedSchedule.employeeId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Chức vụ</Label>
                    <p className="text-base text-gray-800">{selectedSchedule.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Công việc</Label>
                    <p className="text-base text-gray-800">{selectedSchedule.task}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Ngày thực hiện</Label>
                    <p className="text-base text-gray-800">{formatDate(selectedSchedule.date, "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Thời gian</Label>
                    <p className="text-base text-gray-800">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Độ ưu tiên</Label>
                    <div className="mt-1">{getPriorityBadge(selectedSchedule.priority)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Trạng thái</Label>
                    <div className="mt-1">{getStatusBadge(selectedSchedule.status)}</div>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Ghi chú</Label>
                <p className="text-base text-gray-800 mt-1">{selectedSchedule.notes}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Schedule Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Tạo lịch làm việc mới
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName" className="text-sm font-medium text-gray-700">
                  Tên nhân viên *
                </Label>
                <Input
                  id="employeeName"
                  placeholder="Nhập tên nhân viên..."
                  value={newSchedule.employeeName}
                  onChange={(e) => setNewSchedule({ ...newSchedule, employeeName: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                  Mã nhân viên *
                </Label>
                <Input
                  id="employeeId"
                  placeholder="VD: EMP001"
                  value={newSchedule.employeeId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, employeeId: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Chức vụ *
                </Label>
                <Input
                  id="role"
                  placeholder="VD: Nhân viên chăm sóc"
                  value={newSchedule.role}
                  onChange={(e) => setNewSchedule({ ...newSchedule, role: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                  Độ ưu tiên *
                </Label>
                <Select 
                  value={newSchedule.priority} 
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, priority: value })}
                >
                  <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                    <SelectValue placeholder="Chọn độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task" className="text-sm font-medium text-gray-700">
                Công việc *
              </Label>
              <Input
                id="task"
                placeholder="Mô tả công việc cần thực hiện..."
                value={newSchedule.task}
                onChange={(e) => setNewSchedule({ ...newSchedule, task: e.target.value })}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Ngày *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                  Giờ bắt đầu *
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSchedule.startTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                  Giờ kết thúc *
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSchedule.endTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Ghi chú
              </Label>
              <Textarea
                id="notes"
                placeholder="Ghi chú thêm về công việc..."
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                className="border-2 border-gray-300 focus:border-blue-500 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="px-6"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddSchedule}
              >
                Tạo lịch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chỉnh sửa lịch làm việc
            </DialogTitle>
          </DialogHeader>
          {editingSchedule && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-employeeName" className="text-sm font-medium text-gray-700">
                    Tên nhân viên *
                  </Label>
                  <Input
                    id="edit-employeeName"
                    placeholder="Nhập tên nhân viên..."
                    value={editingSchedule.employeeName}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, employeeName: e.target.value })}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-employeeId" className="text-sm font-medium text-gray-700">
                    Mã nhân viên *
                  </Label>
                  <Input
                    id="edit-employeeId"
                    placeholder="VD: EMP001"
                    value={editingSchedule.employeeId}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, employeeId: e.target.value })}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role" className="text-sm font-medium text-gray-700">
                    Chức vụ *
                  </Label>
                  <Input
                    id="edit-role"
                    placeholder="VD: Nhân viên chăm sóc"
                    value={editingSchedule.role}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, role: e.target.value })}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority" className="text-sm font-medium text-gray-700">
                    Độ ưu tiên *
                  </Label>
                  <Select 
                    value={editingSchedule.priority} 
                    onValueChange={(value: SchedulePriority) => setEditingSchedule({ ...editingSchedule, priority: value })}
                  >
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task" className="text-sm font-medium text-gray-700">
                  Công việc *
                </Label>
                <Input
                  id="edit-task"
                  placeholder="Mô tả công việc cần thực hiện..."
                  value={editingSchedule.task}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, task: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date" className="text-sm font-medium text-gray-700">
                    Ngày *
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingSchedule.date}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, date: e.target.value })}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startTime" className="text-sm font-medium text-gray-700">
                    Giờ bắt đầu *
                  </Label>
                  <Input
                    id="edit-startTime"
                    type="time"
                    value={editingSchedule.startTime}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, startTime: e.target.value })}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endTime" className="text-sm font-medium text-gray-700">
                    Giờ kết thúc *
                  </Label>
                  <Input
                    id="edit-endTime"
                    type="time"
                    value={editingSchedule.endTime}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, endTime: e.target.value })}
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium text-gray-700">
                  Trạng thái
                </Label>
                <Select 
                  value={editingSchedule.status} 
                  onValueChange={(value: ScheduleStatus) => setEditingSchedule({ ...editingSchedule, status: value })}
                >
                  <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
                    <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="overdue">Trễ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="text-sm font-medium text-gray-700">
                  Ghi chú
                </Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Ghi chú thêm về công việc..."
                  value={editingSchedule.notes}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, notes: e.target.value })}
                  className="border-2 border-gray-300 focus:border-blue-500 min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdateSchedule}
                  className="px-6"
                >
                  Cập nhật
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}