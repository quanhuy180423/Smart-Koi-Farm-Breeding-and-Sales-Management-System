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
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Ruler, Droplet, Fish, Calendar } from "lucide-react";
import {
  getPondStatusLabel,
  getHealthStatusLabel,
  getGenderLabel,
  getSaleStatusLabel,
} from "@/lib/utils/enum";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { useGetWaterParameterRecords } from "@/hooks/useWaterParameterRecord";
import { useGetPondKoiFishes } from "@/hooks/usePond";
import { PaginationWithLinks } from "@/components/pagination";
import formatCurrency from "@/lib/utils/numbers";

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
      <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {selectedPond?.pondName}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Thông tin chi tiết và quản lý hồ cá
          </DialogDescription>
        </DialogHeader>
        {selectedPond && (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Thông tin chung</TabsTrigger>
              <TabsTrigger value="koi-fish">Danh sách cá</TabsTrigger>
              <TabsTrigger value="records">Bản ghi thông số</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 mt-6">
              {/* Status Overview */}
              <div className="grid grid-cols-2 gap-2">
                <Card className="border-2 py-3">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Trạng thái hồ
                      </p>
                      <Badge
                        className={`${getPondStatusLabel(selectedPond.pondStatus).colorClass} px-3 py-1 text-sm font-medium`}
                      >
                        {getPondStatusLabel(selectedPond.pondStatus).label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 py-3">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Tình trạng
                      </p>
                      <Badge
                        variant={
                          selectedPond.available ? "default" : "secondary"
                        }
                        className="px-3 py-1 text-sm font-medium"
                      >
                        {selectedPond.available ? "Có sẵn" : "Không có sẵn"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Basic Information */}
              <Card className="border-2">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 px-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Tên hồ
                          </Label>
                          <p className="text-base font-semibold text-gray-900 mt-1">
                            {selectedPond.pondName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 px-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Loại hồ
                          </Label>
                          <p className="text-base text-gray-900 mt-1">
                            {selectedPond.pondTypeName || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 px-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Khu vực
                          </Label>
                          <p className="text-base text-gray-900 mt-1">
                            {selectedPond.areaName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 px-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Địa điểm
                          </Label>
                          <p className="text-base text-gray-900 mt-1">
                            {selectedPond.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dimensions & Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-green-600" />
                      Kích thước
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">
                          Chiều dài
                        </span>
                        <span className="font-semibold">
                          {selectedPond.lengthMeters}m
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">
                          Chiều rộng
                        </span>
                        <span className="font-semibold">
                          {selectedPond.widthMeters}m
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">
                          Độ sâu
                        </span>
                        <span className="font-semibold">
                          {selectedPond.depthMeters}m
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-cyan-600" />
                      Dung tích & Số lượng
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">
                          Sức chứa tối đa
                        </span>
                        <span className="font-semibold">
                          {selectedPond.capacityLiters?.toLocaleString(
                            "vi-VN"
                          ) || 0}{" "}
                          L
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">
                          Dung tích hiện tại
                        </span>
                        <span className="font-semibold">
                          {selectedPond.currentCapacity?.toLocaleString(
                            "vi-VN"
                          ) || 0}{" "}
                          L
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">
                          Số cá (hiện tại/tối đa)
                        </span>
                        <span className="font-semibold">
                          {selectedPond.currentCount || 0} /{" "}
                          {selectedPond.maxFishCount || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Creation Date */}
              <Card className="border-2">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Ngày tạo
                      </Label>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {formatDate(selectedPond.createdAt, DATE_FORMATS.DATETIME_24H)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="koi-fish" className="space-y-4 mt-6">
              {isLoadingKoiFishes ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Đang tải danh sách cá...
                  </p>
                </div>
              ) : koiFishesData.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Fish className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">
                      Danh sách cá trong hồ ({koiFishesData.length})
                    </h3>
                  </div>
                  <div className="border-2 rounded-lg overflow-hidden shadow-sm">
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
                            koi.healthStatus
                          );
                          const genderLabel = getGenderLabel(koi.gender);
                          const saleLabel = getSaleStatusLabel(koi.saleStatus);

                          return (
                            <TableRow
                              key={koi.id}
                              className="hover:bg-muted/50"
                            >
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
                                {formatCurrency(koi.sellingPrice) ||
                                  "-"}
                              </TableCell>
                              <TableCell>
                                {formatDate(koi.birthDate, DATE_FORMATS.MEDIUM_DATE)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 border-2 rounded-lg border-dashed">
                  <Fish className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Không có cá trong hồ
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hồ này hiện chưa có cá nào
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="records" className="space-y-4 mt-6">
              {isLoadingRecords ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Đang tải bản ghi thông số...
                  </p>
                </div>
              ) : records.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Droplet className="h-5 w-5 text-cyan-600" />
                    <h3 className="text-lg font-semibold">
                      Lịch sử thông số nước
                    </h3>
                  </div>
                  <div className="border-2 rounded-lg overflow-hidden shadow-sm">
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
                                "HH:mm dd/MM/yyyy"
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
                    <div className="mt-4">
                      <PaginationWithLinks
                        pageSize={pageSize}
                        page={currentPage}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 border-2 rounded-lg border-dashed">
                  <Droplet className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Không có bản ghi thông số
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Chưa có dữ liệu ghi nhận thông số nước cho hồ này
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
