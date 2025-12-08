"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import * as z from "zod";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/dates";
import {
  PondResponse,
  PondStatus,
  PondSearchParams,
  PondRequest,
  PondTypeEnum,
} from "@/lib/api/services/fetchPond";
import {
  useGetPonds,
  useAddPond,
  useUpdatePond,
  useDeletePond,
} from "@/hooks/usePond";
import { AreaResponse } from "@/lib/api/services/fetchArea";
import { useGetAreas } from "@/hooks/useArea";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
import { getPondStatusLabel } from "@/lib/utils/enum";
import AreaSelectionDialog from "./components/AreaSelectionDialog";
import PondDetailModal from "./components/PondDetailModal";
import AddPondModal from "./components/AddPondModal";
import EditPondModal from "./components/EditPondModal";
import { useGetPondTypes } from "@/hooks/usePondType";
import { PondTypeResponse } from "@/lib/api/services/fetchPondType";
import PondTypeSelectionDialog from "./components/PondTypeSelectionDialog";
import DeletePondConfirmDialog from "./components/DeletePondConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";
import PondAdvancedFilterDialog, {
  PondAdvancedFilterState,
} from "@/components/manager/PondAdvancedFilterDialog";
import toast from "react-hot-toast";

export interface PondFormState {
  pondName: string;
  location: string;
  currentCapacity: string;
  depthMeters: string;
  lengthMeters: string;
  widthMeters: string;
  areaId: string;
  pondTypeId: string;
  pondStatus?: PondStatus;
  record?: {
    phLevel: string;
    temperatureCelsius: string;
    oxygenLevel: string;
    ammoniaLevel: string;
    nitriteLevel: string;
    nitrateLevel: string;
    carbonHardness: string;
    waterLevelMeters: string;
    notes: string;
  };
}

// Zod validation schemas for pond
const waterParametersSchema = z.object({
  phLevel: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // optional, so empty is ok
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "pH Level phải >= 0"),
  temperatureCelsius: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num);
    }, "Nhiệt độ phải là số hợp lệ"),
  oxygenLevel: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Oxy phải >= 0"),
  ammoniaLevel: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Ammonia phải >= 0"),
  nitriteLevel: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Nitrite phải >= 0"),
  nitrateLevel: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Nitrate phải >= 0"),
  carbonHardness: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Carbon Hardness phải >= 0"),
  waterLevelMeters: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Mức nước phải >= 0"),
  notes: z.string().optional(),
});

const pondSchema = z.object({
  pondName: z.string().min(1, "Vui lòng nhập tên hồ"),
  location: z.string().min(1, "Vui lòng nhập địa điểm"),
  lengthMeters: z
    .string()
    .min(1, "Vui lòng nhập chiều dài")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Chiều dài phải lớn hơn 0"),
  widthMeters: z
    .string()
    .min(1, "Vui lòng nhập chiều rộng")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Chiều rộng phải lớn hơn 0"),
  depthMeters: z
    .string()
    .min(1, "Vui lòng nhập độ sâu")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Độ sâu phải lớn hơn 0"),
  currentCapacity: z
    .string()
    .min(1, "Vui lòng nhập dung tích")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Dung tích phải lớn hơn 0"),
  areaId: z.string().min(1, "Vui lòng chọn khu vực"),
  pondTypeId: z.string().min(1, "Vui lòng chọn loại hồ"),
  record: waterParametersSchema.optional(),
});

