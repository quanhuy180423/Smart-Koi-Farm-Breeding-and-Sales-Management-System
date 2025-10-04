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
import { Edit, Trash2, Plus, Package, Truck, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import formatCurrency from "@/lib/utils/numbers";

// Types
interface BoxSize {
  id: string;
  name: string;
  fishSize: string;
  basePrice: number;
  fishCount: string;
}

interface DistanceRange {
  id: string;
  name: string;
  minDistance: number;
  maxDistance: number;
  pricePerKm: number;
  fixedFee: number;
}

// Mock data
const boxSizes: BoxSize[] = [
  {
    id: "mini",
    name: "Mini Box",
    fishSize: "15cm",
    basePrice: 50000,
    fishCount: "2",
  },
  {
    id: "medium",
    name: "Medium Box",
    fishSize: "25cm",
    basePrice: 80000,
    fishCount: "5",
  },
  {
    id: "large",
    name: "Large Box",
    fishSize: "35cm",
    basePrice: 120000,
    fishCount: "10",
  },
  {
    id: "extra-large",
    name: "Extra Large Box",
    fishSize: "45cm",
    basePrice: 180000,
    fishCount: "15+",
  },
];

const distanceRanges: DistanceRange[] = [
  {
    id: "noi-thanh",
    name: "Nội thành",
    minDistance: 0,
    maxDistance: 20,
    pricePerKm: 2000,
    fixedFee: 30000,
  },
  {
    id: "ngoai-thanh",
    name: "Ngoại thành",
    minDistance: 21,
    maxDistance: 50,
    pricePerKm: 3000,
    fixedFee: 50000,
  },
  {
    id: "lien-tinh-gan",
    name: "Liên tỉnh gần",
    minDistance: 51,
    maxDistance: 200,
    pricePerKm: 4000,
    fixedFee: 80000,
  },
  {
    id: "lien-tinh-xa",
    name: "Liên tỉnh xa",
    minDistance: 201,
    maxDistance: 500,
    pricePerKm: 5000,
    fixedFee: 120000,
  },
];

export default function ShippingManagement() {
  const [isBoxDialogOpen, setIsBoxDialogOpen] = useState(false);
  const [isDistanceDialogOpen, setIsDistanceDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<BoxSize | null>(null);
  const [editingDistance, setEditingDistance] = useState<DistanceRange | null>(
    null,
  );

  const handleEditBox = (box: BoxSize) => {
    setEditingBox(box);
    setIsBoxDialogOpen(true);
  };

  const handleEditDistance = (distance: DistanceRange) => {
    setEditingDistance(distance);
    setIsDistanceDialogOpen(true);
  };

  const handleCloseBoxDialog = () => {
    setIsBoxDialogOpen(false);
    setEditingBox(null);
  };

  const handleAddBox = () => {
    setEditingBox(null);
    setIsBoxDialogOpen(true);
  };

  const handleCloseDistanceDialog = () => {
    setIsDistanceDialogOpen(false);
    setEditingDistance(null);
  };

  const handleAddDistance = () => {
    setEditingDistance(null);
    setIsDistanceDialogOpen(true);
  };

  const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const value = target.value;
    // Chỉ cho phép số và tối đa một dấu chấm (cho số thập phân)
    const numericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    if (value !== numericValue) {
      target.value = numericValue;
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
                  <DialogContent className="sm:max-w-[500px]">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="boxName"
                            className="text-sm font-medium"
                          >
                            Tên hộp <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="boxName"
                            placeholder="VD: Mini Box"
                            defaultValue={editingBox?.name || ""}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="fishSize"
                            className="text-sm font-medium"
                          >
                            Size cá chuẩn{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fishSize"
                            placeholder="VD: 15cm"
                            defaultValue={editingBox?.fishSize || ""}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="basePrice"
                            className="text-sm font-medium"
                          >
                            Giá cơ bản (VNĐ){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="basePrice"
                            placeholder="VD: 50000"
                            defaultValue={editingBox?.basePrice || ""}
                            onInput={handleNumericInput}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="fishCount"
                            className="text-sm font-medium"
                          >
                            Số lượng cá/hộp{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fishCount"
                            placeholder="VD: 2"
                            defaultValue={editingBox?.fishCount || ""}
                            onInput={handleNumericInput}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-7 w-7 text-blue-600 -mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Lưu ý:</p>
                            <p>
                              Giá cơ bản sẽ được áp dụng cho mỗi hộp theo kích
                              thước. Số lượng cá/hộp giúp xác định sức chứa tối
                              đa.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={handleCloseBoxDialog}>
                        Hủy
                      </Button>
                      <Button onClick={handleCloseBoxDialog}>
                        {editingBox ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {boxSizes.map((box) => (
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
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:bg-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Giá cơ bản:
                          </span>
                          <span className="font-bold text-lg ml-1">
                            {formatCurrency(box.basePrice)}
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
                            16in x {box.fishCount}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
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
                  <Button onClick={handleAddDistance}>
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
                        <Label
                          htmlFor="distanceName"
                          className="text-sm font-medium"
                        >
                          Tên khoảng cách{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="distanceName"
                          placeholder="VD: Nội thành"
                          defaultValue={editingDistance?.name || ""}
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="minDistance"
                            className="text-sm font-medium"
                          >
                            Khoảng cách từ (km){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="minDistance"
                            placeholder="VD: 0"
                            defaultValue={editingDistance?.minDistance || ""}
                            onInput={handleNumericInput}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="maxDistance"
                            className="text-sm font-medium"
                          >
                            Khoảng cách đến (km){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="maxDistance"
                            placeholder="VD: 20"
                            defaultValue={editingDistance?.maxDistance || ""}
                            onInput={handleNumericInput}
                            className="border-gray-300 focus:border-teal-500"
                          />
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
                            placeholder="VD: 2000"
                            defaultValue={editingDistance?.pricePerKm || ""}
                            onInput={handleNumericInput}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="fixedFee"
                            className="text-sm font-medium"
                          >
                            Phí cố định (VNĐ){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fixedFee"
                            placeholder="VD: 30000"
                            defaultValue={editingDistance?.fixedFee || ""}
                            onInput={handleNumericInput}
                            className="border-gray-300 focus:border-teal-500"
                          />
                        </div>
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
                              {editingDistance
                                ? editingDistance.maxDistance
                                : "20"}
                              km, giá/km{" "}
                              {editingDistance
                                ? editingDistance.pricePerKm.toLocaleString(
                                    "vi-VN",
                                  )
                                : "2.000"}
                              ₫, phí cố định{" "}
                              {editingDistance
                                ? editingDistance.fixedFee.toLocaleString(
                                    "vi-VN",
                                  )
                                : "30.000"}
                              ₫ → Tổng:{" "}
                              {editingDistance
                                ? (
                                    editingDistance.fixedFee +
                                    editingDistance.maxDistance *
                                      editingDistance.pricePerKm
                                  ).toLocaleString("vi-VN")
                                : "70.000"}
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
                      >
                        Hủy
                      </Button>
                      <Button onClick={handleCloseDistanceDialog}>
                        {editingDistance ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {distanceRanges.map((distance) => {
                  const exampleDistance = distance.maxDistance;
                  const exampleCost =
                    distance.fixedFee + exampleDistance * distance.pricePerKm;

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
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:bg-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {distance.minDistance} - {distance.maxDistance} km
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">
                              Khoảng cách
                            </div>
                            <div className="font-medium">
                              {distance.minDistance} - {distance.maxDistance} km
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Giá/km</div>
                            <div className="font-medium">
                              {formatCurrency(distance.pricePerKm)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Phí cố định
                            </div>
                            <div className="font-medium">
                              {formatCurrency(distance.fixedFee)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs">
                          Ví dụ ({exampleDistance}km):{" "}
                          <span className="font-medium">
                            {exampleDistance} x{" "}
                            {formatCurrency(distance.pricePerKm)} +{" "}
                            {formatCurrency(distance.fixedFee)} ={" "}
                            {formatCurrency(exampleCost)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
