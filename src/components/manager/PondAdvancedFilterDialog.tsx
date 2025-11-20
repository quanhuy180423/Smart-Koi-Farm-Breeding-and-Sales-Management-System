"use client";

import { useCallback, useState } from "react";
import { ChevronRight } from "lucide-react";
import AreaFilterSelectionDialog from "./AreaFilterSelectionDialog";
import PondTypeFilterSelectionDialog from "./PondTypeFilterSelectionDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputNumber } from "@/components/ui/input-number";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAreas } from "@/hooks/useArea";
import { useGetPondTypes } from "@/hooks/usePondType";
import { DatePickerFilter } from "@/components/ui/DatePickerFilter";
import { PondStatus, PondTypeEnum } from "@/lib/api/services/fetchPond";
import { PondTypeEnum as PondTypeEnumLabel } from "@/lib/api/services/fetchPond";
import { getPondStatusLabel, getPondTypeLabel } from "@/lib/utils/enum";

export interface PondAdvancedFilterState {
  statusFilter: string;
  areaIdInput: string;
  pondTypeIdInput: string;
  pondTypeEnumInput: string;
  minCapacityInput: string;
  maxCapacityInput: string;
  minDepthInput: string;
  maxDepthInput: string;
  createdFromInput: string;
  createdToInput: string;
}

