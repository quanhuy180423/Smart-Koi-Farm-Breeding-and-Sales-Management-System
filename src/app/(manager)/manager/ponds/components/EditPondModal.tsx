import { useState } from "react";
import * as z from "zod";
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

// Zod validation schemas for pond
const waterParametersSchema = z.object({
  phLevel: z
    .string()
    .min(1, "Vui lòng nhập pH Level")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "pH Level phải >= 0"
    ),
  temperatureCelsius: z
    .string()
    .min(1, "Vui lòng nhập Nhiệt độ")
    .refine((val) => !isNaN(Number(val)), "Nhiệt độ phải là số hợp lệ"),
  oxygenLevel: z
    .string()
    .min(1, "Vui lòng nhập Oxy")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Oxy phải >= 0"),
  ammoniaLevel: z
    .string()
    .min(1, "Vui lòng nhập Ammonia")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Ammonia phải >= 0"
    ),
  nitriteLevel: z
    .string()
    .min(1, "Vui lòng nhập Nitrite")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Nitrite phải >= 0"
    ),
  nitrateLevel: z
    .string()
    .min(1, "Vui lòng nhập Nitrate")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Nitrate phải >= 0"
    ),
  carbonHardness: z
    .string()
    .min(1, "Vui lòng nhập Độ cứng")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Carbon Hardness phải >= 0"
    ),
  waterLevelMeters: z
    .string()
    .min(1, "Vui lòng nhập Mực nước")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Mực nước phải >= 0"
    ),
  notes: z.string().optional(),
});

const pondSchema = z
  .object({
    pondName: z.string().min(1, "Vui lòng nhập tên hồ"),
    location: z.string().min(1, "Vui lòng nhập địa điểm"),
    lengthMeters: z
      .string()
      .refine((val) => val && Number(val) > 0, "Chiều dài phải lớn hơn 0"),
    widthMeters: z
      .string()
      .refine((val) => val && Number(val) > 0, "Chiều rộng phải lớn hơn 0"),
    depthMeters: z
      .string()
      .refine((val) => val && Number(val) > 0, "Độ sâu phải lớn hơn 0"),
    areaId: z.string().min(1, "Vui lòng chọn khu vực"),
    pondTypeId: z.string().min(1, "Vui lòng chọn loại hồ"),
    record: waterParametersSchema,
  })
  .refine(
    (data) => {
      // Validate waterLevelMeters <= depthMeters
      if (data.record?.waterLevelMeters && data.depthMeters) {
        const waterLevel = Number(data.record.waterLevelMeters);
        const depth = Number(data.depthMeters);
        return waterLevel <= depth;
      }
      return true;
    },
    {
      message: "Mực nước không được lớn hơn độ sâu của hồ",
      path: ["record", "waterLevelMeters"],
    }
  );

