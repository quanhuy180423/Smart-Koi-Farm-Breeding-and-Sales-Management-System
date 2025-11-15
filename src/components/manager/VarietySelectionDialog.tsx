import { PaginationSection } from "@/components/common/PaginationSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetVarieties } from "@/hooks/useVariety";
import { VarietySearchParams } from "@/lib/api/services/fetchVariety";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface VarietySelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (varietyId: number, varietyName: string) => void;
  initialSelectedId?: number;
}

const PAGE_SIZE_OPTIONS: number[] = [5, 10, 20];

const VarietySelectionDialog = ({
  isOpen,
  onOpenChange,
  onSelect,
  initialSelectedId,
}: VarietySelectionDialogProps) => {
  const [varietySearchTerm, setVarietySearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | undefined>(
    initialSelectedId,
  );
  const [varietySearchParams, setVarietySearchParams] =
    useState<VarietySearchParams>({
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS[0],
      search: "",
    });

  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVarietySearchParams((prev) => ({
        ...prev,
        search: varietySearchTerm,
        pageIndex: 1,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [varietySearchTerm]);

  const { data: varietiesData, isLoading: isTableLoading } =
    useGetVarieties(varietySearchParams);
  const varieties = varietiesData?.data || [];
  const totalItems = varietiesData?.totalItems || 0;
  const totalPages = varietiesData?.totalPages || 0;

  const handlePageChange = (page: number) =>
    setVarietySearchParams((prev) => ({ ...prev, pageIndex: page }));
  const handlePageSizeChange = (size: number) =>
    setVarietySearchParams((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 1,
    }));

  const handleConfirm = () => {
    if (selectedId) {
      const selectedVariety = varieties.find((v) => v.id === selectedId);
      if (selectedVariety) {
        onSelect(selectedId, selectedVariety.varietyName);
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chọn Giống cá</DialogTitle>
          <DialogDescription>Chọn giống cá để lọc danh sách</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm giống theo tên..."
            value={varietySearchTerm}
            onChange={(e) => setVarietySearchTerm(e.target.value)}
            className="w-full"
          />

          {isTableLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải danh sách giống...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">#</TableHead>
                    <TableHead className="w-[30%]">Tên Giống</TableHead>
                    <TableHead className="w-[30%]">Đặc điểm</TableHead>
                    <TableHead className="w-[35%]">Xuất xứ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {varieties.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-4"
                      >
                        Không tìm thấy giống nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    varieties.map((variety) => (
                      <TableRow
                        key={variety.id}
                        onClick={() => setSelectedId(variety.id)}
                        className={
                          variety.id === selectedId
                            ? "bg-blue-50/50 cursor-pointer"
                            : "hover:bg-gray-50 cursor-pointer"
                        }
                      >
                        <TableCell>
                          <input
                            type="radio"
                            checked={variety.id === selectedId}
                            onChange={() => setSelectedId(variety.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {variety.varietyName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {variety.characteristic || "N/A"}
                        </TableCell>
                        <TableCell className="truncate text-sm text-gray-500">
                          {variety.originCountry || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <PaginationSection
                  totalItems={totalItems}
                  postsPerPage={varietySearchParams.pageSize}
                  currentPage={varietySearchParams.pageIndex}
                  setCurrentPage={handlePageChange}
                  totalPages={totalPages}
                  setPageSize={handlePageSizeChange}
                  hasNextPage={varietiesData?.hasNextPage}
                  hasPreviousPage={varietiesData?.hasPreviousPage}
                  pageSizeOptions={[5, 10, 20]}
                />
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedId || isTableLoading}
          >
            Chọn Giống
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VarietySelectionDialog;
