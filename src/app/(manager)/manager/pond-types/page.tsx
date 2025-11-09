"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { InputNumber } from "@/components/ui/input-number";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PondTypeResponse,
  PondTypeSearchParams,
  PondTypeRequest,
  PondTypeEnum,
} from "@/lib/api/services/fetchPondType";
import {
  useGetPondTypes,
  useAddPondType,
  useUpdatePondType,
  useDeletePondType,
} from "@/hooks/usePondType";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import AddPondTypeModal from "./AddPondTypeModal";
import EditPondTypeModal from "./EditPondTypeModal";
import PondTypeDetailModal from "./PondTypeDetailModal";
import DeletePondTypeConfirmDialog from "./DeletePondTypeConfirmDialog";
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
import { getPondTypeLabel } from "@/lib/utils/enum/formatEnum";

export interface PondTypeFormState {
  typeName: string;
  type: PondTypeEnum | "";
  description: string;
  recommendedQuantity: string;
}

export default function PondTypeManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedPondType, setSelectedPondType] =
    useState<PondTypeResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPondType, setEditingPondType] =
    useState<PondTypeResponse | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pondTypeToDelete, setPondTypeToDelete] =
    useState<PondTypeResponse | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [minQuantityInput, setMinQuantityInput] = useState<string>("");
  const [maxQuantityInput, setMaxQuantityInput] = useState<string>("");

  const [searchParams, setSearchParams] = useState<PondTypeSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    minRecommendedQuantity: undefined,
    maxRecommendedQuantity: undefined,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const { data: pondTypesData, isLoading } = useGetPondTypes(searchParams);

  const pondTypes: PondTypeResponse[] = pondTypesData?.data || [];
  const totalCount = pondTypesData?.totalItems || 0;
  const totalPages = pondTypesData?.totalPages || 1;

  const addPondTypeMutation = useAddPondType();
  const updatePondTypeMutation = useUpdatePondType();
  const deletePondTypeMutation = useDeletePondType();

  const [newPondType, setNewPondType] = useState<PondTypeFormState>({
    typeName: "",
    type: "",
    description: "",
    recommendedQuantity: "",
  });

  const handleSetCurrentPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleSetPageSize = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: 1, pageSize: size }));
  };

  const handleViewDetails = (pondType: PondTypeResponse) => {
    setSelectedPondType(pondType);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setNewPondType({
      typeName: "",
      type: "",
      description: "",
      recommendedQuantity: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddPondType = () => {
    if (
      !newPondType.typeName ||
      !newPondType.type ||
      !newPondType.recommendedQuantity
    ) {
      console.error("Vui lòng điền đầy đủ Tên loại hồ, Loại hồ, và Sức chứa.");
      return;
    }

    const payload: PondTypeRequest = {
      typeName: newPondType.typeName,
      type: newPondType.type as PondTypeEnum,
      description: newPondType.description,
      recommendedQuantity: parseFloat(newPondType.recommendedQuantity),
    };

    addPondTypeMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      },
    });
  };

  const handleEditPondType = (pondType: PondTypeResponse) => {
    setEditingPondType(pondType);
    setIsEditModalOpen(true);
  };

  const handleUpdatePondType = () => {
    if (!editingPondType || !editingPondType.typeName) return;

    const payload: PondTypeRequest = {
      typeName: editingPondType.typeName,
      type: editingPondType.type,
      description: editingPondType.description,
      recommendedQuantity: editingPondType.recommendedQuantity,
    };

    updatePondTypeMutation.mutate(
      { id: editingPondType.id, pondType: payload },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingPondType(null);
        },
      },
    );
  };

  const handleDeletePondType = (pondType: PondTypeResponse) => {
    setPondTypeToDelete(pondType);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pondTypeToDelete) {
      deletePondTypeMutation.mutate(pondTypeToDelete.id, {
        onSuccess: () => {
          setIsDeleteConfirmOpen(false);
          setPondTypeToDelete(null);
        },
        onError: () => {
          setIsDeleteConfirmOpen(false);
        },
      });
    }
  };

  const handleApplyFilters = () => {
    const minQuantity = minQuantityInput ? Number(minQuantityInput) : undefined;
    const maxQuantity = maxQuantityInput ? Number(maxQuantityInput) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      minRecommendedQuantity: minQuantity,
      maxRecommendedQuantity: maxQuantity,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setMinQuantityInput("");
    setMaxQuantityInput("");

    setSearchParams((prev) => ({
      ...prev,
      minRecommendedQuantity: undefined,
      maxRecommendedQuantity: undefined,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const isFilterActive = Object.keys(searchParams).some((key) => {
    const value = searchParams[key as keyof PondTypeSearchParams];
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Loại Hồ Cá
          </h1>
          <p className="text-muted-foreground">
            Định nghĩa và quản lý các loại hồ cá khác nhau
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại hồ mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Loại Hồ</CardTitle>
          <CardDescription>
            Các loại hồ cá được định nghĩa trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên loại hồ..."
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[4%]">STT</TableHead>
                    <TableHead className="w-[18%]">Tên Loại Hồ</TableHead>
                    <TableHead className="w-[15%]">Loại Hồ</TableHead>
                    <TableHead className="w-[15%]">
                      Sức chứa (Số lượng)
                    </TableHead>
                    <TableHead className="w-[28%]">Mô tả</TableHead>
                    <TableHead className="w-[20%] text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pondTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Không tìm thấy loại hồ nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pondTypes.map((pondType, index) => (
                      <TableRow key={pondType.id}>
                        <TableCell className="font-medium">
                          {index +
                            1 +
                            (searchParams.pageIndex - 1) *
                              searchParams.pageSize}
                        </TableCell>
                        <TableCell>{pondType.typeName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPondTypeLabel(pondType.type).colorClass}`}
                          >
                            {getPondTypeLabel(pondType.type).label}
                          </span>
                        </TableCell>
                        <TableCell>{pondType.recommendedQuantity}</TableCell>
                        <TableCell className="truncate">
                          {pondType.description || "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(pondType)}
                              title="Chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPondType(pondType)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeletePondType(pondType)}
                              title="Xóa"
                              disabled={deletePondTypeMutation.isPending}
                            >
                              {deletePondTypeMutation.isPending ? (
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
                  hasNextPage={pondTypesData?.hasNextPage}
                  hasPreviousPage={pondTypesData?.hasPreviousPage}
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
            setMinQuantityInput(
              searchParams.minRecommendedQuantity !== undefined
                ? String(searchParams.minRecommendedQuantity)
                : "",
            );
            setMaxQuantityInput(
              searchParams.maxRecommendedQuantity !== undefined
                ? String(searchParams.maxRecommendedQuantity)
                : "",
            );
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc Loại Hồ Cá</DialogTitle>
            <DialogDescription>
              Lọc danh sách loại hồ cá theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Sức chứa đề xuất (Số lượng)
              </p>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="minQuantity">Tối thiểu</Label>
                <InputNumber
                  value={
                    minQuantityInput ? Number(minQuantityInput) : undefined
                  }
                  onChange={(value) =>
                    setMinQuantityInput(value ? String(value) : "")
                  }
                  placeholder="Sức chứa min"
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="maxQuantity">Tối đa</Label>
                <InputNumber
                  value={
                    maxQuantityInput ? Number(maxQuantityInput) : undefined
                  }
                  onChange={(value) =>
                    setMaxQuantityInput(value ? String(value) : "")
                  }
                  placeholder="Sức chứa max"
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

      <AddPondTypeModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newPondType={newPondType}
        setNewPondType={setNewPondType}
        handleAddPondType={handleAddPondType}
        isPending={addPondTypeMutation.isPending}
      />

      <EditPondTypeModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingPondType={editingPondType}
        setEditingPondType={setEditingPondType}
        handleUpdatePondType={handleUpdatePondType}
        isPending={updatePondTypeMutation.isPending}
      />

      <PondTypeDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        selectedPondType={selectedPondType}
      />

      <DeletePondTypeConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        pondTypeToDelete={pondTypeToDelete}
        onConfirm={handleConfirmDelete}
        isPending={deletePondTypeMutation.isPending}
      />
    </div>
  );
}
