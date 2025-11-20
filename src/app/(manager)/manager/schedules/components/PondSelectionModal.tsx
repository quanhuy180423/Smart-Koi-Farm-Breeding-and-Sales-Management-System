"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check } from "lucide-react";
import { useGetPonds } from "@/hooks/usePond";
import { PondResponse, PondSearchParams } from "@/lib/api/services/fetchPond";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationWithLinks } from "@/components/pagination";

const PAGE_SIZE_OPTIONS = [10, 20, 30];

interface PondSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPondIds: Set<number>;
  onTogglePond: (pondId: number) => void;
  selectionMode?: "single" | "multiple";
  onSelectSingle?: (pond: PondResponse) => void;
}

export default function PondSelectionModal({
  isOpen,
  onOpenChange,
  selectedPondIds,
  onTogglePond,
  selectionMode = "multiple",
  onSelectSingle,
}: PondSelectionModalProps) {
  const [pondSearchTerm, setPondSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const debouncedPondSearch = useDebounce(pondSearchTerm, 500);

  const { data: pondsData, isLoading: isLoadingPonds } = useGetPonds({
    pageIndex: currentPage,
    pageSize: pageSize,
    search: debouncedPondSearch || undefined,
  } as PondSearchParams);

  const handleClose = () => {
    setPondSearchTerm("");
    setCurrentPage(1);
    setPageSize(PAGE_SIZE_OPTIONS[0]);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onOpenChange(false);
  };

  const handlePondClick = (pond: PondResponse) => {
    if (selectionMode === "single" && onSelectSingle) {
      onSelectSingle(pond);
      onOpenChange(false);
    } else {
      onTogglePond(pond.id);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[700px] flex flex-col">
        <SheetHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <SheetTitle>Chọn hồ</SheetTitle>
          <SheetDescription>Chọn hồ để gán cho công việc</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Search Input */}
          <Input
            placeholder="Tìm kiếm hồ theo tên..."
            value={pondSearchTerm}
            onChange={(e) => {
              setPondSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full"
          />

          {/* Selected Count */}
          {selectedPondIds.size > 0 && (
            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              Đã chọn {selectedPondIds.size} hồ
            </div>
          )}

          {isLoadingPonds ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải danh sách hồ...
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {!pondsData?.data || pondsData.data.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Không tìm thấy hồ nào.
                  </div>
                ) : (
                  pondsData.data.map((pond: PondResponse) => {
                    const isSelected = selectedPondIds.has(pond.id);
                    const isActive =
                      selectionMode === "single" ? false : isSelected;

                    return (
                      <div
                        key={pond.id}
                        onClick={() => handlePondClick(pond)}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${
                            isActive
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }
                        `}
                      >
                        {/* Icon/Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {pond.pondName.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {pond.pondName}
                            </h4>
                            {selectionMode === "multiple" && isSelected && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            📍 {pond.location}
                          </p>
                          {pond.pondTypeName && (
                            <p className="text-xs text-gray-500">
                              🏷️ {pond.pondTypeName}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {pondsData && pondsData.totalItems > 0 && (
                <PaginationWithLinks
                  totalCount={pondsData.totalItems}
                  pageSize={pageSize}
                  page={currentPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </div>

        <SheetFooter className="sticky bottom-0 bg-white border-t pt-4 mt-auto">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Hủy
          </Button>
          {selectionMode === "multiple" && (
            <Button
              onClick={handleConfirm}
              disabled={selectedPondIds.size === 0 || isLoadingPonds}
              className="flex-1"
            >
              Chọn ({selectedPondIds.size})
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
