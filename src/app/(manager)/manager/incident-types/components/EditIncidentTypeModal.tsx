"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateIncidentType } from "@/hooks/useIncidentType";
import {
  IncidentType,
  IncidentTypeRequest,
} from "@/lib/api/services/fetchIncidentType";
import { IncidentSeverity } from "@/lib/api/services/fetchIncident";

interface EditIncidentTypeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  incidentType: IncidentType | null;
}

const severityOptions = [
  { value: IncidentSeverity.LOW, label: "Thấp" },
  { value: IncidentSeverity.MEDIUM, label: "Trung bình" },
  { value: IncidentSeverity.HIGH, label: "Cao" },
  { value: IncidentSeverity.URGENT, label: "Khẩn cấp" },
];

export default function EditIncidentTypeModal({
  isOpen,
  onOpenChange,
  incidentType,
}: EditIncidentTypeModalProps) {
  const [formData, setFormData] = useState<IncidentTypeRequest>({
    name: "",
    description: "",
    defaultSeverity: IncidentSeverity.MEDIUM,
    affectsBreeding: false,
  });

  const { mutate: updateIncidentType, isPending } = useUpdateIncidentType();

  useEffect(() => {
    if (incidentType && isOpen) {
      setFormData({
        name: incidentType.name,
        description: incidentType.description,
        defaultSeverity: incidentType.defaultSeverity,
        affectsBreeding: incidentType.affectsBreeding,
      });
    }
  }, [incidentType, isOpen]);

  const handleSubmit = () => {
    if (!formData.name.trim() || !incidentType) {
      return;
    }

    updateIncidentType(
      {
        id: incidentType.id,
        data: formData,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa loại sự cố</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết của loại sự cố
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Tên loại sự cố</Label>
            <Input
              id="edit-name"
              placeholder="vd: Bệnh nấm trắng"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Mô tả</Label>
            <Textarea
              id="edit-description"
              placeholder="Nhập mô tả chi tiết về loại sự cố..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isPending}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-severity">Mức độ nghiêm trọng mặc định</Label>
            <Select
              value={formData.defaultSeverity}
              onValueChange={(value: IncidentSeverity) =>
                setFormData({ ...formData, defaultSeverity: value })
              }
              disabled={isPending}
            >
              <SelectTrigger id="edit-severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {severityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-breeding"
                checked={formData.affectsBreeding}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    affectsBreeding: checked as boolean,
                  })
                }
                disabled={isPending}
              />
              <Label htmlFor="edit-breeding" className="cursor-pointer">
                Ảnh hưởng đến nhân giống
              </Label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending || !formData.name.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
