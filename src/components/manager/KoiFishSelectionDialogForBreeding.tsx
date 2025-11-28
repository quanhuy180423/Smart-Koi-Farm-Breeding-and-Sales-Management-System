import { PaginationWithLinks } from "@/components/pagination";
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
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import {
  KoiFishSearchParams,
  Gender,
  HealthStatus,
} from "@/lib/api/services/fetchKoiFish";
import { getGenderLabel, getHealthStatusLabel } from "@/lib/utils/enum";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const isGender = (value: unknown): value is Gender => {
  return Object.values(Gender).includes(value as Gender);
};

const isHealthStatus = (value: unknown): value is HealthStatus => {
  return Object.values(HealthStatus).includes(value as HealthStatus);
};

interface KoiFishSelectionDialogForBreedingProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (fishId: number, fishName: string) => void;
  initialSelectedId?: number;
  title?: string;
  description?: string;
}

const PAGE_SIZE_OPTIONS: number[] = [5, 10, 20];

const KoiFishSelectionDialogForBreeding = ({
  isOpen,
  onOpenChange,
  onSelect,
  initialSelectedId,
  title = "Chọn Cá Koi",
  description = "Chọn cá koi để lọc danh sách",
}: KoiFishSelectionDialogForBreedingProps) => {
  const [fishSearchTerm, setFishSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | undefined>(
    initialSelectedId,
  );
  const [fishSearchParams, setFishSearchParams] = useState<KoiFishSearchParams>(
    {
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS[1], // 10 per page
      search: "",
    },
  );

  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFishSearchParams((prev) => ({
        ...prev,
        search: fishSearchTerm,
        pageIndex: 1,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [fishSearchTerm]);

  const { data: fishesData, isLoading: isTableLoading } =
    useGetKoiFishes(fishSearchParams);
  const fishes = fishesData?.data || [];
  const totalItems = fishesData?.totalItems || 0;

  const handlePageChange = (page: number) =>
    setFishSearchParams((prev) => ({ ...prev, pageIndex: page }));
  const handlePageSizeChange = (size: number) =>
    setFishSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));

  const handleConfirm = () => {
    if (selectedId) {
      const selectedFish = fishes.find((f) => f.id === selectedId);
      if (selectedFish) {
        onSelect(selectedId, selectedFish.rfid);
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm cá theo tên..."
            value={fishSearchTerm}
            onChange={(e) => setFishSearchTerm(e.target.value)}
            className="w-full"
          />

          {isTableLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải danh sách cá...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">#</TableHead>
                    <TableHead className="w-[25%]">RFID</TableHead>
                    <TableHead className="w-[15%]">Giới tính</TableHead>
                    <TableHead className="w-[15%]">Sức khỏe</TableHead>
                    <TableHead className="w-[15%]">Kích cỡ</TableHead>
                    <TableHead className="w-[25%]">Giống</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fishes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500 py-4"
                      >
                        Không tìm thấy cá nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    fishes.map((fish) => (
                      <TableRow
                        key={fish.id}
                        onClick={() => setSelectedId(fish.id)}
                        className={
                          fish.id === selectedId
                            ? "bg-blue-50/50 cursor-pointer"
                            : "hover:bg-gray-50 cursor-pointer"
                        }
                      >
                        <TableCell>
                          <input
                            type="radio"
                            checked={fish.id === selectedId}
                            onChange={() => setSelectedId(fish.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {fish.rfid}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {isGender(fish.gender)
                            ? getGenderLabel(fish.gender).label
                            : fish.gender}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              isHealthStatus(fish.healthStatus)
                                ? getHealthStatusLabel(fish.healthStatus)
                                    .colorClass
                                : ""
                            }`}
                          >
                            {isHealthStatus(fish.healthStatus)
                              ? getHealthStatusLabel(fish.healthStatus).label
                              : fish.healthStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {fish.size || "N/A"}
                        </TableCell>
                        <TableCell className="truncate text-sm text-gray-500">
                          {fish.variety?.varietyName || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <PaginationWithLinks
                  totalCount={totalItems}
                  pageSize={fishSearchParams.pageSize}
                  page={fishSearchParams.pageIndex}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
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
            Chọn Cá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KoiFishSelectionDialogForBreeding;
