"use client";

import { useState } from "react";
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
import { useCreateIncidentType } from "@/hooks/useIncidentType";
import { IncidentSeverity } from "@/lib/api/services/fetchIncident";
import { IncidentTypeRequest } from "@/lib/api/services/fetchIncidentType";

interface AddIncidentTypeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const severityOptions = [
  { value: "Low", label: "Thấp" },
  { value: "Medium", label: "Trung bình" },
  { value: "High", label: "Cao" },
];

export default function AddIncidentTypeModal({
  isOpen,
  onOpenChange,
}: AddIncidentTypeModalProps) {
  const [formData, setFormData] = useState<IncidentTypeRequest>({
    name: "",
    description: "",
    defaultSeverity: IncidentSeverity.MEDIUM,
    affectsBreeding: false,
  });

  const { mutate: createIncidentType, isPending } = useCreateIncidentType();

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return;
    }

    createIncidentType(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          description: "",
          defaultSeverity: IncidentSeverity.MEDIUM,
          affectsBreeding: false,
        });
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo loại sự cố mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết của loại sự cố
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên loại sự cố</Label>
            <Input
              id="name"
              placeholder="vd: Bệnh nấm trắng"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
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
            <Label htmlFor="severity">Mức độ nghiêm trọng mặc định</Label>
            <Select
              value={formData.defaultSeverity}
              onValueChange={(value: IncidentSeverity) =>
                setFormData({ ...formData, defaultSeverity: value })
              }
              disabled={isPending}
            >
              <SelectTrigger id="severity">
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
                id="breeding"
                checked={formData.affectsBreeding}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    affectsBreeding: checked as boolean,
                  })
                }
                disabled={isPending}
              />
              <Label htmlFor="breeding" className="cursor-pointer">
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
                  Đang tạo...
                </>
              ) : (
                "Tạo"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
