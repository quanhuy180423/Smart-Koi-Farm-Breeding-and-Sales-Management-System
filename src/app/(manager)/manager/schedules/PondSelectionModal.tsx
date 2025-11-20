"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Filter } from "lucide-react";
import { useGetPonds } from "@/hooks/usePond";
import {
  PondResponse,
  PondSearchParams,
  PondStatus,
  PondTypeEnum,
} from "@/lib/api/services/fetchPond";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PaginationSection,
  PAGE_SIZE_OPTIONS_DEFAULT,
} from "@/components/common/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { getPondStatusLabel } from "@/lib/utils/enum";
import PondAdvancedFilterDialog, {
  PondAdvancedFilterState,
} from "@/components/manager/PondAdvancedFilterDialog";

interface PondSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPondIds: Set<number>;
  onTogglePond: (pondId: number) => void;
}

export default function PondSelectionModal({
  isOpen,
  onOpenChange,
  selectedPondIds,
  onTogglePond,
}: PondSelectionModalProps) {
  const [pondSearchTerm, setPondSearchTerm] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
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
  const [pondSearchParams, setPondSearchParams] = useState({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
  });

  const debouncedPondSearch = useDebounce(pondSearchTerm, 500);

  // Build search params with filters
  const searchParams: PondSearchParams = {
    pageIndex: pondSearchParams.pageIndex,
    pageSize: pondSearchParams.pageSize,
    search: debouncedPondSearch || undefined,
    status:
      filters.statusFilter && filters.statusFilter !== "all"
        ? ((filters.statusFilter.charAt(0).toUpperCase() +
            filters.statusFilter.slice(1)) as PondStatus)
        : undefined,
    areaId: filters.areaIdInput ? parseInt(filters.areaIdInput) : undefined,
    pondTypeId: filters.pondTypeIdInput
      ? parseInt(filters.pondTypeIdInput)
      : undefined,
    pondTypeEnum:
      filters.pondTypeEnumInput && filters.pondTypeEnumInput !== "all"
        ? (filters.pondTypeEnumInput as PondTypeEnum)
        : undefined,
    minCapacityLiters: filters.minCapacityInput
      ? parseInt(filters.minCapacityInput)
      : undefined,
    maxCapacityLiters: filters.maxCapacityInput
      ? parseInt(filters.maxCapacityInput)
      : undefined,
    minDepthMeters: filters.minDepthInput
      ? parseFloat(filters.minDepthInput)
      : undefined,
    maxDepthMeters: filters.maxDepthInput
      ? parseFloat(filters.maxDepthInput)
      : undefined,
    createdFrom: filters.createdFromInput || undefined,
    createdTo: filters.createdToInput || undefined,
  };

  const { data: pondsData, isLoading: isLoadingPonds } =
    useGetPonds(searchParams);

  const handleClose = () => {
    setPondSearchTerm("");
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
    setPondSearchParams({
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
    });
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onOpenChange(false);
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
  };

  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-5xl">
          <DialogHeader>
            <DialogTitle>Chọn hồ</DialogTitle>
            <DialogDescription>Chọn hồ để gán cho công việc</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm hồ theo tên..."
                value={pondSearchTerm}
                onChange={(e) => {
                  setPondSearchTerm(e.target.value);
                  setPondSearchParams((prev) => ({
                    ...prev,
                    search: e.target.value,
                    pageIndex: 1,
                  }));
                }}
                className="w-full"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Bộ lọc
              </Button>
            </div>

            {isLoadingPonds ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang tải danh sách hồ...
              </div>
            ) : (
              <>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[5%]">#</TableHead>
                        <TableHead className="w-[15%]">Tên hồ</TableHead>
                        <TableHead className="w-[12%]">
                          Thể tích (L×W×D)
                        </TableHead>
                        <TableHead className="w-[12%]">
                          Sức chứa (Lít)
                        </TableHead>
                        <TableHead className="w-[12%]">Khu vực</TableHead>
                        <TableHead className="w-[15%]">Địa điểm</TableHead>
                        <TableHead className="w-[12%]">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!pondsData?.data || pondsData.data.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center text-gray-500 py-4"
                          >
                            Không tìm thấy hồ nào.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pondsData.data.map((pond: PondResponse) => (
                          <TableRow
                            key={pond.id}
                            onClick={() => onTogglePond(pond.id)}
                            className={
                              selectedPondIds.has(pond.id)
                                ? "bg-blue-50/50 cursor-pointer"
                                : "hover:bg-gray-50 cursor-pointer"
                            }
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedPondIds.has(pond.id)}
                                onChange={() => onTogglePond(pond.id)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {pond.pondName}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {pond.lengthMeters}×{pond.widthMeters}×
                              {pond.depthMeters}m
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {pond.capacityLiters.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {pond.areaName || "-"}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {pond.location}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`text-xs ${getPondStatusLabel(pond.pondStatus).colorClass}`}
                              >
                                {getPondStatusLabel(pond.pondStatus).label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {pondsData && pondsData.totalItems > 0 && (
                  <PaginationSection
                    totalItems={pondsData.totalItems}
                    postsPerPage={pondSearchParams.pageSize}
                    currentPage={pondSearchParams.pageIndex}
                    setCurrentPage={(page) =>
                      setPondSearchParams((prev) => ({
                        ...prev,
                        pageIndex: page,
                      }))
                    }
                    totalPages={pondsData.totalPages}
                    setPageSize={(size) =>
                      setPondSearchParams((prev) => ({
                        ...prev,
                        pageSize: size,
                        pageIndex: 1,
                      }))
                    }
                    hasNextPage={pondsData.hasNextPage}
                    hasPreviousPage={pondsData.hasPreviousPage}
                    pageSizeOptions={[5, 10, 20]}
                  />
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedPondIds.size === 0 || isLoadingPonds}
            >
              Chọn ({selectedPondIds.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filter Dialog */}
      <PondAdvancedFilterDialog
        isOpen={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </>
  );
}
