"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
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
  PondTypeResponse,
  PondTypeSearchParams,
  PondTypeRequest,
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
import toast from "react-hot-toast";
import AddPondTypeModal from "./AddPondTypeModal";
import EditPondTypeModal from "./EditPondTypeModal";
import PondTypeDetailModal from "./PondTypeDetailModal";
import DeletePondTypeConfirmDialog from "./DeletePondTypeConfirmDialog";

export interface PondTypeFormState {
  typeName: string;
  description: string;
  recommendedCapacity: string;
}

export default function PondTypeManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPondType, setSelectedPondType] =
    useState<PondTypeResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPondType, setEditingPondType] =
    useState<PondTypeResponse | null>(null);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState<string>("");

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pondTypeToDelete, setPondTypeToDelete] =
    useState<PondTypeResponse | null>(null);

  const [searchParams, setSearchParams] = useState<PondTypeSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debounceSearchTerm,
      pageIndex: 1,
    }));
  }, [debounceSearchTerm]);

  const {
    data: pondTypesData,
    isLoading,
  } = useGetPondTypes(searchParams);

  const pondTypes: PondTypeResponse[] = pondTypesData?.data || [];
  const totalCount = pondTypesData?.totalItems || 0;
  const totalPages = pondTypesData?.totalPages || 1;

  const addPondTypeMutation = useAddPondType();
  const updatePondTypeMutation = useUpdatePondType();
  const deletePondTypeMutation = useDeletePondType();

  const [newPondType, setNewPondType] = useState<PondTypeFormState>({
    typeName: "",
    description: "",
    recommendedCapacity: "",
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
      description: "",
      recommendedCapacity: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddPondType = () => {
    if (!newPondType.typeName || !newPondType.recommendedCapacity) {
      toast.error("Vui lòng điền đầy đủ Tên loại hồ và Sức chứa.");
      return;
    }

    const payload: PondTypeRequest = {
      typeName: newPondType.typeName,
      description: newPondType.description,
      recommendedCapacity: parseFloat(newPondType.recommendedCapacity),
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

    const payload: Partial<PondTypeRequest> = {
      typeName: editingPondType.typeName,
      description: editingPondType.description,
      recommendedCapacity: editingPondType.recommendedCapacity,
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
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên loại hồ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-gray-400 pl-10"
            />
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
                    <TableHead className="w-[20%]">Tên Loại Hồ</TableHead>
                    <TableHead className="w-[20%]">Sức chứa KG (Lít)</TableHead>
                    <TableHead className="w-[35%]">Mô tả</TableHead>
                    <TableHead className="w-[20%] text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pondTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Không tìm thấy loại hồ nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pondTypes.map((type, index) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">
                          {index +
                            1 +
                            (searchParams.pageIndex - 1) * searchParams.pageSize}
                        </TableCell>
                        <TableCell>{type.typeName}</TableCell>
                        <TableCell>
                          {type.recommendedCapacity.toLocaleString()}
                        </TableCell>
                        <TableCell className="truncate">
                          {type.description || "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(type)}
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPondType(type)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeletePondType(type)}
                              title="Xóa loại hồ"
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
