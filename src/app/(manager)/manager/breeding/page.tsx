"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Heart,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
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
import { formatDate } from "@/lib/utils/dates/formatDate";

const breedingData = [
  {
    id: "BR001",
    maleFish: {
      id: "KOI001",
      name: "Kohaku Nam",
      variety: "Kohaku",
    },
    femaleFish: {
      id: "KOI015",
      name: "Kohaku Cái",
      variety: "Kohaku",
    },
    startDate: "2024-02-15",
    expectedHatchDate: "2024-03-20",
    actualHatchDate: null,
    status: "Đang ấp",
    eggCount: 2500,
    hatchRate: null,
    fryCount: null,
    survivalRate: null,
    pond: "Hồ A1",
    notes: "Điều kiện thời tiết thuận lợi, theo dõi nhiệt độ nước",
  },
  {
    id: "BR002",
    maleFish: {
      id: "KOI005",
      name: "Showa Nam",
      variety: "Showa",
    },
    femaleFish: {
      id: "KOI020",
      name: "Showa Cái",
      variety: "Showa",
    },
    startDate: "2024-01-20",
    expectedHatchDate: "2024-02-25",
    actualHatchDate: "2024-02-23",
    status: "Hoàn thành",
    eggCount: 3200,
    hatchRate: 85,
    fryCount: 2720,
    survivalRate: 78,
    pond: "Hồ B1",
    notes: "Sinh sản thành công, cá con phát triển tốt",
  },
  {
    id: "BR003",
    maleFish: {
      id: "KOI012",
      name: "Sanke Nam",
      variety: "Sanke",
    },
    femaleFish: {
      id: "KOI028",
      name: "Sanke Cái",
      variety: "Sanke",
    },
    startDate: "2024-03-01",
    expectedHatchDate: "2024-04-05",
    actualHatchDate: null,
    status: "Chuẩn bị",
    eggCount: null,
    hatchRate: null,
    fryCount: null,
    survivalRate: null,
    pond: "Hồ C1",
    notes: "Đang chuẩn bị môi trường và theo dõi sức khỏe cá bố mẹ",
  },
  {
    id: "BR004",
    maleFish: {
      id: "KOI007",
      name: "Utsuri Nam",
      variety: "Utsuri",
    },
    femaleFish: {
      id: "KOI022",
      name: "Utsuri Cái",
      variety: "Utsuri",
    },
    startDate: "2023-12-10",
    expectedHatchDate: "2024-01-15",
    actualHatchDate: "2024-01-14",
    status: "Thất bại",
    eggCount: 1800,
    hatchRate: 25,
    fryCount: 450,
    survivalRate: 12,
    pond: "Hồ A2",
    notes: "Tỷ lệ nở thấp do nhiệt độ không ổn định",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Hoàn thành":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Hoàn thành
        </Badge>
      );
    case "Đang ấp":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Đang ấp
        </Badge>
      );
    case "Chuẩn bị":
      return <Badge variant="secondary">Chuẩn bị</Badge>;
    case "Thất bại":
      return <Badge variant="destructive">Thất bại</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function BreedingManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [varietyFilter, setVarietyFilter] = useState("all");

  const filteredBreeding = breedingData.filter((breeding) => {
    const matchesSearch =
      breeding.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breeding.maleFish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breeding.femaleFish.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      breeding.pond.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || breeding.status === statusFilter;
    const matchesVariety =
      varietyFilter === "all" ||
      breeding.maleFish.variety === varietyFilter ||
      breeding.femaleFish.variety === varietyFilter;
    return matchesSearch && matchesStatus && matchesVariety;
  });

  const handleCreateBreeding = () => {
    router.push("/manager/breeding/new");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý sinh sản
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý quá trình sinh sản cá Koi
          </p>
        </div>
        <Button onClick={handleCreateBreeding}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm cặp sinh sản mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chu kỳ sinh sản
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{breedingData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {breedingData.filter((b) => b.status === "Hoàn thành").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang tiến hành
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                breedingData.filter(
                  (b) => b.status === "Đang ấp" || b.status === "Chuẩn bị"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thất bại</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {breedingData.filter((b) => b.status === "Thất bại").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breeding Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chu kỳ sinh sản</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tiến trình sinh sản của cá Koi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 mb-6 bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã, tên cá hoặc hồ..."
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
                  <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                  <SelectItem value="Đang ấp">Đang ấp</SelectItem>
                  <SelectItem value="Chuẩn bị">Chuẩn bị</SelectItem>
                  <SelectItem value="Thất bại">Thất bại</SelectItem>
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
                  <SelectItem value="Showa">Showa</SelectItem>
                  <SelectItem value="Sanke">Sanke</SelectItem>
                  <SelectItem value="Utsuri">Utsuri</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã sinh sản</TableHead>
                <TableHead>Cá bố</TableHead>
                <TableHead>Cá mẹ</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày nở dự kiến</TableHead>
                <TableHead>Hồ</TableHead>
                <TableHead>Số trứng</TableHead>
                <TableHead>Tỷ lệ nở</TableHead>
                <TableHead>Cá con</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBreeding.map((breeding) => (
                <TableRow key={breeding.id}>
                  <TableCell className="font-medium">{breeding.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {breeding.maleFish.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {breeding.maleFish.variety}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {breeding.femaleFish.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {breeding.femaleFish.variety}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(breeding.startDate, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{formatDate(breeding.expectedHatchDate, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{breeding.pond}</TableCell>
                  <TableCell>
                    {breeding.eggCount?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell>
                    {breeding.hatchRate ? `${breeding.hatchRate}%` : "-"}
                  </TableCell>
                  <TableCell>
                    {breeding.fryCount?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(breeding.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
    </div>
  );
}
