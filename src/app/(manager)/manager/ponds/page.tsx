"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Loader2, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formatDate } from "@/lib/utils/dates";
import {
  PondResponse,
  PondStatus,
  PondSearchParams,
  PondRequest,
} from "@/lib/api/services/fetchPond";
import {
  useGetPonds,
  useAddPond,
  useUpdatePond,
  useDeletePond,
} from "@/hooks/usePond";
import { AreaResponse } from "@/lib/api/services/fetchArea";
import { useGetAreas } from "@/hooks/useArea";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import { getPondStatusLabel } from "@/lib/utils/enum";
import PondStats from "./PondStats";
import AreaSelectionDialog from "./AreaSelectionDialog";
import PondDetailModal from "./PondDetailModal";
import AddPondModal from "./AddPondModal";
import EditPondModal from "./EditPondModal";
import { useGetPondTypes } from "@/hooks/usePondType";
import { PondTypeResponse } from "@/lib/api/services/fetchPondType";
import PondTypeSelectionDialog from "./PondTypeSelectionDialog";
import DeletePondConfirmDialog from "./DeletePondConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export interface PondFormState {
  pondName: string;
  location: string;
  capacityLiters: string;
  depthMeters: string;
  lengthMeters: string;
  widthMeters: string;
  areaId: string;
  pondTypeId: string;
  pondStatus?: PondStatus;
}

