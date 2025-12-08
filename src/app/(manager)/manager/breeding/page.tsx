"use client";

import { useRouter } from "next/navigation";
import { Eye, X, Plus, Loader2, Search, Filter } from "lucide-react";
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
import {
  useCancelBreeding,
  useGetBreedingProcesses,
} from "@/hooks/useBreedingProcess";
import { useCompleteClassification } from "@/hooks/useClassificationStage";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
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
import { InputNumber } from "@/components/ui/input-number";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerFilter } from "@/components/ui/DatePickerFilter";
import { Textarea } from "@/components/ui/textarea";
import KoiFishSelectionDialogForBreeding from "@/components/manager/KoiFishSelectionDialogForBreeding";
import PondSelectionDialog from "@/components/manager/PondSelectionDialog";

export default function BreedingManagement() {
  const router = useRouter();

  // Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [breedingToDelete, setBreedingToDelete] =
    useState<BreedingProcessResponse>();
  const [cancelNote, setCancelNote] = useState<string>("");

  // Complete Classification
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [breedingToComplete, setBreedingToComplete] =
    useState<BreedingProcessResponse | null>(null);

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
  const [codeInput, setCodeInput] = useState<string>("");
  const [minTotalEggsInput, setMinTotalEggsInput] = useState<string>("");
  const [maxTotalEggsInput, setMaxTotalEggsInput] = useState<string>("");
  const [fertilizationRateRange, setFertilizationRateRange] = useState<
    [number, number]
  >([0, 100]);
  const [survivalRateRange, setSurvivalRateRange] = useState<[number, number]>([
    0, 100,
  ]);

  const [isMaleDialogOpen, setIsMaleDialogOpen] = useState(false);
  const [isFemaleDialogOpen, setIsFemaleDialogOpen] = useState(false);
  const [isPondDialogOpen, setIsPondDialogOpen] = useState(false);
  const [selectedMaleName, setSelectedMaleName] = useState<
    string | undefined
  >();
  const [selectedFemaleName, setSelectedFemaleName] = useState<
    string | undefined
  >();
  const [selectedPondName, setSelectedPondName] = useState<
    string | undefined
  >();

  const [searchParams, setSearchParams] = useState<BreedingProcessSearchParams>(
    {
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
      code: undefined,
      status: undefined,
      result: undefined,
      minTotalFishQualified: undefined,
      maxTotalFishQualified: undefined,
      minTotalPackage: undefined,
      maxTotalPackage: undefined,
      minTotalEggs: undefined,
      maxTotalEggs: undefined,
      minFertilizationRate: undefined,
      maxFertilizationRate: undefined,
      minCurrentSurvivalRate: undefined,
      maxCurrentSurvivalRate: undefined,
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
  const { mutateAsync: cancelBreedingAsync } = useCancelBreeding();
  const { mutate: completeClassification, isPending: isCompleting } =
    useCompleteClassification();
  const breedingProcesses = data?.data || [];
  const totalItems = data?.totalItems || 0;

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleSelectMale = (fishId: number, fishName: string) => {
    setMaleKoiIdInput(String(fishId));
    setSelectedMaleName(fishName);
    setIsMaleDialogOpen(false);
  };

  const handleSelectFemale = (fishId: number, fishName: string) => {
    setFemaleKoiIdInput(String(fishId));
    setSelectedFemaleName(fishName);
    setIsFemaleDialogOpen(false);
  };

  const handleSelectPond = (pondId: number, pondName: string) => {
    setPondIdInput(String(pondId));
    setSelectedPondName(pondName);
    setIsPondDialogOpen(false);
  };

  const handleClearMale = () => {
    setMaleKoiIdInput("");
    setSelectedMaleName(undefined);
  };

  const handleClearFemale = () => {
    setFemaleKoiIdInput("");
    setSelectedFemaleName(undefined);
  };

  const handleClearPond = () => {
    setPondIdInput("");
    setSelectedPondName(undefined);
  };

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
    const minTotalEggs = minTotalEggsInput
      ? Number(minTotalEggsInput)
      : undefined;
    const maxTotalEggs = maxTotalEggsInput
      ? Number(maxTotalEggsInput)
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
      code: codeInput || undefined,
      minTotalFishQualified: minFishQualified,
      maxTotalFishQualified: maxFishQualified,
      minTotalPackage: minPackage,
      maxTotalPackage: maxPackage,
      minTotalEggs: minTotalEggs,
      maxTotalEggs: maxTotalEggs,
      minFertilizationRate: fertilizationRateRange[0],
      maxFertilizationRate: fertilizationRateRange[1],
      minCurrentSurvivalRate: survivalRateRange[0],
      maxCurrentSurvivalRate: survivalRateRange[1],
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
    setSelectedMaleName(undefined);
    setSelectedFemaleName(undefined);
    setSelectedPondName(undefined);
    setCodeInput("");
    setMinTotalEggsInput("");
    setMaxTotalEggsInput("");
    setFertilizationRateRange([0, 100]);
    setSurvivalRateRange([0, 100]);

    setSearchParams((prev) => ({
      ...prev,
      code: undefined,
      minTotalFishQualified: undefined,
      maxTotalFishQualified: undefined,
      minTotalPackage: undefined,
      maxTotalPackage: undefined,
      minTotalEggs: undefined,
      maxTotalEggs: undefined,
      minFertilizationRate: undefined,
      maxFertilizationRate: undefined,
      minCurrentSurvivalRate: undefined,
      maxCurrentSurvivalRate: undefined,
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
    if (!breedingToDelete?.id) return;

    try {
      await cancelBreedingAsync({ id: breedingToDelete.id, note: cancelNote });
      setIsDeleteModalOpen(false);
      setBreedingToDelete(undefined);
      setCancelNote("");
    } catch {}
  };

  const handleCompleteClassification = () => {
    if (!breedingToComplete?.id) return;

    completeClassification(breedingToComplete.id, {
      onSuccess: () => {
        setIsCompleteModalOpen(false);
        setBreedingToComplete(null);
      },
    });
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
          <CardTitle>Danh sách đợt sinh sản</CardTitle>
          <CardDescription>
            Danh sách chi tiết các đợt lai cá hiện có
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative grow">
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
                    <TableHead className="w-[15%]">Cá đực (RFID)</TableHead>
                    <TableHead className="w-[15%]">Cá cái (RFID)</TableHead>
                    <TableHead className="w-[20%]">Thời gian diễn ra</TableHead>
                    <TableHead className="w-[15%]">Giai đoạn</TableHead>
                    <TableHead className="w-[15%]">Kết quả</TableHead>
                    <TableHead className="w-[10%] text-center">
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
                          {process.endDate
                            ? formatDate(
                                process.endDate,
                                DATE_FORMATS.MEDIUM_DATE,
                              )
                            : "Chưa xác định"}
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
                        <TableCell className="text-center grid grid-cols-3 gap-1">
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

                          {process.status === BreedingStatus.CLASSIFICATION && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600"
                              title="Hoàn thành"
                              onClick={() => {
                                setBreedingToComplete(process);
                                setIsCompleteModalOpen(true);
                              }}
                            >
                              ✓
                            </Button>
                          )}

                          {process.status !== BreedingStatus.COMPLETE &&
                            process.status !== BreedingStatus.FAILED && (
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
                                <X className="h-4 w-4" />
                              </Button>
                            )}
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
            setMinTotalEggsInput(
              searchParams.minTotalEggs !== undefined
                ? String(searchParams.minTotalEggs)
                : "",
            );
            setMaxTotalEggsInput(
              searchParams.maxTotalEggs !== undefined
                ? String(searchParams.maxTotalEggs)
                : "",
            );
            setFertilizationRateRange([
              searchParams.minFertilizationRate ?? 0,
              searchParams.maxFertilizationRate ?? 100,
            ]);
            setSurvivalRateRange([
              searchParams.minCurrentSurvivalRate ?? 0,
              searchParams.maxCurrentSurvivalRate ?? 100,
            ]);
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
            setCodeInput(searchParams.code || "");
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bộ lọc Đợt lai</DialogTitle>
            <DialogDescription>
              Lọc danh sách đợt sinh sản theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maleId">Cá Đực</Label>
                <Button
                  variant="outline"
                  onClick={() => setIsMaleDialogOpen(true)}
                  className="w-full justify-start text-left"
                >
                  {selectedMaleName ? (
                    <span className="flex items-center justify-between w-full">
                      <span>{selectedMaleName}</span>
                      <X
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearMale();
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Chọn cá đực</span>
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="femaleId">Cá Cái</Label>
                <Button
                  variant="outline"
                  onClick={() => setIsFemaleDialogOpen(true)}
                  className="w-full justify-start text-left"
                >
                  {selectedFemaleName ? (
                    <span className="flex items-center justify-between w-full">
                      <span>{selectedFemaleName}</span>
                      <X
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearFemale();
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Chọn cá cái</span>
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pondId">Hồ cá</Label>
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

              <div className="space-y-2">
                <Label htmlFor="code">Mã Chu Kỳ</Label>
                <Input
                  id="code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="BP-001..."
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

            <div className="grid grid-cols-2 gap-3 border-t pt-3">
              <p className="text-sm font-semibold col-span-full -mb-1.5 text-muted-foreground">
                Lọc theo Số lượng cá Đạt chuẩn
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="minFish">Tối thiểu</Label>
                <InputNumber
                  value={
                    minFishQualifiedInput
                      ? Number(minFishQualifiedInput)
                      : undefined
                  }
                  onChange={(value) =>
                    setMinFishQualifiedInput(value ? String(value) : "")
                  }
                  placeholder="Cá đạt chuẩn min"
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="maxFish">Tối đa</Label>
                <InputNumber
                  value={
                    maxFishQualifiedInput
                      ? Number(maxFishQualifiedInput)
                      : undefined
                  }
                  onChange={(value) =>
                    setMaxFishQualifiedInput(value ? String(value) : "")
                  }
                  placeholder="Cá đạt chuẩn max"
                />
              </div>

              <p className="text-sm font-semibold col-span-full md:col-span-2 -mb-1.5 text-muted-foreground">
                Lọc theo Số gói (Package)
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="minPackage">Tối thiểu</Label>
                <InputNumber
                  value={
                    minTotalPackageInput
                      ? Number(minTotalPackageInput)
                      : undefined
                  }
                  onChange={(value) =>
                    setMinTotalPackageInput(value ? String(value) : "")
                  }
                  placeholder="Gói min"
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="maxPackage">Tối đa</Label>
                <InputNumber
                  value={
                    maxTotalPackageInput
                      ? Number(maxTotalPackageInput)
                      : undefined
                  }
                  onChange={(value) =>
                    setMaxTotalPackageInput(value ? String(value) : "")
                  }
                  placeholder="Gói max"
                />
              </div>

              <p className="text-sm font-semibold col-span-full md:col-span-2 -mb-1.5 text-muted-foreground">
                Lọc theo Số trứng
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="minTotalEggs">Tối thiểu</Label>
                <InputNumber
                  value={
                    minTotalEggsInput ? Number(minTotalEggsInput) : undefined
                  }
                  onChange={(value) =>
                    setMinTotalEggsInput(value ? String(value) : "")
                  }
                  placeholder="Min"
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="maxTotalEggs">Tối đa</Label>
                <InputNumber
                  value={
                    maxTotalEggsInput ? Number(maxTotalEggsInput) : undefined
                  }
                  onChange={(value) =>
                    setMaxTotalEggsInput(value ? String(value) : "")
                  }
                  placeholder="Max"
                />
              </div>

              <div className="space-y-2 col-span-full md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label>Tỷ lệ thụ tinh (%)</Label>
                  <span className="text-sm text-muted-foreground font-medium">
                    {fertilizationRateRange[0]}% - {fertilizationRateRange[1]}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={fertilizationRateRange}
                  onValueChange={(value) =>
                    setFertilizationRateRange([value[0], value[1]])
                  }
                />
              </div>

              <div className="space-y-2 col-span-full md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label>Tỷ lệ sống sót (%)</Label>
                  <span className="text-sm text-muted-foreground font-medium">
                    {survivalRateRange[0]}% - {survivalRateRange[1]}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={survivalRateRange}
                  onValueChange={(value) =>
                    setSurvivalRateRange([value[0], value[1]])
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t pt-3">
              <p className="text-sm font-semibold col-span-full -mb-1.5 text-muted-foreground">
                Lọc theo Thời gian BẮT ĐẦU
              </p>
              <DatePickerFilter
                label="Từ ngày"
                value={startDateFromInput}
                onChange={setStartDateFromInput}
              />
              <DatePickerFilter
                label="Đến ngày"
                value={startDateToInput}
                onChange={setStartDateToInput}
              />

              <p className="text-sm font-semibold col-span-full md:col-span-2 -mb-1.5 text-muted-foreground">
                Lọc theo Thời gian KẾT THÚC
              </p>
              <DatePickerFilter
                label="Từ ngày"
                value={endDateFromInput}
                onChange={setEndDateFromInput}
              />
              <DatePickerFilter
                label="Đến ngày"
                value={endDateToInput}
                onChange={setEndDateToInput}
              />
            </div>
          </div>
          <DialogFooter className="mt-3 flex justify-between sm:justify-between sticky bottom-0 bg-white pt-2 border-t">
            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Male Fish Selection Dialog */}
      <KoiFishSelectionDialogForBreeding
        isOpen={isMaleDialogOpen}
        onOpenChange={setIsMaleDialogOpen}
        onSelect={handleSelectMale}
        title="Chọn Cá Đực"
        description="Chọn cá đực để lọc danh sách đợt sinh sản"
      />

      {/* Female Fish Selection Dialog */}
      <KoiFishSelectionDialogForBreeding
        isOpen={isFemaleDialogOpen}
        onOpenChange={setIsFemaleDialogOpen}
        onSelect={handleSelectFemale}
        title="Chọn Cá Cái"
        description="Chọn cá cái để lọc danh sách đợt sinh sản"
      />

      {/* Pond Selection Dialog */}
      <PondSelectionDialog
        isOpen={isPondDialogOpen}
        onOpenChange={setIsPondDialogOpen}
        onSelect={handleSelectPond}
      />

      {/* Confirm Complete Classification Dialog */}
      <Dialog open={isCompleteModalOpen} onOpenChange={setIsCompleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận hoàn thành phân loại</DialogTitle>
            <DialogDescription>
              Đánh dấu đợt lai này đã hoàn thành giai đoạn phân loại.
            </DialogDescription>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn hoàn thành phân loại cho đợt lai{" "}
            <span className="font-semibold text-green-600">
              {breedingToComplete?.maleKoiRFID} -{" "}
              {breedingToComplete?.femaleKoiRFID}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsCompleteModalOpen(false)}
              disabled={isCompleting}
            >
              Hủy
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleCompleteClassification}
              disabled={isCompleting}
            >
              {isCompleting ? "Đang xử lý..." : "Hoàn thành"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setTimeout(() => {
              setBreedingToDelete(undefined);
              setCancelNote("");
            }, 100);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đợt lai</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Bạn có chắc chắn muốn hủy đợt lai{" "}
              <span className="font-semibold text-red-600">
                {breedingToDelete?.maleKoiRFID} -{" "}
                {breedingToDelete?.femaleKoiRFID}
              </span>
              ?
            </p>
            <div className="space-y-2">
              <Label htmlFor="cancelNote">
                Ghi chú lý do hủy <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="cancelNote"
                placeholder="Nhập lý do hủy đợt lai..."
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Quay lại
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={!cancelNote.trim()}
            >
              Hủy đợt lai
            </Button>
          </DialogFooter>
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
