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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Fish,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Package,
  Tag,
  Ruler,
  Calendar,
  Trash2,
  Network,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetKoiFishes, useUpdateKoiFish } from "@/hooks/useKoiFish";
import {
  KoiFishSearchParams,
  SaleStatus,
  KoiFishUpdateRequest,
} from "@/lib/api/services/fetchKoiFish";
import { useDebounce } from "@/hooks/useDebounce";
import { formatKoiAge } from "@/lib/utils/dates/age";
import {
  getFishSizeLabel,
  getGenderLabel,
  getHealthStatusLabel,
  getSaleStatusLabel,
} from "@/lib/utils/enum";
import { PaginationWithLinks } from "@/components/pagination";
import Image from "next/image";
import { AddFishDialog } from "./AddFishDialog";
import { KoiDetailDialog } from "@/components/dialogs/KoiDetailDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { parseSizeToNumber } from "@/lib/utils/numbers/parseSize";
import PedigreeModal from "@/app/(manager)/manager/koi/components/PedigreeModal";

const PAGE_SIZE_OPTIONS: number[] = [9, 12, 15, 18];

export default function FishForSalePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [searchParams, setSearchParams] = useState<KoiFishSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    saleStatus: SaleStatus.AVAILABLE,
  });
  const [isAddFishDialogOpen, setIsAddFishDialogOpen] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState<KoiFishResponse | null>(null);
  const [selectedKoiInAddDialog, setSelectedKoiInAddDialog] =
    useState<KoiFishResponse | null>(null);
  const [fishToRemove, setFishToRemove] = useState<KoiFishResponse | null>(
    null,
  );
  const [isRemovingFishId, setIsRemovingFishId] = useState<number | null>(null);
  const [isAddingFishId, setIsAddingFishId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("available");
  const [isPedigreeModalOpen, setIsPedigreeModalOpen] = useState(false);
  const [pedigreeKoi, setPedigreeKoi] = useState<KoiFishResponse | null>(null);

  const { data: koiData, isLoading } = useGetKoiFishes(searchParams);
  const { mutate: updateFish, isPending: isUpdating } = useUpdateKoiFish();

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setSearchParams((prev) => ({
      ...prev,
      saleStatus:
        tabValue === "available" ? SaleStatus.AVAILABLE : SaleStatus.SOLD,
      pageIndex: 1,
      search: "",
    }));
    setSearchTerm("");
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleAddFish = (koi: KoiFishResponse) => {
    setIsAddingFishId(koi.id);

    const requestBody: KoiFishUpdateRequest = {
      rfid: koi.rfid,
      pondId: koi.pond.id,
      varietyId: koi.variety.id,
      breedingProcessId: koi.breedingProcess?.id ?? undefined,
      size: parseSizeToNumber(koi.size),
      type: koi.type,
      pattern: koi.pattern ?? "",
      birthDate: koi.birthDate ?? "",
      gender: koi.gender,
      healthStatus: koi.healthStatus,
      origin: koi.origin ?? "",
      images: koi.images,
      videos: koi.videos,
      sellingPrice: koi.sellingPrice ?? 0,
      description: koi.description,
      isMutated: koi.isMutated ?? false,
      mutationDescription: koi.mutationDescription ?? "",
      // Field cần update
      saleStatus: SaleStatus.AVAILABLE,
    };

    updateFish(
      {
        id: koi.id,
        request: requestBody,
      },
      {
        onSuccess: () => {
          setSelectedKoiInAddDialog(null);
          setIsAddFishDialogOpen(false);
        },
        onSettled: () => {
          setIsAddingFishId(null);
        },
      },
    );
  };

  const handleRemoveFromSaleList = (koi: KoiFishResponse) => {
    setIsRemovingFishId(koi.id);

    const requestBody: KoiFishUpdateRequest = {
      rfid: koi.rfid,
      pondId: koi.pond.id,
      varietyId: koi.variety.id,
      breedingProcessId: koi.breedingProcess?.id ?? undefined,
      size: parseSizeToNumber(koi.size),
      type: koi.type,
      pattern: koi.pattern ?? "",
      birthDate: koi.birthDate ?? "",
      gender: koi.gender,
      healthStatus: koi.healthStatus,
      origin: koi.origin ?? "",
      images: koi.images,
      videos: koi.videos,
      sellingPrice: koi.sellingPrice ?? 0,
      description: koi.description,
      isMutated: koi.isMutated ?? false,
      mutationDescription: koi.mutationDescription ?? "",
      // Field cần update
      saleStatus: SaleStatus.NOT_FOR_SALE,
    };

    updateFish(
      {
        id: koi.id,
        request: requestBody,
      },
      {
        onSuccess: () => {
          setFishToRemove(null);
        },
        onSettled: () => {
          setIsRemovingFishId(null);
        },
      },
    );
  };

  const fishList = koiData?.data || [];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Quản lý cá bán
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý kho cá, giá bán và theo dõi tồn kho
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Dialog
            open={isAddFishDialogOpen}
            onOpenChange={setIsAddFishDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Thêm cá</span>
                <span className="hidden sm:inline">Thêm cá mới</span>
              </Button>
            </DialogTrigger>
            <AddFishDialog
              onSelectedKoiChange={setSelectedKoiInAddDialog}
              updatingFishId={isAddingFishId}
            />
          </Dialog>
        </div>
      </div>

      {/* Search and List */}
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
            <div className="relative border border-gray-300 rounded-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo RFID, giống..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
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
              <TabsTrigger value="available">Có sẵn</TabsTrigger>
              <TabsTrigger value="sold">Đã bán</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4 mt-6">
              {isLoading ? (
                <LoadingState message="Đang tải danh sách cá..." />
              ) : fishList.length === 0 ? (
                <EmptyState
                  icon={Fish}
                  title="Không tìm thấy cá"
                  description="Thử thay đổi từ khóa tìm kiếm của bạn."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {fishList.map((koi) => {
                      const saleStatusInfo = getSaleStatusLabel(koi.saleStatus);
                      const healthStatusInfo = getHealthStatusLabel(
                        koi.healthStatus,
                      );
                      const genderInfo = getGenderLabel(koi.gender);

                      return (
                        <Card
                          key={koi.id}
                          className="relative overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-0 bg-white p-0"
                        >
                          {/* Image Section with Gradient Overlay */}
                          <CardHeader
                            className="p-0 relative group cursor-pointer"
                            onClick={() => setSelectedKoi(koi)}
                          >
                            <div className="relative w-full h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                              <Image
                                src={koi.images[0] || "/placeholder.svg"}
                                alt={koi.rfid}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              {/* Status Badge on Image */}
                              <div className="absolute top-3 right-3">
                                <Badge
                                  className={`${saleStatusInfo.colorClass} shadow-md`}
                                >
                                  {saleStatusInfo.label}
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
                                  {koi.rfid}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                  {koi.variety.varietyName}
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
                                  <DropdownMenuItem
                                    onClick={() => setSelectedKoi(koi)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" /> Xem chi
                                    tiết
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setPedigreeKoi(koi);
                                      setIsPedigreeModalOpen(true);
                                    }}
                                  >
                                    <Network className="mr-2 h-4 w-4" /> Xem gia
                                    phả
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setFishToRemove(koi)}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa khỏi
                                    danh sách
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-md">
                                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Tuổi</p>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {formatKoiAge(koi.birthDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-md">
                                  <Ruler className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Kích thước
                                  </p>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {getFishSizeLabel(koi.size)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 rounded-md">
                                  <Package className="h-3.5 w-3.5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Giới tính
                                  </p>
                                  <p
                                    className={`font-semibold text-sm ${genderInfo.colorClass}`}
                                  >
                                    {genderInfo.label}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-100 rounded-md">
                                  <Tag className="h-3.5 w-3.5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Hoa văn
                                  </p>
                                  <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                    {koi.pattern || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Health Status */}
                            <div className="mb-4">
                              <Badge
                                variant="secondary"
                                className={`w-full justify-center py-2 text-sm font-semibold ${healthStatusInfo.colorClass}`}
                              >
                                Sức khỏe: {healthStatusInfo.label}
                              </Badge>
                            </div>

                            {/* Price Section */}
                            <div className="border-t pt-4 mt-auto bg-linear-to-r from-blue-50 to-blue-50/0 -mx-4 -mb-4 px-4 py-4 rounded-b-lg">
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Giá bán
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(koi.sellingPrice || 0)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {koiData && koiData.totalItems > 0 && (
                    <div className="mt-8">
                      <PaginationWithLinks
                        totalCount={koiData.totalItems}
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

            <TabsContent value="sold" className="space-y-4 mt-6">
              {isLoading ? (
                <LoadingState message="Đang tải danh sách cá..." />
              ) : fishList.length === 0 ? (
                <EmptyState
                  icon={Fish}
                  title="Không tìm thấy cá"
                  description="Thử thay đổi từ khóa tìm kiếm của bạn."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {fishList.map((koi) => {
                      const saleStatusInfo = getSaleStatusLabel(koi.saleStatus);
                      const healthStatusInfo = getHealthStatusLabel(
                        koi.healthStatus,
                      );
                      const genderInfo = getGenderLabel(koi.gender);

                      return (
                        <Card
                          key={koi.id}
                          className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                        >
                          {/* Header with Image and Status Badge */}
                          <CardHeader className="p-0 relative">
                            {koi.images && koi.images.length > 0 ? (
                              <Image
                                src={koi.images[0]}
                                alt={koi.rfid}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <Fish className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <Badge
                              className={`absolute top-2 right-2 ${saleStatusInfo.colorClass}`}
                            >
                              {saleStatusInfo.label}
                            </Badge>
                          </CardHeader>

                          {/* Card Content */}
                          <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                            {/* Title with More Menu */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg truncate">
                                  {koi.rfid}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm truncate">
                                  {koi.variety.varietyName}
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
                                  <DropdownMenuItem
                                    onClick={() => setSelectedKoi(koi)}
                                    className="text-sm cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setPedigreeKoi(koi);
                                      setIsPedigreeModalOpen(true);
                                    }}
                                    className="text-sm cursor-pointer"
                                  >
                                    <Network className="h-4 w-4 mr-2" />
                                    Xem gia phả
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-md">
                                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Tuổi</p>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {formatKoiAge(koi.birthDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-md">
                                  <Ruler className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Kích thước
                                  </p>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {getFishSizeLabel(koi.size)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 rounded-md">
                                  <Package className="h-3.5 w-3.5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Giới tính
                                  </p>
                                  <p
                                    className={`font-semibold text-sm ${genderInfo.colorClass}`}
                                  >
                                    {genderInfo.label}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-100 rounded-md">
                                  <Tag className="h-3.5 w-3.5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Hoa văn
                                  </p>
                                  <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                    {koi.pattern || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Health Status */}
                            <div className="mb-4">
                              <Badge
                                variant="secondary"
                                className={`w-full justify-center py-2 text-sm font-semibold ${healthStatusInfo.colorClass}`}
                              >
                                Sức khỏe: {healthStatusInfo.label}
                              </Badge>
                            </div>

                            {/* Selling Price */}
                            <div className="border-t pt-4 mt-auto">
                              <p className="text-xs font-medium text-gray-600">
                                Giá đã bán
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(koi.sellingPrice || 0)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {koiData && koiData.totalItems > 0 && (
                    <div className="mt-8">
                      <PaginationWithLinks
                        totalCount={koiData.totalItems}
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

      {/* Detail Dialog */}
      <KoiDetailDialog
        isOpen={!!selectedKoi}
        onOpenChange={(open) => !open && setSelectedKoi(null)}
        koi={selectedKoi}
        showPricingInfo={true}
      />

      {/* Detail Dialog for Add Fish Dialog */}
      <KoiDetailDialog
        isOpen={!!selectedKoiInAddDialog}
        onOpenChange={(open) => !open && setSelectedKoiInAddDialog(null)}
        koi={selectedKoiInAddDialog}
        showPricingInfo={false}
        onSelectFish={(koi) => {
          setSelectedKoiInAddDialog(null);
          handleAddFish(koi);
        }}
        onSelectLabel="Thêm vào danh sách bán"
        isSelectLoading={
          isAddingFishId === selectedKoiInAddDialog?.id && isUpdating
        }
      />

      {/* Remove from Sale List Confirmation Dialog */}
      <Dialog
        open={!!fishToRemove}
        onOpenChange={(open: boolean) => !open && setFishToRemove(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Xóa khỏi danh sách bán?
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Bạn có chắc muốn xóa{" "}
              <span className="font-semibold text-gray-900">
                {fishToRemove?.rfid}
              </span>{" "}
              khỏi danh sách cá bán? Cá sẽ được chuyển trạng thái về &quot;Không
              bán&quot;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setFishToRemove(null)}
              disabled={isRemovingFishId === fishToRemove?.id && isUpdating}
            >
              Hủy
            </Button>
            <Button
              onClick={() =>
                fishToRemove && handleRemoveFromSaleList(fishToRemove)
              }
              disabled={isRemovingFishId === fishToRemove?.id && isUpdating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRemovingFishId === fishToRemove?.id && isUpdating
                ? "Đang xóa..."
                : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pedigree Modal */}
      <PedigreeModal
        isOpen={isPedigreeModalOpen}
        onOpenChange={setIsPedigreeModalOpen}
        koi={pedigreeKoi}
      />
    </div>
  );
}
