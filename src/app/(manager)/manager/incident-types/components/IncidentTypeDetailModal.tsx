"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IncidentType } from "@/lib/api/services/fetchIncidentType";
import { Label } from "@/components/ui/label";
import { IncidentSeverity } from "@/lib/api/services/fetchIncident";

interface IncidentTypeDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  incidentType: IncidentType | null;
}

const severityColors: Record<IncidentSeverity, { bg: string; text: string }> = {
  [IncidentSeverity.LOW]: { bg: "bg-blue-100", text: "text-blue-800" },
  [IncidentSeverity.MEDIUM]: { bg: "bg-yellow-100", text: "text-yellow-800" },
  [IncidentSeverity.HIGH]: { bg: "bg-red-100", text: "text-red-800" },
  [IncidentSeverity.URGENT]: { bg: "bg-red-100", text: "text-red-900" },
};

const severityLabels: Record<IncidentSeverity, string> = {
  [IncidentSeverity.LOW]: "Thấp",
  [IncidentSeverity.MEDIUM]: "Trung bình",
  [IncidentSeverity.HIGH]: "Cao",
  [IncidentSeverity.URGENT]: "Khẩn cấp",
};

export default function IncidentTypeDetailModal({
  isOpen,
  onOpenChange,
  incidentType,
}: IncidentTypeDetailModalProps) {
  if (!incidentType) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{incidentType.name}</DialogTitle>
          <DialogDescription>Chi tiết loại sự cố</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-600">Mô tả</Label>
            <p className="text-base text-gray-800 leading-relaxed">
              {incidentType.description}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-600">
              Mức độ mặc định
            </Label>
            <Badge
              className={`${
                severityColors[incidentType.defaultSeverity].bg
              } ${severityColors[incidentType.defaultSeverity].text} w-fit`}
              variant="outline"
            >
              {severityLabels[incidentType.defaultSeverity]}
            </Badge>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-600">
              Ảnh hưởng đến nhân giống
            </Label>
            <Badge
              variant={incidentType.affectsBreeding ? "default" : "secondary"}
              className="w-fit"
            >
              {incidentType.affectsBreeding ? "Có" : "Không"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
