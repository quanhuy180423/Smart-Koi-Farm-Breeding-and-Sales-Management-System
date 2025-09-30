"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Fish,
  Edit,
  Trash2,
  Eye,
  Upload
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import formatCurrency from "@/lib/utils/numbers";
import { formatDate } from "@/lib/utils/dates";

interface Koi {
  id: string;
  name: string;
  variety: KoiVariety;
  age: string;
  size: string;
  weight: string;
  gender: KoiGender;
  pond: string;
  origin: KoiOrigin;
  health: KoiHealth;
  breedingStatus: BreedingStatus;
  status: KoiStatus;
  price: string;
  lastHealthCheck: string;
}

interface NewFishForm {
  name: string;
  variety: string;
  age: string;
  size: string;
  weight: string;
  gender: string;
  pond: string;
  origin: string;
  price: string;
}

type KoiVariety = "Kohaku" | "Sanke" | "Showa" | "Tancho";
type KoiHealth = "Khỏe mạnh" | "Điều trị";
type KoiStatus = "active" | "for-sale" | "sold" | "deceased";
type KoiGender = "Đực" | "Cái";
type KoiOrigin = "Nhật Bản" | "Việt Nam" | "Trung Quốc";
type BreedingStatus = "Có sẵn" | "Không khả dụng";

const koiData: Koi[] = [
  {
    id: "KOI001",
    name: "Sakura",
    variety: "Kohaku",
    age: "2 năm",
    size: "45cm",
    weight: "2.1kg",
    gender: "Cái",
    pond: "Hồ A",
    origin: "Nhật Bản",
    health: "Khỏe mạnh",
    breedingStatus: "Có sẵn",
    status: "active",
    price: "8,500,000",
    lastHealthCheck: "2024-01-10",
  },
  {
    id: "KOI002",
    name: "Sanke #002",
    variety: "Sanke",
    age: "3 năm",
    size: "42cm",
    weight: "1.8kg",
    gender: "Đực",
    pond: "Hồ A2",
    origin: "Việt Nam",
    health: "Khỏe mạnh",
    breedingStatus: "Có sẵn",
    status: "sold",
    price: "25,000,000",
    lastHealthCheck: "2024-01-08",
  },
  {
    id: "KOI003",
    name: "Showa #003",
    variety: "Showa",
    age: "1.5 năm",
    size: "28cm",
    weight: "1.2kg",
    gender: "Cái",
    pond: "Hồ B1",
    origin: "Nhật Bản",
    health: "Điều trị",
    breedingStatus: "Không khả dụng",
    status: "deceased",
    price: "12,000,000",
    lastHealthCheck: "2024-01-05",
  },
  {
    id: "KOI004",
    name: "Tancho #004",
    variety: "Tancho",
    age: "4 năm",
    size: "48cm",
    weight: "2.5kg",
    gender: "Đực",
    pond: "Hồ A1",
    origin: "Nhật Bản",
    health: "Khỏe mạnh",
    breedingStatus: "Có sẵn",
    status: "for-sale",
    price: "35,000,000",
    lastHealthCheck: "2024-01-12",
  },
];

