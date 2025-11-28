import { PondResponse, PondStatus } from "@/lib/api/services/fetchPond";
import { PondFormState } from "../page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    <DialogContent className="min-w-2xl">
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
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="water">Thông số nước</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
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
                Dung tích hiện tại (Lít)
              </Label>
              <InputNumber
                value={
                  editPondForm.currentCapacity
                    ? Number(editPondForm.currentCapacity)
                    : undefined
                }
                onChange={(value) =>
                  setEditPondForm({
                    ...editPondForm,
                    currentCapacity: value ? String(value) : "",
                  })
                }
                placeholder="Dung tích hiện tại (Lít)"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
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
          </div>
          </TabsContent>

          {/* Water Parameters Tab */}
          <TabsContent value="water" className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-ph"
                  className="text-sm font-medium text-gray-700"
                >
                  pH
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.phLevel
                      ? Number(editPondForm.record.phLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        phLevel: value ? String(value) : "",
                        temperatureCelsius:
                          editPondForm.record?.temperatureCelsius || "",
                        oxygenLevel: editPondForm.record?.oxygenLevel || "",
                        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                        nitriteLevel: editPondForm.record?.nitriteLevel || "",
                        nitrateLevel: editPondForm.record?.nitrateLevel || "",
                        carbonHardness: editPondForm.record?.carbonHardness || "",
                        waterLevelMeters:
                          editPondForm.record?.waterLevelMeters || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 7.5"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-temperature"
                  className="text-sm font-medium text-gray-700"
                >
                  Nhiệt độ (°C)
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.temperatureCelsius
                      ? Number(editPondForm.record.temperatureCelsius)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        temperatureCelsius: value ? String(value) : "",
                        phLevel: editPondForm.record?.phLevel || "",
                        oxygenLevel: editPondForm.record?.oxygenLevel || "",
                        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                        nitriteLevel: editPondForm.record?.nitriteLevel || "",
                        nitrateLevel: editPondForm.record?.nitrateLevel || "",
                        carbonHardness: editPondForm.record?.carbonHardness || "",
                        waterLevelMeters:
                          editPondForm.record?.waterLevelMeters || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 25.5"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-oxygen"
                  className="text-sm font-medium text-gray-700"
                >
                  Oxy (mg/L)
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.oxygenLevel
                      ? Number(editPondForm.record.oxygenLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        oxygenLevel: value ? String(value) : "",
                        phLevel: editPondForm.record?.phLevel || "",
                        temperatureCelsius:
                          editPondForm.record?.temperatureCelsius || "",
                        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                        nitriteLevel: editPondForm.record?.nitriteLevel || "",
                        nitrateLevel: editPondForm.record?.nitrateLevel || "",
                        carbonHardness: editPondForm.record?.carbonHardness || "",
                        waterLevelMeters:
                          editPondForm.record?.waterLevelMeters || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 8.5"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-ammonia"
                  className="text-sm font-medium text-gray-700"
                >
                  Ammonia (mg/L)
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.ammoniaLevel
                      ? Number(editPondForm.record.ammoniaLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        ammoniaLevel: value ? String(value) : "",
                        phLevel: editPondForm.record?.phLevel || "",
                        temperatureCelsius:
                          editPondForm.record?.temperatureCelsius || "",
                        oxygenLevel: editPondForm.record?.oxygenLevel || "",
                        nitriteLevel: editPondForm.record?.nitriteLevel || "",
                        nitrateLevel: editPondForm.record?.nitrateLevel || "",
                        carbonHardness: editPondForm.record?.carbonHardness || "",
                        waterLevelMeters:
                          editPondForm.record?.waterLevelMeters || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 0.0"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-nitrite"
                  className="text-sm font-medium text-gray-700"
                >
                  Nitrite (mg/L)
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.nitriteLevel
                      ? Number(editPondForm.record.nitriteLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        nitriteLevel: value ? String(value) : "",
                        phLevel: editPondForm.record?.phLevel || "",
                        temperatureCelsius:
                          editPondForm.record?.temperatureCelsius || "",
                        oxygenLevel: editPondForm.record?.oxygenLevel || "",
                        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                        nitrateLevel: editPondForm.record?.nitrateLevel || "",
                        carbonHardness: editPondForm.record?.carbonHardness || "",
                        waterLevelMeters:
                          editPondForm.record?.waterLevelMeters || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 0.0"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-nitrate"
                  className="text-sm font-medium text-gray-700"
                >
                  Nitrate (mg/L)
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.nitrateLevel
                      ? Number(editPondForm.record.nitrateLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        nitrateLevel: value ? String(value) : "",
                        phLevel: editPondForm.record?.phLevel || "",
                        temperatureCelsius:
                          editPondForm.record?.temperatureCelsius || "",
                        oxygenLevel: editPondForm.record?.oxygenLevel || "",
                        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                        nitriteLevel: editPondForm.record?.nitriteLevel || "",
                        carbonHardness: editPondForm.record?.carbonHardness || "",
                        waterLevelMeters:
                          editPondForm.record?.waterLevelMeters || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 20.0"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-carbonate"
                  className="text-sm font-medium text-gray-700"
                >
                  Độ cứng (dH)
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.carbonHardness
                      ? Number(editPondForm.record.carbonHardness)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        carbonHardness: value ? String(value) : "",
                        phLevel: editPondForm.record?.phLevel || "",
                        temperatureCelsius:
                          editPondForm.record?.temperatureCelsius || "",
                        oxygenLevel: editPondForm.record?.oxygenLevel || "",
                        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                        nitriteLevel: editPondForm.record?.nitriteLevel || "",
                        nitrateLevel: editPondForm.record?.nitrateLevel || "",
                        waterLevelMeters:
                          editPondForm.record?.waterLevelMeters || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 8.0"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-water-level"
                  className="text-sm font-medium text-gray-700"
                >
                  Mức nước (m)
                </Label>
                <InputNumber
                  value={
                    editPondForm.record?.waterLevelMeters
                      ? Number(editPondForm.record.waterLevelMeters)
                      : undefined
                  }
                  onChange={(value) =>
                    setEditPondForm({
                      ...editPondForm,
                      record: {
                        ...editPondForm.record,
                        waterLevelMeters: value ? String(value) : "",
                        phLevel: editPondForm.record?.phLevel || "",
                        temperatureCelsius:
                          editPondForm.record?.temperatureCelsius || "",
                        oxygenLevel: editPondForm.record?.oxygenLevel || "",
                        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                        nitriteLevel: editPondForm.record?.nitriteLevel || "",
                        nitrateLevel: editPondForm.record?.nitrateLevel || "",
                        carbonHardness: editPondForm.record?.carbonHardness || "",
                        notes: editPondForm.record?.notes || "",
                      },
                    })
                  }
                  placeholder="VD: 1.5"
                  allowDecimal={true}
                  className="border-2 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-notes"
                className="text-sm font-medium text-gray-700"
              >
                Ghi chú
              </Label>
              <Input
                id="edit-notes"
                placeholder="Ghi chú về thông số nước..."
                value={editPondForm.record?.notes || ""}
                onChange={(e) =>
                  setEditPondForm({
                    ...editPondForm,
                    record: {
                      ...editPondForm.record,
                      notes: e.target.value,
                      phLevel: editPondForm.record?.phLevel || "",
                      temperatureCelsius:
                        editPondForm.record?.temperatureCelsius || "",
                      oxygenLevel: editPondForm.record?.oxygenLevel || "",
                      ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
                      nitriteLevel: editPondForm.record?.nitriteLevel || "",
                      nitrateLevel: editPondForm.record?.nitrateLevel || "",
                      carbonHardness: editPondForm.record?.carbonHardness || "",
                      waterLevelMeters:
                        editPondForm.record?.waterLevelMeters || "",
                    },
                  })
                }
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

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
            editingPond === null || !editPondForm.areaId || !editPondForm.pondTypeId
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
    </DialogContent>
  </Dialog>
);

export default EditPondModal;
