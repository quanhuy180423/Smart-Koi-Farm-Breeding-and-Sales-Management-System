import * as React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { PondTypeFormState } from "../page";
import { getPondTypeLabel } from "@/lib/utils/enum/formatEnum";
import { PondTypeEnum } from "@/lib/api/services/fetchPond";

interface AddPondTypeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPondType: PondTypeFormState;
  setNewPondType: React.Dispatch<React.SetStateAction<PondTypeFormState>>;
  handleAddPondType: () => void;
  isPending: boolean;
}

const AddPondTypeModal = ({
  isOpen,
  onOpenChange,
  newPondType,
  setNewPondType,
  handleAddPondType,
  isPending,
}: AddPondTypeModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Thêm Loại Hồ mới
        </DialogTitle>
        <DialogDescription>
          Nhập thông tin chi tiết về loại hồ mới
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Loại Hồ <span className="text-red-600">*</span>
            </Label>
            <Select
              value={newPondType.type}
              onValueChange={(value) =>
                setNewPondType({
                  ...newPondType,
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
          <div className="space-y-2">
            <Label
              htmlFor="recommendedQuantity"
              className="text-sm font-medium text-gray-700"
            >
              Sức chứa khuyến nghị <span className="text-red-600">*</span>
            </Label>
            <InputNumber
              value={
                newPondType.recommendedQuantity
                  ? Number(newPondType.recommendedQuantity)
                  : undefined
              }
              onChange={(value) =>
                setNewPondType({
                  ...newPondType,
                  recommendedQuantity: value ? String(value) : "",
                })
              }
              placeholder="Nhập số lượng cá khuyến nghị"
              className="border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground italic">
            * Tên loại hồ sẽ được tự động tạo từ Loại hồ và Sức chứa (VD: Ghép
            cặp - 3)
          </p>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Mô tả
          </Label>
          <Textarea
            id="description"
            placeholder="Mô tả chi tiết về loại hồ này..."
            value={newPondType.description}
            onChange={(e) =>
              setNewPondType({ ...newPondType, description: e.target.value })
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
            onClick={handleAddPondType}
            disabled={
              isPending || !newPondType.type || !newPondType.recommendedQuantity
            }
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Thêm loại hồ
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);

export default AddPondTypeModal;
