"use client";

import { useState, useEffect } from "react";
import {
  useAddArea,
  useGetAreas,
  useDeleteArea,
  useUpdateArea,
} from "@/hooks/useArea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye, Loader2, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AreaResponse, AreaSearchParams } from "@/lib/api/services/fetchArea";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import { useDebounce } from "@/hooks/useDebounce";

export default function AreaManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [minAreaInput, setMinAreaInput] = useState<string>("");
  const [maxAreaInput, setMaxAreaInput] = useState<string>("");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingArea, setEditingArea] = useState<AreaResponse | null>(null);

  const [searchParams, setSearchParams] = useState<AreaSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    minTotalAreaSQM: undefined,
    maxTotalAreaSQM: undefined,
  });

  const [newArea, setNewArea] = useState({
    areaName: "",
    totalAreaSQM: "",
    description: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [areaToDelete, setAreaToDelete] = useState<AreaResponse | null>(null);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleApplyFilters = () => {
    const min = minAreaInput ? Number(minAreaInput) : undefined;
    const max = maxAreaInput ? Number(maxAreaInput) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      minTotalAreaSQM: min,
      maxTotalAreaSQM: max,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setMinAreaInput("");
    setMaxAreaInput("");

    setSearchParams((prev) => ({
      ...prev,
      minTotalAreaSQM: undefined,
      maxTotalAreaSQM: undefined,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const { data: areasData, isLoading } = useGetAreas(searchParams);

  const areas = areasData?.data || [];
  const totalItems = areasData?.totalItems || 0;
  const totalPages = areasData?.totalPages || 1;

  const { isPending: isAdding, mutateAsync: addAreaAsync } = useAddArea();
  const { isPending: isEditting, mutateAsync: updateAreaAsync } =
    useUpdateArea();
  const { isPending: isDeleting, mutateAsync: deleteAreaAsync } =
    useDeleteArea();

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

  const handleViewDetails = (area: AreaResponse) => {
    setSelectedArea(area);
    setIsDetailModalOpen(true);
  };

  const handleEditArea = (area: AreaResponse) => {
    setEditingArea(area);
    setIsEditModalOpen(true);
  };

  const handleAddArea = async () => {
    if (!newArea.areaName || !newArea.totalAreaSQM) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      await addAreaAsync({
        areaName: newArea.areaName,
        totalAreaSQM: Number(newArea.totalAreaSQM),
        description: newArea.description,
      });
      setIsAddModalOpen(false);
      setNewArea({ areaName: "", totalAreaSQM: "", description: "" });
    } catch { }
  };

  const handleUpdateArea = async () => {
    if (!editingArea) return;
    if (!editingArea.areaName || !editingArea.totalAreaSQM) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      await updateAreaAsync({
        id: editingArea.id,
        area: {
          areaName: editingArea.areaName,
          totalAreaSQM: Number(editingArea.totalAreaSQM),
          description: editingArea.description,
        },
      });
      setIsEditModalOpen(false);
      setEditingArea(null);
    } catch { }
  };

  const handleDeleteArea = async () => {
    if (!areaToDelete) return;
    try {
      await deleteAreaAsync(areaToDelete.id);
      setIsDeleteModalOpen(false);
      setAreaToDelete(null);
    } catch { }
  };

  const isAreaFilterActive = searchParams.minTotalAreaSQM !== undefined || searchParams.maxTotalAreaSQM !== undefined;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khu vực</h1>
          <p className="text-muted-foreground">
            Quản lý các khu vực trong trang trại
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khu vực mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khu vực</CardTitle>
          <CardDescription>Thông tin chi tiết của từng khu vực</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên khu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-400 pl-10"
              />
            </div>

            <Button
              variant={isAreaFilterActive ? "default" : "outline"}
              onClick={() => setIsFilterModalOpen(true)}
              className={isAreaFilterActive ? "bg-indigo-600 hover:bg-indigo-700" : "border-gray-400"}
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc {isAreaFilterActive && <span className="ml-1 px-2 py-0.5 bg-white/30 text-white rounded-full text-xs">ON</span>}
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
                    <TableHead className="w-[15%]">STT</TableHead>
                    <TableHead className="w-[20%]">Tên khu vực</TableHead>
                    <TableHead className="w-[15%]">Diện tích (m²)</TableHead>
                    <TableHead className="w-[30%]">Mô tả</TableHead>
                    <TableHead className="w-[20%]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500 py-6"
                      >
                        Không có dữ liệu khu vực
                      </TableCell>
                    </TableRow>
                  ) : (
                    areas.map((area, index) => (
                      <TableRow key={area.id}>
                        <TableCell className="font-medium">
                          {index + 1 + (searchParams.pageIndex - 1) * searchParams.pageSize}
                        </TableCell>
                        <TableCell>{area.areaName}</TableCell>
                        <TableCell>{area.totalAreaSQM}</TableCell>
                        <TableCell>{area.description}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(area)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditArea(area)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => {
                              setAreaToDelete(area);
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
                  hasNextPage={areasData?.hasNextPage}
                  hasPreviousPage={areasData?.hasPreviousPage}
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
            setMinAreaInput(searchParams.minTotalAreaSQM !== undefined ? String(searchParams.minTotalAreaSQM) : "");
            setMaxAreaInput(searchParams.maxTotalAreaSQM !== undefined ? String(searchParams.maxTotalAreaSQM) : "");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bộ lọc Khu vực</DialogTitle>
            <DialogDescription>
              Lọc danh sách khu vực theo phạm vi diện tích
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minArea">Diện tích tối thiểu (m²)</Label>
              <Input
                id="minArea"
                type="number"
                placeholder="Ví dụ: 50"
                value={minAreaInput}
                onChange={(e) => setMinAreaInput(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxArea">Diện tích tối đa (m²)</Label>
              <Input
                id="maxArea"
                type="number"
                placeholder="Ví dụ: 200"
                value={maxAreaInput}
                onChange={(e) => setMaxAreaInput(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={handleResetFilters}
            >
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>
              Áp dụng bộ lọc
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm khu vực mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="areaName">Tên khu vực *</Label>
                <Input
                  id="areaName"
                  placeholder="Nhập tên khu vực..."
                  value={newArea.areaName}
                  onChange={(e) =>
                    setNewArea({ ...newArea, areaName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAreaSQM">Diện tích (m²) *</Label>
                <Input
                  id="totalAreaSQM"
                  placeholder="Nhập diện tích"
                  type="number"
                  value={newArea.totalAreaSQM}
                  onChange={(e) =>
                    setNewArea({ ...newArea, totalAreaSQM: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về khu vực..."
                value={newArea.description}
                onChange={(e) =>
                  setNewArea({ ...newArea, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleAddArea} disabled={isAdding}>
                {isAdding ? "Đang tạo..." : "Thêm khu vực"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khu vực</DialogTitle>
          </DialogHeader>
          {editingArea && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editAreaName">Tên khu vực *</Label>
                  <Input
                    id="editAreaName"
                    value={editingArea.areaName}
                    onChange={(e) =>
                      setEditingArea({
                        ...editingArea,
                        areaName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTotalArea">Diện tích (m²) *</Label>
                  <Input
                    id="editTotalArea"
                    type="number"
                    value={editingArea.totalAreaSQM}
                    onChange={(e) =>
                      setEditingArea({
                        ...editingArea,
                        totalAreaSQM: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Mô tả</Label>
                <Textarea
                  id="editDescription"
                  value={editingArea.description}
                  onChange={(e) =>
                    setEditingArea({
                      ...editingArea,
                      description: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleUpdateArea} disabled={isEditting}>
                  {isEditting ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của khu vực
            </DialogDescription>
          </DialogHeader>
          {selectedArea && (
            <div className="space-y-4">
              <p>
                <strong>Tên khu vực:</strong> {selectedArea.areaName}
              </p>
              <p>
                <strong>Diện tích:</strong> {selectedArea.totalAreaSQM || 0} m²
              </p>
              <p>
                <strong>Mô tả:</strong> {selectedArea.description}
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khu vực</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác
            </DialogDescription>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa khu vực {areaToDelete?.areaName}? </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={handleDeleteArea}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