interface PondAdvancedFilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PondAdvancedFilterState;
  onFiltersChange: (filters: PondAdvancedFilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function PondAdvancedFilterDialog({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  onApply,
  onReset,
}: PondAdvancedFilterDialogProps) {
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [isPondTypeDialogOpen, setIsPondTypeDialogOpen] = useState(false);

  // Fetch areas and pond types for getting names
  const { data: areasData } = useGetAreas({
    pageIndex: 1,
    pageSize: 100,
  });

  const { data: pondTypesData } = useGetPondTypes({
    pageIndex: 1,
    pageSize: 100,
  });

  // Helper function to get area name by ID
  const getAreaName = useCallback(
    (areaId: number | null) => {
      if (!areaId || !areasData?.data) return null;
      return areasData.data.find((a) => a.id === areaId)?.areaName;
    },
    [areasData],
  );

  // Helper function to get pond type name by ID
  const getPondTypeName = useCallback(
    (pondTypeId: number | null) => {
      if (!pondTypeId || !pondTypesData?.data) return null;
      return pondTypesData.data.find((p) => p.id === pondTypeId)?.typeName;
    },
    [pondTypesData],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        statusFilter: value,
      });
    },
    [filters, onFiltersChange],
  );

  const handleAreaIdChange = useCallback(
    (value: number) => {
      onFiltersChange({
        ...filters,
        areaIdInput: value ? String(value) : "",
      });
    },
    [filters, onFiltersChange],
  );

  const handlePondTypeIdChange = useCallback(
    (value: number) => {
      onFiltersChange({
        ...filters,
        pondTypeIdInput: value ? String(value) : "",
      });
    },
    [filters, onFiltersChange],
  );

  const handlePondTypeEnumChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        pondTypeEnumInput: value,
      });
    },
    [filters, onFiltersChange],
  );

  const handleMinCapacityChange = useCallback(
    (value: number) => {
      onFiltersChange({
        ...filters,
        minCapacityInput: value ? String(value) : "",
      });
    },
    [filters, onFiltersChange],
  );

  const handleMaxCapacityChange = useCallback(
    (value: number) => {
      onFiltersChange({
        ...filters,
        maxCapacityInput: value ? String(value) : "",
      });
    },
    [filters, onFiltersChange],
  );

  const handleMinDepthChange = useCallback(
    (value: number) => {
      onFiltersChange({
        ...filters,
        minDepthInput: value ? String(value) : "",
      });
    },
    [filters, onFiltersChange],
  );

  const handleMaxDepthChange = useCallback(
    (value: number) => {
      onFiltersChange({
        ...filters,
        maxDepthInput: value ? String(value) : "",
      });
    },
    [filters, onFiltersChange],
  );

  const handleCreatedFromChange = useCallback(
    (dateString: string) => {
      onFiltersChange({
        ...filters,
        createdFromInput: dateString,
      });
    },
    [filters, onFiltersChange],
  );

  const handleCreatedToChange = useCallback(
    (dateString: string) => {
      onFiltersChange({
        ...filters,
        createdToInput: dateString,
      });
    },
    [filters, onFiltersChange],
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc Hồ Cá Nâng cao</DialogTitle>
            <DialogDescription>
              Lọc danh sách hồ cá theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="pondStatus">Trạng thái</Label>
                <Select
                  value={filters.statusFilter}
                  onValueChange={handleStatusChange}
                >
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
                <Label htmlFor="pondTypeEnum">Loại Hồ</Label>
                <Select
                  value={filters.pondTypeEnumInput}
                  onValueChange={handlePondTypeEnumChange}
                >
                  <SelectTrigger className="border-2 w-full border-gray-400">
                    <SelectValue placeholder="Chọn loại hồ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại hồ</SelectItem>
                    {Object.values(PondTypeEnum).map((type) => {
                      // Map from fetchPond enum values to fetchPondType enum values for label lookup
                      const labelEnumValue =
                        type as unknown as PondTypeEnumLabel;
                      return (
                        <SelectItem key={type} value={type}>
                          {getPondTypeLabel(labelEnumValue).label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="areaId">Khu vực</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 border-2 border-gray-400"
                  onClick={() => setIsAreaDialogOpen(true)}
                >
                  <span>
                    {filters.areaIdInput
                      ? getAreaName(Number(filters.areaIdInput)) ||
                        "Chọn Khu vực..."
                      : "Chọn Khu vực..."}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="pondTypeId">Loại Hồ</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 border-2 border-gray-400"
                  onClick={() => setIsPondTypeDialogOpen(true)}
                >
                  <span>
                    {filters.pondTypeIdInput
                      ? getPondTypeName(Number(filters.pondTypeIdInput)) ||
                        "Chọn Loại Hồ..."
                      : "Chọn Loại Hồ..."}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              </div>
            </div>

            <div className="space-y-6 border-t pt-4">
              {/* Capacity Range Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Lọc theo Sức chứa (Lít)
                  </p>
                  <div className="text-sm text-gray-600">
                    {filters.minCapacityInput || 0} -{" "}
                    {filters.maxCapacityInput || 10000} Lít
                  </div>
                </div>

                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={[
                    filters.minCapacityInput
                      ? Number(filters.minCapacityInput)
                      : 0,
                    filters.maxCapacityInput
                      ? Number(filters.maxCapacityInput)
                      : 10000,
                  ]}
                  onValueChange={(values) => {
                    onFiltersChange({
                      ...filters,
                      minCapacityInput: String(values[0]),
                      maxCapacityInput: String(values[1]),
                    });
                  }}
                  className="w-full"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minCapacity">Tối thiểu (Lít)</Label>
                    <InputNumber
                      value={
                        filters.minCapacityInput
                          ? Number(filters.minCapacityInput)
                          : undefined
                      }
                      onChange={handleMinCapacityChange}
                      placeholder="0"
                      min={0}
                      max={10000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Tối đa (Lít)</Label>
                    <InputNumber
                      value={
                        filters.maxCapacityInput
                          ? Number(filters.maxCapacityInput)
                          : undefined
                      }
                      onChange={handleMaxCapacityChange}
                      placeholder="10000"
                      min={0}
                      max={10000}
                    />
                  </div>
                </div>
              </div>

              {/* Depth Range Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Lọc theo Độ sâu (Mét)
                  </p>
                  <div className="text-sm text-gray-600">
                    {filters.minDepthInput || 0} - {filters.maxDepthInput || 10}{" "}
                    m
                  </div>
                </div>

                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  value={[
                    filters.minDepthInput ? Number(filters.minDepthInput) : 0,
                    filters.maxDepthInput ? Number(filters.maxDepthInput) : 10,
                  ]}
                  onValueChange={(values) => {
                    onFiltersChange({
                      ...filters,
                      minDepthInput: String(Math.round(values[0] * 10) / 10),
                      maxDepthInput: String(Math.round(values[1] * 10) / 10),
                    });
                  }}
                  className="w-full"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minDepth">Tối thiểu (m)</Label>
                    <InputNumber
                      value={
                        filters.minDepthInput
                          ? Number(filters.minDepthInput)
                          : undefined
                      }
                      onChange={handleMinDepthChange}
                      placeholder="0"
                      min={0}
                      max={10}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDepth">Tối đa (m)</Label>
                    <InputNumber
                      value={
                        filters.maxDepthInput
                          ? Number(filters.maxDepthInput)
                          : undefined
                      }
                      onChange={handleMaxDepthChange}
                      placeholder="10"
                      min={0}
                      max={10}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Ngày tạo
              </p>
              <DatePickerFilter
                label="Từ ngày"
                value={filters.createdFromInput}
                onChange={handleCreatedFromChange}
              />
              <DatePickerFilter
                label="Đến ngày"
                value={filters.createdToInput}
                onChange={handleCreatedToChange}
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={onReset}>
              Đặt lại
            </Button>
            <Button onClick={onApply}>Áp dụng bộ lọc</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Area Selection Dialog */}
      <AreaFilterSelectionDialog
        isOpen={isAreaDialogOpen}
        onOpenChange={setIsAreaDialogOpen}
        onSelect={(areaId) => {
          handleAreaIdChange(areaId ? areaId : 0);
        }}
        selectedId={filters.areaIdInput ? Number(filters.areaIdInput) : null}
      />

      {/* Pond Type Selection Dialog */}
      <PondTypeFilterSelectionDialog
        isOpen={isPondTypeDialogOpen}
        onOpenChange={setIsPondTypeDialogOpen}
        onSelect={(pondTypeId) => {
          handlePondTypeIdChange(pondTypeId ? pondTypeId : 0);
        }}
        selectedId={
          filters.pondTypeIdInput ? Number(filters.pondTypeIdInput) : null
        }
      />
    </>
  );
}
