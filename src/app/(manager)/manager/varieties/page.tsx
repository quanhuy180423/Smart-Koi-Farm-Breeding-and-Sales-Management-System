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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  VarietyResponse,
  VarietySearchParams,
  VarietyRequest,
} from "@/lib/api/services/fetchVariety";
import {
  useGetVarieties,
  useAddVariety,
  useDeleteVariety,
  useUpdateVariety,
} from "@/hooks/useVariety";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import toast from "react-hot-toast";
import AddVarietyModal from "./AddVarietyModal";
import EditVarietyModal from "./EditVarietyModal";
import VarietyDetailModal from "./VarietyDetailModal";
import DeleteVarietyConfirmDialog from "./DeleteVarietyConfirmDialogProps";
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

export interface VarietyFormState {
  varietyName: string;
  characteristic: string;
  originCountry: string;
}

export default function VarietyManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedVariety, setSelectedVariety] =
    useState<VarietyResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingVariety, setEditingVariety] = useState<VarietyResponse | null>(
    null,
  );

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [varietyToDelete, setVarietyToDelete] =
    useState<VarietyResponse | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [originCountryInput, setOriginCountryInput] = useState<string>("");

  const [searchParams, setSearchParams] = useState<VarietySearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    originCountry: undefined,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const {
    data: varietiesData,
    isLoading,
    isFetching,
  } = useGetVarieties(searchParams);

  const varieties: VarietyResponse[] = varietiesData?.data || [];
  const totalCount = varietiesData?.totalItems || 0;
  const totalPages = varietiesData?.totalPages || 0;

  const addVarietyMutation = useAddVariety();
  const updateVarietyMutation = useUpdateVariety();
  const deleteVarietyMutation = useDeleteVariety();

  const [newVariety, setNewVariety] = useState<VarietyFormState>({
    varietyName: "",
    characteristic: "",
    originCountry: "",
  });

  const handleApplyFilters = () => {
    setSearchParams((prev) => ({
      ...prev,
      originCountry: originCountryInput || undefined,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setOriginCountryInput("");

    setSearchParams((prev) => ({
      ...prev,
      originCountry: undefined,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const isFilterActive = !!searchParams.originCountry;

  const handleSetCurrentPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleSetPageSize = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: 1, pageSize: size }));
  };

  const handleViewDetails = (variety: VarietyResponse) => {
    setSelectedVariety(variety);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setNewVariety({
      varietyName: "",
      characteristic: "",
      originCountry: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddVariety = () => {
    if (!newVariety.varietyName || !newVariety.originCountry) {
      toast.error("Vui lòng điền đầy đủ Tên giống cá và Quốc gia xuất xứ.");
      return;
    }

    const payload: VarietyRequest = {
      varietyName: newVariety.varietyName,
      characteristic: newVariety.characteristic,
      originCountry: newVariety.originCountry,
    };

    addVarietyMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      },
    });
  };

  const handleEditVariety = (variety: VarietyResponse) => {
    setEditingVariety(variety);
    setIsEditModalOpen(true);
  };

  const handleUpdateVariety = () => {
    if (
      !editingVariety ||
      !editingVariety.varietyName ||
      !editingVariety.originCountry
    )
      return;

    const payload: Partial<VarietyRequest> = {
      varietyName: editingVariety.varietyName,
      characteristic: editingVariety.characteristic,
      originCountry: editingVariety.originCountry,
    };

    updateVarietyMutation.mutate(
      { id: editingVariety.id, variety: payload },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingVariety(null);
        },
      },
    );
  };

  const handleDeleteVariety = (variety: VarietyResponse) => {
    setVarietyToDelete(variety);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (varietyToDelete) {
      deleteVarietyMutation.mutate(varietyToDelete.id, {
        onSuccess: () => {
          setIsDeleteConfirmOpen(false);
          setVarietyToDelete(null);
        },
        onError: () => {
          setIsDeleteConfirmOpen(false);
        },
      });
    }
  };

  if (isLoading && !isFetching) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="text-lg">Đang tải dữ liệu giống cá...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Giống Cá
          </h1>
          <p className="text-muted-foreground">
            Quản lý các giống cá Koi và các đặc điểm liên quan
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm giống cá mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Giống Cá</CardTitle>
          <CardDescription>
            Các giống cá được quản lý trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên giống cá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-400 pl-10"
              />
            </div>

            <Button
              variant={isFilterActive ? "default" : "outline"}
              onClick={() => {
                setOriginCountryInput(searchParams.originCountry || "");
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
                    <TableHead className="w-[20%]">Tên Giống</TableHead>
                    <TableHead className="w-[15%]">Xuất xứ</TableHead>
                    <TableHead className="w-[40%]">Đặc điểm</TableHead>
                    <TableHead className="w-[20%] text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {varieties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Không tìm thấy giống cá nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    varieties.map((variety, index) => (
                      <TableRow key={variety.id}>
                        <TableCell className="font-medium">
                          {index +
                            1 +
                            (searchParams.pageIndex - 1) *
                              searchParams.pageSize}
                        </TableCell>
                        <TableCell>{variety.varietyName}</TableCell>
                        <TableCell>{variety.originCountry}</TableCell>
                        <TableCell className="truncate">
                          {variety.characteristic || "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(variety)}
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditVariety(variety)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteVariety(variety)}
                              title="Xóa giống cá"
                              disabled={deleteVarietyMutation.isPending}
                            >
                              {deleteVarietyMutation.isPending ? (
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
                  hasNextPage={varietiesData?.hasNextPage}
                  hasPreviousPage={varietiesData?.hasPreviousPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc Giống Cá</DialogTitle>
            <DialogDescription>
              Lọc danh sách giống cá theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originCountry">Quốc gia Xuất xứ</Label>
                <Input
                  id="originCountry"
                  placeholder="Nhập tên quốc gia..."
                  value={originCountryInput}
                  onChange={(e) => setOriginCountryInput(e.target.value)}
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

      <AddVarietyModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newVariety={newVariety}
        setNewVariety={setNewVariety}
        handleAddVariety={handleAddVariety}
        isPending={addVarietyMutation.isPending}
      />

      <EditVarietyModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingVariety={editingVariety}
        setEditingVariety={setEditingVariety}
        handleUpdateVariety={handleUpdateVariety}
        isPending={updateVarietyMutation.isPending}
      />

      <VarietyDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        selectedVariety={selectedVariety}
      />

      <DeleteVarietyConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        varietyToDelete={varietyToDelete}
        onConfirm={handleConfirmDelete}
        isPending={deleteVarietyMutation.isPending}
      />
    </div>
  );
}
