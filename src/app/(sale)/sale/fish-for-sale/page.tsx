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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
  Edit,
  Package,
  Tag,
  Ruler,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import {
  KoiFishSearchParams,
  SaleStatus,
} from "@/lib/api/services/fetchKoiFish";
import { useDebounce } from "@/hooks/useDebounce";
import getAge from "@/lib/utils/dates/age";
import {
  getFishSizeLabel,
  getGenderLabel,
  getHealthStatusLabel,
  getSaleStatusLabel,
} from "@/lib/utils/enum";
import { PaginationSection } from "@/components/common/PaginationSection";
import Image from "next/image";
import { AddFishDialog } from "./AddFishDialog";
import { KoiDetailDialog } from "@/components/dialogs/KoiDetailDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";

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
  const { data: koiData, isLoading } = useGetKoiFishes(searchParams);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const fishList = koiData?.data || [];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
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
            <AddFishDialog onClose={() => setIsAddFishDialogOpen(false)} />
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
                      className="relative overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <CardHeader className="p-0">
                        <div className="relative w-full h-48">
                          <Image
                            src={koi.images[0] || "/placeholder.svg"}
                            alt={koi.rfid}
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="p-3 sm:p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg line-clamp-1">
                              {koi.rfid}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {koi.variety.varietyName}
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
                              <DropdownMenuItem
                                onClick={() => setSelectedKoi(koi)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                              {getAge(koi.birthDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                              {getFishSizeLabel(koi.size)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-muted-foreground" />
                            <span
                              className={`font-medium ${genderInfo.colorClass}`}
                            >
                              {genderInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-xs">
                              {koi.patternType || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-auto">
                          <Badge
                            variant="secondary"
                            className={`text-xs justify-center ${saleStatusInfo.colorClass}`}
                          >
                            {saleStatusInfo.label}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs justify-center bg-muted/50 text-muted-foreground"
                          >
                            Sức khỏe:{" "}
                            <span
                              className={`font-semibold ml-1 ${healthStatusInfo.colorClass}`}
                            >
                              {healthStatusInfo.label}
                            </span>
                          </Badge>
                        </div>

                        <div className="border-t pt-3 mt-3">
                          <span className="text-sm text-muted-foreground">
                            Giá bán
                          </span>
                          <p className="font-bold text-lg text-primary">
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
                  <PaginationSection
                    currentPage={searchParams.pageIndex}
                    setCurrentPage={handlePageChange}
                    totalItems={koiData.totalItems}
                    postsPerPage={searchParams.pageSize}
                    setPageSize={handlePageSizeChange}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    hasNextPage={koiData.hasNextPage}
                    hasPreviousPage={koiData.hasPreviousPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <KoiDetailDialog
        isOpen={!!selectedKoi}
        onOpenChange={(open) => !open && setSelectedKoi(null)}
        koi={selectedKoi}
        showPricingInfo={true}
      />
    </div>
  );
}
