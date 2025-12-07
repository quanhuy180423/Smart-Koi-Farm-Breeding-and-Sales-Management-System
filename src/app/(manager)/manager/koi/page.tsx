"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Trash2,
  Eye,
  Edit,
  Loader2,
  Filter,
  Network,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  MoreHorizontal,
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
} from "@/components/ui/select";
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
  Gender,
  HealthStatus,
  KoiFishResponse,
  KoiFishSearchParams,
  SaleStatus,
} from "@/lib/api/services/fetchKoiFish";
import { useGetKoiFishes, useDeleteKoiFish } from "@/hooks/useKoiFish";
import formatCurrency from "@/lib/utils/numbers";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
import { formatKoiAge } from "@/lib/utils/dates/age";
import {
  getFishSizeLabel,
  getHealthStatusLabel,
  getGenderLabel,
} from "@/lib/utils/enum";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";
import PedigreeModal from "./components/PedigreeModal";
import { KoiDetailDialog } from "@/components/dialogs/KoiDetailDialog";
import { KoiIncidentHistoryDialog } from "@/components/dialogs/KoiIncidentHistoryDialog";
import { EditKoiModal } from "./components/EditKoiModal";
import PondSelectionDialog from "@/components/manager/PondSelectionDialog";
import VarietySelectionDialog from "@/components/manager/VarietySelectionDialog";

