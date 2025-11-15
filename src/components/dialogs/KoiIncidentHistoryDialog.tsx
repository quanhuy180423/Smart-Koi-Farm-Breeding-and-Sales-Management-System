"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useKoiIncident } from "@/hooks/useKoiIncident";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates/formatDate";
import { AffectedStatus } from "@/lib/api/services/fetchKoiIncident";
import { EmptyState } from "@/components/common/EmptyState";

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
    case AffectedStatus.WEAK:
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
    case AffectedStatus.WEAK:
      return "Yếu";
    case AffectedStatus.SICK:
      return "Bệnh";
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
  const {
    data: incidents,
    isLoading,
    error,
  } = useKoiIncident(koiFishId || 0, isOpen && !!koiFishId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">
                      Ngày phát hiện
                    </TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="font-semibold">Triệu chứng</TableHead>
                    <TableHead className="font-semibold">
                      Cần điều trị
                    </TableHead>
                    <TableHead className="font-semibold">Cách ly</TableHead>
                    <TableHead className="font-semibold">
                      Ngày hồi phục
                    </TableHead>
                    <TableHead className="font-semibold">
                      Ghi chú điều trị
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id} className="hover:bg-muted/30">
                      <TableCell className="text-sm">
                        {formatDate(
                          incident.affectedFrom,
                          DATE_FORMATS.MEDIUM_DATE,
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            incident.affectedStatus as AffectedStatus,
                          )} font-semibold text-xs`}
                        >
                          {getStatusLabel(
                            incident.affectedStatus as AffectedStatus,
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {incident.specificSymptoms || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            incident.requiresTreatment
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {incident.requiresTreatment ? "Có" : "Không"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            incident.isIsolated ? "destructive" : "outline"
                          }
                          className="text-xs"
                        >
                          {incident.isIsolated ? "Có" : "Không"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {incident.recoveredAt
                          ? formatDate(
                              incident.recoveredAt,
                              DATE_FORMATS.MEDIUM_DATE,
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs">
                        <p className="line-clamp-2">
                          {incident.treatmentNotes || "-"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
