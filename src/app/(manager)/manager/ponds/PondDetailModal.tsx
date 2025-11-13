import { useState } from "react";
import { PondResponse } from "@/lib/api/services/fetchPond";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { getPondStatusLabel } from "@/lib/utils/enum";
import { formatDate } from "@/lib/utils/dates";
import { useGetWaterParameterRecords } from "@/hooks/useWaterParameterRecord";
import { PaginationSection } from "@/components/common/PaginationSection";

interface PondDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPond: PondResponse | null;
}

const PondDetailModal = ({
  isOpen,
  onOpenChange,
  selectedPond,
}: PondDetailModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: recordsData, isLoading: isLoadingRecords } =
    useGetWaterParameterRecords({
      pondId: selectedPond?.id,
      pageIndex: currentPage,
      pageSize: pageSize,
    });

  const records = recordsData?.data || [];
  const totalPages = recordsData?.totalPages || 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Chi tiết hồ cá: {selectedPond?.pondName}
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về hồ cá</DialogDescription>
        </DialogHeader>
        {selectedPond && (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Thông tin chung</TabsTrigger>
              <TabsTrigger value="records">Bản ghi thông số</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Tên hồ
                    </Label>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedPond.pondName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Địa điểm
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.location}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Khu vực
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.areaName}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Kích thước (Dài x Rộng)
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.lengthMeters}m x {selectedPond.widthMeters}m
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Độ sâu
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.depthMeters}m
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Sức chứa (Lít)
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.capacityLiters} Lít
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Trạng thái
                    </Label>
                    <div className="mt-2">
                      <Badge
                        className={`${getPondStatusLabel(selectedPond.pondStatus).colorClass} px-3 py-1 text-sm font-medium`}
                      >
                        {getPondStatusLabel(selectedPond.pondStatus).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Ngày tạo
                </Label>
                <p className="text-base text-gray-800 mt-1">
                  {formatDate(selectedPond.createdAt, "HH:mm dd/MM/yyyy")}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              {isLoadingRecords ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : records.length > 0 ? (
                <>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Ngày ghi nhận</TableHead>
                          <TableHead>Người ghi nhận</TableHead>
                          <TableHead className="text-right">pH</TableHead>
                          <TableHead className="text-right">Nhiệt độ (°C)</TableHead>
                          <TableHead className="text-right">Oxy (mg/L)</TableHead>
                          <TableHead className="text-right">Amoniac (mg/L)</TableHead>
                          <TableHead className="text-right">Nitrite (mg/L)</TableHead>
                          <TableHead className="text-right">Nitrate (mg/L)</TableHead>
                          <TableHead className="text-right">Độ cứng (°dH)</TableHead>
                          <TableHead className="text-right">Mức nước (m)</TableHead>
                          <TableHead>Ghi chú</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record) => (
                          <TableRow
                            key={record.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {formatDate(
                                record.recordedAt,
                                "HH:mm dd/MM/yyyy",
                              )}
                            </TableCell>
                            <TableCell>{record.recordedByUserName}</TableCell>
                            <TableCell className="text-right">
                              {record.phLevel}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.temperatureCelsius}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.oxygenLevel}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.ammoniaLevel}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.nitriteLevel}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.nitrateLevel}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.carbonHardness}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.waterLevelMeters}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {record.notes || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <PaginationSection
                      currentPage={currentPage}
                      setCurrentPage={handlePageChange}
                      totalPages={totalPages}
                      setPageSize={handlePageSizeChange}
                      pageSizeOptions={[10, 20, 50]}
                      hasNextPage={currentPage < totalPages}
                      hasPreviousPage={currentPage > 1}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Không có bản ghi thông số
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PondDetailModal;
