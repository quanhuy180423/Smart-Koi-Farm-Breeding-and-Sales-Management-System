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
import { useGetPonds } from "@/hooks/usePond";
import {
  PondSearchParams,
  PondStatus,
  PondTypeEnum,
} from "@/lib/api/services/fetchPond";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PondSelectionDialogForIncidentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (pondId: number, pondName: string) => void;
  initialSelectedId?: number;
}

const PAGE_SIZE_OPTIONS: number[] = [5, 10, 20];

const PondSelectionDialogForIncident = ({
  isOpen,
  onOpenChange,
  onSelect,
  initialSelectedId,
}: PondSelectionDialogForIncidentProps) => {
  const [pondSearchTerm, setPondSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPondType, setFilterPondType] = useState<string>("all");
  const [filterAvailable, setFilterAvailable] = useState<string>("all");
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
        status:
          filterStatus !== "all" ? (filterStatus as PondStatus) : undefined,
        pondTypeEnum:
          filterPondType !== "all"
            ? (filterPondType as PondTypeEnum)
            : undefined,
        available:
          filterAvailable === "all" ? undefined : filterAvailable === "true",
        pageIndex: 1,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [pondSearchTerm, filterStatus, filterPondType, filterAvailable]);

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
          <DialogDescription>Chọn hồ cá để lọc sự cố</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm hồ theo tên..."
            value={pondSearchTerm}
            onChange={(e) => setPondSearchTerm(e.target.value)}
            className="w-full"
          />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Trạng thái</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full bg-white h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={PondStatus.ACTIVE}>Hoạt động</SelectItem>
                  <SelectItem value={PondStatus.EMPTY}>Trống</SelectItem>
                  <SelectItem value={PondStatus.MAINTENANCE}>
                    Bảo trì
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pond Type Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Loại hồ</label>
              <Select value={filterPondType} onValueChange={setFilterPondType}>
                <SelectTrigger className="w-full bg-white h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={PondTypeEnum.PARING}>Ghép cặp</SelectItem>
                  <SelectItem value={PondTypeEnum.EGG_BATCH}>
                    Ấp trứng
                  </SelectItem>
                  <SelectItem value={PondTypeEnum.FRY_FISH}>Cá con</SelectItem>
                  <SelectItem value={PondTypeEnum.CLASSIFICATION}>
                    Tuyển chọn
                  </SelectItem>
                  <SelectItem value={PondTypeEnum.MARKET_POND}>
                    Thương mại
                  </SelectItem>
                  <SelectItem value={PondTypeEnum.BROOD_STOCK}>
                    Cơ sở giống
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Tình trạng</label>
              <Select
                value={filterAvailable}
                onValueChange={setFilterAvailable}
              >
                <SelectTrigger className="w-full bg-white h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="true">Có sẵn</SelectItem>
                  <SelectItem value="false">Không có sẵn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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

export default PondSelectionDialogForIncident;
