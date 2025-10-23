import * as React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PondTypeFormState } from "./page";

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
      </DialogHeader>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="typeName"
              className="text-sm font-medium text-gray-700"
            >
              Tên loại hồ *
            </Label>
            <Input
              id="typeName"
              placeholder="Ví dụ: Hồ nước ngọt, Hồ thủy sinh..."
              value={newPondType.typeName}
              onChange={(e) =>
                setNewPondType({ ...newPondType, typeName: e.target.value })
              }
              className="border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="recommendedCapacity"
              className="text-sm font-medium text-gray-700"
            >
              Sức chứa khuyến nghị (Lít) *
            </Label>
            <Input
              id="recommendedCapacity"
              placeholder="Nhập số lít khuyến nghị"
              type="number"
              value={newPondType.recommendedCapacity}
              onChange={(e) =>
                setNewPondType({
                  ...newPondType,
                  recommendedCapacity: e.target.value,
                })
              }
              className="border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
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
              isPending ||
              !newPondType.typeName ||
              !newPondType.recommendedCapacity
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
