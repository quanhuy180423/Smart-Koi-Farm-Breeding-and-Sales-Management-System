"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Fish,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Tag,
  Ruler,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import formatCurrency from "@/lib/utils/numbers";

// Mock data - replace with real API calls
const mockFishStats = {
  totalFish: 234,
  availableFish: 198,
  soldFish: 36,
  lowStockFish: 12,
  totalValue: 1245600000,
  avgPrice: 5320000,
};

const mockFishForSale = [
  {
    id: "FISH001",
    name: "Koi Kohaku Premium",
    breed: "Kohaku",
    age: "2 năm",
    size: "45cm",
    weight: "2.5kg",
    gender: "Đực",
    origin: "Nhật Bản",
    price: 2500000,
    cost: 1800000,
    profit: 700000,
    status: "available",
    stock: 5,
    sold: 12,
    dateAdded: "2024-01-01",
    category: "Premium",
    healthStatus: "Khỏe mạnh",
    description: "Cá Koi Kohaku chất lượng cao từ Nhật Bản",
    images: ["koi1.jpg", "koi2.jpg"],
  },
  {
    id: "FISH002",
    name: "Koi Sanke",
    breed: "Sanke",
    age: "1.5 năm",
    size: "38cm",
    weight: "1.8kg",
    gender: "Cái",
    origin: "Nhật Bản",
    price: 1800000,
    cost: 1200000,
    profit: 600000,
    status: "available",
    stock: 8,
    sold: 6,
    dateAdded: "2024-01-03",
    category: "Standard",
    healthStatus: "Khỏe mạnh",
    description: "Cá Koi Sanke với màu sắc đẹp",
    images: ["sanke1.jpg"],
  },
  {
    id: "FISH003",
    name: "Koi Showa",
    breed: "Showa",
    age: "3 năm",
    size: "52cm",
    weight: "3.2kg",
    gender: "Đực",
    origin: "Việt Nam",
    price: 3200000,
    cost: 2400000,
    profit: 800000,
    status: "low_stock",
    stock: 2,
    sold: 8,
    dateAdded: "2023-12-15",
    category: "Premium",
    healthStatus: "Khỏe mạnh",
    description: "Cá Koi Showa lớn với hoa văn đẹp",
    images: ["showa1.jpg", "showa2.jpg"],
  },
  {
    id: "FISH004",
    name: "Koi Tancho",
    breed: "Tancho",
    age: "2.5 năm",
    size: "42cm",
    weight: "2.1kg",
    gender: "Cái",
    origin: "Nhật Bản",
    price: 2800000,
    cost: 2000000,
    profit: 800000,
    status: "sold_out",
    stock: 0,
    sold: 15,
    dateAdded: "2023-11-20",
    category: "Premium",
    healthStatus: "Khỏe mạnh",
    description: "Cá Koi Tancho với dấu đỏ đặc trưng",
    images: ["tancho1.jpg"],
  },
];

export default function FishForSalePage() {
  const [fishList] = useState(mockFishForSale);
  const [filteredFish, setFilteredFish] = useState(mockFishForSale);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = fishList;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (fish) =>
          fish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fish.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fish.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((fish) => fish.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((fish) => fish.category === categoryFilter);
    }

    setFilteredFish(filtered);
  }, [searchTerm, statusFilter, categoryFilter, fishList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "sold_out":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "low_stock":
        return <AlertTriangle className="h-4 w-4" />;
      case "sold_out":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Có sẵn";
      case "low_stock":
        return "Sắp hết";
      case "sold_out":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Standard":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Quản lý cá bán
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý kho cá, giá bán và theo dõi tồn kho
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Eye className="h-4 w-4 mr-2" />
            <span className="sm:hidden">Báo cáo</span>
            <span className="hidden sm:inline">Báo cáo kho</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Thêm cá</span>
                <span className="hidden sm:inline">Thêm cá mới</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm cá bán mới</DialogTitle>
                <DialogDescription>
                  Form thêm cá sẽ được implement sau
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Tổng số cá
            </CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {mockFishStats.totalFish}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Có sẵn
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {mockFishStats.availableFish}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Đã bán
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {mockFishStats.soldFish}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Sắp hết
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-yellow-600">
              {mockFishStats.lowStockFish}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Giá trị kho
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-lg font-bold text-green-600">
              {formatCurrency(mockFishStats.totalValue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Giá TB
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-lg font-bold text-orange-600">
              {formatCurrency(mockFishStats.avgPrice)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Danh sách cá bán
              </CardTitle>
              <CardDescription className="text-sm">
                Quản lý thông tin cá, giá bán và tồn kho
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
              <div className="relative border border-gray-300 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, giống, mã cá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1 sm:w-32 border border-gray-300">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="available">Có sẵn</SelectItem>
                    <SelectItem value="low_stock">Sắp hết</SelectItem>
                    <SelectItem value="sold_out">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="flex-1 sm:w-32 border border-gray-300">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredFish.map((fish) => (
              <Card
                key={fish.id}
                className="relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg mb-1 line-clamp-2">
                        {fish.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                        <Badge
                          className={`${getCategoryColor(fish.category)} text-xs`}
                          variant="secondary"
                        >
                          {fish.category}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(fish.status)} text-xs`}
                          variant="secondary"
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(fish.status)}
                            <span>{getStatusText(fish.status)}</span>
                          </div>
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {fish.id} • {fish.breed}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa cá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  {/* Fish Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Tuổi:</span>
                      <span className="font-medium">{fish.age}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Kích thước:</span>
                      <span className="font-medium">{fish.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Giới tính:</span>
                      <span className="font-medium">{fish.gender}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Xuất xứ:</span>
                      <span className="font-medium">{fish.origin}</span>
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tồn kho:</span>
                      <span className="font-bold ml-1">{fish.stock}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Đã bán:</span>
                      <span className="font-bold ml-1">{fish.sold}</span>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giá bán:
                      </span>
                      <span className="font-bold text-base sm:text-lg text-primary">
                        {formatCurrency(fish.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Giá gốc:</span>
                      <span className="font-medium">
                        {formatCurrency(fish.cost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lợi nhuận:</span>
                      <span className="font-medium text-green-600">
                        +{formatCurrency(fish.profit)}
                      </span>
                    </div>
                  </div>

                  {/* Health Status */}
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {fish.healthStatus}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFish.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Fish className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-2">
                Không tìm thấy cá
              </h3>
              <p className="text-sm text-muted-foreground mb-4 px-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Thêm cá mới
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
