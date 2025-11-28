import { useState } from "react";
import { PondResponse } from "@/lib/api/services/fetchPond";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  getPondStatusLabel,
  getHealthStatusLabel,
  getGenderLabel,
  getSaleStatusLabel,
} from "@/lib/utils/enum";
import { formatDate } from "@/lib/utils/dates";
import { useGetWaterParameterRecords } from "@/hooks/useWaterParameterRecord";
import { useGetPondKoiFishes } from "@/hooks/usePond";
import { PaginationWithLinks } from "@/components/pagination";

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

  const { data: koiFishesData = [], isLoading: isLoadingKoiFishes } =
    useGetPondKoiFishes(selectedPond?.id);

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
      <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Chi tiết hồ cá: {selectedPond?.pondName}
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về hồ cá</DialogDescription>
        </DialogHeader>
        {selectedPond && (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Thông tin chung</TabsTrigger>
              <TabsTrigger value="koi-fish">Danh sách cá</TabsTrigger>
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
                      Loại hồ
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.pondTypeName || "-"}
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
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Kích thước (Dài x Rộng x Sâu)
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.lengthMeters}m x {selectedPond.widthMeters}m
                      x {selectedPond.depthMeters}m
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Sức chứa tối đa (Lít)
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.capacityLiters?.toLocaleString("vi-VN") ||
                        0}{" "}
                      Lít
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Dung tích hiện tại (Lít)
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.currentCapacity?.toLocaleString("vi-VN") ||
                        0}{" "}
                      Lít
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Số cá hiện tại / Tối đa
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedPond.currentCount || 0} /{" "}
                      {selectedPond.maxFishCount || 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Tình trạng
                    </Label>
                    <div className="mt-2">
                      <Badge
                        variant={
                          selectedPond.available ? "default" : "secondary"
                        }
                        className="px-3 py-1 text-sm font-medium"
                      >
                        {selectedPond.available ? "Có sẵn" : "Không có sẵn"}
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

            <TabsContent value="koi-fish" className="space-y-4">
              {isLoadingKoiFishes ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : koiFishesData.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>RFID</TableHead>
                        <TableHead>Giống cá</TableHead>
                        <TableHead>Giới tính</TableHead>
                        <TableHead>Kích thước</TableHead>
                        <TableHead>Tình trạng sức khỏe</TableHead>
                        <TableHead>Hoa văn</TableHead>
                        <TableHead>Trạng thái bán</TableHead>
                        <TableHead className="text-right">
                          Giá bán (₫)
                        </TableHead>
                        <TableHead>Ngày sinh</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {koiFishesData.map((koi) => {
                        const healthLabel = getHealthStatusLabel(
                          koi.healthStatus,
                        );
                        const genderLabel = getGenderLabel(koi.gender);
                        const saleLabel = getSaleStatusLabel(koi.saleStatus);

                        return (
                          <TableRow key={koi.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {koi.rfid}
                            </TableCell>
                            <TableCell>
                              {koi.variety?.varietyName || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {genderLabel.label}
                              </Badge>
                            </TableCell>
                            <TableCell>{koi.size} cm</TableCell>
                            <TableCell>
                              <Badge
                                className={`${healthLabel.colorClass} px-2 py-1`}
                              >
                                {healthLabel.label}
                              </Badge>
                            </TableCell>
                            <TableCell>{koi.pattern || "-"}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${saleLabel.colorClass} px-2 py-1`}
                              >
                                {saleLabel.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {koi.sellingPrice?.toLocaleString("vi-VN") || "-"}
                            </TableCell>
                            <TableCell>
                              {formatDate(koi.birthDate, "dd/MM/yyyy")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không có cá trong hồ</p>
                </div>
              )}
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
                          <TableHead className="text-right">
                            Nhiệt độ (°C)
                          </TableHead>
                          <TableHead className="text-right">
                            Oxy (mg/L)
                          </TableHead>
                          <TableHead className="text-right">
                            Amoniac (mg/L)
                          </TableHead>
                          <TableHead className="text-right">
                            Nitrite (mg/L)
                          </TableHead>
                          <TableHead className="text-right">
                            Nitrate (mg/L)
                          </TableHead>
                          <TableHead className="text-right">
                            Độ cứng (°dH)
                          </TableHead>
                          <TableHead className="text-right">
                            Mức nước (m)
                          </TableHead>
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
