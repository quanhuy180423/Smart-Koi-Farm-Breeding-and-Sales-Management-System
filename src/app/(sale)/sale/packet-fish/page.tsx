"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ruler,
  DollarSign,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationSection } from "@/components/common/PaginationSection";
import { useGetPacketFishes } from "@/hooks/usePacketFish";
import {
  PacketFishResponse,
  PacketFishSearchParams,
} from "@/lib/api/services/fetchPacketFish";
import { FishSize } from "@/lib/api/services/fetchKoiFish";
import { AddPacketDialog } from "./AddPacketDialog";
import Image from "next/image";
import { getFishSizeLabel } from "@/lib/utils/enum";

const PAGE_SIZE_OPTIONS: number[] = [9, 12, 15, 18];

const FISH_SIZES = [
  { value: "Under10cm", label: "Dưới 10cm" },
  { value: "From10To20cm", label: "10 - 20cm" },
  { value: "From21To25cm", label: "21 - 25cm" },
  { value: "From26To30cm", label: "26 - 30cm" },
  { value: "From31To40cm", label: "31 - 40cm" },
  { value: "From41To45cm", label: "41 - 45cm" },
  { value: "From46To50cm", label: "46 - 50cm" },
  { value: "Over50cm", label: "Trên 50cm" },
];