export default function KoiManagement() {
  const [selectedKoi, setSelectedKoi] = useState<KoiFishResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingKoi, setEditingKoi] = useState<KoiFishResponse | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isIncidentHistoryOpen, setIsIncidentHistoryOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [healthFilterInput, setHealthFilterInput] = useState<string>("all");
  const [genderFilterInput, setGenderFilterInput] = useState<string>("all");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [minSizeInput, setMinSizeInput] = useState<string>("");
  const [maxSizeInput, setMaxSizeInput] = useState<string>("");
  const [varietyIdInput, setVarietyIdInput] = useState<string>("");
  const [pondIdInput, setPondIdInput] = useState<string>("");
  const [originInput, setOriginInput] = useState<string>("");

  const [isPedigreeModalOpen, setIsPedigreeModalOpen] = useState(false);
  const [isVarietyDialogOpen, setIsVarietyDialogOpen] = useState(false);
  const [isPondDialogOpen, setIsPondDialogOpen] = useState(false);
  const [selectedVarietyName, setSelectedVarietyName] = useState<
    string | undefined
  >();
  const [selectedPondName, setSelectedPondName] = useState<
    string | undefined
  >();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteConfirmKoi, setDeleteConfirmKoi] =
    useState<KoiFishResponse | null>(null);

  const [searchParams, setSearchParams] = useState<KoiFishSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    health: undefined,
    gender: undefined,
    varietyId: undefined,
    minSize: undefined,
    maxSize: undefined,
    pondId: undefined,
    origin: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const { data: koiFishData, isLoading } = useGetKoiFishes(searchParams);
  const { mutate: deleteKoi, isPending: isDeletingKoi } = useDeleteKoiFish();
  const dataToDisplay: KoiFishResponse[] = koiFishData?.data || [];
  const totalItems = koiFishData?.totalItems || 0;

  const handleViewDetails = (koi: KoiFishResponse) => {
    setSelectedKoi(koi);
    setSelectedImageIdx(0);
    setIsDetailModalOpen(true);
  };

  const handlePrevImage = () => {
    if (selectedKoi && selectedKoi.images && selectedKoi.images.length > 0) {
      setSelectedImageIdx((prev) =>
        prev === 0 ? selectedKoi.images.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (selectedKoi && selectedKoi.images && selectedKoi.images.length > 0) {
      setSelectedImageIdx((prev) =>
        prev === selectedKoi.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const handleApplyFilters = () => {
    const health =
      healthFilterInput !== "all"
        ? (healthFilterInput as HealthStatus)
        : undefined;
    const gender =
      genderFilterInput !== "all" ? (genderFilterInput as Gender) : undefined;
    const minSize = minSizeInput ? Number(minSizeInput) : undefined;
    const maxSize = maxSizeInput ? Number(maxSizeInput) : undefined;
    const minPrice = minPriceInput ? Number(minPriceInput) : undefined;
    const maxPrice = maxPriceInput ? Number(maxPriceInput) : undefined;

    const varietyId = varietyIdInput ? Number(varietyIdInput) : undefined;
    const pondId = pondIdInput ? Number(pondIdInput) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      health: health,
      gender: gender,
      minSize: minSize,
      maxSize: maxSize,
      minPrice: minPrice,
      maxPrice: maxPrice,
      varietyId: varietyId,
      pondId: pondId,
      origin: originInput || undefined,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setHealthFilterInput("all");
    setGenderFilterInput("all");
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinSizeInput("");
    setMaxSizeInput("");
    setVarietyIdInput("");
    setPondIdInput("");
    setOriginInput("");

    setSearchParams((prev) => ({
      ...prev,
      health: undefined,
      gender: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minSize: undefined,
      maxSize: undefined,
      varietyId: undefined,
      pondId: undefined,
      origin: undefined,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: page,
    }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 1,
    }));
  };

  const handleViewPedigree = (koi: KoiFishResponse) => {
    setSelectedKoi(koi);
    setIsPedigreeModalOpen(true);
  };

  const handleViewIncidentHistory = (koi: KoiFishResponse) => {
    setSelectedKoi(koi);
    setIsIncidentHistoryOpen(true);
  };

  const handleEditKoi = (koi: KoiFishResponse) => {
    setEditingKoi(koi);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteConfirm = (koi: KoiFishResponse) => {
    setDeleteConfirmKoi(koi);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmKoi) {
      deleteKoi(deleteConfirmKoi.id);
      setIsDeleteConfirmOpen(false);
      setDeleteConfirmKoi(null);
    }
  };

  const canDeleteKoi = (koi: KoiFishResponse): boolean => {
    return (
      koi.saleStatus === SaleStatus.NOT_FOR_SALE ||
      koi.saleStatus === SaleStatus.AVAILABLE
    );
  };

  const handleSelectVariety = (varietyId: number, varietyName: string) => {
    setVarietyIdInput(String(varietyId));
    setSelectedVarietyName(varietyName);
    setIsVarietyDialogOpen(false);
  };

  const handleSelectPond = (pondId: number, pondName: string) => {
    setPondIdInput(String(pondId));
    setSelectedPondName(pondName);
    setIsPondDialogOpen(false);
  };

  const handleClearVariety = () => {
    setVarietyIdInput("");
    setSelectedVarietyName(undefined);
  };

  const handleClearPond = () => {
    setPondIdInput("");
    setSelectedPondName(undefined);
  };

  const isFilterActive = Object.keys(searchParams).some((key) => {
    const value = searchParams[key as keyof KoiFishSearchParams];
    return (
      key !== "search" &&
      key !== "pageIndex" &&
      key !== "pageSize" &&
      value !== undefined &&
      value !== null &&
      value !== "" &&
      String(value) !== "0"
    );
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý cá Koi</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và trạng thái của tất cả cá Koi trong trang trại
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách cá Koi</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết của từng con cá Koi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã cá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-400 pl-10"
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

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải dữ liệu...
              {/*  */}
            </div>
          ) : (
            <>
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">STT</TableHead>
                    <TableHead className="w-[12%]">RFID</TableHead>
                    <TableHead className="w-[13%]">Giống</TableHead>
                    <TableHead className="w-[5%]">Tuổi</TableHead>
                    <TableHead className="w-[10%]">Kích thước</TableHead>
                    <TableHead className="w-[15%]">Hồ</TableHead>
                    <TableHead className="w-[15%]">Sức khỏe</TableHead>
                    <TableHead className="w-[15%]">Giá bán (VNĐ)</TableHead>
                    <TableHead className="w-[10%] text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataToDisplay.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted-foreground"
                      >
                        Không tìm thấy dữ liệu cá Koi nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataToDisplay.map((koi, index) => (
                      <TableRow key={koi.id}>
                        <TableCell className="font-medium truncate">
                          {index +
                            1 +
                            (searchParams.pageIndex - 1) *
                              searchParams.pageSize}
                        </TableCell>
                        <TableCell className="font-medium truncate">
                          {koi.rfid}
                        </TableCell>
                        <TableCell className="truncate">
                          {koi.variety.varietyName}
                        </TableCell>
                        <TableCell>{formatKoiAge(koi.birthDate)}</TableCell>
                        <TableCell>{getFishSizeLabel(koi.size)}</TableCell>
                        <TableCell className="truncate">
                          {koi.pond.pondName}
                        </TableCell>
                        <TableCell className="truncate">
                          {(() => {
                            const label = getHealthStatusLabel(
                              koi.healthStatus,
                            );
                            return (
                              <Badge
                                className={`font-semibold ${label.colorClass}`}
                              >
                                {label.label}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="truncate">
                          {formatCurrency(koi.sellingPrice || 0)}
                        </TableCell>
                        <TableCell className="truncate text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Hành động"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(koi)}
                                className="hover:bg-primary hover:text-white cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4 hover:text-white" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewPedigree(koi)}
                                className="hover:bg-primary hover:text-white cursor-pointer"
                              >
                                <Network className="mr-2 h-4 w-4 hover:text-white" />
                                Xem gia phả
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditKoi(koi)}
                                className="hover:bg-primary hover:text-white cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4 hover:text-white" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewIncidentHistory(koi)}
                                className="hover:bg-primary hover:text-white cursor-pointer"
                              >
                                <AlertCircle className="mr-2 h-4 w-4 hover:text-white" />
                                Xem lịch sử sự cố
                              </DropdownMenuItem>
                              {canDeleteKoi(koi) && (
                                <DropdownMenuItem
                                  onClick={() => handleOpenDeleteConfirm(koi)}
                                  className="text-red-600 hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4 hover:text-white" />
                                  Xóa
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <PaginationWithLinks
                  totalCount={totalItems}
                  pageSize={searchParams.pageSize}
                  page={searchParams.pageIndex}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <KoiDetailDialog
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        koi={selectedKoi}
        showPricingInfo={true}
      />

      {/* Image Viewer Modal */}
      {isImageViewerOpen && selectedKoi && selectedKoi.images && (
        <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 border-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white z-10">
              <div>
                <DialogTitle className="text-lg">
                  {selectedKoi.rfid} - Ảnh số {selectedImageIdx + 1} /{" "}
                  {selectedKoi.images.length}
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsImageViewerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Container */}
            <div className="flex-1 w-full h-auto flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
              <Image
                src={selectedKoi.images[selectedImageIdx]}
                alt={`${selectedKoi.rfid} - Ảnh ${selectedImageIdx + 1}`}
                width={1000}
                height={800}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
                priority
                unoptimized
              />
            </div>

            {/* Navigation Footer */}
            {selectedKoi.images.length > 1 && (
              <div className="flex items-center justify-between gap-4 p-4 border-t bg-gray-50">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevImage}
                  disabled={selectedKoi.images.length === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2 overflow-x-auto">
                  {selectedKoi.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImageIdx === idx
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextImage}
                  disabled={selectedKoi.images.length === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      <PedigreeModal
        isOpen={isPedigreeModalOpen}
        onOpenChange={setIsPedigreeModalOpen}
        koi={selectedKoi}
      />

      {/* Incident History Dialog */}
      {selectedKoi && (
        <KoiIncidentHistoryDialog
          isOpen={isIncidentHistoryOpen}
          onOpenChange={setIsIncidentHistoryOpen}
          koiFishId={selectedKoi.id}
          koiFishRFID={selectedKoi.rfid}
        />
      )}

      {/* Variety Selection Dialog */}
      <VarietySelectionDialog
        isOpen={isVarietyDialogOpen}
        onOpenChange={setIsVarietyDialogOpen}
        onSelect={handleSelectVariety}
      />

      {/* Pond Selection Dialog */}
      <PondSelectionDialog
        isOpen={isPondDialogOpen}
        onOpenChange={setIsPondDialogOpen}
        onSelect={handleSelectPond}
      />

      <Dialog
        open={isFilterModalOpen}
        onOpenChange={(open) => {
          setIsFilterModalOpen(open);
          if (!open) {
            setHealthFilterInput(searchParams.health || "all");
            setGenderFilterInput(searchParams.gender || "all");
            setMinSizeInput(
              searchParams.minSize !== undefined
                ? String(searchParams.minSize)
                : "",
            );
            setMaxSizeInput(
              searchParams.maxSize !== undefined
                ? String(searchParams.maxSize)
                : "",
            );
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
            setVarietyIdInput(
              searchParams.varietyId !== undefined
                ? String(searchParams.varietyId)
                : "",
            );
            setPondIdInput(
              searchParams.pondId !== undefined
                ? String(searchParams.pondId)
                : "",
            );
            setOriginInput(searchParams.origin || "");
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc Cá Koi</DialogTitle>
            <DialogDescription>
              Lọc danh sách cá Koi theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="healthStatus">Sức khỏe</Label>
                <Select
                  value={healthFilterInput}
                  onValueChange={setHealthFilterInput}
                >
                  <SelectTrigger>
                    <span className="flex items-center gap-2 w-full">
                      {healthFilterInput === "all"
                        ? "Chọn trạng thái"
                        : getHealthStatusLabel(
                            healthFilterInput as HealthStatus,
                          ).label}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.values(HealthStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {getHealthStatusLabel(s).label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={genderFilterInput}
                  onValueChange={setGenderFilterInput}
                >
                  <SelectTrigger>
                    <span className="flex items-center gap-2">
                      {genderFilterInput === "all"
                        ? "Chọn giới tính"
                        : getGenderLabel(genderFilterInput as Gender).label}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value={Gender.MALE}>Đực</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Cái</SelectItem>
                    <SelectItem value={Gender.UNKNOWN}>Không rõ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Kích thước (cm)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <InputNumber
                    value={minSizeInput ? Number(minSizeInput) : undefined}
                    onChange={(value) =>
                      setMinSizeInput(value ? String(value) : "")
                    }
                    placeholder="Kích thước tối thiểu"
                  />
                  <InputNumber
                    value={maxSizeInput ? Number(maxSizeInput) : undefined}
                    onChange={(value) =>
                      setMaxSizeInput(value ? String(value) : "")
                    }
                    placeholder="Kích thước tối đa"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Xuất xứ</Label>
                <Input
                  id="origin"
                  placeholder="Nhập xuất xứ..."
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Giống cá</Label>
                <Button
                  variant="outline"
                  onClick={() => setIsVarietyDialogOpen(true)}
                  className="w-full justify-start text-left"
                >
                  {selectedVarietyName ? (
                    <span className="flex items-center justify-between w-full">
                      <span>{selectedVarietyName}</span>
                      <X
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearVariety();
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Chọn giống cá</span>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Hồ cá</Label>
                <Button
                  variant="outline"
                  onClick={() => setIsPondDialogOpen(true)}
                  className="w-full justify-start text-left"
                >
                  {selectedPondName ? (
                    <span className="flex items-center justify-between w-full">
                      <span>{selectedPondName}</span>
                      <X
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearPond();
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Chọn hồ cá</span>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Giá bán (VNĐ)
              </p>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="minPrice">Giá tối thiểu</Label>
                <InputNumber
                  value={minPriceInput ? Number(minPriceInput) : undefined}
                  onChange={(value) =>
                    setMinPriceInput(value ? String(value) : "")
                  }
                  placeholder="Giá thấp nhất"
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="maxPrice">Giá tối đa</Label>
                <InputNumber
                  value={maxPriceInput ? Number(maxPriceInput) : undefined}
                  onChange={(value) =>
                    setMaxPriceInput(value ? String(value) : "")
                  }
                  placeholder="Giá cao nhất"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Koi Modal */}
      <EditKoiModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        koi={editingKoi}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa cá Koi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cá Koi này? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          {deleteConfirmKoi && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">RFID:</span>{" "}
                {deleteConfirmKoi.rfid}
              </p>
              <p>
                <span className="font-semibold">Giống:</span>{" "}
                {deleteConfirmKoi.variety.varietyName}
              </p>
              <p>
                <span className="font-semibold">Hồ:</span>{" "}
                {deleteConfirmKoi.pond.pondName}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setDeleteConfirmKoi(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeletingKoi}
            >
              {isDeletingKoi ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
