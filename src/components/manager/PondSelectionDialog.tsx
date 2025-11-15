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
import { useGetPonds } from "@/hooks/usePond";
import { PondSearchParams } from "@/lib/api/services/fetchPond";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PondSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (pondId: number, pondName: string) => void;
  initialSelectedId?: number;
}

const PAGE_SIZE_OPTIONS: number[] = [5, 10, 20];

const PondSelectionDialog = ({
  isOpen,
  onOpenChange,
  onSelect,
  initialSelectedId,
}: PondSelectionDialogProps) => {
  const [pondSearchTerm, setPondSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | undefined>(
    initialSelectedId,
  );
  const [pondSearchParams, setPondSearchParams] = useState<PondSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    search: "",
  });

  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPondSearchParams((prev) => ({
        ...prev,
        search: pondSearchTerm,
        pageIndex: 1,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [pondSearchTerm]);

  const { data: pondsData, isLoading: isTableLoading } =
    useGetPonds(pondSearchParams);
  const ponds = pondsData?.data || [];
  const totalItems = pondsData?.totalItems || 0;
  const totalPages = pondsData?.totalPages || 0;

  const handlePageChange = (page: number) =>
    setPondSearchParams((prev) => ({ ...prev, pageIndex: page }));
  const handlePageSizeChange = (size: number) =>
    setPondSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));

  const handleConfirm = () => {
    if (selectedId) {
      const selectedPond = ponds.find((p) => p.id === selectedId);
      if (selectedPond) {
        onSelect(selectedId, selectedPond.pondName);
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chọn Hồ cá</DialogTitle>
          <DialogDescription>
            Chọn hồ cá để xem cảnh báo chất lượng nước
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm hồ theo tên..."
            value={pondSearchTerm}
            onChange={(e) => setPondSearchTerm(e.target.value)}
            className="w-full"
          />

          {isTableLoading ? (
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
                    <TableHead className="w-[30%]">Tên Hồ</TableHead>
                    <TableHead className="w-[20%]">Khu vực</TableHead>
                    <TableHead className="w-[45%]">Vị trí</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ponds.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-4"
                      >
                        Không tìm thấy hồ nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ponds.map((pond) => (
                      <TableRow
                        key={pond.id}
                        onClick={() => setSelectedId(pond.id)}
                        className={
                          pond.id === selectedId
                            ? "bg-blue-50/50 cursor-pointer"
                            : "hover:bg-gray-50 cursor-pointer"
                        }
                      >
                        <TableCell>
                          <input
                            type="radio"
                            checked={pond.id === selectedId}
                            onChange={() => setSelectedId(pond.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {pond.pondName}
                        </TableCell>
                        <TableCell>{pond.areaName || "N/A"}</TableCell>
                        <TableCell className="truncate text-sm text-gray-500">
                          {pond.location || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <PaginationSection
                  totalItems={totalItems}
                  postsPerPage={pondSearchParams.pageSize}
                  currentPage={pondSearchParams.pageIndex}
                  setCurrentPage={handlePageChange}
                  totalPages={totalPages}
                  setPageSize={handlePageSizeChange}
                  hasNextPage={pondsData?.hasNextPage}
                  hasPreviousPage={pondsData?.hasPreviousPage}
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
            Chọn Hồ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PondSelectionDialog;
