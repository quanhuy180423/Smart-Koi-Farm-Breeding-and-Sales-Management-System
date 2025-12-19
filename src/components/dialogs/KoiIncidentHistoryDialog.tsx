"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates/formatDate";
import { EmptyState } from "@/components/common/EmptyState";
import { AffectedStatus } from "@/lib/api/services/fetchIncident";
import { useKoiIncident } from "@/hooks/useIncident";
import { cn } from "@/lib/utils";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";

interface KoiIncidentHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  koiFish: KoiFishResponse | null;
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
  koiFish,
}: KoiIncidentHistoryDialogProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const {
    data: incidents,
    isLoading,
    error,
  } = useKoiIncident(koiFish?.id || 0, isOpen && !!koiFish?.id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Lịch sử sự cố sức khỏe
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            RFID: {koiFish?.rfid}
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
            <div className="space-y-3">
              {incidents.map((incident) => {
                const isExpanded = expandedId === incident.id;
                const statusColor = getStatusColor(
                  incident.affectedStatus as AffectedStatus
                );
                const statusLabel = getStatusLabel(
                  incident.affectedStatus as AffectedStatus
                );

                return (
                  <div
                    key={incident.id}
                    className="relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Header */}
                    <div
                      className="px-4 py-3 bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : incident.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Status Badge Circle with Image */}
                          <div
                            className={cn(
                              "p-0.5 rounded-full border-2",
                              statusColor
                            )}
                          >
                            {koiFish?.images && koiFish.images.length > 0 ? (
                              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                <Image
                                  src={koiFish.images[0]}
                                  alt={koiFish.rfid}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {incident.incident?.incidentTitle ||
                                "Sự cố sức khỏe"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-600">
                                {formatDate(
                                  incident.affectedFrom,
                                  DATE_FORMATS.MEDIUM_DATE
                                )}
                              </p>
                              <Badge
                                className={cn(
                                  "text-xs font-medium",
                                  statusColor
                                )}
                              >
                                {statusLabel}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Expand icon */}
                        <button className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 py-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Incident Info */}
                        {incident.incident && (
                          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                            <h4 className="font-semibold text-sm">
                              Thông tin sự cố
                            </h4>
                            <div className="grid gap-2 text-sm">
                              <div className="grid grid-cols-3 gap-2">
                                <span className="text-gray-600">
                                  Loại sự cố:
                                </span>
                                <span className="col-span-2 font-medium">
                                  {incident.incident.incidentTypeName}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <span className="text-gray-600">Mô tả:</span>
                                <span className="col-span-2">
                                  {incident.incident.description}
                                </span>
                              </div>
                              {incident.incident.severity && (
                                <div className="grid grid-cols-3 gap-2 items-center">
                                  <span className="text-gray-600">Mức độ:</span>
                                  <Badge
                                    className={cn(
                                      "text-xs w-fit",
                                      getSeverityColor(
                                        incident.incident.severity
                                      )
                                    )}
                                  >
                                    {getSeverityLabel(
                                      incident.incident.severity
                                    )}
                                  </Badge>
                                </div>
                              )}
                              <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="text-gray-600">
                                  Trạng thái:
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-xs w-fit"
                                >
                                  {getIncidentStatusLabel(
                                    incident.incident.status
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Fish Status */}
                        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                          <h4 className="font-semibold text-sm">
                            Trạng thái cá
                          </h4>
                          <div className="grid gap-2 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                              <span className="text-gray-600">
                                Ngày phát hiện:
                              </span>
                              <span className="col-span-2 font-medium">
                                {formatDate(
                                  incident.affectedFrom,
                                  DATE_FORMATS.MEDIUM_DATE
                                )}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <span className="text-gray-600">
                                Ngày hồi phục:
                              </span>
                              <span className="col-span-2 font-medium">
                                {incident.recoveredAt
                                  ? formatDate(
                                      incident.recoveredAt,
                                      DATE_FORMATS.MEDIUM_DATE
                                    )
                                  : "Chưa hồi phục"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Symptoms & Treatment */}
                        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                          <h4 className="font-semibold text-sm">
                            Triệu chứng và điều trị
                          </h4>
                          <div className="grid gap-2 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                              <span className="text-gray-600">
                                Triệu chứng:
                              </span>
                              <span className="col-span-2">
                                {incident.specificSymptoms || "-"}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <span className="text-gray-600">Ghi chú:</span>
                              <span className="col-span-2">
                                {incident.treatmentNotes || "-"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Treatment Measures */}
                        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                          <h4 className="font-semibold text-sm">Biện pháp</h4>
                          <div className="grid gap-2 text-sm">
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-gray-600">
                                Cần điều trị:
                              </span>
                              <span className="col-span-2">
                                {incident.requiresTreatment ? "Có" : "Không"}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-gray-600">Cách ly:</span>
                              <span className="col-span-2">
                                {incident.isIsolated ? "Có" : "Không"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