export default function PondManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
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
  const [filters, setFilters] = useState<PondAdvancedFilterState>({
    statusFilter: "all",
    areaIdInput: "",
    pondTypeIdInput: "",
    pondTypeEnumInput: "all",
    minCapacityInput: "",
    maxCapacityInput: "",
    minDepthInput: "",
    maxDepthInput: "",
    createdFromInput: "",
    createdToInput: "",
  });

  const [searchParams, setSearchParams] = useState<PondSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    status: undefined,
    areaId: undefined,
    pondTypeId: undefined,
    pondTypeEnum: undefined,
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

  const addPondMutation = useAddPond();
  const updatePondMutation = useUpdatePond();
  const deletePondMutation = useDeletePond();

  const [newPond, setNewPond] = useState<PondFormState>({
    pondName: "",
    location: "",
    currentCapacity: "",
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
    currentCapacity: "",
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
      currentCapacity: "",
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

  const handleAddPond = (
    onValidationError?: (errors: Record<string, string>) => void,
  ) => {
    const result = pondSchema.safeParse({
      pondName: newPond.pondName,
      location: newPond.location,
      lengthMeters: newPond.lengthMeters,
      widthMeters: newPond.widthMeters,
      depthMeters: newPond.depthMeters,
      currentCapacity: newPond.currentCapacity,
      areaId: newPond.areaId,
      pondTypeId: newPond.pondTypeId,
      record: newPond.record,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message;
      });
      if (onValidationError) {
        onValidationError(errors);
      } else {
        const firstError = result.error.errors[0];
        toast.error(firstError.message);
      }
      return;
    }

    const payload: PondRequest = {
      pondName: newPond.pondName,
      location: newPond.location,
      currentCapacity: parseFloat(newPond.currentCapacity),
      depthMeters: parseFloat(newPond.depthMeters),
      lengthMeters: parseFloat(newPond.lengthMeters),
      widthMeters: parseFloat(newPond.widthMeters),
      areaId: parseInt(newPond.areaId),
      pondTypeId: parseInt(newPond.pondTypeId),
      pondStatus: PondStatus.EMPTY,
      record: newPond.record
        ? {
            phLevel: parseFloat(newPond.record.phLevel) || 0,
            temperatureCelsius:
              parseFloat(newPond.record.temperatureCelsius) || 0,
            oxygenLevel: parseFloat(newPond.record.oxygenLevel) || 0,
            ammoniaLevel: parseFloat(newPond.record.ammoniaLevel) || 0,
            nitriteLevel: parseFloat(newPond.record.nitriteLevel) || 0,
            nitrateLevel: parseFloat(newPond.record.nitrateLevel) || 0,
            carbonHardness: parseFloat(newPond.record.carbonHardness) || 0,
            waterLevelMeters: parseFloat(newPond.record.waterLevelMeters) || 0,
            notes: newPond.record.notes || "",
          }
        : {
            phLevel: 0,
            temperatureCelsius: 0,
            oxygenLevel: 0,
            ammoniaLevel: 0,
            nitriteLevel: 0,
            nitrateLevel: 0,
            carbonHardness: 0,
            waterLevelMeters: 0,
            notes: "",
          },
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
      currentCapacity: pond.currentCapacity?.toString() || "",
      depthMeters: pond.depthMeters.toString(),
      lengthMeters: pond.lengthMeters.toString(),
      widthMeters: pond.widthMeters.toString(),
      areaId: pond.areaId.toString(),
      pondTypeId: pond.pondTypeId.toString(),
      pondStatus: pond.pondStatus,
      record: pond.record
        ? {
            phLevel: pond.record.phLevel.toString(),
            temperatureCelsius: pond.record.temperatureCelsius.toString(),
            oxygenLevel: pond.record.oxygenLevel.toString(),
            ammoniaLevel: pond.record.ammoniaLevel.toString(),
            nitriteLevel: pond.record.nitriteLevel.toString(),
            nitrateLevel: pond.record.nitrateLevel.toString(),
            carbonHardness: pond.record.carbonHardness.toString(),
            waterLevelMeters: pond.record.waterLevelMeters.toString(),
            notes: pond.record.notes,
          }
        : {
            phLevel: "",
            temperatureCelsius: "",
            oxygenLevel: "",
            ammoniaLevel: "",
            nitriteLevel: "",
            nitrateLevel: "",
            carbonHardness: "",
            waterLevelMeters: "",
            notes: "",
          },
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePond = (
    onValidationError?: (errors: Record<string, string>) => void,
  ) => {
    if (!editingPond) return;

    const result = pondSchema.safeParse({
      pondName: editPondForm.pondName,
      location: editPondForm.location,
      lengthMeters: editPondForm.lengthMeters,
      widthMeters: editPondForm.widthMeters,
      depthMeters: editPondForm.depthMeters,
      currentCapacity: editPondForm.currentCapacity,
      areaId: editPondForm.areaId,
      pondTypeId: editPondForm.pondTypeId,
      record: editPondForm.record,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message;
      });
      if (onValidationError) {
        onValidationError(errors);
      } else {
        const firstError = result.error.errors[0];
        toast.error(firstError.message);
      }
      return;
    }

    const payload: Partial<PondRequest> = {
      pondName: editPondForm.pondName,
      location: editPondForm.location,
      currentCapacity: parseFloat(editPondForm.currentCapacity),
      depthMeters: parseFloat(editPondForm.depthMeters),
      lengthMeters: parseFloat(editPondForm.lengthMeters),
      widthMeters: parseFloat(editPondForm.widthMeters),
      areaId: parseInt(editPondForm.areaId),
      pondTypeId: parseInt(editPondForm.pondTypeId),
      pondStatus: editPondForm.pondStatus,
      record: editPondForm.record
        ? {
            phLevel: parseFloat(editPondForm.record.phLevel) || 0,
            temperatureCelsius:
              parseFloat(editPondForm.record.temperatureCelsius) || 0,
            oxygenLevel: parseFloat(editPondForm.record.oxygenLevel) || 0,
            ammoniaLevel: parseFloat(editPondForm.record.ammoniaLevel) || 0,
            nitriteLevel: parseFloat(editPondForm.record.nitriteLevel) || 0,
            nitrateLevel: parseFloat(editPondForm.record.nitrateLevel) || 0,
            carbonHardness: parseFloat(editPondForm.record.carbonHardness) || 0,
            waterLevelMeters:
              parseFloat(editPondForm.record.waterLevelMeters) || 0,
            notes: editPondForm.record.notes || "",
          }
        : {
            phLevel: 0,
            temperatureCelsius: 0,
            oxygenLevel: 0,
            ammoniaLevel: 0,
            nitriteLevel: 0,
            nitrateLevel: 0,
            carbonHardness: 0,
            waterLevelMeters: 0,
            notes: "",
          },
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
    const areaId = filters.areaIdInput
      ? Number(filters.areaIdInput)
      : undefined;
    const pondTypeId = filters.pondTypeIdInput
      ? Number(filters.pondTypeIdInput)
      : undefined;
    const minCapacityLiters = filters.minCapacityInput
      ? Number(filters.minCapacityInput)
      : undefined;
    const maxCapacityLiters = filters.maxCapacityInput
      ? Number(filters.maxCapacityInput)
      : undefined;
    const minDepthMeters = filters.minDepthInput
      ? Number(filters.minDepthInput)
      : undefined;
    const maxDepthMeters = filters.maxDepthInput
      ? Number(filters.maxDepthInput)
      : undefined;
    const status =
      filters.statusFilter === "all"
        ? undefined
        : ((filters.statusFilter.charAt(0).toUpperCase() +
            filters.statusFilter.slice(1)) as PondStatus);
    const pondTypeEnum =
      filters.pondTypeEnumInput && filters.pondTypeEnumInput !== "all"
        ? (filters.pondTypeEnumInput as PondTypeEnum)
        : undefined;

    setSearchParams((prev) => ({
      ...prev,
      status: status,
      areaId: areaId,
      pondTypeId: pondTypeId,
      pondTypeEnum: pondTypeEnum,
      minCapacityLiters: minCapacityLiters,
      maxCapacityLiters: maxCapacityLiters,
      minDepthMeters: minDepthMeters,
      maxDepthMeters: maxDepthMeters,
      createdFrom: filters.createdFromInput || undefined,
      createdTo: filters.createdToInput || undefined,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      statusFilter: "all",
      areaIdInput: "",
      pondTypeIdInput: "",
      pondTypeEnumInput: "all",
      minCapacityInput: "",
      maxCapacityInput: "",
      minDepthInput: "",
      maxDepthInput: "",
      createdFromInput: "",
      createdToInput: "",
    });
    setSearchParams((prev) => ({
      ...prev,
      status: undefined,
      areaId: undefined,
      pondTypeId: undefined,
      pondTypeEnum: undefined,
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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ cá</CardTitle>
          <CardDescription>
            Thông tin chi tiết và trạng thái của từng hồ cá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative grow">
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
                setFilters({
                  statusFilter: searchParams.status
                    ? searchParams.status.toLowerCase()
                    : "all",
                  areaIdInput:
                    searchParams.areaId !== undefined
                      ? String(searchParams.areaId)
                      : "",
                  pondTypeIdInput:
                    searchParams.pondTypeId !== undefined
                      ? String(searchParams.pondTypeId)
                      : "",
                  pondTypeEnumInput: searchParams.pondTypeEnum || "all",
                  minCapacityInput:
                    searchParams.minCapacityLiters !== undefined
                      ? String(searchParams.minCapacityLiters)
                      : "",
                  maxCapacityInput:
                    searchParams.maxCapacityLiters !== undefined
                      ? String(searchParams.maxCapacityLiters)
                      : "",
                  minDepthInput:
                    searchParams.minDepthMeters !== undefined
                      ? String(searchParams.minDepthMeters)
                      : "",
                  maxDepthInput:
                    searchParams.maxDepthMeters !== undefined
                      ? String(searchParams.maxDepthMeters)
                      : "",
                  createdFromInput: searchParams.createdFrom || "",
                  createdToInput: searchParams.createdTo || "",
                });
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
              <Table className="table-fixed w-full">
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
                        <TableCell className="truncate">
                          {pond.pondName}
                        </TableCell>
                        <TableCell className="truncate">
                          {getAreaNameById(pond.areaId) || "N/A"}
                        </TableCell>
                        <TableCell className="truncate">
                          {pond.lengthMeters || "N/A"}m ×{" "}
                          {pond.widthMeters || "N/A"}m (
                          {pond.depthMeters || "N/A"}m sâu)
                        </TableCell>
                        <TableCell>
                          {pond.capacityLiters ? pond.capacityLiters : "N/A"}{" "}
                          Lít
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const statusInfo = getPondStatusLabel(
                              pond.pondStatus,
                            );
                            const IconComponent = statusInfo.icon;
                            return (
                              <Badge
                                variant="secondary"
                                className={`${statusInfo.colorClass} flex items-center gap-1 w-fit`}
                              >
                                <IconComponent className="h-3.5 w-3.5" />
                                <span>{statusInfo.label}</span>
                              </Badge>
                            );
                          })()}
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
                              title="Chi tiết"
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
                            {pond.pondStatus === PondStatus.EMPTY ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeletePond(pond)}
                                title="Xóa"
                                disabled={deletePondMutation.isPending}
                              >
                                {deletePondMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            ) : (
                              <div className="h-10 w-10" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalCount > 0 && (
                <PaginationWithLinks
                  totalCount={totalCount}
                  pageSize={searchParams.pageSize}
                  page={searchParams.pageIndex}
                  onPageChange={handleSetCurrentPage}
                  onPageSizeChange={handleSetPageSize}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <PondAdvancedFilterDialog
        isOpen={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

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