export default function PacketFishPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [searchParams, setSearchParams] = useState<PacketFishSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
  });
  const [isAddPacketDialogOpen, setIsAddPacketDialogOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter states
  const [isAvailableFilter, setIsAvailableFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [minAgeInput, setMinAgeInput] = useState<string>("");
  const [maxAgeInput, setMaxAgeInput] = useState<string>("");
  const [minQuantityInput, setMinQuantityInput] = useState<string>("");
  const [maxQuantityInput, setMaxQuantityInput] = useState<string>("");

  const { data, isLoading, error } = useGetPacketFishes({
    ...searchParams,
    search: debouncedSearchTerm || undefined,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleApplyFilters = () => {
    const minPrice = minPriceInput ? Number(minPriceInput) : undefined;
    const maxPrice = maxPriceInput ? Number(maxPriceInput) : undefined;
    const minAge = minAgeInput ? Number(minAgeInput) : undefined;
    const maxAge = maxAgeInput ? Number(maxAgeInput) : undefined;
    const minQuantity = minQuantityInput ? Number(minQuantityInput) : undefined;
    const maxQuantity = maxQuantityInput ? Number(maxQuantityInput) : undefined;

    const isAvailable =
      isAvailableFilter !== "all" ? isAvailableFilter === "true" : undefined;
    const size = sizeFilter !== "all" ? (sizeFilter as FishSize) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      isAvailable,
      size,
      minPrice,
      maxPrice,
      minAgeMonths: minAge,
      maxAgeMonths: maxAge,
      minQuantity,
      maxQuantity,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setIsAvailableFilter("all");
    setSizeFilter("all");
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinAgeInput("");
    setMaxAgeInput("");
    setMinQuantityInput("");
    setMaxQuantityInput("");

    setSearchParams((prev) => ({
      ...prev,
      isAvailable: undefined,
      size: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minAgeMonths: undefined,
      maxAgeMonths: undefined,
      minQuantity: undefined,
      maxQuantity: undefined,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const isFilterActive = Object.values(searchParams).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== searchParams.pageSize &&
      value !== searchParams.pageIndex &&
      value !== searchParams.search,
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Quản lý gói bán
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý gói cá, giá bán và theo dõi tồn kho
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Eye className="h-4 w-4 mr-2" />
            <span className="sm:hidden">Báo cáo</span>
            <span className="hidden sm:inline">Báo cáo kho</span>
          </Button>
          <Dialog
            open={isAddPacketDialogOpen}
            onOpenChange={setIsAddPacketDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Thêm gói</span>
                <span className="hidden sm:inline">Thêm gói bán mới</span>
              </Button>
            </DialogTrigger>
            <AddPacketDialog onClose={() => setIsAddPacketDialogOpen(false)} />
          </Dialog>
        </div>
      </div>

      {/* Search and List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 w-full">
              <div className="relative flex-grow w-full border border-gray-300 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên gói, giống..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Button
                variant={isFilterActive ? "default" : "outline"}
                onClick={() => setIsFilterModalOpen(true)}
                className={
                  isFilterActive
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "border-gray-400"
                }
              >
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
                {isFilterActive && (
                  <span className="ml-1 px-2 py-0.5 bg-white/30 text-white rounded-full text-xs">
                    ON
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 sm:py-12">
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4 animate-spin" />
              <h3 className="text-base sm:text-lg font-medium mb-2">
                Đang tải...
              </h3>
            </div>
          )}

          {!!error && !isLoading && (
            <div className="text-center py-8 sm:py-12">
              <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-red-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-2 text-red-600">
                Có lỗi xảy ra
              </h3>
              <p className="text-sm text-muted-foreground mb-4 px-4">
                {(error as Error)?.message || "Không thể tải danh sách gói bán"}
              </p>
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.data?.map((packet: PacketFishResponse) => (
                <Card
                  key={packet.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-40 bg-muted">
                    {packet.images && packet.images.length > 0 ? (
                      <Image
                        src={packet.images[0]}
                        alt={packet.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {packet.isAvailable ? (
                        <Badge variant="default" className="bg-green-600">
                          Có sẵn
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Hết hàng</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2">
                      {packet.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mb-3">
                      {packet.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Ruler className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {getFishSizeLabel(packet.size)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {packet.ageMonths} tháng
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {packet.quantity} con
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(packet.totalPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(`/sale/packet-fish/${packet.id}`)
                        }
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Xem</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Sửa</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem>Xóa</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && data && (!data.data || data.data.length === 0) && (
            <div className="text-center py-8 sm:py-12">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-2">
                Chưa có gói bán nào
              </h3>
              <p className="text-sm text-muted-foreground mb-4 px-4">
                Bắt đầu thêm gói bán mới để quản lý kho hàng.
              </p>
            </div>
          )}

          {data && (
            <div className="mt-6 flex justify-center">
              <PaginationSection
                currentPage={searchParams.pageIndex}
                postsPerPage={searchParams.pageSize}
                totalItems={data.totalItems}
                setCurrentPage={handlePageChange}
                setPageSize={handlePageSizeChange}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                totalPages={data.totalPages}
                hasNextPage={data.hasNextPage}
                hasPreviousPage={data.hasPreviousPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog
        open={isFilterModalOpen}
        onOpenChange={(open) => {
          setIsFilterModalOpen(open);
          if (!open) {
            setIsAvailableFilter(
              searchParams.isAvailable !== undefined
                ? searchParams.isAvailable
                  ? "true"
                  : "false"
                : "all",
            );
            setSizeFilter(searchParams.size || "all");
            setMinPriceInput(
              searchParams.minPrice !== undefined
                ? String(searchParams.minPrice)
                : "",
            );
            setMaxPriceInput(
              searchParams.maxPrice !== undefined
                ? String(searchParams.maxPrice)
                : "",
            );
            setMinAgeInput(
              searchParams.minAgeMonths !== undefined
                ? String(searchParams.minAgeMonths)
                : "",
            );
            setMaxAgeInput(
              searchParams.maxAgeMonths !== undefined
                ? String(searchParams.maxAgeMonths)
                : "",
            );
            setMinQuantityInput(
              searchParams.minQuantity !== undefined
                ? String(searchParams.minQuantity)
                : "",
            );
            setMaxQuantityInput(
              searchParams.maxQuantity !== undefined
                ? String(searchParams.maxQuantity)
                : "",
            );
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc gói bán</DialogTitle>
            <DialogDescription>
              Lọc danh sách gói bán theo tiêu chí.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Trạng thái & Kích cỡ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isAvailable">Trạng thái</Label>
                <Select
                  value={isAvailableFilter}
                  onValueChange={setIsAvailableFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="true">Có sẵn</SelectItem>
                    <SelectItem value="false">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Kích cỡ</Label>
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kích cỡ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {FISH_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Giá */}
            <div className="border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-3 text-muted-foreground">
                Lọc theo Giá bán
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Giá tối thiểu (VND)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Giá tối đa (VND)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="0"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Tuổi */}
            <div className="border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-3 text-muted-foreground">
                Lọc theo Tuổi (tháng)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAge">Tuổi tối thiểu</Label>
                  <Input
                    id="minAge"
                    type="number"
                    placeholder="0"
                    value={minAgeInput}
                    onChange={(e) => setMinAgeInput(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAge">Tuổi tối đa</Label>
                  <Input
                    id="maxAge"
                    type="number"
                    placeholder="0"
                    value={maxAgeInput}
                    onChange={(e) => setMaxAgeInput(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Số lượng */}
            <div className="border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-3 text-muted-foreground">
                Lọc theo Số lượng (con)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Số lượng tối thiểu</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    placeholder="0"
                    value={minQuantityInput}
                    onChange={(e) => setMinQuantityInput(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxQuantity">Số lượng tối đa</Label>
                  <Input
                    id="maxQuantity"
                    type="number"
                    placeholder="0"
                    value={maxQuantityInput}
                    onChange={(e) => setMaxQuantityInput(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
