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
import { Loader2 } from "lucide-react";
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse, PondSearchParams } from "@/lib/api/services/fetchPond";
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
  const [pondSearchParams, setPondSearchParams] = useState({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
  });

  const debouncedPondSearch = useDebounce(pondSearchTerm, 500);

  const { data: pondsData, isLoading: isLoadingPonds } = useGetPonds({
    pageIndex: pondSearchParams.pageIndex,
    pageSize: pondSearchParams.pageSize,
    search: debouncedPondSearch || undefined,
  } as PondSearchParams);

  const handleClose = () => {
    setPondSearchTerm("");
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chọn hồ</DialogTitle>
          <DialogDescription>Chọn hồ để gán cho công việc</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search Input */}
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

          {isLoadingPonds ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải danh sách hồ...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">#</TableHead>
                    <TableHead className="w-[45%]">Tên hồ</TableHead>
                    <TableHead className="w-[50%]">Địa điểm</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!pondsData?.data || pondsData.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
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
                        <TableCell className="font-medium">
                          {pond.pondName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {pond.location}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

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
  );
}
