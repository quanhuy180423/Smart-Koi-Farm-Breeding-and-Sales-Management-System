"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputNumber } from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X, Edit, Trash2 } from "lucide-react";
import {
  useGetWaterParameterThresholds,
  useCreateWaterParameterThreshold,
  useUpdateWaterParameterThreshold,
  useDeleteWaterParameterThreshold,
} from "@/hooks/useWaterParameterThreshold";
import {
  WaterParameterName,
  WaterParameterThreshold,
} from "@/lib/api/services/fetchWaterParameterThreshold";
import { PaginationWithLinks } from "@/components/pagination";

interface WaterParameterThresholdModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pondTypeId: number;
  pondTypeName: string;
}

const parameterOptions = [
  { value: "All", label: "Tất cả" },
  { value: WaterParameterName.PHLevel, label: "PH Level" },
  {
    value: WaterParameterName.TemperatureCelsius,
    label: "Temperature (°C)",
  },
  { value: WaterParameterName.OxygenLevel, label: "Oxygen Level" },
  { value: WaterParameterName.AmmoniaLevel, label: "Ammonia Level" },
  { value: WaterParameterName.NitriteLevel, label: "Nitrite Level" },
  { value: WaterParameterName.NitrateLevel, label: "Nitrate Level" },
  { value: WaterParameterName.CarbonHardness, label: "Carbon Hardness" },
  { value: WaterParameterName.WaterLevelMeters, label: "Water Level (m)" },
];

const createParameterOptions = parameterOptions.slice(1); // Exclude "Tất cả"

const paramUnits: Record<string, string> = {
  [WaterParameterName.PHLevel]: "",
  [WaterParameterName.TemperatureCelsius]: "°C",
  [WaterParameterName.OxygenLevel]: "mg/L",
  [WaterParameterName.AmmoniaLevel]: "mg/L",
  [WaterParameterName.NitriteLevel]: "mg/L",
  [WaterParameterName.NitrateLevel]: "mg/L",
  [WaterParameterName.CarbonHardness]: "°dH",
  [WaterParameterName.WaterLevelMeters]: "m",
};

