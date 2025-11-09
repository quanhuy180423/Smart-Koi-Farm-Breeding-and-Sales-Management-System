import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PondTypeResponse } from "@/lib/api/services/fetchPondType";
import { getPondTypeLabel } from "@/lib/utils/enum/formatEnum";

interface PondTypeDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPondType: PondTypeResponse | null;
}

const PondTypeDetailModal = ({
  isOpen,
  onOpenChange,
  selectedPondType,
}: PondTypeDetailModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Chi tiết Loại Hồ: {selectedPondType?.typeName}
        </DialogTitle>
        <DialogDescription>Thông tin chi tiết về loại hồ</DialogDescription>
      </DialogHeader>
      {selectedPondType && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Tên loại
                </Label>
                <p className="text-base font-semibold text-gray-800">
                  {selectedPondType.typeName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Loại Hồ
                </Label>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPondTypeLabel(selectedPondType.type).colorClass}`}
                  >
                    {getPondTypeLabel(selectedPondType.type).label}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Sức chứa khuyến nghị (Số lượng cá)
                </Label>
                <p className="text-base text-gray-800">
                  {selectedPondType.recommendedQuantity}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-600">Mô tả</Label>
              <p className="text-base text-gray-800">
                {selectedPondType.description || "Chưa có mô tả"}
              </p>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default PondTypeDetailModal;