interface EditPondModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPond: PondResponse | null;
  editPondForm: PondFormState;
  setEditPondForm: React.Dispatch<React.SetStateAction<PondFormState>>;
  handleUpdatePond: (
    onValidationError?: (errors: Record<string, string>) => void
  ) => void;
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
}: EditPondModalProps) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");

  const waterParamLabels: Record<string, string> = {
    phLevel: "pH Level",
    temperatureCelsius: "Nhiệt độ (°C)",
    oxygenLevel: "Oxy (mg/L)",
    ammoniaLevel: "Amoniac (mg/L)",
    nitriteLevel: "Nitrite (mg/L)",
    nitrateLevel: "Nitrate (mg/L)",
    carbonHardness: "Độ cứng (°dH)",
    waterLevelMeters: "Mức nước (m)",
  };

  const handleUpdatePondWithValidation = () => {
    const result = pondSchema.safeParse({
      pondName: editPondForm.pondName,
      location: editPondForm.location,
      lengthMeters: editPondForm.lengthMeters,
      widthMeters: editPondForm.widthMeters,
      depthMeters: editPondForm.depthMeters,
      areaId: editPondForm.areaId,
      pondTypeId: editPondForm.pondTypeId,
      record: editPondForm.record,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        // Handle nested paths like ["record", "waterLevelMeters"]
        const pathKey =
          error.path.length > 1
            ? error.path.join(".")
            : (error.path[0] as string);
        errors[pathKey] = error.message;

        // Also add without "record." prefix for inline validation
        if (pathKey.startsWith("record.")) {
          const fieldName = pathKey.replace("record.", "");
          errors[fieldName] = error.message;
        }
      });
      setFormErrors(errors);

      // Automatically switch to the tab with errors
      const basicFields = [
        "pondName",
        "location",
        "lengthMeters",
        "widthMeters",
        "depthMeters",
        "areaId",
        "pondTypeId",
        "currentCapacity",
        "pondStatus",
      ];
      const hasBasicErrors = Object.keys(errors).some((key) =>
        basicFields.includes(key)
      );
      const hasWaterErrors = Object.keys(errors).some(
        (key) => !basicFields.includes(key)
      );

      // Prioritize basic tab if it has errors, otherwise go to water tab
      if (hasBasicErrors) {
        setActiveTab("basic");
      } else if (hasWaterErrors) {
        setActiveTab("water");
      }
      return;
    }

    // Don't clear errors here - let handleUpdatePond set them if validation fails there
    handleUpdatePond(setFormErrors);
  };

  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const rest = { ...prev };
        delete rest[fieldName];
        return rest;
      });
    }
  };

  const validateWaterParam = (fieldName: string, value: string): boolean => {
    if (!value) return false; // empty is NOT ok - now required
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    return num >= 0;
  };

  // const handleWaterParamBlur = (
  //   fieldName: string,
  //   value: string | undefined
  // ) => {
  //   if (!value) {
  //     const label = waterParamLabels[fieldName] || fieldName;
  //     setFormErrors((prev) => ({
  //       ...prev,
  //       [fieldName]: `Vui lòng nhập ${label}`,
  //     }));
  //   } else {
  //     const num = parseFloat(value);
  //     if (isNaN(num) || num < 0) {
  //       const label = waterParamLabels[fieldName] || fieldName;
  //       setFormErrors((prev) => ({
  //         ...prev,
  //         [fieldName]: `${label} phải là số >= 0`,
  //       }));
  //     } else if (fieldName === "waterLevelMeters" && editPondForm.depthMeters) {
  //       const waterLevel = Number(value);
  //       const depth = Number(editPondForm.depthMeters);
  //       if (waterLevel > depth) {
  //         setFormErrors((prev) => ({
  //           ...prev,
  //           [fieldName]: "Mực nước không được lớn hơn độ sâu của hồ",
  //         }));
  //       } else {
  //         // Clear both error keys
  //         setFormErrors((prev) => {
  //           const rest = { ...prev };
  //           delete rest[fieldName];
  //           delete rest[`record.${fieldName}`];
  //           return rest;
  //         });
  //       }
  //     } else {
  //       // Clear both error keys
  //       setFormErrors((prev) => {
  //         const rest = { ...prev };
  //         delete rest[fieldName];
  //         delete rest[`record.${fieldName}`];
  //         return rest;
  //       });
  //     }
  //   }
  // };

  const handleWaterParamChange = (
    fieldName:
      | "phLevel"
      | "temperatureCelsius"
      | "oxygenLevel"
      | "ammoniaLevel"
      | "nitriteLevel"
      | "nitrateLevel"
      | "carbonHardness"
      | "waterLevelMeters"
      | "notes",
    value: number | undefined
  ) => {
    const strValue = value ? String(value) : "";
    setEditPondForm({
      ...editPondForm,
      record: {
        ...editPondForm.record,
        phLevel: editPondForm.record?.phLevel || "",
        temperatureCelsius: editPondForm.record?.temperatureCelsius || "",
        oxygenLevel: editPondForm.record?.oxygenLevel || "",
        ammoniaLevel: editPondForm.record?.ammoniaLevel || "",
        nitriteLevel: editPondForm.record?.nitriteLevel || "",
        nitrateLevel: editPondForm.record?.nitrateLevel || "",
        carbonHardness: editPondForm.record?.carbonHardness || "",
        waterLevelMeters: editPondForm.record?.waterLevelMeters || "",
        notes: editPondForm.record?.notes || "",
        [fieldName]: strValue,
      },
    });

    // Clear both error keys (with and without "record." prefix)
    setFormErrors((prev) => {
      const rest = { ...prev };
      delete rest[fieldName];
      delete rest[`record.${fieldName}`];
      return rest;
    });

    // Validate immediately
    if (!strValue) {
      const label = waterParamLabels[fieldName] || fieldName;
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: `Vui lòng nhập ${label}`,
      }));
    } else if (!validateWaterParam(fieldName as string, strValue)) {
      const label = waterParamLabels[fieldName] || fieldName;
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: `${label} phải là số >= 0`,
      }));
    } else {
      // Special validation for water level vs depth
      if (fieldName === "waterLevelMeters" && editPondForm.depthMeters) {
        const waterLevel = Number(strValue);
        const depth = Number(editPondForm.depthMeters);
        if (waterLevel > depth) {
          setFormErrors((prev) => ({
            ...prev,
            [fieldName]: "Mực nước không được lớn hơn độ sâu của hồ",
          }));
        }
      }
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setFormErrors({});
      setActiveTab("basic");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
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
                      Tên hồ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-name"
                      placeholder="Nhập tên hồ..."
                      value={editPondForm.pondName}
                      onChange={(e) => {
                        setEditPondForm({
                          ...editPondForm,
                          pondName: e.target.value,
                        });
                        clearFieldError("pondName");
                      }}
                      className={`border-2 focus:border-blue-500 ${
                        formErrors.pondName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.pondName && (
                      <p className="text-sm text-red-500">
                        {formErrors.pondName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-location"
                      className="text-sm font-medium text-gray-700"
                    >
                      Địa điểm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-location"
                      placeholder="VD: Khu A, Lô 2"
                      value={editPondForm.location}
                      onChange={(e) => {
                        setEditPondForm({
                          ...editPondForm,
                          location: e.target.value,
                        });
                        clearFieldError("location");
                      }}
                      className={`border-2 focus:border-blue-500 ${
                        formErrors.location
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.location && (
                      <p className="text-sm text-red-500">
                        {formErrors.location}
                      </p>
                    )}
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
                        {getAreaNameById(editPondForm.areaId) ||
                          "Chọn Khu vực..."}
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
                      Dài (m) <span className="text-red-500">*</span>
                    </Label>
                    <InputNumber
                      value={
                        editPondForm.lengthMeters
                          ? Number(editPondForm.lengthMeters)
                          : undefined
                      }
                      onChange={(value) => {
                        setEditPondForm({
                          ...editPondForm,
                          lengthMeters: value ? String(value) : "",
                        });
                        clearFieldError("lengthMeters");
                      }}
                      onBlur={() => {
                        const num = parseFloat(editPondForm.lengthMeters);
                        if (
                          editPondForm.lengthMeters &&
                          !isNaN(num) &&
                          num <= 0
                        ) {
                          setFormErrors((prev) => ({
                            ...prev,
                            lengthMeters: "Chiều dài phải lớn hơn 0",
                          }));
                        }
                      }}
                      placeholder="Dài (m)"
                      allowDecimal={true}
                      className={`border-2 focus:border-blue-500 ${
                        formErrors.lengthMeters
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.lengthMeters && (
                      <p className="text-sm text-red-500">
                        {formErrors.lengthMeters}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-width"
                      className="text-sm font-medium text-gray-700"
                    >
                      Rộng (m) <span className="text-red-500">*</span>
                    </Label>
                    <InputNumber
                      value={
                        editPondForm.widthMeters
                          ? Number(editPondForm.widthMeters)
                          : undefined
                      }
                      onChange={(value) => {
                        setEditPondForm({
                          ...editPondForm,
                          widthMeters: value ? String(value) : "",
                        });
                        clearFieldError("widthMeters");
                      }}
                      onBlur={() => {
                        const num = parseFloat(editPondForm.widthMeters);
                        if (
                          editPondForm.widthMeters &&
                          !isNaN(num) &&
                          num <= 0
                        ) {
                          setFormErrors((prev) => ({
                            ...prev,
                            widthMeters: "Chiều rộng phải lớn hơn 0",
                          }));
                        }
                      }}
                      placeholder="Rộng (m)"
                      allowDecimal={true}
                      className={`border-2 focus:border-blue-500 ${
                        formErrors.widthMeters
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.widthMeters && (
                      <p className="text-sm text-red-500">
                        {formErrors.widthMeters}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-depth"
                      className="text-sm font-medium text-gray-700"
                    >
                      Sâu (m) <span className="text-red-500">*</span>
                    </Label>
                    <InputNumber
                      value={
                        editPondForm.depthMeters
                          ? Number(editPondForm.depthMeters)
                          : undefined
                      }
                      onChange={(value) => {
                        setEditPondForm({
                          ...editPondForm,
                          depthMeters: value ? String(value) : "",
                        });
                        clearFieldError("depthMeters");

                        // Re-validate water level if depth changes
                        if (value && editPondForm.record?.waterLevelMeters) {
                          const waterLevel = Number(
                            editPondForm.record.waterLevelMeters
                          );
                          const newDepth = Number(value);
                          if (waterLevel > newDepth) {
                            setFormErrors((prev) => ({
                              ...prev,
                              waterLevelMeters:
                                "Mực nước không được lớn hơn độ sâu của hồ",
                            }));
                          } else {
                            clearFieldError("waterLevelMeters");
                          }
                        }
                      }}
                      onBlur={() => {
                        const num = parseFloat(editPondForm.depthMeters);
                        if (
                          editPondForm.depthMeters &&
                          !isNaN(num) &&
                          num <= 0
                        ) {
                          setFormErrors((prev) => ({
                            ...prev,
                            depthMeters: "Độ sâu phải lớn hơn 0",
                          }));
                        }
                      }}
                      placeholder="Độ sâu (m)"
                      allowDecimal={true}
                      className={`border-2 focus:border-blue-500 ${
                        formErrors.depthMeters
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.depthMeters && (
                      <p className="text-sm text-red-500">
                        {formErrors.depthMeters}
                      </p>
                    )}
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
                      <SelectTrigger className="border-2 w-full border-gray-300 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PondStatus.ACTIVE}>
                          Hoạt động
                        </SelectItem>
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
                          handleWaterParamChange("phLevel", value)
                        }
                        placeholder="VD: 7.5"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.phLevel
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.phLevel && (
                        <p className="text-sm text-red-500">
                          {formErrors.phLevel}
                        </p>
                      )}
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
                        onChange={(value) => {
                          const strValue = value ? String(value) : "";
                          setEditPondForm({
                            ...editPondForm,
                            record: {
                              ...editPondForm.record,
                              temperatureCelsius: strValue,
                              phLevel: editPondForm.record?.phLevel || "",
                              oxygenLevel:
                                editPondForm.record?.oxygenLevel || "",
                              ammoniaLevel:
                                editPondForm.record?.ammoniaLevel || "",
                              nitriteLevel:
                                editPondForm.record?.nitriteLevel || "",
                              nitrateLevel:
                                editPondForm.record?.nitrateLevel || "",
                              carbonHardness:
                                editPondForm.record?.carbonHardness || "",
                              waterLevelMeters:
                                editPondForm.record?.waterLevelMeters || "",
                              notes: editPondForm.record?.notes || "",
                            },
                          });
                          // Validate immediately on change
                          if (strValue) {
                            const num = parseFloat(strValue);
                            if (isNaN(num)) {
                              setFormErrors((prev) => ({
                                ...prev,
                                temperatureCelsius:
                                  "Nhiệt độ phải là số hợp lệ",
                              }));
                            } else {
                              clearFieldError("temperatureCelsius");
                            }
                          } else {
                            clearFieldError("temperatureCelsius");
                          }
                        }}
                        onBlur={() => {
                          // Validate on blur as well
                          const val = editPondForm.record?.temperatureCelsius;
                          if (val) {
                            const num = parseFloat(val);
                            if (isNaN(num)) {
                              setFormErrors((prev) => ({
                                ...prev,
                                temperatureCelsius:
                                  "Nhiệt độ phải là số hợp lệ",
                              }));
                            }
                          }
                        }}
                        placeholder="VD: 25.5"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.temperatureCelsius
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.temperatureCelsius && (
                        <p className="text-sm text-red-500">
                          {formErrors.temperatureCelsius}
                        </p>
                      )}
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
                          handleWaterParamChange("oxygenLevel", value)
                        }
                        placeholder="VD: 8.5"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.oxygenLevel
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.oxygenLevel && (
                        <p className="text-sm text-red-500">
                          {formErrors.oxygenLevel}
                        </p>
                      )}
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
                          handleWaterParamChange("ammoniaLevel", value)
                        }
                        placeholder="VD: 0.0"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.ammoniaLevel
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.ammoniaLevel && (
                        <p className="text-sm text-red-500">
                          {formErrors.ammoniaLevel}
                        </p>
                      )}
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
                          handleWaterParamChange("nitriteLevel", value)
                        }
                        placeholder="VD: 0.0"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.nitriteLevel
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.nitriteLevel && (
                        <p className="text-sm text-red-500">
                          {formErrors.nitriteLevel}
                        </p>
                      )}
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
                          handleWaterParamChange("nitrateLevel", value)
                        }
                        placeholder="VD: 20.0"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.nitrateLevel
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.nitrateLevel && (
                        <p className="text-sm text-red-500">
                          {formErrors.nitrateLevel}
                        </p>
                      )}
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
                          handleWaterParamChange("carbonHardness", value)
                        }
                        placeholder="VD: 8.0"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.carbonHardness
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.carbonHardness && (
                        <p className="text-sm text-red-500">
                          {formErrors.carbonHardness}
                        </p>
                      )}
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
                          handleWaterParamChange("waterLevelMeters", value)
                        }
                        placeholder="VD: 1.5"
                        allowDecimal={true}
                        className={`border-2 focus:border-blue-500 ${
                          formErrors.waterLevelMeters ||
                          formErrors["record.waterLevelMeters"]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {(formErrors.waterLevelMeters ||
                        formErrors["record.waterLevelMeters"]) && (
                        <p className="text-sm text-red-500">
                          {formErrors.waterLevelMeters ||
                            formErrors["record.waterLevelMeters"]}
                        </p>
                      )}
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
                            ammoniaLevel:
                              editPondForm.record?.ammoniaLevel || "",
                            nitriteLevel:
                              editPondForm.record?.nitriteLevel || "",
                            nitrateLevel:
                              editPondForm.record?.nitrateLevel || "",
                            carbonHardness:
                              editPondForm.record?.carbonHardness || "",
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
            onClick={() => handleDialogOpenChange(false)}
            className="px-6 cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdatePondWithValidation}
            disabled={editingPond === null || isPending}
            className="cursor-pointer"
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
};

export default EditPondModal;