export default function WaterParameterThresholdModal({
  isOpen,
  onOpenChange,
  pondTypeId,
  pondTypeName,
}: WaterParameterThresholdModalProps) {
  const [selectedParameter, setSelectedParameter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingThresholdId, setEditingThresholdId] = useState<number | null>(
    null,
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingThresholdId, setDeletingThresholdId] = useState<number | null>(
    null,
  );
  const [createFormData, setCreateFormData] = useState({
    parameterName: WaterParameterName.PHLevel,
    minValue: "",
    maxValue: "",
  });
  const [editFormData, setEditFormData] = useState({
    parameterName: WaterParameterName.PHLevel,
    minValue: "",
    maxValue: "",
  });

  const { data: thresholdsData, isLoading } = useGetWaterParameterThresholds({
    parameterName: selectedParameter === "All" ? undefined : selectedParameter,
    pondTypeId,
    pageIndex: currentPage,
    pageSize: pageSize,
  });

  const { mutate: createThreshold, isPending: isCreating } =
    useCreateWaterParameterThreshold();
  const { mutate: updateThreshold, isPending: isUpdating } =
    useUpdateWaterParameterThreshold();
  const { mutate: deleteThreshold, isPending: isDeleting } =
    useDeleteWaterParameterThreshold();

  const thresholds: WaterParameterThreshold[] = thresholdsData?.data || [];
  const totalPages = thresholdsData?.totalPages || 0;

  const handleParameterChange = (value: string) => {
    setSelectedParameter(value);
    setCurrentPage(1); // Reset to first page when changing parameter
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleCreateSubmit = () => {
    if (!createFormData.minValue || !createFormData.maxValue) {
      return;
    }

    const minValue = parseFloat(createFormData.minValue);
    const maxValue = parseFloat(createFormData.maxValue);

    if (isNaN(minValue) || isNaN(maxValue)) {
      return;
    }

    createThreshold(
      {
        parameterName: createFormData.parameterName as WaterParameterName,
        unit: paramUnits[createFormData.parameterName] || "",
        minValue,
        maxValue,
        pondTypeId,
      },
      {
        onSuccess: () => {
          setCreateFormData({
            parameterName: WaterParameterName.PHLevel,
            minValue: "",
            maxValue: "",
          });
          setIsCreateFormOpen(false);
        },
      },
    );
  };

  const handleCloseCreateForm = () => {
    setCreateFormData({
      parameterName: WaterParameterName.PHLevel,
      minValue: "",
      maxValue: "",
    });
    setIsCreateFormOpen(false);
  };

  const handleEditClick = (threshold: WaterParameterThreshold) => {
    setEditingThresholdId(threshold.id);
    setEditFormData({
      parameterName: threshold.parameterName,
      minValue: String(threshold.minValue),
      maxValue: String(threshold.maxValue),
    });
    setIsEditFormOpen(true);
  };

  const handleEditSubmit = () => {
    if (
      !editFormData.minValue ||
      !editFormData.maxValue ||
      !editingThresholdId
    ) {
      return;
    }

    const minValue = parseFloat(editFormData.minValue);
    const maxValue = parseFloat(editFormData.maxValue);

    if (isNaN(minValue) || isNaN(maxValue)) {
      return;
    }

    updateThreshold(
      {
        id: editingThresholdId,
        data: {
          parameterName: editFormData.parameterName as WaterParameterName,
          unit: paramUnits[editFormData.parameterName] || "",
          minValue,
          maxValue,
          pondTypeId,
        },
      },
      {
        onSuccess: () => {
          setEditFormData({
            parameterName: WaterParameterName.PHLevel,
            minValue: "",
            maxValue: "",
          });
          setEditingThresholdId(null);
          setIsEditFormOpen(false);
        },
      },
    );
  };

  const handleCloseEditForm = () => {
    setEditFormData({
      parameterName: WaterParameterName.PHLevel,
      minValue: "",
      maxValue: "",
    });
    setEditingThresholdId(null);
    setIsEditFormOpen(false);
  };

  const handleDeleteClick = (thresholdId: number) => {
    setDeletingThresholdId(thresholdId);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingThresholdId) {
      deleteThreshold(deletingThresholdId);
      setIsDeleteConfirmOpen(false);
      setDeletingThresholdId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingThresholdId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông số nước - {pondTypeName}</DialogTitle>
          <DialogDescription>
            Xem danh sách thông số nước cho từng loại hồ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header with Create Button */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium">Chọn thông số</label>
              <Select
                value={selectedParameter}
                onValueChange={handleParameterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thông số..." />
                </SelectTrigger>
                <SelectContent>
                  {parameterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!isCreateFormOpen && (
              <Button
                onClick={() => setIsCreateFormOpen(true)}
                size="sm"
                className="ml-2 mt-6"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tạo
              </Button>
            )}
          </div>

          {/* Create Form */}
          {isCreateFormOpen && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Tạo thông số mới</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseCreateForm}
                    disabled={isCreating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="createParam">Thông số</Label>
                  <Select
                    value={createFormData.parameterName}
                    onValueChange={(value) =>
                      setCreateFormData({
                        ...createFormData,
                        parameterName: value as WaterParameterName,
                      })
                    }
                    disabled={isCreating}
                  >
                    <SelectTrigger id="createParam">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {createParameterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minValue">Giá trị tối thiểu</Label>
                    <InputNumber
                      id="minValue"
                      placeholder="0"
                      value={createFormData.minValue}
                      onChange={(value) =>
                        setCreateFormData({
                          ...createFormData,
                          minValue: String(value),
                        })
                      }
                      disabled={isCreating}
                      allowDecimal={true}
                      decimalPlaces={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxValue">Giá trị tối đa</Label>
                    <InputNumber
                      id="maxValue"
                      placeholder="100"
                      value={createFormData.maxValue}
                      onChange={(value) =>
                        setCreateFormData({
                          ...createFormData,
                          maxValue: String(value),
                        })
                      }
                      disabled={isCreating}
                      allowDecimal={true}
                      decimalPlaces={2}
                    />
                  </div>
                </div>

                {paramUnits[createFormData.parameterName] && (
                  <div className="p-2 bg-white rounded border text-sm">
                    <span className="text-muted-foreground">Đơn vị: </span>
                    <span className="font-medium">
                      {paramUnits[createFormData.parameterName]}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleCreateSubmit}
                    disabled={
                      isCreating ||
                      !createFormData.minValue ||
                      !createFormData.maxValue
                    }
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Form */}
          {isEditFormOpen && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Chỉnh sửa thông số
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseEditForm}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editParam">Thông số</Label>
                  <Select
                    value={editFormData.parameterName}
                    onValueChange={(value) =>
                      setEditFormData({
                        ...editFormData,
                        parameterName: value as WaterParameterName,
                      })
                    }
                    disabled={isUpdating}
                  >
                    <SelectTrigger id="editParam">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {createParameterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editMinValue">Giá trị tối thiểu</Label>
                    <InputNumber
                      id="editMinValue"
                      placeholder="0"
                      value={editFormData.minValue}
                      onChange={(value) =>
                        setEditFormData({
                          ...editFormData,
                          minValue: String(value),
                        })
                      }
                      disabled={isUpdating}
                      allowDecimal={true}
                      decimalPlaces={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editMaxValue">Giá trị tối đa</Label>
                    <InputNumber
                      id="editMaxValue"
                      placeholder="100"
                      value={editFormData.maxValue}
                      onChange={(value) =>
                        setEditFormData({
                          ...editFormData,
                          maxValue: String(value),
                        })
                      }
                      disabled={isUpdating}
                      allowDecimal={true}
                      decimalPlaces={2}
                    />
                  </div>
                </div>

                {paramUnits[editFormData.parameterName] && (
                  <div className="p-2 bg-white rounded border text-sm">
                    <span className="text-muted-foreground">Đơn vị: </span>
                    <span className="font-medium">
                      {paramUnits[editFormData.parameterName]}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleEditSubmit}
                    disabled={
                      isUpdating ||
                      !editFormData.minValue ||
                      !editFormData.maxValue
                    }
                    className="flex-1"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      "Cập nhật"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Threshold Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : thresholds.length > 0 ? (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Thông số</TableHead>
                      <TableHead>Loại hồ</TableHead>
                      <TableHead className="text-right">
                        Giá trị tối thiểu
                      </TableHead>
                      <TableHead className="text-right">
                        Giá trị tối đa
                      </TableHead>
                      <TableHead className="text-center">Đơn vị</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {thresholds.map((threshold) => (
                      <TableRow
                        key={threshold.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {
                            parameterOptions.find(
                              (p) => p.value === threshold.parameterName,
                            )?.label
                          }
                        </TableCell>
                        <TableCell>{threshold.pondTypeName}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold">
                            {threshold.minValue}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold">
                            {threshold.maxValue}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {threshold.unit || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(threshold)}
                              disabled={isUpdating || isDeleting}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(threshold.id)}
                              disabled={isDeleting || isUpdating}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationWithLinks
                  // totalCount={totalItems}
                  pageSize={pageSize}
                  page={currentPage}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Không có dữ liệu thông số cho tham số này
              </p>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Xóa thông số
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thông số này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
