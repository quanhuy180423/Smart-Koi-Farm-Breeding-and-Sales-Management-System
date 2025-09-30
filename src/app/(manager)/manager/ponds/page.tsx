"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Building2,
  Edit,
  Trash2,
  Eye,
  Droplets,
  Activity,
  CircleX,
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

interface Pond {
  id: string;
  name: string;
  size: string;
  depth: string;
  capacity: number;
  currentFish: number;
  waterTemp: string;
  phLevel: string;
  oxygenLevel: string;
  status: PondStatus;
  lastCleaned: string;
  equipment: string;
}

interface NewPondForm {
  name: string;
  size: string;
  depth: string;
  capacity: string;
  equipment: string;
}

type PondStatus = "active" | "maintenance" | "inactive";

const pondData: Pond[] = [
  {
    id: "POND001",
    name: "Hồ A1",
    size: "50m²",
    depth: "1.5m",
    capacity: 100,
    currentFish: 45,
    waterTemp: "22°C",
    phLevel: "7.2",
    oxygenLevel: "8.5mg/L",
    status: "active",
    lastCleaned: "2024-03-15",
    equipment: "Máy lọc, Máy sục khí",
  },
  {
    id: "POND002",
    name: "Hồ A2",
    size: "75m²",
    depth: "2.0m",
    capacity: 150,
    currentFish: 120,
    waterTemp: "23°C",
    phLevel: "7.0",
    oxygenLevel: "8.2mg/L",
    status: "active",
    lastCleaned: "2024-03-14",
    equipment: "Máy lọc, Máy sục khí, UV Sterilizer",
  },
  {
    id: "POND003",
    name: "Hồ B1",
    size: "40m²",
    depth: "1.2m",
    capacity: 80,
    currentFish: 0,
    waterTemp: "21°C",
    phLevel: "6.8",
    oxygenLevel: "7.8mg/L",
    status: "maintenance",
    lastCleaned: "2024-03-10",
    equipment: "Máy lọc",
  },
  {
    id: "POND004",
    name: "Hồ C1",
    size: "100m²",
    depth: "2.5m",
    capacity: 200,
    currentFish: 180,
    waterTemp: "24°C",
    phLevel: "7.1",
    oxygenLevel: "8.8mg/L",
    status: "active",
    lastCleaned: "2024-03-16",
    equipment: "Máy lọc, Máy sục khí, UV Sterilizer, Hệ thống làm mát",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Hoạt động
        </Badge>
      );
    case "maintenance":
      return <Badge variant="destructive">Đang bảo trì</Badge>;
    case "inactive":
      return <Badge variant="secondary">Không sử dụng</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getOccupancyBadge = (current: number, capacity: number) => {
  const percentage = (current / capacity) * 100;
  if (percentage >= 90) {
    return <Badge variant="destructive">Đầy ({percentage.toFixed(0)}%)</Badge>;
  } else if (percentage >= 70) {
    return (
      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
        Cao ({percentage.toFixed(0)}%)
      </Badge>
    );
  } else {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Bình thường ({percentage.toFixed(0)}%)
      </Badge>
    );
  }
};

