import { PondResponse, PondStatus } from "@/lib/api/services/fetchPond";
import { PondFormState } from "./page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPondModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPond: PondResponse | null;
  editPondForm: PondFormState;
  setEditPondForm: React.Dispatch<React.SetStateAction<PondFormState>>;
  handleUpdatePond: () => void;
  isPending: boolean;
  handleOpenAreaSelection: (context: "new" | "edit") => void;
  handleOpenPondTypeSelection: (context: "new" | "edit") => void;
  getAreaNameById: (id: string | number | undefined) => string;
  getPondTypeNameById: (id: string | number | undefined) => string;
}

const EditPondModal = ({
  isOpen,
  onOpenChange,
  editingPond,
  editPondForm,
  setEditPondForm,
  handleUpdatePond,
  isPending,
  handleOpenAreaSelection,
  handleOpenPondTypeSelection,
  getAreaNameById,
  getPondTypeNameById,
}: EditPondModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Chỉnh sửa thông tin hồ: {editingPond?.pondName}
        </DialogTitle>
        <DialogDescription>
          Cập nhật thông tin chi tiết về hồ cá
        </DialogDescription>
      </DialogHeader>
      {editingPond && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-name"
                className="text-sm font-medium text-gray-700"
              >
                Tên hồ
              </Label>
              <Input
                id="edit-name"
                placeholder="Nhập tên hồ..."
                value={editPondForm.pondName}
                onChange={(e) =>
                  setEditPondForm({ ...editPondForm, pondName: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-location"
                className="text-sm font-medium text-gray-700"
              >
                Địa điểm
              </Label>
              <Input
                id="edit-location"
                placeholder="VD: Khu A, Lô 2"
                value={editPondForm.location}
                onChange={(e) =>
                  setEditPondForm({ ...editPondForm, location: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-areaId"
                className="text-sm font-medium text-gray-700"
              >
                Khu vực
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between h-10 border-2 border-gray-300"
                onClick={() => handleOpenAreaSelection("edit")}
              >
                <span>
                  {getAreaNameById(editPondForm.areaId) || "Chọn Khu vực..."}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-pondTypeId"
                className="text-sm font-medium text-gray-700"
              >
                Loại hồ
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between h-10 border-2 border-gray-300"
                onClick={() => handleOpenPondTypeSelection("edit")}
              >
                <span>
                  {getPondTypeNameById(editPondForm.pondTypeId) ||
                    "Chọn Loại Hồ..."}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-length"
                className="text-sm font-medium text-gray-700"
              >
                Dài (m)
              </Label>
              <InputNumber
                value={
                  editPondForm.lengthMeters
                    ? Number(editPondForm.lengthMeters)
                    : undefined
                }
                onChange={(value) =>
                  setEditPondForm({
                    ...editPondForm,
                    lengthMeters: value ? String(value) : "",
                  })
                }
                placeholder="Dài (m)"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-width"
                className="text-sm font-medium text-gray-700"
              >
                Rộng (m)
              </Label>
              <InputNumber
                value={
                  editPondForm.widthMeters
                    ? Number(editPondForm.widthMeters)
                    : undefined
                }
                onChange={(value) =>
                  setEditPondForm({
                    ...editPondForm,
                    widthMeters: value ? String(value) : "",
                  })
                }
                placeholder="Rộng (m)"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-depth"
                className="text-sm font-medium text-gray-700"
              >
                Sâu (m)
              </Label>
              <InputNumber
                value={
                  editPondForm.depthMeters
                    ? Number(editPondForm.depthMeters)
                    : undefined
                }
                onChange={(value) =>
                  setEditPondForm({
                    ...editPondForm,
                    depthMeters: value ? String(value) : "",
                  })
                }
                placeholder="Độ sâu (m)"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-capacity"
                className="text-sm font-medium text-gray-700"
              >
                Sức chứa (Lít)
              </Label>
              <InputNumber
                value={
                  editPondForm.capacityLiters
                    ? Number(editPondForm.capacityLiters)
                    : undefined
                }
                onChange={(value) =>
                  setEditPondForm({
                    ...editPondForm,
                    capacityLiters: value ? String(value) : "",
                  })
                }
                placeholder="Sức chứa (Lít)"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="edit-status"
              className="text-sm font-medium text-gray-700"
            >
              Trạng thái
            </Label>
            <Select
              value={editPondForm.pondStatus}
              onValueChange={(value: PondStatus) =>
                setEditPondForm({ ...editPondForm, pondStatus: value })
              }
            >
              <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PondStatus.ACTIVE}>Hoạt động</SelectItem>
                <SelectItem value={PondStatus.MAINTENANCE}>
                  Đang bảo trì
                </SelectItem>
                <SelectItem value={PondStatus.EMPTY}>Trống</SelectItem>
              </SelectContent>
            </Select>
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
              onClick={handleUpdatePond}
              disabled={
                isPending || !editPondForm.areaId || !editPondForm.pondTypeId
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

export default EditPondModal;
