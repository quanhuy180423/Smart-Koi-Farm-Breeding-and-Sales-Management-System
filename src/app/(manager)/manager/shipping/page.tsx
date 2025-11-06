"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Trash2,
  Plus,
  Package,
  Truck,
  Info,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import formatCurrency from "@/lib/utils/numbers";
import {
  useGetAllShippingBoxes,
  useCreateShippingBox,
  useUpdateShippingBox,
  useDeleteShippingBox,
  useGetShippingBoxRules,
  useCreateShippingBoxRule,
  useUpdateShippingBoxRule,
  useDeleteShippingBoxRule,
} from "@/hooks/useShippingBox";
import {
  useGetAllShippingDistances,
  useCreateShippingDistance,
  useUpdateShippingDistance,
  useDeleteShippingDistance,
} from "@/hooks/useShippingDistance";
import {
  ShippingBoxResponse,
  ShippingBoxRule,
  RuleType,
} from "@/lib/api/services/fetchShippingBox";
import { ShippingDistance } from "@/lib/api/services/fetchShippingDistance";

export default function ShippingManagement() {
  const {
    data: shippingBoxes,
    isLoading: isLoadingBoxes,
    isError: isErrorBoxes,
  } = useGetAllShippingBoxes();
  const { mutateAsync: createBox, isPending: isCreatingBox } =
    useCreateShippingBox();
  const { mutateAsync: updateBox, isPending: isUpdatingBox } =
    useUpdateShippingBox();
  const { mutateAsync: deleteBox, isPending: isDeletingBox } =
    useDeleteShippingBox();
  const { mutateAsync: createRule, isPending: isCreatingRule } =
    useCreateShippingBoxRule();
  const { mutateAsync: updateRule, isPending: isUpdatingRule } =
    useUpdateShippingBoxRule();
  const { mutateAsync: deleteRule, isPending: isDeletingRule } =
    useDeleteShippingBoxRule();

  // Distance hooks
  const {
    data: shippingDistances,
    isLoading: isLoadingDistances,
    isError: isErrorDistances,
  } = useGetAllShippingDistances();
  const { mutateAsync: createDistance, isPending: isCreatingDistance } =
    useCreateShippingDistance();
  const { mutateAsync: updateDistance, isPending: isUpdatingDistance } =
    useUpdateShippingDistance();
  const { mutateAsync: deleteDistanceAsync, isPending: isDeletingDistance } =
    useDeleteShippingDistance();

  const [isBoxDialogOpen, setIsBoxDialogOpen] = useState(false);
  const [isDistanceDialogOpen, setIsDistanceDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<ShippingBoxResponse | null>(
    null,
  );
  const [editingDistance, setEditingDistance] =
    useState<ShippingDistance | null>(null);
  const [editingRule, setEditingRule] = useState<ShippingBoxRule | null>(null);
  const [expandedBoxId, setExpandedBoxId] = useState<number | null>(null);
  const { data: boxRules, isLoading: isLoadingRules } = useGetShippingBoxRules(
    expandedBoxId || undefined,
  );

  // Form state for new rule
  const [ruleFormData, setRuleFormData] = useState({
    ruleType: RuleType.ByCount as RuleType,
    maxCount: null as number | null,
    maxLengthCm: null as number | null,
    minLengthCm: null as number | null,
    maxWeightLb: null as number | null,
    extraInfo: "",
    priority: 0,
    isActive: true,
  });

  // Form state for new distance
  const [distanceFormData, setDistanceFormData] = useState({
    name: "",
    minDistanceKm: 0,
    maxDistanceKm: 2000,
    pricePerKm: 0,
    baseFee: 0,
    description: "",
    isActive: true,
  });

  // Confirmation dialog states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "box" | "rule" | "distance";
    item: ShippingBoxResponse | ShippingBoxRule | ShippingDistance | null;
  } | null>(null);

  // Form state for new box
  const [boxFormData, setBoxFormData] = useState({
    name: "",
    maxKoiCount: null as number | null,
    maxKoiSizeInch: null as number | null,
    fee: 0,
    weightCapacityLb: 0,
    notes: "",
    isActive: true,
  });

  const handleEditBox = (box: ShippingBoxResponse) => {
    setEditingBox(box);
    setBoxFormData({
      name: box.name,
      maxKoiCount: box.maxKoiCount,
      maxKoiSizeInch: box.maxKoiSizeInch,
      fee: box.fee,
      weightCapacityLb: box.weightCapacityLb,
      notes: box.notes,
      isActive: box.isActive,
    });
    setIsBoxDialogOpen(true);
  };

  const resetBoxForm = () => {
    setBoxFormData({
      name: "",
      maxKoiCount: null,
      maxKoiSizeInch: null,
      fee: 0,
      weightCapacityLb: 0,
      notes: "",
      isActive: true,
    });
  };

  const handleCloseBoxDialog = () => {
    setIsBoxDialogOpen(false);
    setEditingBox(null);
    resetBoxForm();
  };

  const handleAddBox = () => {
    setEditingBox(null);
    resetBoxForm();
    setIsBoxDialogOpen(true);
  };

  const handleBoxFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setBoxFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? null : parseFloat(value)) : value,
    }));
  };

  const handleBoxFormSubmit = async () => {
    // Validation
    if (!boxFormData.name.trim()) {
      alert("Vui lòng nhập tên hộp");
      return;
    }

    if (boxFormData.fee <= 0) {
      alert("Phí vận chuyển phải lớn hơn 0");
      return;
    }

    if (boxFormData.weightCapacityLb <= 0) {
      alert("Sức chứa cân nặng phải lớn hơn 0");
      return;
    }

    try {
      const payload = {
        name: boxFormData.name,
        weightCapacityLb: boxFormData.weightCapacityLb,
        fee: boxFormData.fee,
        maxKoiCount: boxFormData.maxKoiCount,
        maxKoiSizeInch: boxFormData.maxKoiSizeInch,
        notes: boxFormData.notes,
        isActive: boxFormData.isActive,
      };

      if (editingBox) {
        // Update
        await updateBox({
          id: editingBox.id,
          request: payload,
        });
      } else {
        // Create
        await createBox(payload);
      }
      handleCloseBoxDialog();
    } catch (error) {
      console.error("Failed to save shipping box:", error);
    }
  };

  const handleDeleteBox = (box: ShippingBoxResponse) => {
    setDeleteConfirm({ type: "box", item: box });
  };

  const confirmDeleteBox = async () => {
    if (!deleteConfirm || deleteConfirm.type !== "box" || !deleteConfirm.item) {
      return;
    }

    const box = deleteConfirm.item as ShippingBoxResponse;
    try {
      await deleteBox(box.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete shipping box:", error);
    }
  };

  // Rule handlers
  const handleEditRule = (rule: ShippingBoxRule) => {
    setEditingRule(rule);
    setRuleFormData({
      ruleType: rule.ruleType as RuleType,
      maxCount: rule.maxCount,
      maxLengthCm: rule.maxLengthCm,
      minLengthCm: rule.minLengthCm,
      maxWeightLb: rule.maxWeightLb,
      extraInfo: rule.extraInfo,
      priority: rule.priority,
      isActive: rule.isActive,
    });
    setIsRuleDialogOpen(true);
  };

  const resetRuleForm = () => {
    setRuleFormData({
      ruleType: RuleType.ByCount as RuleType,
      maxCount: null,
      maxLengthCm: null,
      minLengthCm: null,
      maxWeightLb: null,
      extraInfo: "",
      priority: 0,
      isActive: true,
    });
  };

  const handleCloseRuleDialog = () => {
    setIsRuleDialogOpen(false);
    setEditingRule(null);
    resetRuleForm();
  };

  const handleAddRule = () => {
    setEditingRule(null);
    resetRuleForm();
    setIsRuleDialogOpen(true);
  };

  const handleRuleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setRuleFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? null
            : parseFloat(value)
          : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };

  const handleRuleFormSubmit = async () => {
    if (!expandedBoxId) {
      alert("Vui lòng chọn hộp trước");
      return;
    }

    try {
      const payload = {
        shippingBoxId: expandedBoxId,
        ruleType: ruleFormData.ruleType,
        maxCount: ruleFormData.maxCount,
        maxLengthCm: ruleFormData.maxLengthCm,
        minLengthCm: ruleFormData.minLengthCm,
        maxWeightLb: ruleFormData.maxWeightLb,
        extraInfo: ruleFormData.extraInfo,
        priority: ruleFormData.priority,
        isActive: ruleFormData.isActive,
      };

      if (editingRule) {
        // Update
        await updateRule({
          ruleId: editingRule.id,
          request: payload,
        });
      } else {
        // Create
        await createRule(payload);
      }
      handleCloseRuleDialog();
    } catch (error) {
      console.error("Failed to save shipping box rule:", error);
    }
  };

  const handleDeleteRule = (rule: ShippingBoxRule) => {
    setDeleteConfirm({ type: "rule", item: rule });
  };

  const confirmDeleteRule = async () => {
    if (
      !deleteConfirm ||
      deleteConfirm.type !== "rule" ||
      !deleteConfirm.item
    ) {
      return;
    }

    const rule = deleteConfirm.item as ShippingBoxRule;
    try {
      await deleteRule(rule.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete shipping box rule:", error);
    }
  };

  // Distance handlers
  const handleEditDistance = (distance: ShippingDistance) => {
    setEditingDistance(distance);
    setDistanceFormData({
      name: distance.name,
      minDistanceKm: distance.minDistanceKm,
      maxDistanceKm: distance.maxDistanceKm,
      pricePerKm: distance.pricePerKm,
      baseFee: distance.baseFee,
      description: distance.description,
      isActive: distance.isActive,
    });
    setIsDistanceDialogOpen(true);
  };

  const resetDistanceForm = () => {
    setDistanceFormData({
      name: "",
      minDistanceKm: 0,
      maxDistanceKm: 2000,
      pricePerKm: 0,
      baseFee: 0,
      description: "",
      isActive: true,
    });
  };

  const handleCloseDistanceDialog = () => {
    setIsDistanceDialogOpen(false);
    setEditingDistance(null);
    resetDistanceForm();
  };

  const handleAddDistanceClick = () => {
    setEditingDistance(null);
    resetDistanceForm();
    setIsDistanceDialogOpen(true);
  };

  const handleDistanceFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setDistanceFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? 0
            : parseFloat(value)
          : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };

  const handleDistanceFormSubmit = async () => {
    // Validation
    if (!distanceFormData.name.trim()) {
      alert("Vui lòng nhập tên khoảng cách");
      return;
    }

    if (distanceFormData.minDistanceKm < 0) {
      alert("Khoảng cách tối thiểu không thể âm");
      return;
    }

    if (distanceFormData.maxDistanceKm < distanceFormData.minDistanceKm) {
      alert("Khoảng cách tối đa phải lớn hơn khoảng cách tối thiểu");
      return;
    }

    if (distanceFormData.pricePerKm < 0) {
      alert("Giá/km không thể âm");
      return;
    }

    if (distanceFormData.baseFee < 0) {
      alert("Phí cơ sở không thể âm");
      return;
    }

    try {
      const payload = {
        name: distanceFormData.name,
        minDistanceKm: distanceFormData.minDistanceKm,
        maxDistanceKm: distanceFormData.maxDistanceKm,
        pricePerKm: distanceFormData.pricePerKm,
        baseFee: distanceFormData.baseFee,
        description: distanceFormData.description,
        isActive: distanceFormData.isActive,
      };

      if (editingDistance) {
        // Update
        await updateDistance({
          id: editingDistance.id,
          request: payload,
        });
      } else {
        // Create
        await createDistance(payload);
      }
      handleCloseDistanceDialog();
    } catch (error) {
      console.error("Failed to save shipping distance:", error);
    }
  };

  const handleDeleteDistance = (distance: ShippingDistance) => {
    setDeleteConfirm({ type: "distance", item: distance });
  };

  const confirmDeleteDistance = async () => {
    if (
      !deleteConfirm ||
      deleteConfirm.type !== "distance" ||
      !deleteConfirm.item
    ) {
      return;
    }

    const distance = deleteConfirm.item as ShippingDistance;
    try {
      await deleteDistanceAsync(distance.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete shipping distance:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý chi phí vận chuyển
          </h1>
          <p className="text-muted-foreground">
            Thiết lập giá vận chuyển theo kích thước hộp và khoảng cách giao
            hàng
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="boxes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="boxes" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Kích thước hộp
          </TabsTrigger>
          <TabsTrigger value="distances" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Khoảng cách vận chuyển
          </TabsTrigger>
        </TabsList>

        {/* Box Size Tab */}
        <TabsContent value="boxes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quản lý kích thước hộp</CardTitle>
                  <CardDescription>
                    Thiết lập giá vận chuyển theo kích thước hộp và sức chứa
                  </CardDescription>
                </div>
                <Dialog
                  open={isBoxDialogOpen}
                  onOpenChange={handleCloseBoxDialog}
                >
                  <Button onClick={handleAddBox}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm kích thước mới
                  </Button>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <DialogTitle className="text-xl">
                            {editingBox
                              ? "Chỉnh sửa kích thước hộp"
                              : "Thêm kích thước hộp mới"}
                          </DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            {editingBox
                              ? "Cập nhật thông tin kích thước hộp"
                              : "Điền thông tin để tạo kích thước hộp mới cho vận chuyển"}
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="boxName"
                          className="text-sm font-medium"
                        >
                          Tên hộp <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="boxName"
                          name="name"
                          placeholder="VD: Mini Box"
                          value={boxFormData.name}
                          onChange={handleBoxFormChange}
                          disabled={isCreatingBox}
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="maxKoiCount"
                            className="text-sm font-medium"
                          >
                            Số lượng cá tối đa
                          </Label>
                          <Input
                            id="maxKoiCount"
                            name="maxKoiCount"
                            type="number"
                            placeholder="VD: 5"
                            value={boxFormData.maxKoiCount || ""}
                            onChange={handleBoxFormChange}
                            disabled={isCreatingBox}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="maxKoiSizeInch"
                            className="text-sm font-medium"
                          >
                            Kích thước cá tối đa (Inch)
                          </Label>
                          <Input
                            id="maxKoiSizeInch"
                            name="maxKoiSizeInch"
                            type="number"
                            placeholder="VD: 6"
                            value={boxFormData.maxKoiSizeInch || ""}
                            onChange={handleBoxFormChange}
                            disabled={isCreatingBox}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fee" className="text-sm font-medium">
                            Phí vận chuyển (VNĐ){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fee"
                            name="fee"
                            type="number"
                            placeholder="VD: 250000"
                            value={boxFormData.fee}
                            onChange={handleBoxFormChange}
                            disabled={isCreatingBox}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="weightCapacityLb"
                            className="text-sm font-medium"
                          >
                            Sức chứa cân nặng (Lb){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="weightCapacityLb"
                            name="weightCapacityLb"
                            type="number"
                            placeholder="VD: 15"
                            value={boxFormData.weightCapacityLb}
                            onChange={handleBoxFormChange}
                            disabled={isCreatingBox}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium">
                          Ghi chú
                        </Label>
                        <Input
                          id="notes"
                          name="notes"
                          placeholder="VD: Chỉ dành cho cá dưới 1 tuổi"
                          value={boxFormData.notes}
                          onChange={handleBoxFormChange}
                          disabled={isCreatingBox}
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-7 w-7 text-blue-600 -mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Lưu ý:</p>
                            <p>
                              Hộp sẽ được sử dụng dựa trên kích thước cá và số
                              lượng cá trong đơn hàng. Phí sẽ được tính theo hộp
                              được sử dụng.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleCloseBoxDialog}
                        disabled={isCreatingBox || isUpdatingBox}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleBoxFormSubmit}
                        disabled={isCreatingBox || isUpdatingBox}
                      >
                        {isCreatingBox || isUpdatingBox ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingBox ? "Đang cập nhật..." : "Đang tạo..."}
                          </>
                        ) : editingBox ? (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            Cập nhật
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm hộp
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBoxes ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải kích thước hộp...
                  </span>
                </div>
              ) : isErrorBoxes ? (
                <div className="flex items-center justify-center p-12">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <span className="ml-2 text-muted-foreground">
                    Có lỗi khi tải kích thước hộp
                  </span>
                </div>
              ) : !shippingBoxes || shippingBoxes.length === 0 ? (
                <div className="text-center p-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Chưa có kích thước hộp nào. Hãy thêm kích thước hộp đầu
                    tiên!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {shippingBoxes.map((box) => (
                    <Card key={box.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{box.name}</CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleEditBox(box)}
                              disabled={isUpdatingBox || isDeletingBox}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:bg-red-500"
                              onClick={() => handleDeleteBox(box)}
                              disabled={isDeletingBox}
                            >
                              {isDeletingBox ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground italic">
                          {box.notes}
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Phí vận chuyển:
                            </span>
                            <span className="font-bold text-lg ml-1">
                              {formatCurrency(box.fee)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Sức chứa:
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50"
                            >
                              {box.maxKoiCount || "∞"}{" "}
                              <span className="text-muted-foreground ml-1">
                                / {box.maxKoiSizeInch || "∞"}in
                              </span>
                            </Badge>
                          </div>
                          {!box.isActive && (
                            <Badge variant="destructive">Không hoạt động</Badge>
                          )}
                        </div>

                        {/* Rules Expandable Section */}
                        <div className="pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-xs h-8"
                            onClick={() =>
                              setExpandedBoxId(
                                expandedBoxId === box.id ? null : box.id,
                              )
                            }
                          >
                            <span className="text-muted-foreground">
                              Quy tắc ({box.rules?.length || 0})
                            </span>
                            {expandedBoxId === box.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Rules List */}
                          {expandedBoxId === box.id && (
                            <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
                              {isLoadingRules ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    Đang tải...
                                  </span>
                                </div>
                              ) : !boxRules || boxRules.length === 0 ? (
                                <div className="text-center py-4">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Không có quy tắc nào
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-xs"
                                    onClick={() => {
                                      if (expandedBoxId === box.id)
                                        handleAddRule();
                                    }}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Thêm quy tắc
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {boxRules.map((rule) => (
                                    <div
                                      key={rule.id}
                                      className="text-xs p-2 bg-muted/50 rounded border border-muted-foreground/20"
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex-1">
                                          <p className="font-medium">
                                            {rule.ruleType}
                                          </p>
                                          <p className="text-muted-foreground">
                                            {rule.extraInfo}
                                          </p>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5"
                                            onClick={() => handleEditRule(rule)}
                                            disabled={
                                              isUpdatingRule || isDeletingRule
                                            }
                                          >
                                            <Edit className="h-2.5 w-2.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 text-red-500 hover:bg-red-500"
                                            onClick={() =>
                                              handleDeleteRule(rule)
                                            }
                                            disabled={isDeletingRule}
                                          >
                                            {isDeletingRule ? (
                                              <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                            ) : (
                                              <Trash2 className="h-2.5 w-2.5" />
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                      {!rule.isActive && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs mb-1"
                                        >
                                          Vô hiệu
                                        </Badge>
                                      )}
                                      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                                        {rule.maxCount && (
                                          <span>Max: {rule.maxCount} cá</span>
                                        )}
                                        {rule.maxLengthCm && (
                                          <span>Dài: {rule.maxLengthCm}cm</span>
                                        )}
                                        {rule.minLengthCm && (
                                          <span>Min: {rule.minLengthCm}cm</span>
                                        )}
                                        {rule.maxWeightLb && (
                                          <span>Cân: {rule.maxWeightLb}lb</span>
                                        )}
                                      </div>
                                      <p className="text-muted-foreground mt-1">
                                        Priority: {rule.priority}
                                      </p>
                                    </div>
                                  ))}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full h-7 text-xs mt-2"
                                    onClick={handleAddRule}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Thêm quy tắc
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rule Dialog */}
          <Dialog open={isRuleDialogOpen} onOpenChange={handleCloseRuleDialog}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      {editingRule
                        ? "Chỉnh sửa quy tắc vận chuyển"
                        : "Thêm quy tắc vận chuyển mới"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {editingRule
                        ? "Cập nhật thông tin quy tắc vận chuyển"
                        : "Điền thông tin để tạo quy tắc vận chuyển mới"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ruleType" className="text-sm font-medium">
                    Loại quy tắc <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="ruleType"
                    name="ruleType"
                    value={ruleFormData.ruleType}
                    onChange={handleRuleFormChange}
                    disabled={isCreatingRule || isUpdatingRule}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                  >
                    <option value={RuleType.ByAge}>Theo tuổi (ByAge)</option>
                    <option value={RuleType.ByMaxLength}>
                      Theo chiều dài tối đa (ByMaxLength)
                    </option>
                    <option value={RuleType.ByCount}>
                      Theo số lượng cá (ByCount)
                    </option>
                    <option value={RuleType.ByWeight}>
                      Theo cân nặng (ByWeight)
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCount" className="text-sm font-medium">
                    Số lượng cá tối đa
                  </Label>
                  <Input
                    id="maxCount"
                    name="maxCount"
                    type="number"
                    placeholder="VD: 5"
                    value={ruleFormData.maxCount || ""}
                    onChange={handleRuleFormChange}
                    disabled={isCreatingRule || isUpdatingRule}
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="minLengthCm"
                      className="text-sm font-medium"
                    >
                      Chiều dài tối thiểu (cm)
                    </Label>
                    <Input
                      id="minLengthCm"
                      name="minLengthCm"
                      type="number"
                      placeholder="VD: 10"
                      value={ruleFormData.minLengthCm || ""}
                      onChange={handleRuleFormChange}
                      disabled={isCreatingRule || isUpdatingRule}
                      className="border-gray-300 focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="maxLengthCm"
                      className="text-sm font-medium"
                    >
                      Chiều dài tối đa (cm)
                    </Label>
                    <Input
                      id="maxLengthCm"
                      name="maxLengthCm"
                      type="number"
                      placeholder="VD: 50"
                      value={ruleFormData.maxLengthCm || ""}
                      onChange={handleRuleFormChange}
                      disabled={isCreatingRule || isUpdatingRule}
                      className="border-gray-300 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxWeightLb" className="text-sm font-medium">
                    Cân nặng tối đa (Lb)
                  </Label>
                  <Input
                    id="maxWeightLb"
                    name="maxWeightLb"
                    type="number"
                    placeholder="VD: 10"
                    value={ruleFormData.maxWeightLb || ""}
                    onChange={handleRuleFormChange}
                    disabled={isCreatingRule || isUpdatingRule}
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Ưu tiên (Priority)
                  </Label>
                  <Input
                    id="priority"
                    name="priority"
                    type="number"
                    placeholder="VD: 1"
                    value={ruleFormData.priority}
                    onChange={handleRuleFormChange}
                    disabled={isCreatingRule || isUpdatingRule}
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extraInfo" className="text-sm font-medium">
                    Thông tin bổ sung
                  </Label>
                  <Input
                    id="extraInfo"
                    name="extraInfo"
                    placeholder="VD: Chỉ dành cho cá nhỏ"
                    value={ruleFormData.extraInfo}
                    onChange={handleRuleFormChange}
                    disabled={isCreatingRule || isUpdatingRule}
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={ruleFormData.isActive}
                    onChange={handleRuleFormChange}
                    disabled={isCreatingRule || isUpdatingRule}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Kích hoạt quy tắc này
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCloseRuleDialog}
                  disabled={isCreatingRule || isUpdatingRule}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleRuleFormSubmit}
                  disabled={isCreatingRule || isUpdatingRule}
                >
                  {isCreatingRule || isUpdatingRule ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingRule ? "Đang cập nhật..." : "Đang tạo..."}
                    </>
                  ) : editingRule ? (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Cập nhật
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm quy tắc
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Distance Tab */}
        <TabsContent value="distances" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quản lý khoảng cách vận chuyển</CardTitle>
                  <CardDescription>
                    Thiết lập phí vận chuyển theo khoảng cách giao hàng
                  </CardDescription>
                </div>
                <Dialog
                  open={isDistanceDialogOpen}
                  onOpenChange={handleCloseDistanceDialog}
                >
                  <Button onClick={handleAddDistanceClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm khoảng cách mới
                  </Button>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <DialogTitle className="text-xl">
                            {editingDistance
                              ? "Chỉnh sửa khoảng cách vận chuyển"
                              : "Thêm khoảng cách vận chuyển mới"}
                          </DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            {editingDistance
                              ? "Cập nhật thông tin khoảng cách và giá vận chuyển"
                              : "Thiết lập khoảng cách và giá vận chuyển mới"}
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Tên khoảng cách{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="VD: Nội thành"
                          value={distanceFormData.name}
                          onChange={handleDistanceFormChange}
                          disabled={isCreatingDistance || isUpdatingDistance}
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="text-sm font-medium">
                          Khoảng cách (km){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-4">
                          <Slider
                            value={[
                              distanceFormData.minDistanceKm,
                              distanceFormData.maxDistanceKm,
                            ]}
                            onValueChange={(values) => {
                              setDistanceFormData((prev) => ({
                                ...prev,
                                minDistanceKm: values[0],
                                maxDistanceKm: values[1],
                              }));
                            }}
                            min={0}
                            max={2000}
                            step={1}
                            disabled={isCreatingDistance || isUpdatingDistance}
                            className="w-full"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="minDistanceKm"
                                className="text-xs"
                              >
                                Từ (km)
                              </Label>
                              <Input
                                id="minDistanceKm"
                                name="minDistanceKm"
                                type="number"
                                placeholder="0"
                                value={distanceFormData.minDistanceKm}
                                onChange={handleDistanceFormChange}
                                disabled={
                                  isCreatingDistance || isUpdatingDistance
                                }
                                className="border-gray-300 focus:border-teal-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="maxDistanceKm"
                                className="text-xs"
                              >
                                Đến (km)
                              </Label>
                              <Input
                                id="maxDistanceKm"
                                name="maxDistanceKm"
                                type="number"
                                placeholder="2000"
                                value={distanceFormData.maxDistanceKm}
                                onChange={handleDistanceFormChange}
                                disabled={
                                  isCreatingDistance || isUpdatingDistance
                                }
                                className="border-gray-300 focus:border-teal-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="pricePerKm"
                            className="text-sm font-medium"
                          >
                            Giá mỗi km (VNĐ){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="pricePerKm"
                            name="pricePerKm"
                            type="number"
                            placeholder="VD: 2000"
                            value={distanceFormData.pricePerKm}
                            onChange={handleDistanceFormChange}
                            disabled={isCreatingDistance || isUpdatingDistance}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="baseFee"
                            className="text-sm font-medium"
                          >
                            Phí cơ sở (VNĐ){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="baseFee"
                            name="baseFee"
                            type="number"
                            placeholder="VD: 30000"
                            value={distanceFormData.baseFee}
                            onChange={handleDistanceFormChange}
                            disabled={isCreatingDistance || isUpdatingDistance}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Mô tả
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          placeholder="VD: Giao hàng nội thành"
                          value={distanceFormData.description}
                          onChange={handleDistanceFormChange}
                          disabled={isCreatingDistance || isUpdatingDistance}
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="distanceIsActive"
                          name="isActive"
                          checked={distanceFormData.isActive}
                          onChange={handleDistanceFormChange}
                          disabled={isCreatingDistance || isUpdatingDistance}
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="distanceIsActive"
                          className="text-sm font-medium"
                        >
                          Kích hoạt khoảng cách này
                        </Label>
                      </div>

                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-2">
                              Công thức tính phí:
                            </p>
                            <p className="font-mono bg-white px-2 py-1 rounded text-xs">
                              Tổng phí = Phí cố định + (Khoảng cách × Giá/km)
                            </p>
                            <p className="mt-2 text-xs">
                              Ví dụ: Với{" "}
                              {distanceFormData.maxDistanceKm || "20"}
                              km, giá/km{" "}
                              {distanceFormData.pricePerKm.toLocaleString(
                                "vi-VN",
                              )}
                              ₫, phí cơ sở{" "}
                              {distanceFormData.baseFee.toLocaleString("vi-VN")}
                              ₫ → Tổng:{" "}
                              {(
                                distanceFormData.baseFee +
                                (distanceFormData.maxDistanceKm || 20) *
                                  distanceFormData.pricePerKm
                              ).toLocaleString("vi-VN")}
                              ₫
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleCloseDistanceDialog}
                        disabled={isCreatingDistance || isUpdatingDistance}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleDistanceFormSubmit}
                        disabled={isCreatingDistance || isUpdatingDistance}
                      >
                        {isCreatingDistance || isUpdatingDistance ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingDistance
                              ? "Đang cập nhật..."
                              : "Đang tạo..."}
                          </>
                        ) : editingDistance ? (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            Cập nhật
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm khoảng cách
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDistances ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải khoảng cách vận chuyển...
                  </span>
                </div>
              ) : isErrorDistances ? (
                <div className="flex items-center justify-center p-12">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <span className="ml-2 text-muted-foreground">
                    Có lỗi khi tải khoảng cách vận chuyển
                  </span>
                </div>
              ) : !shippingDistances || shippingDistances.length === 0 ? (
                <div className="text-center p-12">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Chưa có khoảng cách vận chuyển nào. Hãy thêm khoảng cách đầu
                    tiên!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {shippingDistances.map((distance) => {
                    const exampleDistance = distance.maxDistanceKm;
                    const exampleCost =
                      distance.baseFee + exampleDistance * distance.pricePerKm;

                    return (
                      <Card key={distance.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {distance.name}
                            </CardTitle>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleEditDistance(distance)}
                                disabled={
                                  isUpdatingDistance || isDeletingDistance
                                }
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:bg-red-500"
                                onClick={() => handleDeleteDistance(distance)}
                                disabled={isDeletingDistance}
                              >
                                {isDeletingDistance ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {distance.minDistanceKm} - {distance.maxDistanceKm}{" "}
                            km
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">
                                Khoảng cách
                              </div>
                              <div className="font-medium">
                                {distance.minDistanceKm} -{" "}
                                {distance.maxDistanceKm} km
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                Giá/km
                              </div>
                              <div className="font-medium">
                                {formatCurrency(distance.pricePerKm)}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                Phí cơ sở
                              </div>
                              <div className="font-medium">
                                {formatCurrency(distance.baseFee)}
                              </div>
                            </div>
                          </div>
                          {distance.description && (
                            <div className="text-xs text-muted-foreground">
                              {distance.description}
                            </div>
                          )}
                          <div className="text-xs">
                            Ví dụ ({exampleDistance}km):{" "}
                            <span className="font-medium">
                              {exampleDistance} x{" "}
                              {formatCurrency(distance.pricePerKm)} +{" "}
                              {formatCurrency(distance.baseFee)} ={" "}
                              {formatCurrency(exampleCost)}
                            </span>
                          </div>
                          {!distance.isActive && (
                            <Badge variant="destructive">Không hoạt động</Badge>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setDeleteConfirm(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteConfirm?.type === "box"
                ? "Xóa hộp vận chuyển"
                : deleteConfirm?.type === "rule"
                  ? "Xóa quy tắc vận chuyển"
                  : "Xóa khoảng cách vận chuyển"}
            </DialogTitle>
            <DialogDescription>
              {deleteConfirm?.type === "box" && deleteConfirm?.item
                ? `Bạn có chắc chắn muốn xóa hộp "${(deleteConfirm.item as ShippingBoxResponse).name}"? Hành động này không thể hoàn tác.`
                : deleteConfirm?.type === "rule"
                  ? "Bạn có chắc chắn muốn xóa quy tắc này? Hành động này không thể hoàn tác."
                  : deleteConfirm?.type === "distance" && deleteConfirm?.item
                    ? `Bạn có chắc chắn muốn xóa khoảng cách "${(deleteConfirm.item as ShippingDistance).name}"? Hành động này không thể hoàn tác.`
                    : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={isDeletingBox || isDeletingRule || isDeletingDistance}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm?.type === "box") {
                  confirmDeleteBox();
                } else if (deleteConfirm?.type === "rule") {
                  confirmDeleteRule();
                } else if (deleteConfirm?.type === "distance") {
                  confirmDeleteDistance();
                }
              }}
              disabled={isDeletingBox || isDeletingRule || isDeletingDistance}
            >
              {isDeletingBox || isDeletingRule || isDeletingDistance ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
