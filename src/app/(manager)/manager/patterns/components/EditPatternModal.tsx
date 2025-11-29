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
import { useUpdatePattern } from "@/hooks/usePattern";
import { Pattern, PatternRequest } from "@/lib/api/services/fetchPattern";

interface EditPatternModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pattern: Pattern | null;
}

export default function EditPatternModal({
  isOpen,
  onOpenChange,
  pattern,
}: EditPatternModalProps) {
  const [formData, setFormData] = useState<PatternRequest>({
    patternName: "",
    description: "",
  });

  const { mutate: updatePattern, isPending } = useUpdatePattern();

  useEffect(() => {
    if (pattern && isOpen) {
      setFormData({
        patternName: pattern.patternName,
        description: pattern.description,
      });
    }
  }, [pattern, isOpen]);

  const handleSubmit = () => {
    if (!formData.patternName.trim() || !pattern) {
      return;
    }

    updatePattern(
      {
        id: pattern.id,
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
          <DialogTitle>Chỉnh sửa hoa văn</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết của hoa văn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Tên hoa văn</Label>
            <Input
              id="edit-name"
              placeholder="vd: Kohaku, Sanke..."
              value={formData.patternName}
              onChange={(e) =>
                setFormData({ ...formData, patternName: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Mô tả</Label>
            <Textarea
              id="edit-description"
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
