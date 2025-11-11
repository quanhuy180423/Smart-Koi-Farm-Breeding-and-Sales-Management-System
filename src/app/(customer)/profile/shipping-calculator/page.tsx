"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputNumber } from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Loader2,
  Calculator,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useCalculateShippingBox } from "@/hooks/useShippingCalculator";
import CustomerLayout from "@/components/customer/CustomerLayout";
import {
  BoxCalculation,
  KoiInput,
  ShippingCalculationResponse,
} from "@/lib/api/services/fetchShippingBox";
import { FishSize } from "@/lib/api/services/fetchKoiFish";
import { getFishSizeLabel } from "@/lib/utils/enum/formatEnum";

const KOI_SIZES = [
  FishSize.UNDER_10CM,
  FishSize.FROM_10_TO_20CM,
  FishSize.FROM_21_TO_25CM,
  FishSize.FROM_26_TO_30CM,
  FishSize.FROM_31_TO_40CM,
  FishSize.FROM_41_TO_45CM,
  FishSize.FROM_46_TO_50CM,
  FishSize.OVER_50CM,
];

interface SizeQuantityMap {
  [key: string]: string;
}

export default function ShippingCalculatorPage() {
  const [quantities, setQuantities] = useState<SizeQuantityMap>(
    KOI_SIZES.reduce((acc, size) => {
      acc[size] = "0";
      return acc;
    }, {} as SizeQuantityMap),
  );
  const [result, setResult] = useState<ShippingCalculationResponse | null>(
    null,
  );
  const { mutate: calculateShipping, isPending } = useCalculateShippingBox();

  const updateQuantity = (size: string, value: string) => {
    setQuantities((prev) => ({
      ...prev,
      [size]: value,
    }));
  };

  const handleCalculate = () => {
    // Validate inputs - tạo array với các size có quantity > 0
    const koiInputs: KoiInput[] = KOI_SIZES.filter(
      (size) => parseInt(quantities[size] || "0") > 0,
    ).map((size) => ({
      size,
      quantity: parseInt(quantities[size]) || 0,
    }));

    if (koiInputs.length === 0) {
      alert("Vui lòng nhập số lượng cá cho ít nhất một kích thước");
      return;
    }

    calculateShipping(
      { koiInputs },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setResult(data.result);
          }
        },
      },
    );
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link href="/profile/cart">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tính thử giá hộp gửi cá</h1>
            <p className="text-muted-foreground">
              Nhập kích thước và số lượng cá để tính phí vận chuyển
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {KOI_SIZES.map((size) => (
                    <div key={size} className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label
                          htmlFor={`qty-${size}`}
                          className="text-sm font-medium"
                        >
                          {getFishSizeLabel(size)}
                        </Label>
                      </div>
                      <InputNumber
                        id={`qty-${size}`}
                        min={0}
                        placeholder="0"
                        value={parseInt(quantities[size]) || 0}
                        onChange={(value) =>
                          updateQuantity(size, (value || 0).toString())
                        }
                        className="w-24 h-9"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full text-sm mt-6"
                  onClick={handleCalculate}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tính...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Tính thử giá
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {!result ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {`Nhập thông tin cá và click "Tính thử giá" để xem kết quả`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Boxes Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Hộp gửi cá (Tổng: {result.totalKoiCount} con)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Loại hộp</TableHead>
                            <TableHead className="text-xs text-right">
                              Số hộp
                            </TableHead>
                            <TableHead className="text-xs text-right">
                              Giá/hộp
                            </TableHead>
                            <TableHead className="text-xs text-right">
                              Tổng
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.boxes.map(
                            (box: BoxCalculation, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="text-sm font-medium">
                                  {box.boxName}
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {box.quantity}
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {formatCurrency(box.feePerBox)}
                                </TableCell>
                                <TableCell className="text-right text-sm font-semibold">
                                  {formatCurrency(box.subtotal)}
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                {result.warnings && result.warnings.length > 0 && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <CardTitle className="text-lg">Cảnh báo</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.warnings.map(
                          (warning: string, index: number) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm text-amber-800"
                            >
                              <span className="text-amber-600 font-bold mt-0.5">
                                •
                              </span>
                              <span>{warning}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Gợi ý</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.suggestions.map(
                          (suggestion: string, index: number) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm text-blue-800"
                            >
                              <span className="text-blue-600 font-bold mt-0.5">
                                •
                              </span>
                              <span>{suggestion}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Summary */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Tổng phí vận chuyển:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(result.totalFee)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
