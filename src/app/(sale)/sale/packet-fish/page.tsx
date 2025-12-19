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
import { InputNumber } from "@/components/ui/input-number";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Search,
  MoreHorizontal,
  Filter,
  Fish,
  Calendar,
  DollarSign,
  Layers,
  X,
  Loader2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import {
  useGetPacketFishes,
  useTogglePacketFishAvailability,
} from "@/hooks/usePacketFish";
import {
  PacketFishSearchParams,
  PacketFishResponse,
} from "@/lib/api/services/fetchPacketFish";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationWithLinks } from "@/components/pagination";
import Image from "next/image";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetVarieties } from "@/hooks/useVariety";
import { VarietySearchParams } from "@/lib/api/services/fetchVariety";

const PAGE_SIZE_OPTIONS: number[] = [9, 12, 15, 18];

export default function PacketFishPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [searchParams, setSearchParams] = useState<PacketFishSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    isAvailable: true,
  });
  const [activeTab, setActiveTab] = useState<string>("available");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [packetToToggle, setPacketToToggle] =
    useState<PacketFishResponse | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  // Filter inputs
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [minSizeInput, setMinSizeInput] = useState<string>("");
  const [maxSizeInput, setMaxSizeInput] = useState<string>("");
  const [minAgeInput, setMinAgeInput] = useState<string>("");
  const [maxAgeInput, setMaxAgeInput] = useState<string>("");
  const [minStockInput, setMinStockInput] = useState<string>("");
  const [maxStockInput, setMaxStockInput] = useState<string>("");
  const [selectedVarietyIds, setSelectedVarietyIds] = useState<number[]>([]);
  const [selectedVarietyNames, setSelectedVarietyNames] = useState<string[]>(
    [],
  );
  const [isVarietyDialogOpen, setIsVarietyDialogOpen] = useState(false);
  const [varietySearchTerm, setVarietySearchTerm] = useState("");
  const [varietySearchParams, setVarietySearchParams] =
    useState<VarietySearchParams>({
      pageIndex: 1,
      pageSize: 10,
      search: "",
    });

  const { data: packetData, isLoading } = useGetPacketFishes(searchParams);
  const { data: varietiesData, isLoading: isVarietiesLoading } =
    useGetVarieties(varietySearchParams);
  const { mutate: toggleAvailability } = useTogglePacketFishAvailability();

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVarietySearchParams((prev) => ({
        ...prev,
        search: varietySearchTerm,
        pageIndex: 1,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [varietySearchTerm]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);

    // Reset search term
    setSearchTerm("");

    // Reset all filter inputs
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinSizeInput("");
    setMaxSizeInput("");
    setMinAgeInput("");
    setMaxAgeInput("");
    setMinStockInput("");
    setMaxStockInput("");
    setSelectedVarietyIds([]);
    setSelectedVarietyNames([]);

    // Reset search params
    setSearchParams({
      pageIndex: 1,
      pageSize: searchParams.pageSize,
      isAvailable: tabValue === "available" ? true : undefined,
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleApplyFilters = () => {
    const minPrice = minPriceInput ? Number(minPriceInput) : undefined;
    const maxPrice = maxPriceInput ? Number(maxPriceInput) : undefined;
    const minSize = minSizeInput ? Number(minSizeInput) : undefined;
    const maxSize = maxSizeInput ? Number(maxSizeInput) : undefined;
    const minAgeMonths = minAgeInput ? Number(minAgeInput) : undefined;
    const maxAgeMonths = maxAgeInput ? Number(maxAgeInput) : undefined;
    const minStockQuantity = minStockInput ? Number(minStockInput) : undefined;
    const maxStockQuantity = maxStockInput ? Number(maxStockInput) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      minAgeMonths,
      maxAgeMonths,
      minStockQuantity,
      maxStockQuantity,
      varietyIds:
        selectedVarietyIds.length > 0 ? selectedVarietyIds : undefined,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinSizeInput("");
    setMaxSizeInput("");
    setMinAgeInput("");
    setMaxAgeInput("");
    setMinStockInput("");
    setMaxStockInput("");
    setSelectedVarietyIds([]);
    setSelectedVarietyNames([]);

    setSearchParams((prev) => ({
      pageIndex: 1,
      pageSize: prev.pageSize,
      isAvailable: prev.isAvailable,
      search: prev.search,
    }));

    setIsFilterModalOpen(false);
  };

  const handleToggleVariety = (varietyId: number, varietyName: string) => {
    const index = selectedVarietyIds.indexOf(varietyId);
    if (index > -1) {
      // Remove if already selected
      setSelectedVarietyIds(
        selectedVarietyIds.filter((id) => id !== varietyId),
      );
      setSelectedVarietyNames(
        selectedVarietyNames.filter((_, i) => i !== index),
      );
    } else {
      // Add if not selected
      setSelectedVarietyIds([...selectedVarietyIds, varietyId]);
      setSelectedVarietyNames([...selectedVarietyNames, varietyName]);
    }
  };

  const handleRemoveVariety = (varietyId: number) => {
    const index = selectedVarietyIds.indexOf(varietyId);
    if (index > -1) {
      setSelectedVarietyIds(
        selectedVarietyIds.filter((id) => id !== varietyId),
      );
      setSelectedVarietyNames(
        selectedVarietyNames.filter((_, i) => i !== index),
      );
    }
  };

  const handleConfirmVarietySelection = () => {
    setIsVarietyDialogOpen(false);
  };

  const handleToggleAvailability = () => {
    if (!packetToToggle) return;

    setIsToggling(true);
    toggleAvailability(packetToToggle.id, {
      onSuccess: () => {
        setPacketToToggle(null);
      },
      onSettled: () => {
        setIsToggling(false);
      },
    });
  };

  const isFilterActive = Object.keys(searchParams).some((key) => {
    const value = searchParams[key as keyof PacketFishSearchParams];
    return (
      key !== "search" &&
      key !== "pageIndex" &&
      key !== "pageSize" &&
      key !== "isAvailable" &&
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (Array.isArray(value) ? value.length > 0 : String(value) !== "0")
    );
  });

  const packetList = packetData?.data || [];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Quản lý gói cá
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý gói cá bán theo lô và theo dõi tồn kho
          </p>
        </div>
      </div>

      {/* Search and List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Danh sách gói cá
              </CardTitle>
              <CardDescription className="text-sm">
                Quản lý thông tin gói cá, giá bán và tồn kho
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative border border-gray-300 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên gói..."
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
                Bộ lọc{" "}
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
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Đang bán</TabsTrigger>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4 mt-6">
              {isLoading ? (
                <LoadingState message="Đang tải danh sách gói cá..." />
              ) : packetList.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="Không tìm thấy gói cá"
                  description="Thử thay đổi từ khóa tìm kiếm của bạn."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {packetList.map((packet) => {
                      return (
                        <Card
                          key={packet.id}
                          className="relative overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-0 bg-white p-0"
                        >
                          {/* Image Section with Gradient Overlay */}
                          <CardHeader className="p-0 relative group">
                            <div className="relative w-full h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {packet.images && packet.images.length > 0 ? (
                                <Image
                                  src={packet.images[0]}
                                  alt={packet.name}
                                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Package className="h-16 w-16 text-gray-400" />
                                </div>
                              )}
                              {/* Status Badge on Image */}
                              <div className="absolute top-3 right-3">
                                <Badge
                                  className={
                                    packet.isAvailable
                                      ? "bg-green-500 hover:bg-green-600 shadow-md"
                                      : "bg-gray-500 hover:bg-gray-600 shadow-md"
                                  }
                                >
                                  {packet.isAvailable
                                    ? "Đang bán"
                                    : "Ngừng bán"}
                                </Badge>
                              </div>
                              {/* Stock Badge */}
                              <div className="absolute top-3 left-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-white/90 text-gray-800 shadow-md"
                                >
                                  <Layers className="h-3 w-3 mr-1" />
                                  Còn {packet.stockQuantity}
                                </Badge>
                              </div>
                              {/* Overlay on Hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </div>
                          </CardHeader>

                          <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                            {/* Title and Menu */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1 mb-1">
                                  {packet.name}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                                  {packet.description}
                                </CardDescription>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 shrink-0 hover:bg-gray-100"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Hành động
                                  </DropdownMenuLabel>
                                  {packet.isAvailable ? (
                                    <DropdownMenuItem
                                      className="text-sm cursor-pointer text-orange-600"
                                      onClick={() => setPacketToToggle(packet)}
                                    >
                                      <Ban className="h-4 w-4 mr-2" />
                                      Ngừng bán
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      className="text-sm cursor-pointer text-green-600"
                                      onClick={() => setPacketToToggle(packet)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mở bán
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Varieties */}
                            <div className="mb-3 flex flex-wrap gap-1">
                              {packet.varietyPacketFishes.map((variety) => (
                                <Badge
                                  key={variety.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <Fish className="h-3 w-3 mr-1" />
                                  {variety.varietyName}
                                </Badge>
                              ))}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-md">
                                  <Package className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Số lượng/gói
                                  </p>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {packet.fishPerPacket} con
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-md">
                                  <Calendar className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Tuổi</p>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {packet.ageMonths === 0
                                      ? "< 1 tháng"
                                      : `${packet.ageMonths} tháng`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 col-span-2">
                                <div className="p-2 bg-purple-100 rounded-md">
                                  <DollarSign className="h-3.5 w-3.5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Kích thước
                                  </p>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {packet.size} cm
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Price Section */}
                            <div className="border-t pt-4 mt-auto bg-linear-to-r from-blue-50 to-blue-50/0 -mx-4 -mb-4 px-4 py-4 rounded-b-lg">
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Giá mỗi gói
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(packet.pricePerPacket || 0)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ≈{" "}
                                {formatCurrency(
                                  Math.round(
                                    packet.pricePerPacket /
                                      packet.fishPerPacket,
                                  ),
                                )}
                                /con
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {packetData && packetData.totalItems > 0 && (
                    <div className="mt-8">
                      <PaginationWithLinks
                        totalCount={packetData.totalItems}
                        pageSize={searchParams.pageSize}
                        page={searchParams.pageIndex}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-6">
              {isLoading ? (
                <LoadingState message="Đang tải danh sách gói cá..." />
              ) : packetList.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="Không tìm thấy gói cá"
                  description="Thử thay đổi từ khóa tìm kiếm của bạn."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {packetList.map((packet) => {
                      return (
                        <Card
                          key={packet.id}
                          className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                        >
                          {/* Header with Image and Status Badge */}
                          <CardHeader className="p-0 relative">
                            {packet.images && packet.images.length > 0 ? (
                              <Image
                                src={packet.images[0]}
                                alt={packet.name}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <Badge
                              className={`absolute top-2 right-2 ${packet.isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}
                            >
                              {packet.isAvailable ? "Đang bán" : "Ngừng bán"}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="absolute top-2 left-2 bg-white/90 text-gray-800"
                            >
                              <Layers className="h-3 w-3 mr-1" />
                              Còn {packet.stockQuantity}
                            </Badge>
                          </CardHeader>

                          {/* Card Content */}
                          <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                            {/* Title with More Menu */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg truncate">
                                  {packet.name}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm truncate">
                                  {packet.description}
                                </CardDescription>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Hành động
                                  </DropdownMenuLabel>
                                  {packet.isAvailable ? (
                                    <DropdownMenuItem
                                      className="text-sm cursor-pointer text-orange-600"
                                      onClick={() => setPacketToToggle(packet)}
                                    >
                                      <Ban className="h-4 w-4 mr-2" />
                                      Ngừng bán
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      className="text-sm cursor-pointer text-green-600"
                                      onClick={() => setPacketToToggle(packet)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mở bán
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Varieties */}
                            <div className="mb-3 flex flex-wrap gap-1">
                              {packet.varietyPacketFishes.map((variety) => (
                                <Badge
                                  key={variety.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {variety.varietyName}
                                </Badge>
                              ))}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                              <div>
                                <p className="text-xs text-gray-600">
                                  Số lượng/gói
                                </p>
                                <p className="font-semibold">
                                  {packet.fishPerPacket} con
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Tuổi</p>
                                <p className="font-semibold">
                                  {packet.ageMonths === 0
                                    ? "< 1 tháng"
                                    : `${packet.ageMonths} tháng`}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-gray-600">
                                  Kích thước
                                </p>
                                <p className="font-semibold">
                                  {packet.size} cm
                                </p>
                              </div>
                            </div>

                            {/* Selling Price */}
                            <div className="border-t pt-4 mt-auto">
                              <p className="text-xs font-medium text-gray-600">
                                Giá mỗi gói
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(packet.pricePerPacket || 0)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {packetData && packetData.totalItems > 0 && (
                    <div className="mt-8">
                      <PaginationWithLinks
                        totalCount={packetData.totalItems}
                        pageSize={searchParams.pageSize}
                        page={searchParams.pageIndex}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bộ lọc nâng cao</DialogTitle>
            <DialogDescription>
              Lọc gói cá theo các tiêu chí chi tiết
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Price Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Giá gói (VNĐ)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Từ</Label>
                  <InputNumber
                    placeholder="Giá tối thiểu"
                    value={minPriceInput}
                    onChange={(val) =>
                      setMinPriceInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Đến</Label>
                  <InputNumber
                    placeholder="Giá tối đa"
                    value={maxPriceInput}
                    onChange={(val) =>
                      setMaxPriceInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Kích thước (cm)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Từ</Label>
                  <InputNumber
                    placeholder="Kích thước tối thiểu"
                    value={minSizeInput}
                    onChange={(val) =>
                      setMinSizeInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Đến</Label>
                  <InputNumber
                    placeholder="Kích thước tối đa"
                    value={maxSizeInput}
                    onChange={(val) =>
                      setMaxSizeInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Age Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Tuổi (tháng)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Từ</Label>
                  <InputNumber
                    placeholder="Tuổi tối thiểu"
                    value={minAgeInput}
                    onChange={(val) =>
                      setMinAgeInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Đến</Label>
                  <InputNumber
                    placeholder="Tuổi tối đa"
                    value={maxAgeInput}
                    onChange={(val) =>
                      setMaxAgeInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Stock Quantity Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Số lượng tồn kho
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Từ</Label>
                  <InputNumber
                    placeholder="Tồn kho tối thiểu"
                    value={minStockInput}
                    onChange={(val) =>
                      setMinStockInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Đến</Label>
                  <InputNumber
                    placeholder="Tồn kho tối đa"
                    value={maxStockInput}
                    onChange={(val) =>
                      setMaxStockInput(isNaN(val) ? "" : String(val))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Variety Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Giống cá
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedVarietyNames.map((name, index) => (
                  <Badge
                    key={selectedVarietyIds[index]}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {name}
                    <button
                      onClick={() =>
                        handleRemoveVariety(selectedVarietyIds[index])
                      }
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setIsVarietyDialogOpen(true)}
                className="w-full"
              >
                <Fish className="h-4 w-4 mr-2" />
                Chọn giống cá
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>Áp dụng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variety Multi-Selection Dialog */}
      <Dialog open={isVarietyDialogOpen} onOpenChange={setIsVarietyDialogOpen}>
        <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chọn giống cá</DialogTitle>
            <DialogDescription>
              Chọn một hoặc nhiều giống cá để lọc
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Tìm kiếm giống theo tên..."
              value={varietySearchTerm}
              onChange={(e) => setVarietySearchTerm(e.target.value)}
              className="w-full"
            />

            {/* Selected Varieties Display */}
            {selectedVarietyNames.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                {selectedVarietyNames.map((name, index) => (
                  <Badge
                    key={selectedVarietyIds[index]}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            )}

            {isVarietiesLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang tải danh sách giống...
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[5%]">#</TableHead>
                      <TableHead className="w-[30%]">Tên Giống</TableHead>
                      <TableHead className="w-[30%]">Đặc điểm</TableHead>
                      <TableHead className="w-[35%]">Xuất xứ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {varietiesData?.data?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500 py-4"
                        >
                          Không tìm thấy giống nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      varietiesData?.data?.map((variety) => {
                        const isSelected = selectedVarietyIds.includes(
                          variety.id,
                        );
                        return (
                          <TableRow
                            key={variety.id}
                            onClick={() =>
                              handleToggleVariety(
                                variety.id,
                                variety.varietyName,
                              )
                            }
                            className={
                              isSelected
                                ? "bg-blue-50/50 cursor-pointer"
                                : "hover:bg-gray-50 cursor-pointer"
                            }
                          >
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleToggleVariety(
                                    variety.id,
                                    variety.varietyName,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {variety.varietyName}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {variety.characteristic || "N/A"}
                            </TableCell>
                            <TableCell className="truncate text-sm text-gray-500">
                              {variety.originCountry || "N/A"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>

                {varietiesData && varietiesData.totalItems > 0 && (
                  <PaginationWithLinks
                    totalCount={varietiesData.totalItems}
                    pageSize={varietySearchParams.pageSize}
                    page={varietySearchParams.pageIndex}
                    onPageChange={(page) =>
                      setVarietySearchParams((prev) => ({
                        ...prev,
                        pageIndex: page,
                      }))
                    }
                    onPageSizeChange={(size) =>
                      setVarietySearchParams((prev) => ({
                        ...prev,
                        pageSize: size,
                        pageIndex: 1,
                      }))
                    }
                  />
                )}
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsVarietyDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirmVarietySelection}>Xong</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Availability Confirmation Dialog */}
      <Dialog
        open={!!packetToToggle}
        onOpenChange={(open) => !open && setPacketToToggle(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {packetToToggle?.isAvailable
                ? "Ngừng bán gói cá"
                : "Mở bán gói cá"}
            </DialogTitle>
            <DialogDescription>
              {packetToToggle?.isAvailable
                ? `Bạn có chắc chắn muốn ngừng bán gói "${packetToToggle?.name}"? Gói cá sẽ không hiển thị cho khách hàng.`
                : `Bạn có chắc chắn muốn mở bán gói "${packetToToggle?.name}"? Gói cá sẽ được hiển thị cho khách hàng.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPacketToToggle(null)}
              disabled={isToggling}
            >
              Hủy
            </Button>
            <Button
              onClick={handleToggleAvailability}
              disabled={isToggling}
              variant={packetToToggle?.isAvailable ? "destructive" : "default"}
            >
              {isToggling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : packetToToggle?.isAvailable ? (
                "Ngừng bán"
              ) : (
                "Mở bán"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
