import * as React from "react";
import { Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PondTypeResponse } from "@/lib/api/services/fetchPondType";
import { getPondTypeLabel } from "@/lib/utils/enum/formatEnum";
import { PondTypeEnum } from "@/lib/api/services/fetchPond";

interface EditPondTypeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPondType: PondTypeResponse | null;
  setEditingPondType: React.Dispatch<
    React.SetStateAction<PondTypeResponse | null>
  >;
  handleUpdatePondType: () => void;
  isPending: boolean;
}

const EditPondTypeModal = ({
  isOpen,
  onOpenChange,
  editingPondType,
  setEditingPondType,
  handleUpdatePondType,
  isPending,
}: EditPondTypeModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Chỉnh sửa Loại Hồ: {editingPondType?.typeName}
        </DialogTitle>
        <DialogDescription>
          Cập nhật thông tin chi tiết về loại hồ
        </DialogDescription>
      </DialogHeader>
      {editingPondType && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="editTypeName"
                className="text-sm font-medium text-gray-700"
              >
                Tên loại hồ *
              </Label>
              <Input
                id="editTypeName"
                value={editingPondType.typeName}
                onChange={(e) =>
                  setEditingPondType({
                    ...editingPondType,
                    typeName: e.target.value,
                  })
                }
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="editType"
                className="text-sm font-medium text-gray-700"
              >
                Loại Hồ *
              </Label>
              <Select
                value={editingPondType.type}
                onValueChange={(value) =>
                  setEditingPondType({
                    ...editingPondType,
                    type: value as PondTypeEnum,
                  })
                }
              >
                <SelectTrigger className="border-2 w-full border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="Chọn loại hồ" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PondTypeEnum).map((typeEnum) => (
                    <SelectItem key={typeEnum} value={typeEnum}>
                      {getPondTypeLabel(typeEnum as PondTypeEnum).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="editQuantity"
              className="text-sm font-medium text-gray-700"
            >
              Sức chứa khuyến nghị (Số lượng cá) *
            </Label>
            <InputNumber
              value={editingPondType.recommendedQuantity}
              onChange={(value) =>
                setEditingPondType({
                  ...editingPondType,
                  recommendedQuantity: value || 0,
                })
              }
              className="border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="editDescription"
              className="text-sm font-medium text-gray-700"
            >
              Mô tả
            </Label>
            <Textarea
              id="editDescription"
              value={editingPondType.description}
              onChange={(e) =>
                setEditingPondType({
                  ...editingPondType,
                  description: e.target.value,
                })
              }
              className="border-2 border-gray-300 focus:border-blue-500 min-h-[100px]"
            />
          </div>
          <DialogFooter className="pt-4 border-t mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdatePondType}
              disabled={
                isPending || !editingPondType.typeName || !editingPondType.type
              }
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
              Cập nhật
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default EditPondTypeModal;