const getHealthBadge = (health: string) => {
  switch (health) {
    case "Khỏe mạnh":
      return <Badge variant="default" className="bg-green-100 text-green-800">Khỏe mạnh</Badge>;
    case "Điều trị":
      return <Badge variant="destructive">Điều trị</Badge>;
    default:
      return <Badge variant="secondary">{health}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Đang nuôi</Badge>;
    case "for-sale":
      return <Badge variant="default" className="bg-green-100 text-green-800">Đang bán</Badge>;
    case "sold":
      return <Badge variant="secondary">Đã bán</Badge>;
    case "deceased":
      return <Badge variant="destructive">Đã chết</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function KoiManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [varietyFilter, setVarietyFilter] = useState<string>("all");
  const [pondFilter, setPondFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedKoi, setSelectedKoi] = useState<Koi | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingKoi, setEditingKoi] = useState<Koi | null>(null);
  const [newFish, setNewFish] = useState<NewFishForm>({
    name: "",
    variety: "",
    age: "",
    size: "",
    weight: "",
    gender: "",
    pond: "",
    origin: "",
    price: "",
  });

  const filteredKoi = koiData.filter((koi) => {
    const matchesSearch = koi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         koi.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVariety = varietyFilter === "all" || koi.variety === varietyFilter;
    const matchesPond = pondFilter === "all" || koi.pond === pondFilter;
    const matchesStatus = statusFilter === "all" || koi.status === statusFilter;
    return matchesSearch && matchesVariety && matchesPond && matchesStatus;
  });

  const handleViewDetails = (koi: Koi) => {
    setSelectedKoi(koi);
    setIsDetailModalOpen(true);
  };

  const handleAddFish = () => {
    console.log("Adding new fish:", newFish);
    setIsAddModalOpen(false);
    setNewFish({
      name: "",
      variety: "",
      age: "",
      size: "",
      weight: "",
      gender: "",
      pond: "",
      origin: "",
      price: "",
    });
  };

  const handleEditKoi = (koi: Koi) => {
    setEditingKoi(koi);
    setIsEditModalOpen(true);
  };

  const handleUpdateKoi = () => {
    console.log("Updating koi:", editingKoi);
    setIsEditModalOpen(false);
    setEditingKoi(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý cá Koi</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và trạng thái của tất cả cá Koi trong trang trại
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm cá Koi mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số cá</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{koiData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang nuôi</CardTitle>
            <Fish className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {koiData.filter(k => k.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
            <Fish className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {koiData.filter(k => k.status === "for-sale").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cần điều trị</CardTitle>
            <Fish className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {koiData.filter(k => k.health === "Điều trị").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách cá Koi</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết của từng con cá Koi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 mb-6 bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="relative md:col-span-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc mã cá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-400 pl-10"
                />
              </div>

              {/* Pond Filter */}
              <Select value={pondFilter} onValueChange={setPondFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400">
                  <SelectValue placeholder="Lọc theo hồ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hồ</SelectItem>
                  <SelectItem value="Hồ A">Hồ A</SelectItem>
                  <SelectItem value="Hồ A1">Hồ A1</SelectItem>
                  <SelectItem value="Hồ A2">Hồ A2</SelectItem>
                  <SelectItem value="Hồ B1">Hồ B1</SelectItem>
                  <SelectItem value="Hồ C1">Hồ C1</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang nuôi</SelectItem>
                  <SelectItem value="for-sale">Đang bán</SelectItem>
                  <SelectItem value="sold">Đã bán</SelectItem>
                  <SelectItem value="deceased">Đã chết</SelectItem>
                </SelectContent>
              </Select>

              {/* Variety Filter */}
              <Select value={varietyFilter} onValueChange={setVarietyFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400">
                  <SelectValue placeholder="Lọc theo giống" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả giống</SelectItem>
                  <SelectItem value="Kohaku">Kohaku</SelectItem>
                  <SelectItem value="Sanke">Sanke</SelectItem>
                  <SelectItem value="Showa">Showa</SelectItem>
                  <SelectItem value="Tancho">Tancho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã cá</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Giống</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Kích thước</TableHead>
                <TableHead>Hồ</TableHead>
                <TableHead>Sức khỏe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Giá (VNĐ)</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKoi.map((koi) => (
                <TableRow key={koi.id}>
                  <TableCell className="font-medium">{koi.id}</TableCell>
                  <TableCell>{koi.name}</TableCell>
                  <TableCell>{koi.variety}</TableCell>
                  <TableCell>{koi.age}</TableCell>
                  <TableCell>{koi.size}</TableCell>
                  <TableCell>{koi.pond}</TableCell>
                  <TableCell>{getHealthBadge(koi.health)}</TableCell>
                  <TableCell>{getStatusBadge(koi.status)}</TableCell>
                  <TableCell>{koi.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(koi)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditKoi(koi)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-500">
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedKoi && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-xl!">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">{selectedKoi.name}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {selectedKoi.id} • {selectedKoi.variety}
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-muted-foreground">Thuộc tính vật lý</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Tuổi:</span>
                      <span className="font-medium">{selectedKoi.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kích thước:</span>
                      <span className="font-medium">{selectedKoi.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cân nặng:</span>
                      <span className="font-medium">{selectedKoi.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giới tính:</span>
                      <span className="font-medium">{selectedKoi.gender}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-muted-foreground">Vị trí & Trạng thái</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Hồ:</span>
                      <span className="font-medium">{selectedKoi.pond}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Xuất xứ:</span>
                      <span className="font-medium">{selectedKoi.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tình trạng sức khỏe:</span>
                      <Badge variant={selectedKoi.health === "Khỏe mạnh" ? "default" : "destructive"} className="text-xs">
                        {selectedKoi.health}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Trạng thái sinh sản:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedKoi.breedingStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Giá trị thị trường</h4>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(parseInt(selectedKoi.price.replace(/[^0-9]/g, ""), 10))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Kiểm tra sức khỏe lần cuối</p>
                    <p className="font-medium">{formatDate(selectedKoi.lastHealthCheck, "dd/MM/yyyy")}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add New Fish Modal */}
      {isAddModalOpen && (
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">Thêm cá mới</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Nhập thông tin chi tiết cho một con cá mới trong kho.
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Tên</Label>
                  <Input
                    id="name"
                    value={newFish.name}
                    onChange={(e) => setNewFish({...newFish, name: e.target.value})}
                    placeholder="Nhập tên cá (vd: Sakura)"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variety" className="text-sm font-medium text-gray-700">Giống</Label>
                  <Select value={newFish.variety} onValueChange={(value) => setNewFish({...newFish, variety: value})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn giống cá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kohaku">Kohaku</SelectItem>
                      <SelectItem value="Sanke">Sanke</SelectItem>
                      <SelectItem value="Showa">Showa</SelectItem>
                      <SelectItem value="Tancho">Tancho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">Tuổi</Label>
                  <Input
                    id="age"
                    value={newFish.age}
                    onChange={(e) => setNewFish({...newFish, age: e.target.value})}
                    placeholder="VD: 2 năm"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm font-medium text-gray-700">Kích thước</Label>
                  <Input
                    id="size"
                    value={newFish.size}
                    onChange={(e) => setNewFish({...newFish, size: e.target.value})}
                    placeholder="VD: 45cm"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Cân nặng</Label>
                  <Input
                    id="weight"
                    value={newFish.weight}
                    onChange={(e) => setNewFish({...newFish, weight: e.target.value})}
                    placeholder="VD: 2.1kg"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pond" className="text-sm font-medium text-gray-700">Hồ</Label>
                  <Select value={newFish.pond} onValueChange={(value) => setNewFish({...newFish, pond: value})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn hồ nuôi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hồ A">Hồ A</SelectItem>
                      <SelectItem value="Hồ A1">Hồ A1</SelectItem>
                      <SelectItem value="Hồ A2">Hồ A2</SelectItem>
                      <SelectItem value="Hồ B1">Hồ B1</SelectItem>
                      <SelectItem value="Hồ C1">Hồ C1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-sm font-medium text-gray-700">Xuất xứ</Label>
                  <Select value={newFish.origin} onValueChange={(value) => setNewFish({...newFish, origin: value})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn xuất xứ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nhật Bản">Nhật Bản</SelectItem>
                      <SelectItem value="Việt Nam">Việt Nam</SelectItem>
                      <SelectItem value="Trung Quốc">Trung Quốc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Giới tính</Label>
                  <Select value={newFish.gender} onValueChange={(value) => setNewFish({...newFish, gender: value})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đực">Đực</SelectItem>
                      <SelectItem value="Cái">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">Giá (VNĐ)</Label>
                  <Input
                    id="price"
                    value={newFish.price}
                    onChange={(e) => setNewFish({...newFish, price: e.target.value})}
                    placeholder="VD: 8,500,000"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-sm font-medium">Hình ảnh</Label>
                <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Tải lên hình ảnh cá</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAddFish}>
                  Thêm cá
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Fish Modal */}
      {isEditModalOpen && editingKoi && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">Chỉnh sửa cá Koi</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Cập nhật thông tin cho cá {editingKoi.name}.
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Tên</Label>
                  <Input
                    id="edit-name"
                    value={editingKoi.name}
                    onChange={(e) => setEditingKoi({...editingKoi, name: e.target.value})}
                    placeholder="Nhập tên cá (vd: Sakura)"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-variety" className="text-sm font-medium text-gray-700">Giống</Label>
                  <Select value={editingKoi.variety} onValueChange={(value) => setEditingKoi({...editingKoi, variety: value as KoiVariety})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn giống cá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kohaku">Kohaku</SelectItem>
                      <SelectItem value="Sanke">Sanke</SelectItem>
                      <SelectItem value="Showa">Showa</SelectItem>
                      <SelectItem value="Tancho">Tancho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-age" className="text-sm font-medium text-gray-700">Tuổi</Label>
                  <Input
                    id="edit-age"
                    value={editingKoi.age}
                    onChange={(e) => setEditingKoi({...editingKoi, age: e.target.value})}
                    placeholder="2 năm"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-size" className="text-sm font-medium text-gray-700">Kích thước</Label>
                  <Input
                    id="edit-size"
                    value={editingKoi.size}
                    onChange={(e) => setEditingKoi({...editingKoi, size: e.target.value})}
                    placeholder="45cm"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-weight" className="text-sm font-medium text-gray-700">Cân nặng</Label>
                  <Input
                    id="edit-weight"
                    value={editingKoi.weight}
                    onChange={(e) => setEditingKoi({...editingKoi, weight: e.target.value})}
                    placeholder="2.1kg"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pond" className="text-sm font-medium text-gray-700">Hồ</Label>
                  <Select value={editingKoi.pond} onValueChange={(value) => setEditingKoi({...editingKoi, pond: value})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn hồ nuôi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hồ A">Hồ A</SelectItem>
                      <SelectItem value="Hồ A1">Hồ A1</SelectItem>
                      <SelectItem value="Hồ A2">Hồ A2</SelectItem>
                      <SelectItem value="Hồ B1">Hồ B1</SelectItem>
                      <SelectItem value="Hồ C1">Hồ C1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-origin" className="text-sm font-medium text-gray-700">Xuất xứ</Label>
                  <Select value={editingKoi.origin} onValueChange={(value) => setEditingKoi({...editingKoi, origin: value as KoiOrigin})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn xuất xứ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nhật Bản">Nhật Bản</SelectItem>
                      <SelectItem value="Việt Nam">Việt Nam</SelectItem>
                      <SelectItem value="Trung Quốc">Trung Quốc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-gender" className="text-sm font-medium text-gray-700">Giới tính</Label>
                  <Select value={editingKoi.gender} onValueChange={(value) => setEditingKoi({...editingKoi, gender: value as KoiGender})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đực">Đực</SelectItem>
                      <SelectItem value="Cái">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700">Giá (VNĐ)</Label>
                  <Input
                    id="edit-price"
                    value={editingKoi.price}
                    onChange={(e) => setEditingKoi({...editingKoi, price: e.target.value})}
                    placeholder="8,500,000"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium text-gray-700">Trạng thái</Label>
                <Select value={editingKoi.status} onValueChange={(value) => setEditingKoi({...editingKoi, status: value as KoiStatus})}>
                  <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang nuôi</SelectItem>
                    <SelectItem value="for-sale">Đang bán</SelectItem>
                    <SelectItem value="sold">Đã bán</SelectItem>
                    <SelectItem value="deceased">Đã chết</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-image" className="text-sm font-medium text-gray-700">Hình ảnh</Label>
                <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Thay đổi hình ảnh cá</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateKoi}>
                  Cập nhật
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}