export default function PondManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPond, setSelectedPond] = useState<Pond | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPond, setEditingPond] = useState<Pond | null>(null);
  const [newPond, setNewPond] = useState<NewPondForm>({
    name: "",
    size: "",
    depth: "",
    capacity: "",
    equipment: "",
  });

  const filteredPonds = pondData.filter((pond) => {
    const matchesSearch = pond.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || pond.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (pond: Pond) => {
    setSelectedPond(pond);
    setIsDetailModalOpen(true);
  };

  const handleAddPond = () => {
    console.log("Adding new pond:", newPond);
    setIsAddModalOpen(false);
    setNewPond({
      name: "",
      size: "",
      depth: "",
      capacity: "",
      equipment: "",
    });
  };

  const handleEditPond = (pond: Pond) => {
    setEditingPond(pond);
    setIsEditModalOpen(true);
  };

  const handleUpdatePond = () => {
    console.log("Updating pond:", editingPond);
    setIsEditModalOpen(false);
    setEditingPond(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý hồ cá</h1>
          <p className="text-muted-foreground">
            Giám sát và quản lý tất cả các hồ cá trong trang trại
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hồ mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số hồ</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pondData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng cá nuôi</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pondData.reduce((sum, pond) => sum + pond.currentFish, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pondData.filter((p) => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang bảo trì</CardTitle>
            <CircleX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pondData.filter((p) => p.status === "maintenance").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ponds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ cá</CardTitle>
          <CardDescription>
            Thông tin chi tiết và trạng thái của từng hồ cá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 mb-6 bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên hồ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-400 pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="maintenance">Đang bảo trì</SelectItem>
                  <SelectItem value="inactive">Không sử dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Tên hồ</TableHead>
                <TableHead>Kích thước</TableHead>
                <TableHead>Số cá hiện tại</TableHead>
                <TableHead>Tỷ lệ lấp đầy</TableHead>
                <TableHead>Nhiệt độ nước</TableHead>
                <TableHead>Độ pH</TableHead>
                <TableHead>Oxy</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vệ sinh lần cuối</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPonds.map((pond, index) => (
                <TableRow key={pond.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{pond.name}</TableCell>
                  <TableCell>
                    {pond.size} × {pond.depth}
                  </TableCell>
                  <TableCell>
                    {pond.currentFish}/{pond.capacity}
                  </TableCell>
                  <TableCell>
                    {getOccupancyBadge(pond.currentFish, pond.capacity)}
                  </TableCell>
                  <TableCell>{pond.waterTemp}</TableCell>
                  <TableCell>{pond.phLevel}</TableCell>
                  <TableCell>{pond.oxygenLevel}</TableCell>
                  <TableCell>{getStatusBadge(pond.status)}</TableCell>
                  <TableCell>
                    {formatDate(pond.lastCleaned, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(pond)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPond(pond)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chi tiết hồ cá
            </DialogTitle>
          </DialogHeader>
          {selectedPond && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Tên hồ
                    </Label>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedPond.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Kích thước
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.size} × {selectedPond.depth}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Sức chứa
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.capacity} con cá
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Số cá hiện tại
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.currentFish} con cá
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Nhiệt độ nước
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.waterTemp}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Độ pH
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.phLevel}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Oxy
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.oxygenLevel}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Trạng thái
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedPond.status)}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Thiết bị
                </Label>
                <p className="text-base text-gray-800 mt-1">
                  {selectedPond.equipment}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Vệ sinh lần cuối
                </Label>
                <p className="text-base text-gray-800 mt-1">
                  {formatDate(selectedPond.lastCleaned, "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Pond Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Thêm hồ cá mới
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Tên hồ *
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập tên hồ..."
                  value={newPond.name}
                  onChange={(e) =>
                    setNewPond({ ...newPond, name: e.target.value })
                  }
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="size"
                  className="text-sm font-medium text-gray-700"
                >
                  Kích thước *
                </Label>
                <Input
                  id="size"
                  placeholder="VD: 10m x 8m"
                  value={newPond.size}
                  onChange={(e) =>
                    setNewPond({ ...newPond, size: e.target.value })
                  }
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="depth"
                  className="text-sm font-medium text-gray-700"
                >
                  Độ sâu *
                </Label>
                <Input
                  id="depth"
                  placeholder="VD: 1.5m"
                  value={newPond.depth}
                  onChange={(e) =>
                    setNewPond({ ...newPond, depth: e.target.value })
                  }
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="capacity"
                  className="text-sm font-medium text-gray-700"
                >
                  Sức chứa *
                </Label>
                <Input
                  id="capacity"
                  placeholder="Số lượng cá tối đa"
                  type="number"
                  value={newPond.capacity}
                  onChange={(e) =>
                    setNewPond({ ...newPond, capacity: e.target.value })
                  }
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="equipment"
                className="text-sm font-medium text-gray-700"
              >
                Thiết bị
              </Label>
              <Textarea
                id="equipment"
                placeholder="Mô tả thiết bị trong hồ..."
                value={newPond.equipment}
                onChange={(e) =>
                  setNewPond({ ...newPond, equipment: e.target.value })
                }
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
              <Button onClick={handleAddPond} className="px-6">
                Thêm hồ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Pond Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chỉnh sửa thông tin hồ
            </DialogTitle>
          </DialogHeader>
          {editingPond && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tên hồ *
                  </Label>
                  <Input
                    id="edit-name"
                    placeholder="Nhập tên hồ..."
                    value={editingPond.name}
                    onChange={(e) =>
                      setEditingPond({ ...editingPond, name: e.target.value })
                    }
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-size"
                    className="text-sm font-medium text-gray-700"
                  >
                    Kích thước *
                  </Label>
                  <Input
                    id="edit-size"
                    placeholder="VD: 10m x 8m"
                    value={editingPond.size}
                    onChange={(e) =>
                      setEditingPond({ ...editingPond, size: e.target.value })
                    }
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-depth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Độ sâu *
                  </Label>
                  <Input
                    id="edit-depth"
                    placeholder="VD: 1.5m"
                    value={editingPond.depth}
                    onChange={(e) =>
                      setEditingPond({ ...editingPond, depth: e.target.value })
                    }
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-capacity"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sức chứa *
                  </Label>
                  <Input
                    id="edit-capacity"
                    placeholder="Số lượng cá tối đa"
                    type="number"
                    value={editingPond.capacity}
                    onChange={(e) =>
                      setEditingPond({
                        ...editingPond,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="border-2 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-status"
                  className="text-sm font-medium text-gray-700"
                >
                  Trạng thái
                </Label>
                <Select
                  value={editingPond.status}
                  onValueChange={(value: PondStatus) =>
                    setEditingPond({ ...editingPond, status: value })
                  }
                >
                  <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="maintenance">Đang bảo trì</SelectItem>
                    <SelectItem value="inactive">Không sử dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-equipment"
                  className="text-sm font-medium text-gray-700"
                >
                  Thiết bị
                </Label>
                <Textarea
                  id="edit-equipment"
                  placeholder="Mô tả thiết bị trong hồ..."
                  value={editingPond.equipment}
                  onChange={(e) =>
                    setEditingPond({
                      ...editingPond,
                      equipment: e.target.value,
                    })
                  }
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
                <Button onClick={handleUpdatePond}>Cập nhật</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
