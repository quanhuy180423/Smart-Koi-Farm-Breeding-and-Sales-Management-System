import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PondTypeResponse } from "@/lib/api/services/fetchPondType";
import { getPondTypeLabel } from "@/lib/utils/enum/formatEnum";
import { Layers, FileText, Users } from "lucide-react";

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
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader className="space-y-3 pb-4 border-b">
        <DialogTitle className="text-2xl mb-2 font-bold text-gray-900">
          {selectedPondType?.typeName}
        </DialogTitle>
        <DialogDescription className="text-base text-gray-600">
          Thông tin chi tiết về loại hồ cá
        </DialogDescription>
      </DialogHeader>
      {selectedPondType && (
        <div className="space-y-6">
          {/* Type Badge */}
          <Card className="border-2">
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Phân loại hồ
                </p>
                <Badge
                  className={`${getPondTypeLabel(selectedPondType.type).colorClass} px-4 py-1.5 text-sm font-medium`}
                >
                  {getPondTypeLabel(selectedPondType.type).label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Layers className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tên loại hồ
                    </Label>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {selectedPondType.typeName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Sức chứa khuyến nghị
                    </Label>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {selectedPondType.recommendedQuantity} con cá
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="border-2">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Mô tả
                  </Label>
                  <div className="rounded-lg bg-muted/50">
                    <p className="text-base text-gray-900 leading-relaxed">
                      {selectedPondType.description ||
                        "Chưa có mô tả cho loại hồ này"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default PondTypeDetailModal;
