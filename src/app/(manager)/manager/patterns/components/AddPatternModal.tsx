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
import { useCreatePattern } from "@/hooks/usePattern";
import { PatternRequest } from "@/lib/api/services/fetchPattern";

interface AddPatternModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPatternModal({
  isOpen,
  onOpenChange,
}: AddPatternModalProps) {
  const [formData, setFormData] = useState<PatternRequest>({
    patternName: "",
    description: "",
  });

  const { mutate: createPattern, isPending } = useCreatePattern();

  const handleSubmit = () => {
    if (!formData.patternName.trim()) {
      return;
    }

    createPattern(formData, {
      onSuccess: () => {
        setFormData({
          patternName: "",
          description: "",
        });
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo hoa văn mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết của hoa văn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên hoa văn</Label>
            <Input
              id="name"
              placeholder="vd: Kohaku, Sanke..."
              value={formData.patternName}
              onChange={(e) =>
                setFormData({ ...formData, patternName: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả chi tiết về hoa văn..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isPending}
              rows={4}
            />
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
              disabled={isPending || !formData.patternName.trim()}
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
