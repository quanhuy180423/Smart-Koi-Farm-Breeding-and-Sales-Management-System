"use client";

import { useState } from "react";
import {
  useAddArea,
  useGetAreas,
  useDeleteArea,
  useUpdateArea,
} from "@/hooks/useArea"; // import hook bạn vừa tạo
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AreaResponse } from "@/lib/api/services/fetchArea";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { PaginationSection } from "@/components/common/PaginationSection";
import { useRouter, useSearchParams } from "next/navigation";

export default function AreaManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingArea, setEditingArea] = useState<AreaResponse | null>(null);
  const [newArea, setNewArea] = useState({
    areaName: "",
    totalAreaSQM: "",
    description: "",
  });

  const pageSizeOptions = [10, 20, 50, 100];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [areaToDelete, setAreaToDelete] = useState<AreaResponse | null>(null);

  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || pageSizeOptions[0];

  const { data: areas, isLoading } = useGetAreas({
    pageIndex,
    pageSize,
    search: searchTerm,
  });
  const { isPending: isAdding, mutateAsync: addAreaAsync } = useAddArea();
  const { isPending: isEditting, mutateAsync: updateAreaAsync } =
    useUpdateArea();
  const { isPending: isDeleting, mutateAsync: deleteAreaAsync } =
    useDeleteArea();

  const filteredAreas =
    areas?.data.filter((area: AreaResponse) =>
      area.areaName.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // Phân trang
  const totalRecords = areas?.totalItems || 0;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageIndex", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", size.toString());
    params.set("pageIndex", "1");
    router.push(`?${params.toString()}`);
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
    } catch {}
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
    } catch {}
  };

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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khu vực</CardTitle>
          <CardDescription>Thông tin chi tiết của từng khu vực</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên khu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-gray-400 pl-10"
            />
          </div>

          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Tên khu vực</TableHead>
                    <TableHead>Diện tích (m²)</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAreas.map((area, index) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
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
                  ))}
                </TableBody>
              </Table>

              <PaginationSection
                totalPosts={totalRecords}
                postsPerPage={pageSize}
                currentPage={pageIndex}
                setCurrentPage={handlePageChange}
                totalPages={totalPages}
                setPageSize={handlePageSizeChange}
                hasNextPage={areas?.hasNextPage}
                hasPreviousPage={areas?.hasPreviousPage}
                pageSizeOptions={pageSizeOptions}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal thêm */}
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

      {/* Modal chỉnh sửa */}
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

      {/* Detail Modal */}
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
                <strong>Diện tích:</strong> {selectedArea.totalAreaSQM} m²
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

      {/* Delete Confirmation Modal */}
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
              onClick={async () => {
                if (!areaToDelete) return;
                try {
                  await deleteAreaAsync(areaToDelete.id);
                  setIsDeleteModalOpen(false);
                  setAreaToDelete(null);
                } catch {}
              }}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