export default function PondManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedPond, setSelectedPond] = useState<PondResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPond, setEditingPond] = useState<PondResponse | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pondToDelete, setPondToDelete] = useState<PondResponse | null>(null);

  const [isAreaSelectionOpen, setIsAreaSelectionOpen] = useState(false);
  const [currentAreaSelectionContext, setCurrentAreaSelectionContext] =
    useState<"new" | "edit" | null>(null);

  const [isPondTypeSelectionOpen, setIsPondTypeSelectionOpen] = useState(false);
  const [currentPondTypeSelectionContext, setCurrentPondTypeSelectionContext] =
    useState<"new" | "edit" | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [areaIdInput, setAreaIdInput] = useState<string>("");
  const [pondTypeIdInput, setPondTypeIdInput] = useState<string>("");
  const [minCapacityInput, setMinCapacityInput] = useState<string>("");
  const [maxCapacityInput, setMaxCapacityInput] = useState<string>("");
  const [minDepthInput, setMinDepthInput] = useState<string>("");
  const [maxDepthInput, setMaxDepthInput] = useState<string>("");
  const [createdFromInput, setCreatedFromInput] = useState<string>("");
  const [createdToInput, setCreatedToInput] = useState<string>("");

  const [searchParams, setSearchParams] = useState<PondSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    status: undefined,
    areaId: undefined,
    pondTypeId: undefined,
    minCapacityLiters: undefined,
    maxCapacityLiters: undefined,
    minDepthMeters: undefined,
    maxDepthMeters: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  });

  const allAreaSearchParams = useMemo(
    () => ({
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
    }),
    [],
  );

  const allPondTypeSearchParams = useMemo(
    () => ({
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
    }),
    [],
  );

  const { data: areasData } = useGetAreas(allAreaSearchParams);
  const availableAreas: AreaResponse[] = areasData?.data || [];

  const { data: pondTypesData } = useGetPondTypes(allPondTypeSearchParams);
  const availablePondTypes: PondTypeResponse[] = pondTypesData?.data || [];

  const getAreaNameById = (id: string | number | undefined) => {
    const area = availableAreas.find((a) => String(a.id) === String(id));
    return area ? area.areaName : id ? `ID: ${id}` : "Không xác định";
  };

  const getPondTypeNameById = (id: string | number | undefined) => {
    const type = availablePondTypes.find((t) => String(t.id) === String(id));
    return type ? type.typeName : id ? `ID: ${id}` : "Không xác định";
  };

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const { data: pondsData, isLoading } = useGetPonds(searchParams);

  const ponds: PondResponse[] = pondsData?.data || [];
  const totalCount = pondsData?.totalItems || 0;
  const totalPages = pondsData?.totalPages || 0;

  const addPondMutation = useAddPond();
  const updatePondMutation = useUpdatePond();
  const deletePondMutation = useDeletePond();

  const [newPond, setNewPond] = useState<PondFormState>({
    pondName: "",
    location: "",
    capacityLiters: "",
    depthMeters: "",
    lengthMeters: "",
    widthMeters: "",
    areaId: availableAreas.length > 0 ? String(availableAreas[0].id) : "",
    pondTypeId:
      availablePondTypes.length > 0 ? String(availablePondTypes[0].id) : "",
    pondStatus: PondStatus.EMPTY,
  });
  const [editPondForm, setEditPondForm] = useState<PondFormState>({
    pondName: "",
    location: "",
    capacityLiters: "",
    depthMeters: "",
    lengthMeters: "",
    widthMeters: "",
    areaId: "",
    pondTypeId: "",
    pondStatus: PondStatus.ACTIVE,
  });

  const handleSetCurrentPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleSetPageSize = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: 1, pageSize: size }));
  };

  const handleViewDetails = (pond: PondResponse) => {
    setSelectedPond(pond);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setNewPond({
      pondName: "",
      location: "",
      capacityLiters: "",
      depthMeters: "",
      lengthMeters: "",
      widthMeters: "",
      areaId: availableAreas.length > 0 ? String(availableAreas[0].id) : "",
      pondTypeId:
        availablePondTypes.length > 0 ? String(availablePondTypes[0].id) : "",
      pondStatus: PondStatus.EMPTY,
    });
    setIsAddModalOpen(true);
  };

  const handleAddPond = () => {
    if (!newPond.areaId || !newPond.pondTypeId) {
      return;
    }
    const payload: PondRequest = {
      pondName: newPond.pondName,
      location: newPond.location,
      capacityLiters: parseFloat(newPond.capacityLiters),
      depthMeters: parseFloat(newPond.depthMeters),
      lengthMeters: parseFloat(newPond.lengthMeters),
      widthMeters: parseFloat(newPond.widthMeters),
      areaId: parseInt(newPond.areaId),
      pondTypeId: parseInt(newPond.pondTypeId),
      pondStatus: PondStatus.EMPTY,
    };

    addPondMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      },
    });
  };

  const handleEditPond = (pond: PondResponse) => {
    setEditingPond(pond);
    setEditPondForm({
      pondName: pond.pondName,
      location: pond.location,
      capacityLiters: pond.capacityLiters.toString(),
      depthMeters: pond.depthMeters.toString(),
      lengthMeters: pond.lengthMeters.toString(),
      widthMeters: pond.widthMeters.toString(),
      areaId: pond.areaId.toString(),
      pondTypeId: pond.pondTypeId.toString(),
      pondStatus: pond.pondStatus,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePond = () => {
    if (!editingPond || !editPondForm.areaId || !editPondForm.pondTypeId)
      return;

    const payload: Partial<PondRequest> = {
      pondName: editPondForm.pondName,
      location: editPondForm.location,
      capacityLiters: parseFloat(editPondForm.capacityLiters),
      depthMeters: parseFloat(editPondForm.depthMeters),
      lengthMeters: parseFloat(editPondForm.lengthMeters),
      widthMeters: parseFloat(editPondForm.widthMeters),
      areaId: parseInt(editPondForm.areaId),
      pondTypeId: parseInt(editPondForm.pondTypeId),
      pondStatus: editPondForm.pondStatus,
    };

    updatePondMutation.mutate(
      { id: editingPond.id, pond: payload },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingPond(null);
        },
      },
    );
  };

  const handleDeletePond = (pond: PondResponse) => {
    setPondToDelete(pond);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pondToDelete) {
      deletePondMutation.mutate(pondToDelete.id, {
        onSuccess: () => {
          setIsDeleteConfirmOpen(false);
          setPondToDelete(null);
        },
        onError: () => {
          setIsDeleteConfirmOpen(false);
        },
      });
    }
  };

  const handleOpenAreaSelection = (context: "new" | "edit") => {
    setCurrentAreaSelectionContext(context);
    setIsAreaSelectionOpen(true);
  };

  const handleAreaSelectionConfirm = (areaId: string) => {
    if (currentAreaSelectionContext === "new") {
      setNewPond((prev) => ({
        ...prev,
        areaId: areaId,
      }));
    } else if (currentAreaSelectionContext === "edit") {
      setEditPondForm((prev) => ({
        ...prev,
        areaId: areaId,
      }));
    }
    setIsAreaSelectionOpen(false);
    setCurrentAreaSelectionContext(null);
  };

  const handleOpenPondTypeSelection = (context: "new" | "edit") => {
    setCurrentPondTypeSelectionContext(context);
    setIsPondTypeSelectionOpen(true);
  };

  const handlePondTypeSelectionConfirm = (pondTypeId: string) => {
    if (currentPondTypeSelectionContext === "new") {
      setNewPond((prev) => ({
        ...prev,
        pondTypeId: pondTypeId,
      }));
    } else if (currentPondTypeSelectionContext === "edit") {
      setEditPondForm((prev) => ({
        ...prev,
        pondTypeId: pondTypeId,
      }));
    }
    setIsPondTypeSelectionOpen(false);
    setCurrentPondTypeSelectionContext(null);
  };

  const handleApplyFilters = () => {
    const areaId = areaIdInput ? Number(areaIdInput) : undefined;
    const pondTypeId = pondTypeIdInput ? Number(pondTypeIdInput) : undefined;
    const minCapacityLiters = minCapacityInput
      ? Number(minCapacityInput)
      : undefined;
    const maxCapacityLiters = maxCapacityInput
      ? Number(maxCapacityInput)
      : undefined;
    const minDepthMeters = minDepthInput ? Number(minDepthInput) : undefined;
    const maxDepthMeters = maxDepthInput ? Number(maxDepthInput) : undefined;
    const status =
      statusFilter === "all" ? undefined : (statusFilter as PondStatus);

    setSearchParams((prev) => ({
      ...prev,
      status: status,
      areaId: areaId,
      pondTypeId: pondTypeId,
      minCapacityLiters: minCapacityLiters,
      maxCapacityLiters: maxCapacityLiters,
      minDepthMeters: minDepthMeters,
      maxDepthMeters: maxDepthMeters,
      createdFrom: createdFromInput || undefined,
      createdTo: createdToInput || undefined,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setAreaIdInput("");
    setPondTypeIdInput("");
    setMinCapacityInput("");
    setMaxCapacityInput("");
    setMinDepthInput("");
    setMaxDepthInput("");
    setCreatedFromInput("");
    setCreatedToInput("");
    setStatusFilter("all");
    setSearchParams((prev) => ({
      ...prev,
      status: undefined,
      areaId: undefined,
      pondTypeId: undefined,
      minCapacityLiters: undefined,
      maxCapacityLiters: undefined,
      minDepthMeters: undefined,
      maxDepthMeters: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const isFilterActive = Object.keys(searchParams).some((key) => {
    const value = searchParams[key as keyof PondSearchParams];
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

  const totalFish = 1200;
  const activePondsCount = useMemo(
    () =>
      pondsData?.data?.filter((p) => p.pondStatus === PondStatus.ACTIVE)
        .length || 0,
    [pondsData],
  );
  const maintenancePondsCount = useMemo(
    () =>
      pondsData?.data?.filter((p) => p.pondStatus === PondStatus.MAINTENANCE)
        .length || 0,
    [pondsData],
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý hồ cá</h1>
          <p className="text-muted-foreground">
            Giám sát và quản lý tất cả các hồ cá trong trang trại
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hồ mới
        </Button>
      </div>

      <PondStats
        totalCount={totalCount}
        totalFish={totalFish}
        activePondsCount={activePondsCount}
        maintenancePondsCount={maintenancePondsCount}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ cá</CardTitle>
          <CardDescription>
            Thông tin chi tiết và trạng thái của từng hồ cá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hồ hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-400 pl-10"
              />
            </div>

            <Button
              variant={isFilterActive ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(
                  searchParams.status
                    ? searchParams.status.toLowerCase()
                    : "all",
                );
                setAreaIdInput(
                  searchParams.areaId !== undefined
                    ? String(searchParams.areaId)
                    : "",
                );
                setPondTypeIdInput(
                  searchParams.pondTypeId !== undefined
                    ? String(searchParams.pondTypeId)
                    : "",
                );
                setMinCapacityInput(
                  searchParams.minCapacityLiters !== undefined
                    ? String(searchParams.minCapacityLiters)
                    : "",
                );
                setMaxCapacityInput(
                  searchParams.maxCapacityLiters !== undefined
                    ? String(searchParams.maxCapacityLiters)
                    : "",
                );
                setMinDepthInput(
                  searchParams.minDepthMeters !== undefined
                    ? String(searchParams.minDepthMeters)
                    : "",
                );
                setMaxDepthInput(
                  searchParams.maxDepthMeters !== undefined
                    ? String(searchParams.maxDepthMeters)
                    : "",
                );
                setCreatedFromInput(searchParams.createdFrom || "");
                setCreatedToInput(searchParams.createdTo || "");
                setIsFilterModalOpen(true);
              }}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">STT</TableHead>
                    <TableHead className="w-[10%]">Tên hồ</TableHead>
                    <TableHead className="w-[20%]">Khu vực</TableHead>
                    <TableHead className="w-[15%]">Kích thước</TableHead>
                    <TableHead className="w-[10%]">Sức chứa (Lít)</TableHead>
                    <TableHead className="w-[10%]">Trạng thái</TableHead>
                    <TableHead className="w-[10%]">Ngày tạo</TableHead>
                    <TableHead className="w-[20%]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ponds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Không tìm thấy hồ cá nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ponds.map((pond, index) => (
                      <TableRow key={pond.id}>
                        <TableCell className="font-medium">
                          {index +
                            1 +
                            (searchParams.pageIndex - 1) *
                              searchParams.pageSize}
                        </TableCell>
                        <TableCell>{pond.pondName}</TableCell>
                        <TableCell>
                          {getAreaNameById(pond.areaId) || "N/A"}
                        </TableCell>
                        <TableCell>
                          {pond.lengthMeters}m × {pond.widthMeters}m (
                          {pond.depthMeters}m sâu)
                        </TableCell>
                        <TableCell>
                          {pond.capacityLiters.toLocaleString()} Lít
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              getPondStatusLabel(pond.pondStatus).colorClass
                            }
                          >
                            {getPondStatusLabel(pond.pondStatus).label}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDate(pond.createdAt, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(pond)}
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPond(pond)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeletePond(pond)}
                              title="Xóa hồ"
                              disabled={deletePondMutation.isPending}
                            >
                              {deletePondMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalCount > 0 && (
                <PaginationSection
                  totalItems={totalCount}
                  postsPerPage={searchParams.pageSize}
                  currentPage={searchParams.pageIndex}
                  setCurrentPage={handleSetCurrentPage}
                  totalPages={totalPages}
                  setPageSize={handleSetPageSize}
                  hasNextPage={pondsData?.hasNextPage}
                  hasPreviousPage={pondsData?.hasPreviousPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc Hồ Cá Nâng cao</DialogTitle>
            <DialogDescription>
              Lọc danh sách hồ cá theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="pondStatus">Trạng thái</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-2 w-full border-gray-400">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    {Object.values(PondStatus).map((s) => (
                      <SelectItem key={s} value={s.toLowerCase()}>
                        {getPondStatusLabel(s).label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="areaId">ID Khu vực</Label>
                <Input
                  id="areaId"
                  type="number"
                  placeholder="ID Khu vực"
                  value={areaIdInput}
                  onChange={(e) => setAreaIdInput(e.target.value)}
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="pondTypeId">ID Loại Hồ</Label>
                <Input
                  id="pondTypeId"
                  type="number"
                  placeholder="ID Loại Hồ"
                  value={pondTypeIdInput}
                  onChange={(e) => setPondTypeIdInput(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Sức chứa (Lít)
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="minCapacity">Tối thiểu</Label>
                <Input
                  id="minCapacity"
                  type="number"
                  placeholder="Sức chứa min"
                  value={minCapacityInput}
                  onChange={(e) => setMinCapacityInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="maxCapacity">Tối đa</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  placeholder="Sức chứa max"
                  value={maxCapacityInput}
                  onChange={(e) => setMaxCapacityInput(e.target.value)}
                />
              </div>

              <p className="text-sm font-semibold col-span-full md:col-span-2 mb-[-8px] text-muted-foreground">
                Lọc theo Độ sâu (Mét)
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="minDepth">Tối thiểu</Label>
                <Input
                  id="minDepth"
                  type="number"
                  step="0.1"
                  placeholder="Độ sâu min"
                  value={minDepthInput}
                  onChange={(e) => setMinDepthInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="maxDepth">Tối đa</Label>
                <Input
                  id="maxDepth"
                  type="number"
                  step="0.1"
                  placeholder="Độ sâu max"
                  value={maxDepthInput}
                  onChange={(e) => setMaxDepthInput(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Ngày tạo
              </p>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="createdFrom">Từ ngày</Label>
                <Input
                  id="createdFrom"
                  type="date"
                  value={createdFromInput}
                  onChange={(e) => setCreatedFromInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="createdTo">Đến ngày</Label>
                <Input
                  id="createdTo"
                  type="date"
                  value={createdToInput}
                  onChange={(e) => setCreatedToInput(e.target.value)}
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

      <AreaSelectionDialog
        isOpen={isAreaSelectionOpen}
        onOpenChange={setIsAreaSelectionOpen}
        onSelect={handleAreaSelectionConfirm}
        initialSelectedId={
          currentAreaSelectionContext === "new"
            ? newPond.areaId
            : editPondForm.areaId
        }
      />

      <PondTypeSelectionDialog
        isOpen={isPondTypeSelectionOpen}
        onOpenChange={setIsPondTypeSelectionOpen}
        onSelect={handlePondTypeSelectionConfirm}
        initialSelectedId={
          currentPondTypeSelectionContext === "new"
            ? newPond.pondTypeId
            : editPondForm.pondTypeId
        }
      />

      <DeletePondConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        pondToDelete={pondToDelete}
        onConfirm={handleConfirmDelete}
        isPending={deletePondMutation.isPending}
      />

      <PondDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        selectedPond={selectedPond}
      />

      <AddPondModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newPond={newPond}
        setNewPond={setNewPond}
        handleAddPond={handleAddPond}
        isPending={addPondMutation.isPending}
        handleOpenAreaSelection={handleOpenAreaSelection}
        handleOpenPondTypeSelection={handleOpenPondTypeSelection}
        getAreaNameById={getAreaNameById}
        getPondTypeNameById={getPondTypeNameById}
      />

      <EditPondModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingPond={editingPond}
        editPondForm={editPondForm}
        setEditPondForm={setEditPondForm}
        handleUpdatePond={handleUpdatePond}
        isPending={updatePondMutation.isPending}
        handleOpenAreaSelection={handleOpenAreaSelection}
        handleOpenPondTypeSelection={handleOpenPondTypeSelection}
        getAreaNameById={getAreaNameById}
        getPondTypeNameById={getPondTypeNameById}
      />
    </div>
  );
}
