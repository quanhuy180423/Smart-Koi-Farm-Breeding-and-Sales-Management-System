"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentResponse } from "@/lib/api/services/fetchIncident";
import {
  getIncidentSeverityColor,
  getIncidentSeverityText,
  getIncidentStatusColor,
  getIncidentStatusText,
} from "@/lib/utils/enum/formatEnum";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";
import Image from "next/image";
import {
  AlertTriangle,
  Calendar,
  User,
  ImageIcon,
  Fish,
  Waves,
  CheckCircle,
  Info,
} from "lucide-react";

interface IncidentDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  incident: IncidentResponse | null;
}

export function IncidentDetailDialog({
  isOpen,
  onOpenChange,
  incident,
}: IncidentDetailDialogProps) {
  if (!incident) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chi tiết sự cố
          </DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết về sự cố và các hành động đã thực hiện
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 min-w-4xl">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tiêu đề</p>
                  <p className="font-semibold">{incident.incidentTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại sự cố</p>
                  <p className="font-medium">{incident.incidentType.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {incident.incidentType.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mô tả</p>
                  <p className="text-sm">{incident.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Trạng thái & Mức độ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Mức độ nghiêm trọng
                  </p>
                  <Badge
                    className={`${getIncidentSeverityColor(incident.incidentType.defaultSeverity)} text-sm`}
                  >
                    {getIncidentSeverityText(
                      incident.incidentType.defaultSeverity,
                    )}
                  </Badge>
                  {incident.incidentType.affectsBreeding && (
                    <p className="text-xs text-orange-600 mt-2">
                      ⚠️ Ảnh hưởng đến sinh sản
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Trạng thái
                  </p>
                  <Badge
                    className={`${getIncidentStatusColor(incident.status)} text-sm`}
                  >
                    {getIncidentStatusText(incident.status)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Thời gian xảy ra
                </p>
                <p className="text-sm font-medium">
                  {formatDate(incident.occurredAt, DATE_FORMATS.DATETIME_24H)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Thời gian báo cáo
                </p>
                <p className="text-sm font-medium">
                  {formatDate(incident.createdAt, DATE_FORMATS.DATETIME_24H)}
                </p>
              </div>
              {incident.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật lần cuối
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(incident.updatedAt, DATE_FORMATS.DATETIME_24H)}
                  </p>
                </div>
              )}
              {incident.resolvedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Thời gian giải quyết
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(incident.resolvedAt, DATE_FORMATS.DATETIME_24H)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* People */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Người liên quan
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Người báo cáo</p>
                <p className="text-sm font-medium">
                  {incident.reportedByUserName}
                </p>
              </div>
              {incident.resolvedByUserName && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Người giải quyết
                  </p>
                  <p className="text-sm font-medium">
                    {incident.resolvedByUserName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Images */}
          {incident.reportImages && incident.reportImages.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Hình ảnh báo cáo ({incident.reportImages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {incident.reportImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                    >
                      <Image
                        src={image}
                        alt={`Hình ảnh báo cáo ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(image, "_blank")}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resolution Info */}
          {incident.resolutionNotes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Thông tin giải quyết
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Ghi chú</p>
                    <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      {incident.resolutionNotes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resolution Images */}
          {incident.resolutionImages &&
            incident.resolutionImages.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-green-600" />
                    Hình ảnh sau xử lý ({incident.resolutionImages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {incident.resolutionImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-green-200 bg-muted"
                      >
                        <Image
                          src={image}
                          alt={`Hình ảnh sau xử lý ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(image, "_blank")}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Affected Koi */}
          {incident.koiIncidents && incident.koiIncidents.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Fish className="h-4 w-4" />
                  Cá Koi bị ảnh hưởng ({incident.koiIncidents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {incident.koiIncidents.map((koiIncident) => (
                    <div
                      key={koiIncident.id}
                      className="p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            RFID: {koiIncident.koiFishRFID}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {koiIncident.specificSymptoms}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {koiIncident.affectedStatus}
                        </Badge>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        {koiIncident.requiresTreatment && (
                          <span>⚕️ Cần điều trị</span>
                        )}
                        {koiIncident.isIsolated && <span>🔒 Đã cách ly</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affected Ponds */}
          {incident.pondIncidents && incident.pondIncidents.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Hồ bị ảnh hưởng ({incident.pondIncidents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {incident.pondIncidents.map((pondIncident) => (
                    <div
                      key={pondIncident.id}
                      className="p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{pondIncident.pondName}</p>
                          <p className="text-sm text-muted-foreground">
                            {pondIncident.environmentalChanges}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        {pondIncident.requiresWaterChange && (
                          <span>💧 Cần thay nước</span>
                        )}
                        {pondIncident.fishDiedCount > 0 && (
                          <span className="text-red-600">
                            ⚠️ Cá chết: {pondIncident.fishDiedCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
