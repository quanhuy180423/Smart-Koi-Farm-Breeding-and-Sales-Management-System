import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PondFormState } from "../page";
import { PondStatus } from "@/lib/api/services/fetchPond";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddPondModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPond: PondFormState;
  setNewPond: React.Dispatch<React.SetStateAction<PondFormState>>;
  handleAddPond: () => void;
  isPending: boolean;
  handleOpenAreaSelection: (context: "new" | "edit") => void;
  handleOpenPondTypeSelection: (context: "new" | "edit") => void;
  getAreaNameById: (id: string | number | undefined) => string;
  getPondTypeNameById: (id: string | number | undefined) => string;
}

const AddPondModal = ({
  isOpen,
  onOpenChange,
  newPond,
  setNewPond,
  handleAddPond,
  isPending,
  handleOpenAreaSelection,
  handleOpenPondTypeSelection,
  getAreaNameById,
  getPondTypeNameById,
}: AddPondModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="min-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Thêm hồ cá mới
        </DialogTitle>
        <DialogDescription>
          Nhập thông tin chi tiết về hồ cá mới
        </DialogDescription>
      </DialogHeader>

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
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Tên hồ
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên hồ..."
                value={newPond.pondName}
                onChange={(e) =>
                  setNewPond({ ...newPond, pondName: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium text-gray-700"
              >
                Địa điểm
              </Label>
              <Input
                id="location"
                placeholder="VD: Khu A, Lô 2"
                value={newPond.location}
                onChange={(e) =>
                  setNewPond({ ...newPond, location: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Chọn Khu vực */}
            <div className="space-y-2">
              <Label
                htmlFor="areaId"
                className="text-sm font-medium text-gray-700"
              >
                Khu vực
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between h-10 border-2 border-gray-300"
                onClick={() => handleOpenAreaSelection("new")}
              >
                <span>
                  {getAreaNameById(newPond.areaId) || "Chọn Khu vực..."}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </div>

            {/* Chọn Loại Hồ (NEW) */}
            <div className="space-y-2">
              <Label
                htmlFor="pondTypeId"
                className="text-sm font-medium text-gray-700"
              >
                Loại hồ
              </Label>
              <Button
                variant="outline"
                className="w-full justify-between h-10 border-2 border-gray-300"
                onClick={() => handleOpenPondTypeSelection("new")}
              >
                <span>
                  {getPondTypeNameById(newPond.pondTypeId) || "Chọn Loại Hồ..."}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="length"
                className="text-sm font-medium text-gray-700"
              >
                Dài (m)
              </Label>
              <InputNumber
                value={
                  newPond.lengthMeters
                    ? Number(newPond.lengthMeters)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
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
                htmlFor="width"
                className="text-sm font-medium text-gray-700"
              >
                Rộng (m)
              </Label>
              <InputNumber
                value={
                  newPond.widthMeters ? Number(newPond.widthMeters) : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
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
                htmlFor="depth"
                className="text-sm font-medium text-gray-700"
              >
                Sâu (m)
              </Label>
              <InputNumber
                value={
                  newPond.depthMeters ? Number(newPond.depthMeters) : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
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
                htmlFor="currentCapacity"
                className="text-sm font-medium text-gray-700"
              >
                Dung tích hiện tại (Lít)
              </Label>
              <InputNumber
                value={
                  newPond.currentCapacity
                    ? Number(newPond.currentCapacity)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
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
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Trạng thái
              </Label>
              <Select
                value={newPond.pondStatus}
                onValueChange={(value: PondStatus) =>
                  setNewPond({ ...newPond, pondStatus: value })
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                pH Level
              </Label>
              <InputNumber
                value={
                  newPond.record?.phLevel
                    ? Number(newPond.record.phLevel)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: value ? String(value) : "",
                      temperatureCelsius:
                        newPond.record?.temperatureCelsius || "",
                      oxygenLevel: newPond.record?.oxygenLevel || "",
                      ammoniaLevel: newPond.record?.ammoniaLevel || "",
                      nitriteLevel: newPond.record?.nitriteLevel || "",
                      nitrateLevel: newPond.record?.nitrateLevel || "",
                      carbonHardness: newPond.record?.carbonHardness || "",
                      waterLevelMeters: newPond.record?.waterLevelMeters || "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 7.0"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Nhiệt độ (°C)
              </Label>
              <InputNumber
                value={
                  newPond.record?.temperatureCelsius
                    ? Number(newPond.record.temperatureCelsius)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: newPond.record?.phLevel || "",
                      temperatureCelsius: value ? String(value) : "",
                      oxygenLevel: newPond.record?.oxygenLevel || "",
                      ammoniaLevel: newPond.record?.ammoniaLevel || "",
                      nitriteLevel: newPond.record?.nitriteLevel || "",
                      nitrateLevel: newPond.record?.nitrateLevel || "",
                      carbonHardness: newPond.record?.carbonHardness || "",
                      waterLevelMeters: newPond.record?.waterLevelMeters || "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 25"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Oxy (mg/L)
              </Label>
              <InputNumber
                value={
                  newPond.record?.oxygenLevel
                    ? Number(newPond.record.oxygenLevel)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: newPond.record?.phLevel || "",
                      temperatureCelsius:
                        newPond.record?.temperatureCelsius || "",
                      oxygenLevel: value ? String(value) : "",
                      ammoniaLevel: newPond.record?.ammoniaLevel || "",
                      nitriteLevel: newPond.record?.nitriteLevel || "",
                      nitrateLevel: newPond.record?.nitrateLevel || "",
                      carbonHardness: newPond.record?.carbonHardness || "",
                      waterLevelMeters: newPond.record?.waterLevelMeters || "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 7.5"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Amoniac (mg/L)
              </Label>
              <InputNumber
                value={
                  newPond.record?.ammoniaLevel
                    ? Number(newPond.record.ammoniaLevel)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: newPond.record?.phLevel || "",
                      temperatureCelsius:
                        newPond.record?.temperatureCelsius || "",
                      oxygenLevel: newPond.record?.oxygenLevel || "",
                      ammoniaLevel: value ? String(value) : "",
                      nitriteLevel: newPond.record?.nitriteLevel || "",
                      nitrateLevel: newPond.record?.nitrateLevel || "",
                      carbonHardness: newPond.record?.carbonHardness || "",
                      waterLevelMeters: newPond.record?.waterLevelMeters || "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 0.02"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Nitrite (mg/L)
              </Label>
              <InputNumber
                value={
                  newPond.record?.nitriteLevel
                    ? Number(newPond.record.nitriteLevel)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: newPond.record?.phLevel || "",
                      temperatureCelsius:
                        newPond.record?.temperatureCelsius || "",
                      oxygenLevel: newPond.record?.oxygenLevel || "",
                      ammoniaLevel: newPond.record?.ammoniaLevel || "",
                      nitriteLevel: value ? String(value) : "",
                      nitrateLevel: newPond.record?.nitrateLevel || "",
                      carbonHardness: newPond.record?.carbonHardness || "",
                      waterLevelMeters: newPond.record?.waterLevelMeters || "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 0.05"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Nitrate (mg/L)
              </Label>
              <InputNumber
                value={
                  newPond.record?.nitrateLevel
                    ? Number(newPond.record.nitrateLevel)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: newPond.record?.phLevel || "",
                      temperatureCelsius:
                        newPond.record?.temperatureCelsius || "",
                      oxygenLevel: newPond.record?.oxygenLevel || "",
                      ammoniaLevel: newPond.record?.ammoniaLevel || "",
                      nitriteLevel: newPond.record?.nitriteLevel || "",
                      nitrateLevel: value ? String(value) : "",
                      carbonHardness: newPond.record?.carbonHardness || "",
                      waterLevelMeters: newPond.record?.waterLevelMeters || "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 50"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Độ cứng (°dH)
              </Label>
              <InputNumber
                value={
                  newPond.record?.carbonHardness
                    ? Number(newPond.record.carbonHardness)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: newPond.record?.phLevel || "",
                      temperatureCelsius:
                        newPond.record?.temperatureCelsius || "",
                      oxygenLevel: newPond.record?.oxygenLevel || "",
                      ammoniaLevel: newPond.record?.ammoniaLevel || "",
                      nitriteLevel: newPond.record?.nitriteLevel || "",
                      nitrateLevel: newPond.record?.nitrateLevel || "",
                      carbonHardness: value ? String(value) : "",
                      waterLevelMeters: newPond.record?.waterLevelMeters || "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 8"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Mức nước (m)
              </Label>
              <InputNumber
                value={
                  newPond.record?.waterLevelMeters
                    ? Number(newPond.record.waterLevelMeters)
                    : undefined
                }
                onChange={(value) =>
                  setNewPond({
                    ...newPond,
                    record: {
                      ...newPond.record,
                      phLevel: newPond.record?.phLevel || "",
                      temperatureCelsius:
                        newPond.record?.temperatureCelsius || "",
                      oxygenLevel: newPond.record?.oxygenLevel || "",
                      ammoniaLevel: newPond.record?.ammoniaLevel || "",
                      nitriteLevel: newPond.record?.nitriteLevel || "",
                      nitrateLevel: newPond.record?.nitrateLevel || "",
                      carbonHardness: newPond.record?.carbonHardness || "",
                      waterLevelMeters: value ? String(value) : "",
                      notes: newPond.record?.notes || "",
                    },
                  })
                }
                placeholder="vd: 1.5"
                allowDecimal={true}
                className="border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label className="text-sm font-medium text-gray-700">Ghi chú</Label>
            <Input
              value={newPond.record?.notes || ""}
              onChange={(e) =>
                setNewPond({
                  ...newPond,
                  record: {
                    ...newPond.record,
                    phLevel: newPond.record?.phLevel || "",
                    temperatureCelsius:
                      newPond.record?.temperatureCelsius || "",
                    oxygenLevel: newPond.record?.oxygenLevel || "",
                    ammoniaLevel: newPond.record?.ammoniaLevel || "",
                    nitriteLevel: newPond.record?.nitriteLevel || "",
                    nitrateLevel: newPond.record?.nitrateLevel || "",
                    carbonHardness: newPond.record?.carbonHardness || "",
                    waterLevelMeters: newPond.record?.waterLevelMeters || "",
                    notes: e.target.value,
                  },
                })
              }
              placeholder="Nhập ghi chú..."
              className="border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter className="pt-4 border-t mt-6">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="px-6"
        >
          Hủy
        </Button>
        <Button
          onClick={handleAddPond}
          disabled={isPending || !newPond.areaId || !newPond.pondTypeId}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Thêm hồ
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AddPondModal;
