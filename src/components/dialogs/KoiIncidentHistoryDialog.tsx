"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Eye } from "lucide-react";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates/formatDate";
import { EmptyState } from "@/components/common/EmptyState";
import { AffectedStatus } from "@/lib/api/services/fetchIncident";
import { useKoiIncident } from "@/hooks/useIncident";
import type { KoiIncidentHistory } from "@/lib/api/services/fetchIncident";

interface KoiIncidentHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  koiFishId: number | null;
  koiFishRFID: string;
}

const getStatusColor = (status: AffectedStatus) => {
  switch (status) {
    case AffectedStatus.HEALTHY:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case AffectedStatus.WARNING:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case AffectedStatus.SICK:
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getStatusLabel = (status: AffectedStatus) => {
  switch (status) {
    case AffectedStatus.HEALTHY:
      return "Khỏe mạnh";
    case AffectedStatus.WARNING:
      return "Yếu";
    case AffectedStatus.SICK:
      return "Bệnh";
    default:
      return status;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSeverityLabel = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "high":
      return "Cao";
    case "medium":
      return "Trung bình";
    case "low":
      return "Thấp";
    default:
      return severity;
  }
};

const getIncidentStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case "reported":
      return "Đã báo cáo";
    case "investigating":
      return "Đang điều tra";
    case "resolved":
      return "Đã xử lý";
    case "closed":
      return "Đóng";
    default:
      return status;
  }
};

export function KoiIncidentHistoryDialog({
  isOpen,
  onOpenChange,
  koiFishId,
  koiFishRFID,
}: KoiIncidentHistoryDialogProps) {
  const [selectedIncident, setSelectedIncident] =
    useState<KoiIncidentHistory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    data: incidents,
    isLoading,
    error,
  } = useKoiIncident(koiFishId || 0, isOpen && !!koiFishId);

  const handleViewDetail = (incident: KoiIncidentHistory) => {
    setSelectedIncident(incident);
    setIsDetailOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Lịch sử sự cố sức khỏe
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            RFID: {koiFishRFID}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Có lỗi xảy ra khi tải dữ liệu: {error.message}</p>
            </div>
          ) : !incidents || incidents.length === 0 ? (
            <EmptyState
              title="Không có lịch sử sự cố"
              description="Cá này không có bất kỳ sự cố sức khỏe nào được ghi lại"
            />
          ) : (
            <div className="rounded-lg border">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[10%] font-semibold">
                      Ngày phát hiện
                    </TableHead>
                    <TableHead className="w-[9%] font-semibold">
                      Trạng thái
                    </TableHead>
                    <TableHead className="w-[16%] font-semibold">
                      Triệu chứng
                    </TableHead>
                    <TableHead className="w-[11%] font-semibold">
                      Cần điều trị
                    </TableHead>
                    <TableHead className="w-[9%] font-semibold">
                      Cách ly
                    </TableHead>
                    <TableHead className="w-[10%] font-semibold">
                      Ngày hồi phục
                    </TableHead>
                    <TableHead className="w-[24%] font-semibold">
                      Ghi chú điều trị
                    </TableHead>
                    <TableHead className="w-[11%] text-center font-semibold">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id} className="hover:bg-muted/30">
                      <TableCell className="text-sm truncate">
                        {formatDate(
                          incident.affectedFrom,
                          DATE_FORMATS.MEDIUM_DATE,
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            incident.affectedStatus as AffectedStatus,
                          )} font-semibold text-xs whitespace-nowrap`}
                        >
                          {getStatusLabel(
                            incident.affectedStatus as AffectedStatus,
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm truncate">
                        {incident.specificSymptoms || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            incident.requiresTreatment
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs whitespace-nowrap"
                        >
                          {incident.requiresTreatment ? "Có" : "Không"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            incident.isIsolated ? "destructive" : "outline"
                          }
                          className="text-xs whitespace-nowrap"
                        >
                          {incident.isIsolated ? "Có" : "Không"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm truncate">
                        {incident.recoveredAt
                          ? formatDate(
                              incident.recoveredAt,
                              DATE_FORMATS.MEDIUM_DATE,
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <p className="line-clamp-2 break-words">
                          {incident.treatmentNotes || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Chi tiết"
                          onClick={() => handleViewDetail(incident)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết sự cố sức khỏe</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về sự cố của cá RFID: {koiFishRFID}
              </DialogDescription>
            </DialogHeader>

            {selectedIncident && (
              <div className="space-y-6">
                {/* Incident Type & Info */}
                {selectedIncident.incident && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Thông tin sự cố</h4>
                    <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Loại sự cố
                        </p>
                        <p className="font-medium text-sm">
                          {selectedIncident.incident.incidentTypeName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Tiêu đề sự cố
                        </p>
                        <p className="font-medium text-sm">
                          {selectedIncident.incident.incidentTitle}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Mô tả chi tiết
                        </p>
                        <p className="text-sm bg-white/50 p-2 rounded">
                          {selectedIncident.incident.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Mức độ nghiêm trọng
                          </p>
                          <Badge
                            className={`${getSeverityColor(
                              selectedIncident.incident.severity,
                            )} font-semibold text-xs`}
                          >
                            {getSeverityLabel(
                              selectedIncident.incident.severity,
                            )}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Trạng thái sự cố
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {getIncidentStatusLabel(
                              selectedIncident.incident.status,
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Affected Fish Status */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold text-sm">
                    Trạng thái cá bị ảnh hưởng
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Ngày phát hiện
                      </p>
                      <p className="font-medium text-sm">
                        {formatDate(
                          selectedIncident.affectedFrom,
                          DATE_FORMATS.MEDIUM_DATE,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Tình trạng sức khỏe
                      </p>
                      <Badge
                        className={`${getStatusColor(
                          selectedIncident.affectedStatus as AffectedStatus,
                        )} font-semibold text-xs mt-1 inline-block`}
                      >
                        {getStatusLabel(
                          selectedIncident.affectedStatus as AffectedStatus,
                        )}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Ngày hồi phục
                      </p>
                      <p className="font-medium text-sm">
                        {selectedIncident.recoveredAt
                          ? formatDate(
                              selectedIncident.recoveredAt,
                              DATE_FORMATS.MEDIUM_DATE,
                            )
                          : "Chưa hồi phục"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Symptoms & Treatment */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold text-sm">
                    Triệu chứng và điều trị
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Triệu chứng cụ thể
                      </p>
                      <p className="text-sm bg-muted/50 p-2 rounded">
                        {selectedIncident.specificSymptoms || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Ghi chú điều trị
                      </p>
                      <p className="text-sm bg-muted/50 p-2 rounded">
                        {selectedIncident.treatmentNotes || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Treatment Status */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold text-sm">Biện pháp điều trị</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Cần điều trị
                      </p>
                      <Badge
                        variant={
                          selectedIncident.requiresTreatment
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {selectedIncident.requiresTreatment ? "Có" : "Không"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Cách ly
                      </p>
                      <Badge
                        variant={
                          selectedIncident.isIsolated
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {selectedIncident.isIsolated ? "Có" : "Không"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
