"use client";

import { useRouter } from "next/navigation";
import { Eye, Trash2, Plus, Loader2, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useGetBreedingProcesses } from "@/hooks/useBreedingProcess";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import {
  BreedingProcessResponse,
  BreedingProcessSearchParams,
  BreedingResult,
  BreedingStatus,
} from "@/lib/api/services/fetchBreedingProcess";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import {
  getBreedingResultLabel,
  getBreedingStatusLabel,
} from "@/lib/utils/enum";
import { BreedingDetailDialog } from "./BreedingDetailDialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BreedingManagement() {
  const router = useRouter();

  // Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [breedingToDelete, setBreedingToDelete] =
    useState<BreedingProcessResponse>();

  // Detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBreeding, setSelectedBreeding] =
    useState<BreedingProcessResponse | null>(null);

  // Search & Debounce
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [minFishQualifiedInput, setMinFishQualifiedInput] =
    useState<string>("");
  const [maxFishQualifiedInput, setMaxFishQualifiedInput] =
    useState<string>("");
  const [minTotalPackageInput, setMinTotalPackageInput] = useState<string>("");
  const [maxTotalPackageInput, setMaxTotalPackageInput] = useState<string>("");
  const [startDateFromInput, setStartDateFromInput] = useState<string>("");
  const [startDateToInput, setStartDateToInput] = useState<string>("");
  const [endDateFromInput, setEndDateFromInput] = useState<string>("");
  const [endDateToInput, setEndDateToInput] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<BreedingStatus | string>(
    "all",
  );
  const [resultFilter, setResultFilter] = useState<BreedingResult | string>(
    "all",
  );
  const [maleKoiIdInput, setMaleKoiIdInput] = useState<string>("");
  const [femaleKoiIdInput, setFemaleKoiIdInput] = useState<string>("");
  const [pondIdInput, setPondIdInput] = useState<string>("");

  const [searchParams, setSearchParams] = useState<BreedingProcessSearchParams>(
    {
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
      status: undefined,
      result: undefined,
      minTotalFishQualified: undefined,
      maxTotalFishQualified: undefined,
      minTotalPackage: undefined,
      maxTotalPackage: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      endDateFrom: undefined,
      endDateTo: undefined,
      maleKoiId: undefined,
      femaleKoiId: undefined,
      pondId: undefined,
    },
  );

  const { data, isLoading } = useGetBreedingProcesses(searchParams);
  const breedingProcesses = data?.data || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleApplyFilters = () => {
    const minFishQualified = minFishQualifiedInput
      ? Number(minFishQualifiedInput)
      : undefined;
    const maxFishQualified = maxFishQualifiedInput
      ? Number(maxFishQualifiedInput)
      : undefined;
    const minPackage = minTotalPackageInput
      ? Number(minTotalPackageInput)
      : undefined;
    const maxPackage = maxTotalPackageInput
      ? Number(maxTotalPackageInput)
      : undefined;

    const maleKoiId = maleKoiIdInput ? Number(maleKoiIdInput) : undefined;
    const femaleKoiId = femaleKoiIdInput ? Number(femaleKoiIdInput) : undefined;
    const pondId = pondIdInput ? Number(pondIdInput) : undefined;

    const status =
      statusFilter !== "all" ? (statusFilter as BreedingStatus) : undefined;
    const result =
      resultFilter !== "all" ? (resultFilter as BreedingResult) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      minTotalFishQualified: minFishQualified,
      maxTotalFishQualified: maxFishQualified,
      minTotalPackage: minPackage,
      maxTotalPackage: maxPackage,
      startDateFrom: startDateFromInput || undefined,
      startDateTo: startDateToInput || undefined,
      endDateFrom: endDateFromInput || undefined,
      endDateTo: endDateToInput || undefined,
      status: status,
      result: result,
      maleKoiId: maleKoiId,
      femaleKoiId: femaleKoiId,
      pondId: pondId,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setMinFishQualifiedInput("");
    setMaxFishQualifiedInput("");
    setMinTotalPackageInput("");
    setMaxTotalPackageInput("");
    setStartDateFromInput("");
    setStartDateToInput("");
    setEndDateFromInput("");
    setEndDateToInput("");
    setStatusFilter("all");
    setResultFilter("all");
    setMaleKoiIdInput("");
    setFemaleKoiIdInput("");
    setPondIdInput("");

    setSearchParams((prev) => ({
      ...prev,
      minTotalFishQualified: undefined,
      maxTotalFishQualified: undefined,
      minTotalPackage: undefined,
      maxTotalPackage: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      endDateFrom: undefined,
      endDateTo: undefined,
      status: undefined,
      result: undefined,
      maleKoiId: undefined,
      femaleKoiId: undefined,
      pondId: undefined,
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

  const handleDelete = async () => {
    try {
      toast.success("Đã hủy đợt lai thành công");
      setIsDeleteModalOpen(false);
      setBreedingToDelete(undefined);
    } catch {
      toast.error("Hủy thất bại");
    }
  };

  const handleCreateBreeding = () => {
    router.push("/manager/breeding/new");
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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đợt lai</CardTitle>
          <CardDescription>
            Danh sách chi tiết các đợt lai cá hiện có
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo RFID cá bố/mẹ..."
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
            </div>
          ) : (
            <>
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%]">STT</TableHead>
                    <TableHead className="w-[10%]">Cá đực (RFID)</TableHead>
                    <TableHead className="w-[10%]">Cá cái (RFID)</TableHead>
                    <TableHead className="w-[20%]">Thời gian diễn ra</TableHead>
                    <TableHead className="w-[15%]">Giai đoạn</TableHead>
                    <TableHead className="w-[15%]">Kết quả</TableHead>
                    <TableHead className="w-[20%] text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {breedingProcesses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-gray-500 py-6"
                      >
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    breedingProcesses.map((process, index) => (
                      <TableRow key={process.id}>
                        <TableCell className="font-medium">
                          {index +
                            1 +
                            (searchParams.pageIndex - 1) *
                              searchParams.pageSize}
                        </TableCell>
                        <TableCell className="truncate">
                          {process.maleKoiRFID}
                        </TableCell>
                        <TableCell className="truncate">
                          {process.femaleKoiRFID}
                        </TableCell>
                        <TableCell>
                          {formatDate(
                            process.startDate,
                            DATE_FORMATS.MEDIUM_DATE,
                          )}{" "}
                          -{" "}
                          {formatDate(
                            process.endDate,
                            DATE_FORMATS.MEDIUM_DATE,
                          )}
                        </TableCell>

                        <TableCell>
                          {(() => {
                            const label = getBreedingStatusLabel(
                              process.status,
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
                          {(() => {
                            const label = getBreedingResultLabel(
                              process.result,
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
                        <TableCell className="text-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Chi tiết"
                            onClick={() => {
                              setSelectedBreeding(process);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            title="Hủy"
                            onClick={() => {
                              setBreedingToDelete(process);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <PaginationSection
                  totalItems={totalItems}
                  postsPerPage={searchParams.pageSize}
                  currentPage={searchParams.pageIndex}
                  setCurrentPage={handlePageChange}
                  totalPages={totalPages}
                  setPageSize={handlePageSizeChange}
                  hasNextPage={data?.hasNextPage}
                  hasPreviousPage={data?.hasPreviousPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isFilterModalOpen}
        onOpenChange={(open) => {
          setIsFilterModalOpen(open);
          if (!open) {
            setMinFishQualifiedInput(
              searchParams.minTotalFishQualified !== undefined
                ? String(searchParams.minTotalFishQualified)
                : "",
            );
            setMaxFishQualifiedInput(
              searchParams.maxTotalFishQualified !== undefined
                ? String(searchParams.maxTotalFishQualified)
                : "",
            );
            setMinTotalPackageInput(
              searchParams.minTotalPackage !== undefined
                ? String(searchParams.minTotalPackage)
                : "",
            );
            setMaxTotalPackageInput(
              searchParams.maxTotalPackage !== undefined
                ? String(searchParams.maxTotalPackage)
                : "",
            );
            setStartDateFromInput(searchParams.startDateFrom || "");
            setStartDateToInput(searchParams.startDateTo || "");
            setEndDateFromInput(searchParams.endDateFrom || "");
            setEndDateToInput(searchParams.endDateTo || "");
            setStatusFilter(searchParams.status || "all");
            setResultFilter(searchParams.result || "all");
            setMaleKoiIdInput(
              searchParams.maleKoiId !== undefined
                ? String(searchParams.maleKoiId)
                : "",
            );
            setFemaleKoiIdInput(
              searchParams.femaleKoiId !== undefined
                ? String(searchParams.femaleKoiId)
                : "",
            );
            setPondIdInput(
              searchParams.pondId !== undefined
                ? String(searchParams.pondId)
                : "",
            );
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc Đợt lai</DialogTitle>
            <DialogDescription>
              Lọc danh sách đợt lai theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maleId">ID Cá Đực</Label>
                <Input
                  id="maleId"
                  type="number"
                  placeholder="ID cá đực..."
                  value={maleKoiIdInput}
                  onChange={(e) => setMaleKoiIdInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="femaleId">ID Cá Cái</Label>
                <Input
                  id="femaleId"
                  type="number"
                  placeholder="ID cá cái..."
                  value={femaleKoiIdInput}
                  onChange={(e) => setFemaleKoiIdInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pondId">ID Hồ</Label>
                <Input
                  id="pondId"
                  type="number"
                  placeholder="ID hồ..."
                  value={pondIdInput}
                  onChange={(e) => setPondIdInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Giai đoạn</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giai đoạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.values(BreedingStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {getBreedingStatusLabel(s as BreedingStatus).label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Kết quả</Label>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kết quả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.values(BreedingResult).map((r) => (
                      <SelectItem key={r} value={r}>
                        {getBreedingResultLabel(r as BreedingResult).label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Số lượng cá Đạt chuẩn
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="minFish">Tối thiểu</Label>
                <Input
                  id="minFish"
                  type="number"
                  placeholder="Cá đạt chuẩn min"
                  value={minFishQualifiedInput}
                  onChange={(e) => setMinFishQualifiedInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="maxFish">Tối đa</Label>
                <Input
                  id="maxFish"
                  type="number"
                  placeholder="Cá đạt chuẩn max"
                  value={maxFishQualifiedInput}
                  onChange={(e) => setMaxFishQualifiedInput(e.target.value)}
                />
              </div>

              <p className="text-sm font-semibold col-span-full md:col-span-2 mb-[-8px] text-muted-foreground">
                Lọc theo Số gói (Package)
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="minPackage">Tối thiểu</Label>
                <Input
                  id="minPackage"
                  type="number"
                  placeholder="Gói min"
                  value={minTotalPackageInput}
                  onChange={(e) => setMinTotalPackageInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="maxPackage">Tối đa</Label>
                <Input
                  id="maxPackage"
                  type="number"
                  placeholder="Gói max"
                  value={maxTotalPackageInput}
                  onChange={(e) => setMaxTotalPackageInput(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Thời gian BẮT ĐẦU
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="startDateFrom">Từ ngày</Label>
                <Input
                  id="startDateFrom"
                  type="date"
                  value={startDateFromInput}
                  onChange={(e) => setStartDateFromInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="startDateTo">Đến ngày</Label>
                <Input
                  id="startDateTo"
                  type="date"
                  value={startDateToInput}
                  onChange={(e) => setStartDateToInput(e.target.value)}
                />
              </div>

              <p className="text-sm font-semibold col-span-full md:col-span-2 mb-[-8px] text-muted-foreground">
                Lọc theo Thời gian KẾT THÚC
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="endDateFrom">Từ ngày</Label>
                <Input
                  id="endDateFrom"
                  type="date"
                  value={endDateFromInput}
                  onChange={(e) => setEndDateFromInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="endDateTo">Đến ngày</Label>
                <Input
                  id="endDateTo"
                  type="date"
                  value={endDateToInput}
                  onChange={(e) => setEndDateToInput(e.target.value)}
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
      {/* KẾT THÚC DIALOG BỘ LỌC */}

      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đợt lai</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn hủy đợt lai{" "}
            <span className="font-semibold text-red-600">
              {breedingToDelete?.maleKoiRFID} -{" "}
              {breedingToDelete?.femaleKoiRFID}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Quay lại
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <BreedingDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        breedingProcess={selectedBreeding}
      />
    </div>
  );
}
