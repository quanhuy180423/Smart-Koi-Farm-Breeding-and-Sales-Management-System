import { useState } from "react";
import * as z from "zod";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, Plus } from "lucide-react";

// Zod validation schemas for pond
const waterParametersSchema = z.object({
  phLevel: z
    .string()
    .min(1, "Vui lòng nhập pH Level")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "pH Level phải >= 0",
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
      "Ammonia phải >= 0",
    ),
  nitriteLevel: z
    .string()
    .min(1, "Vui lòng nhập Nitrite")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Nitrite phải >= 0",
    ),
  nitrateLevel: z
    .string()
    .min(1, "Vui lòng nhập Nitrate")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Nitrate phải >= 0",
    ),
  carbonHardness: z
    .string()
    .min(1, "Vui lòng nhập Độ cứng")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Carbon Hardness phải >= 0",
    ),
  waterLevelMeters: z
    .string()
    .min(1, "Vui lòng nhập Mực nước")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Mực nước phải >= 0",
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
    currentCapacity: z.string().optional(),
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
    },
  );

interface AddPondModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPond: PondFormState;
  setNewPond: React.Dispatch<React.SetStateAction<PondFormState>>;
  handleAddPond: (
    onValidationError?: (errors: Record<string, string>) => void,
  ) => void;
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
}: AddPondModalProps) => {
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
    waterLevelMeters: "Mực nước (m)",
  };

  const handleAddPondWithValidation = () => {
    const result = pondSchema.safeParse({
      pondName: newPond.pondName,
      location: newPond.location,
      lengthMeters: newPond.lengthMeters,
      widthMeters: newPond.widthMeters,
      depthMeters: newPond.depthMeters,
      currentCapacity: calculateCapacity(),
      areaId: newPond.areaId,
      pondTypeId: newPond.pondTypeId,
      record: newPond.record,
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
      ];
      const hasBasicErrors = Object.keys(errors).some((key) =>
        basicFields.includes(key),
      );
      const hasWaterErrors = Object.keys(errors).some(
        (key) => !basicFields.includes(key),
      );

      // Prioritize basic tab if it has errors, otherwise go to water tab
      if (hasBasicErrors) {
        setActiveTab("basic");
      } else if (hasWaterErrors) {
        setActiveTab("water");
      }
      return;
    }

    // Keep current errors - let handleAddPond set them if validation fails there
    handleAddPond(setFormErrors);
  };

  // Calculate capacity from dimensions
  const calculateCapacity = (): string => {
    if (!newPond.lengthMeters || !newPond.widthMeters || !newPond.depthMeters) {
      return "0";
    }
    const length = Number(newPond.lengthMeters);
    const width = Number(newPond.widthMeters);
    const depth = Number(newPond.depthMeters);
    const capacityM3 = length * width * depth;
    const capacityLiters = capacityM3 * 1000; // Convert m³ to liters
    return Math.round(capacityLiters).toString();
  };

  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldName]: _, ...rest } = prev;
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

  const handleWaterParamBlur = (
    fieldName: string,
    value: string | undefined,
  ) => {
    if (!value) {
      const label = waterParamLabels[fieldName] || fieldName;
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: `Vui lòng nhập ${label}`,
      }));
    } else {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        const label = waterParamLabels[fieldName] || fieldName;
        setFormErrors((prev) => ({
          ...prev,
          [fieldName]: `${label} phải là số >= 0`,
        }));
      } else if (fieldName === "waterLevelMeters" && newPond.depthMeters) {
        const waterLevel = Number(value);
        const depth = Number(newPond.depthMeters);
        if (waterLevel > depth) {
          setFormErrors((prev) => ({
            ...prev,
            [fieldName]: "Mực nước không được lớn hơn độ sâu của hồ",
          }));
        } else {
          clearFieldError(fieldName);
        }
      } else {
        clearFieldError(fieldName);
      }
    }
  };

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
    value: number | undefined,
  ) => {
    const strValue = value ? String(value) : "";
    setNewPond({
      ...newPond,
      record: {
        ...newPond.record,
        phLevel: newPond.record?.phLevel || "",
        temperatureCelsius: newPond.record?.temperatureCelsius || "",
        oxygenLevel: newPond.record?.oxygenLevel || "",
        ammoniaLevel: newPond.record?.ammoniaLevel || "",
        nitriteLevel: newPond.record?.nitriteLevel || "",
        nitrateLevel: newPond.record?.nitrateLevel || "",
        carbonHardness: newPond.record?.carbonHardness || "",
        waterLevelMeters: newPond.record?.waterLevelMeters || "",
        notes: newPond.record?.notes || "",
        [fieldName]: strValue,
      },
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
      if (fieldName === "waterLevelMeters" && newPond.depthMeters) {
        const waterLevel = Number(strValue);
        const depth = Number(newPond.depthMeters);
        if (waterLevel > depth) {
          setFormErrors((prev) => ({
            ...prev,
            [fieldName]: "Mực nước không được lớn hơn độ sâu của hồ",
          }));
        } else {
          clearFieldError(fieldName as string);
        }
      } else {
        clearFieldError(fieldName as string);
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
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Thêm hồ cá mới
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết về hồ cá mới
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="water">Thông số nước</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Tên hồ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập tên hồ..."
                  value={newPond.pondName}
                  onChange={(e) => {
                    setNewPond({ ...newPond, pondName: e.target.value });
                    clearFieldError("pondName");
                  }}
                  className={`border-2 focus:border-blue-500 ${
                    formErrors.pondName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.pondName && (
                  <p className="text-sm text-red-500">{formErrors.pondName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Địa điểm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="VD: Khu A, Lô 2"
                  value={newPond.location}
                  onChange={(e) => {
                    setNewPond({ ...newPond, location: e.target.value });
                    clearFieldError("location");
                  }}
                  className={`border-2 focus:border-blue-500 ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.location && (
                  <p className="text-sm text-red-500">{formErrors.location}</p>
                )}
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
                    {getPondTypeNameById(newPond.pondTypeId) ||
                      "Chọn Loại Hồ..."}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="length"
                  className="text-sm font-medium text-gray-700"
                >
                  Dài (m) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.lengthMeters
                      ? Number(newPond.lengthMeters)
                      : undefined
                  }
                  onChange={(value) => {
                    setNewPond({
                      ...newPond,
                      lengthMeters: value ? String(value) : "",
                    });
                    clearFieldError("lengthMeters");
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
                  htmlFor="width"
                  className="text-sm font-medium text-gray-700"
                >
                  Rộng (m) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.widthMeters
                      ? Number(newPond.widthMeters)
                      : undefined
                  }
                  onChange={(value) => {
                    setNewPond({
                      ...newPond,
                      widthMeters: value ? String(value) : "",
                    });
                    clearFieldError("widthMeters");
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
                  htmlFor="depth"
                  className="text-sm font-medium text-gray-700"
                >
                  Sâu (m) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.depthMeters
                      ? Number(newPond.depthMeters)
                      : undefined
                  }
                  onChange={(value) => {
                    setNewPond({
                      ...newPond,
                      depthMeters: value ? String(value) : "",
                    });
                    clearFieldError("depthMeters");

                    // Re-validate water level if depth changes
                    if (value && newPond.record?.waterLevelMeters) {
                      const waterLevel = Number(
                        newPond.record.waterLevelMeters,
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
            </div>
          </TabsContent>

          {/* Water Parameters Tab */}
          <TabsContent value="water" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  pH Level <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.phLevel
                      ? Number(newPond.record.phLevel)
                      : undefined
                  }
                  onChange={(value) => handleWaterParamChange("phLevel", value)}
                  onBlur={() =>
                    handleWaterParamBlur("phLevel", newPond.record?.phLevel)
                  }
                  placeholder="vd: 7.0"
                  allowDecimal={true}
                  className={`border-2 focus:border-blue-500 ${
                    formErrors.phLevel ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.phLevel && (
                  <p className="text-sm text-red-500">{formErrors.phLevel}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Nhiệt độ (°C) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.temperatureCelsius
                      ? Number(newPond.record.temperatureCelsius)
                      : undefined
                  }
                  onChange={(value) =>
                    handleWaterParamChange("temperatureCelsius", value)
                  }
                  onBlur={() =>
                    handleWaterParamBlur(
                      "temperatureCelsius",
                      newPond.record?.temperatureCelsius,
                    )
                  }
                  placeholder="vd: 25"
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
                <Label className="text-sm font-medium text-gray-700">
                  Oxy (mg/L) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.oxygenLevel
                      ? Number(newPond.record.oxygenLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    handleWaterParamChange("oxygenLevel", value)
                  }
                  onBlur={() =>
                    handleWaterParamBlur(
                      "oxygenLevel",
                      newPond.record?.oxygenLevel,
                    )
                  }
                  placeholder="vd: 7.5"
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
                <Label className="text-sm font-medium text-gray-700">
                  Amoniac (mg/L) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.ammoniaLevel
                      ? Number(newPond.record.ammoniaLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    handleWaterParamChange("ammoniaLevel", value)
                  }
                  onBlur={() =>
                    handleWaterParamBlur(
                      "ammoniaLevel",
                      newPond.record?.ammoniaLevel,
                    )
                  }
                  placeholder="vd: 0.02"
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
                <Label className="text-sm font-medium text-gray-700">
                  Nitrite (mg/L) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.nitriteLevel
                      ? Number(newPond.record.nitriteLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    handleWaterParamChange("nitriteLevel", value)
                  }
                  onBlur={() =>
                    handleWaterParamBlur(
                      "nitriteLevel",
                      newPond.record?.nitriteLevel,
                    )
                  }
                  placeholder="vd: 0.05"
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
                <Label className="text-sm font-medium text-gray-700">
                  Nitrate (mg/L) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.nitrateLevel
                      ? Number(newPond.record.nitrateLevel)
                      : undefined
                  }
                  onChange={(value) =>
                    handleWaterParamChange("nitrateLevel", value)
                  }
                  onBlur={() =>
                    handleWaterParamBlur(
                      "nitrateLevel",
                      newPond.record?.nitrateLevel,
                    )
                  }
                  placeholder="vd: 50"
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
                <Label className="text-sm font-medium text-gray-700">
                  Độ cứng (°dH) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.carbonHardness
                      ? Number(newPond.record.carbonHardness)
                      : undefined
                  }
                  onChange={(value) =>
                    handleWaterParamChange("carbonHardness", value)
                  }
                  onBlur={() =>
                    handleWaterParamBlur(
                      "carbonHardness",
                      newPond.record?.carbonHardness,
                    )
                  }
                  placeholder="vd: 8"
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
                <Label className="text-sm font-medium text-gray-700">
                  Mực nước (m) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  value={
                    newPond.record?.waterLevelMeters
                      ? Number(newPond.record.waterLevelMeters)
                      : undefined
                  }
                  onChange={(value) =>
                    handleWaterParamChange("waterLevelMeters", value)
                  }
                  onBlur={() =>
                    handleWaterParamBlur(
                      "waterLevelMeters",
                      newPond.record?.waterLevelMeters,
                    )
                  }
                  placeholder="vd: 1.5"
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
            <div className="space-y-2 mt-4">
              <Label className="text-sm font-medium text-gray-700">
                Ghi chú
              </Label>
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
            onClick={() => handleDialogOpenChange(false)}
            className="px-6 cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddPondWithValidation}
            disabled={isPending}
            className="cursor-pointer"
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
};

export default AddPondModal;
